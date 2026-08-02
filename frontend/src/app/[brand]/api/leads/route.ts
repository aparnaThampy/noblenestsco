import { NextRequest } from "next/server";
import { container } from "@/backend/di/container";
import {
  apiSuccess,
  apiError,
  logRequest,
  withRateLimit,
  withAdminAuth,
} from "@/backend/presentation/middleware/api-middleware";

/**
 * POST /api/leads
 * Creates a new investment inquiry lead.
 * Rate-limited to prevent spam. No auth required — public endpoint.
 */
export async function POST(req: NextRequest) {
  logRequest(req);

  const rateLimitError = withRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();

    if (!body.name || !body.phone || !body.budget || !body.city || !body.purpose) {
      return apiError(
        "Missing required fields: name, phone, budget, city, purpose.",
        400,
        "VALIDATION_ERROR"
      );
    }

    const lead = await container.leadService.createLead({
      name: body.name,
      phone: body.phone,
      email: body.email,
      budget: body.budget,
      city: body.city,
      purpose: body.purpose,
    });

    return apiSuccess(
      {
        id: lead.id,
        message: "Your inquiry has been received. An advisor will contact you shortly.",
      },
      201
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit inquiry.";
    console.error("[POST /api/leads]", error);
    return apiError(message, 400, "VALIDATION_ERROR");
  }
}

/**
 * GET /api/leads
 * Returns all leads. Admin-only endpoint.
 */
export async function GET(req: NextRequest) {
  logRequest(req);

  const authError = withAdminAuth(req);
  if (authError) return authError;

  try {
    const leads = await container.leadService.getAllLeads();
    return apiSuccess(leads, 200, { total: leads.length });
  } catch (error) {
    console.error("[GET /api/leads]", error);
    return apiError("Failed to retrieve leads.", 500);
  }
}
