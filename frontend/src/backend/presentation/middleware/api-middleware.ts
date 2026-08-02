import { NextRequest, NextResponse } from "next/server";

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

// ─── Error Helper ─────────────────────────────────────────────────────────────

export function apiError(message: string, status: number = 500, code?: string): NextResponse<ApiErrorResponse> {
  return NextResponse.json({ success: false, error: message, code }, { status });
}

export function apiSuccess<T>(data: T, status: number = 200, meta?: ApiSuccessResponse<T>["meta"]): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data, meta }, { status });
}

// ─── CORS Middleware ──────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000").split(",");

export function withCors(response: NextResponse): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
  return response;
}

// ─── Admin API Key Auth Middleware ────────────────────────────────────────────

export function withAdminAuth(req: NextRequest): null | NextResponse<ApiErrorResponse> {
  const apiKey = req.headers.get("x-api-key");
  const validApiKey = process.env.ADMIN_API_KEY;

  if (!validApiKey) {
    console.error("[Auth] ADMIN_API_KEY environment variable is not set.");
    return apiError("Server misconfiguration", 500, "SERVER_ERROR");
  }

  if (!apiKey || apiKey !== validApiKey) {
    return apiError("Unauthorized. A valid API key is required.", 401, "UNAUTHORIZED");
  }

  return null; // Auth passed
}

// ─── Rate Limiter (In-Memory, for development) ────────────────────────────────
// In production, swap this with a Redis-backed implementation.

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute per IP

export function withRateLimit(req: NextRequest): null | NextResponse<ApiErrorResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return apiError("Too many requests. Please try again later.", 429, "RATE_LIMITED");
  }

  record.count++;
  return null;
}

// ─── Request Logger Middleware ────────────────────────────────────────────────

export function logRequest(req: NextRequest): void {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.nextUrl.pathname;
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  console.log(`[API] ${timestamp} ${method} ${url} from ${ip}`);
}
