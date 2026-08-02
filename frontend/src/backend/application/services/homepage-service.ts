import { IHomepageSectionRepository } from "../../core/ports";
import { HomepageSection } from "../../core/domain/types";

export class HomepageService {
  constructor(private readonly homepageSectionRepository: IHomepageSectionRepository) {}

  async getAllSections(): Promise<HomepageSection[]> {
    return this.homepageSectionRepository.findAll();
  }

  async getSection(id: string): Promise<HomepageSection | null> {
    return this.homepageSectionRepository.findById(id);
  }

  async createSection(section: Omit<HomepageSection, "id">): Promise<HomepageSection> {
    return this.homepageSectionRepository.create(section);
  }

  async updateSection(id: string, section: Partial<HomepageSection>): Promise<HomepageSection> {
    return this.homepageSectionRepository.update(id, section);
  }

  async deleteSection(id: string): Promise<boolean> {
    return this.homepageSectionRepository.delete(id);
  }
}
