import { NextRequest } from "next/server";
import { container } from "@/backend/di/container";
import { apiSuccess, apiError, logRequest, withRateLimit } from "@/backend/presentation/middleware/api-middleware";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/properties/[slug]
 * Returns a single property by its URL slug.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  logRequest(req);

  const rateLimitError = withRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const { slug } = await context.params;
    const property = await container.propertyService.getPropertyBySlug(slug);

    if (!property) {
      return apiError(`Property with slug "${slug}" not found.`, 404, "NOT_FOUND");
    }

    return apiSuccess(property);
  } catch (error) {
    console.error("[GET /api/properties/[slug]]", error);
    return apiError("Failed to retrieve property details.", 500);
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  logRequest(req);

  const { withAdminAuth } = await import("@/backend/presentation/middleware/api-middleware");
  const authError = withAdminAuth(req);
  if (authError) return authError;

  try {
    const { slug } = await context.params;
    const existing = await container.propertyService.getPropertyBySlug(slug);
    if (!existing) {
      return apiError(`Property with slug "${slug}" not found.`, 404);
    }

    const body = await req.json();
    const property = await container.propertyService.updateProperty(existing.id, body);
    return apiSuccess(property, 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update property.";
    console.error("[PUT /api/properties/[slug]]", error);
    return apiError(message, 400);
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  logRequest(req);

  const { withAdminAuth } = await import("@/backend/presentation/middleware/api-middleware");
  const authError = withAdminAuth(req);
  if (authError) return authError;

  try {
    const { slug } = await context.params;
    const existing = await container.propertyService.getPropertyBySlug(slug);
    if (!existing) {
      return apiError(`Property with slug "${slug}" not found.`, 404);
    }

    await container.propertyService.deleteProperty(existing.id);
    return apiSuccess({ deleted: true }, 200);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete property.";
    console.error("[DELETE /api/properties/[slug]]", error);
    return apiError(message, 400);
  }
}

export async function OPTIONS() {
  const { NextResponse } = await import("next/server");
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  return res;
}
