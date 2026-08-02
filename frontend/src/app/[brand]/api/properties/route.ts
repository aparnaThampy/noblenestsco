import { NextRequest } from "next/server";
import { container } from "@/backend/di/container";
import { apiSuccess, apiError, logRequest, withRateLimit } from "@/backend/presentation/middleware/api-middleware";

/**
 * GET /api/properties
 * Returns a list of all published properties.
 * Supports query params: city, budget
 */
export async function GET(req: NextRequest) {
  logRequest(req);

  const rateLimitError = withRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const { searchParams } = req.nextUrl;
    const city = searchParams.get("city") ?? undefined;
    const budget = searchParams.get("budget") ?? undefined;

    const properties = await container.propertyService.getAllProperties({ city, budget });
    return apiSuccess(properties, 200, { total: properties.length });
  } catch (error) {
    console.error("[GET /api/properties]", error);
    return apiError("Failed to retrieve properties.", 500);
  }
}

/**
 * POST /api/properties
 * Creates a new property listing. Requires admin API key.
 */
export async function POST(req: NextRequest) {
  logRequest(req);

  const { withAdminAuth } = await import("@/backend/presentation/middleware/api-middleware");
  const authError = withAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();

    if (!body.title || !body.slug || !body.price) {
      return apiError("Missing required fields: title, slug, price.", 400, "VALIDATION_ERROR");
    }

    const property = await container.propertyService.addProperty(body);
    return apiSuccess(property, 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create property.";
    console.error("[POST /api/properties]", error);
    return apiError(message, 400);
  }
}

/**
 * OPTIONS /api/properties
 * Handles CORS preflight requests.
 */
export async function OPTIONS() {
  const { NextResponse } = await import("next/server");
  const res = new NextResponse(null, { status: 204 });
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  return res;
}
