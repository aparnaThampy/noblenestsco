import { IPropertyRepository, IStorageProvider } from "../../core/ports";
import { Property } from "../../core/domain/types";

export class PropertyService {
  constructor(
    private propertyRepo: IPropertyRepository,
    private storageProvider: IStorageProvider
  ) {}

  async getAllProperties(filters?: { city?: string; budget?: string; isFeatured?: boolean; status?: string }): Promise<Property[]> {
    return this.propertyRepo.findAll(filters as Record<string, unknown>);
  }

  async getPropertyBySlug(slug: string): Promise<Property | null> {
    return this.propertyRepo.findBySlug(slug);
  }

  async addProperty(data: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
    // Add business validation here (e.g., check if slug is unique)
    const existing = await this.propertyRepo.findBySlug(data.slug);
    if (existing) {
      throw new Error("A property with this slug already exists");
    }
    return this.propertyRepo.create(data);
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    if (data.slug) {
      const existing = await this.propertyRepo.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        throw new Error("A property with this slug already exists");
      }
    }
    return this.propertyRepo.update(id, data);
  }

  async deleteProperty(id: string): Promise<boolean> {
    return this.propertyRepo.delete(id);
  }

  async uploadPropertyImage(propertyId: string, fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    const property = await this.propertyRepo.findById(propertyId);
    if (!property) throw new Error("Property not found");

    const url = await this.storageProvider.uploadFile(fileBuffer, fileName, mimeType, `properties/${propertyId}`);
    return url;
  }
}
