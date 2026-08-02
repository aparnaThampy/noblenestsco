import { ILeadRepository } from "../../core/ports";
import { Lead } from "../../core/domain/types";

export interface CreateLeadDTO {
  name: string;
  phone: string;
  email?: string;
  budget: string;
  city: string;
  purpose: string;
}

export class LeadService {
  constructor(private leadRepo: ILeadRepository) {}

  async createLead(dto: CreateLeadDTO): Promise<Lead> {
    this.validateLeadDTO(dto);
    return this.leadRepo.create(dto);
  }

  async getAllLeads(): Promise<Lead[]> {
    return this.leadRepo.findAll();
  }

  async qualifyLead(id: string): Promise<Lead> {
    return this.leadRepo.updateStatus(id, "Qualified");
  }

  async markLeadContacted(id: string): Promise<Lead> {
    return this.leadRepo.updateStatus(id, "Contacted");
  }

  async markLeadLost(id: string): Promise<Lead> {
    return this.leadRepo.updateStatus(id, "Lost");
  }

  private validateLeadDTO(dto: CreateLeadDTO): void {
    if (!dto.name || dto.name.trim().length < 2) {
      throw new Error("Name must be at least 2 characters.");
    }
    // Basic Indian phone validation (10 digits, optionally preceded by +91)
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(dto.phone.replace(/\s/g, ""))) {
      throw new Error("Please provide a valid Indian phone number.");
    }
    if (dto.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email)) {
      throw new Error("Please provide a valid email address.");
    }
    if (!dto.budget) throw new Error("Budget is required.");
    if (!dto.city) throw new Error("City is required.");
    if (!dto.purpose) throw new Error("Investment purpose is required.");
  }
}
