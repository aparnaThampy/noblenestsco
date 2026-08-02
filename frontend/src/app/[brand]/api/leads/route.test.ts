import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { container } from "@/backend/di/container";
import { LeadService } from "@/backend/application/services/lead-service";
import { MockLeadRepository } from "@/backend/infrastructure/persistence/mock-repositories";
import * as apiMiddleware from "@/backend/presentation/middleware/api-middleware";

// Mock middleware
vi.mock("@/backend/presentation/middleware/api-middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/backend/presentation/middleware/api-middleware")>();
  return {
    ...actual,
    withRateLimit: vi.fn(() => null),
    withAdminAuth: vi.fn(() => null),
    logRequest: vi.fn(),
  };
});

describe("Leads API Route", () => {
  beforeEach(() => {
    // Reset container with fresh mock repository
    const mockRepo = new MockLeadRepository();
    // @ts-expect-error - readonly property override for tests
    container.leadService = new LeadService(mockRepo);
    
    vi.clearAllMocks();
  });

  describe("POST /api/leads", () => {
    it("should successfully create a new lead", async () => {
      const req = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          phone: "+919876543210",
          email: "test@example.com",
          budget: "₹1-3 Cr",
          city: "Bengaluru",
          purpose: "Investment"
        })
      });

      const res = await POST(req);
      
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBeDefined();
      expect(json.data.message).toMatch(/inquiry has been received/);
    });

    it("should return 400 for missing required fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Incomplete Lead"
          // Missing other fields
        })
      });

      const res = await POST(req);
      
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toMatch(/Missing required fields/);
    });

    it("should return rate limit error if rate limited", async () => {
      vi.mocked(apiMiddleware.withRateLimit).mockReturnValueOnce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        NextResponse.json({ success: false, error: "Too Many Requests" }, { status: 429 }) as any
      );

      const req = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({ name: "Test", phone: "123", budget: "1", city: "A", purpose: "B" })
      });

      const res = await POST(req);
      
      expect(res.status).toBe(429);
      const json = await res.json();
      expect(json.error).toBe("Too Many Requests");
    });
  });

  describe("GET /api/leads", () => {
    it("should return a list of leads for admin", async () => {
      const req = new NextRequest("http://localhost:3000/api/leads");
      const res = await GET(req);
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
    });

    it("should return auth error if admin auth fails", async () => {
      vi.mocked(apiMiddleware.withAdminAuth).mockReturnValueOnce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }) as any
      );

      const req = new NextRequest("http://localhost:3000/api/leads");
      const res = await GET(req);
      
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });
  });
});
