import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { container } from "@/backend/di/container";
import { MockPropertyRepository } from "@/backend/infrastructure/persistence/mock-repositories";
import { PropertyService } from "@/backend/application/services/property-service";
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

describe("Properties API Route", () => {
  beforeEach(() => {
    // Reset container with fresh mock repository
    const mockRepo = new MockPropertyRepository();
    const mockStorage = { uploadFile: async () => "test-url", deleteFile: async () => true };
    // @ts-expect-error - readonly property override for tests
    container.propertyService = new PropertyService(mockRepo, mockStorage);
    
    vi.clearAllMocks();
  });

  describe("GET /api/properties", () => {
    it("should return a list of properties", async () => {
      const req = new NextRequest("http://localhost:3000/api/properties");
      const res = await GET(req);
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.meta.total).toBe(json.data.length);
    });

    it("should return rate limit error if rate limited", async () => {
      vi.mocked(apiMiddleware.withRateLimit).mockReturnValueOnce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        NextResponse.json({ success: false, error: "Too Many Requests" }, { status: 429 }) as any
      );

      const req = new NextRequest("http://localhost:3000/api/properties");
      const res = await GET(req);
      
      expect(res.status).toBe(429);
      const json = await res.json();
      expect(json.error).toBe("Too Many Requests");
    });
  });

  describe("POST /api/properties", () => {
    it("should successfully create a new property", async () => {
      const req = new NextRequest("http://localhost:3000/api/properties", {
        method: "POST",
        body: JSON.stringify({
          title: "New API Property",
          slug: "new-api-property",
          price: "₹10 Cr",
          location: { address: "Address", city: "City", coordinates: { lat: 0, lng: 0 } },
          city: "City",
          area: "4000 sq.ft",
          type: "Villa",
          builder: "Builder",
          status: "Draft",
          description: "Desc",
          isFeatured: false
        })
      });

      const res = await POST(req);
      
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBeDefined();
      expect(json.data.title).toBe("New API Property");
    });

    it("should return 400 for missing required fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/properties", {
        method: "POST",
        body: JSON.stringify({
          title: "Incomplete Property"
          // Missing slug and price
        })
      });

      const res = await POST(req);
      
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toMatch(/Missing required fields/);
    });

    it("should return auth error if admin auth fails", async () => {
      vi.mocked(apiMiddleware.withAdminAuth).mockReturnValueOnce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }) as any
      );

      const req = new NextRequest("http://localhost:3000/api/properties", {
        method: "POST",
        body: JSON.stringify({ title: "Test", slug: "test", price: "Test" })
      });

      const res = await POST(req);
      
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Unauthorized");
    });
  });
});
