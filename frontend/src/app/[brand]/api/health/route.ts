import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Health check endpoint for Docker and load balancer probes.
 * Returns 200 OK with a timestamp if the service is running.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "noble-nests-frontend",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
