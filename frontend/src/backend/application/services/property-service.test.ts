import { describe, it, expect, beforeEach } from "vitest";
import { PropertyService } from "./property-service";
import { MockPropertyRepository } from "../../infrastructure/persistence/mock-repositories";
import { Property } from "../../core/domain/types";
import { IStorageProvider } from "../../core/ports";

describe("PropertyService", () => {
  let propertyRepo: MockPropertyRepository;
  let storageProvider: IStorageProvider;
  let service: PropertyService;

  beforeEach(() => {
    propertyRepo = new MockPropertyRepository();
    storageProvider = {
      uploadFile: async () => "https://example.com/mock-image.jpg",
      deleteFile: async () => true
    };
    service = new PropertyService(propertyRepo, storageProvider);
  });

  describe("addProperty", () => {
    it("should successfully create a new property", async () => {
      const newPropData: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
        title: "Test Villa",
        slug: "test-villa",
        price: "₹5 Cr",
        location: {
          address: "Test Address",
          city: "Test City",
          coordinates: { lat: 0, lng: 0 }
        },
        city: "Test City",
        area: "5000 sq.ft",
        type: "Luxury Villa",
        builder: "Test Builder",
        status: "Draft",
        description: "Test Description",
        isFeatured: false,
        amenities: [],
        financials: { roi: "", appreciation: "" },
        images: []
      };

      const result = await service.addProperty(newPropData);
      
      expect(result.id).toBeDefined();
      expect(result.title).toBe("Test Villa");
      expect(result.slug).toBe("test-villa");
      expect(result.createdAt).toBeInstanceOf(Date);
      
      const saved = await propertyRepo.findById(result.id);
      expect(saved).toBeDefined();
      expect(saved?.title).toBe("Test Villa");
    });

    it("should throw an error if a property with the same slug exists", async () => {
      const newPropData: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
        title: "Test Villa",
        slug: "prestige-golfshire-villas", // Existing slug in mock data
        price: "₹5 Cr",
        location: {
          address: "Test Address",
          city: "Test City",
          coordinates: { lat: 0, lng: 0 }
        },
        city: "Test City",
        area: "5000 sq.ft",
        type: "Luxury Villa",
        builder: "Test Builder",
        status: "Draft",
        description: "Test Description",
        isFeatured: false,
        amenities: [],
        financials: { roi: "", appreciation: "" },
        images: []
      };

      await expect(service.addProperty(newPropData)).rejects.toThrow(/already exists/);
    });
  });

  describe("updateProperty", () => {
    it("should successfully update an existing property", async () => {
      const allProps = await service.getAllProperties();
      const targetId = allProps[0].id;
      
      const result = await service.updateProperty(targetId, { title: "Updated Title", price: "₹15 Cr" });
      
      expect(result.title).toBe("Updated Title");
      expect(result.price).toBe("₹15 Cr");
      
      const saved = await propertyRepo.findById(targetId);
      expect(saved?.title).toBe("Updated Title");
    });

    it("should throw an error if updating to an existing slug", async () => {
      // First, create a second property
      const newPropData: Omit<Property, "id" | "createdAt" | "updatedAt"> = {
        title: "Test Villa 2",
        slug: "test-villa-2",
        price: "₹5 Cr",
        location: {
          address: "Test Address",
          city: "Test City",
          coordinates: { lat: 0, lng: 0 }
        },
        city: "Test City",
        area: "5000 sq.ft",
        type: "Luxury Villa",
        builder: "Test Builder",
        status: "Draft",
        description: "Test Description",
        isFeatured: false,
        amenities: [],
        financials: { roi: "", appreciation: "" },
        images: []
      };
      const newProp = await service.addProperty(newPropData);
      
      // Try to update it to the slug of the first mock property
      await expect(
        service.updateProperty(newProp.id, { slug: "prestige-golfshire-villas" })
      ).rejects.toThrow(/already exists/);
    });
  });

  describe("deleteProperty", () => {
    it("should successfully delete a property", async () => {
      const allProps = await service.getAllProperties();
      const targetId = allProps[0].id;
      
      const result = await service.deleteProperty(targetId);
      expect(result).toBe(true);
      
      const saved = await propertyRepo.findById(targetId);
      expect(saved).toBeNull();
    });
  });
});
