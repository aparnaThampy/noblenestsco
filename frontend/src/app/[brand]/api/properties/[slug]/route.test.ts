import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, PUT, DELETE } from "./route";
import { NextRequest } from "next/server";
import { container } from "@/backend/di/container";
import { MockPropertyRepository } from "@/backend/infrastructure/persistence/mock-repositories";
import { PropertyService } from "@/backend/application/services/property-service";

import { Property } from "@/backend/core/domain/types";

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

describe("Properties [slug] API Route", () => {
  let propertyRepo: MockPropertyRepository;
  let testProperty: Property;

  beforeEach(async () => {
    propertyRepo = new MockPropertyRepository();
    const mockStorage = { uploadFile: async () => "test-url", deleteFile: async () => true };
    // @ts-expect-error - readonly property override for tests
    container.propertyService = new PropertyService(propertyRepo, mockStorage);
    
    // Get a test property from the mock repository
    const props = await container.propertyService.getAllProperties();
    testProperty = props[0];

    vi.clearAllMocks();
  });

  describe("GET /api/properties/[slug]", () => {
    it("should return a single property by slug", async () => {
      const req = new NextRequest(`http://localhost:3000/api/properties/${testProperty.slug}`);
      const context = { params: Promise.resolve({ slug: testProperty.slug }) };
      const res = await GET(req, context);
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe(testProperty.id);
      expect(json.data.slug).toBe(testProperty.slug);
    });

    it("should return 404 for unknown slug", async () => {
      const req = new NextRequest("http://localhost:3000/api/properties/unknown-slug");
      const context = { params: Promise.resolve({ slug: "unknown-slug" }) };
      const res = await GET(req, context);
      
      expect(res.status).toBe(404);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toMatch(/not found/);
    });
  });

  describe("PUT /api/properties/[slug]", () => {
    it("should update a property", async () => {
      const req = new NextRequest(`http://localhost:3000/api/properties/${testProperty.slug}`, {
        method: "PUT",
        body: JSON.stringify({
          title: "Updated Title via API"
        })
      });
      const context = { params: Promise.resolve({ slug: testProperty.slug }) };
      const res = await PUT(req, context);
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.title).toBe("Updated Title via API");

      // Verify in repo
      const updated = await container.propertyService.getPropertyBySlug(testProperty.slug);
      expect(updated?.title).toBe("Updated Title via API");
    });

    it("should return 404 for unknown slug on PUT", async () => {
      const req = new NextRequest("http://localhost:3000/api/properties/unknown-slug", {
        method: "PUT",
        body: JSON.stringify({ title: "Updated" })
      });
      const context = { params: Promise.resolve({ slug: "unknown-slug" }) };
      const res = await PUT(req, context);
      
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/properties/[slug]", () => {
    it("should delete a property", async () => {
      const req = new NextRequest(`http://localhost:3000/api/properties/${testProperty.slug}`, {
        method: "DELETE"
      });
      const context = { params: Promise.resolve({ slug: testProperty.slug }) };
      const res = await DELETE(req, context);
      
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.deleted).toBe(true);

      // Verify in repo
      const deleted = await container.propertyService.getPropertyBySlug(testProperty.slug);
      expect(deleted).toBeNull();
    });

    it("should return 404 for unknown slug on DELETE", async () => {
      const req = new NextRequest("http://localhost:3000/api/properties/unknown-slug", {
        method: "DELETE"
      });
      const context = { params: Promise.resolve({ slug: "unknown-slug" }) };
      const res = await DELETE(req, context);
      
      expect(res.status).toBe(404);
    });
  });
});
