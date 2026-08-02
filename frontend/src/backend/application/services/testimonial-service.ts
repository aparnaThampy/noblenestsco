import { ITestimonialRepository } from "../../core/ports";
import { Testimonial } from "../../core/domain/types";

export class TestimonialService {
  constructor(private readonly testimonialRepository: ITestimonialRepository) {}

  async getAllTestimonials(filters?: { isActive?: boolean }): Promise<Testimonial[]> {
    return this.testimonialRepository.findAll(filters);
  }

  async getTestimonial(id: string): Promise<Testimonial | null> {
    return this.testimonialRepository.findById(id);
  }

  async createTestimonial(testimonial: Omit<Testimonial, "id">): Promise<Testimonial> {
    return this.testimonialRepository.create(testimonial);
  }

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    return this.testimonialRepository.update(id, testimonial);
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    return this.testimonialRepository.delete(id);
  }
}
