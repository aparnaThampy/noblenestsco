import { ISettingsRepository } from "../../core/ports";
import { ContactSetting, CompanySetting, SocialLink } from "../../core/domain/types";

export class SettingsService {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async getContactSettings(): Promise<ContactSetting | null> {
    return this.settingsRepository.getContactSettings();
  }

  async updateContactSettings(settings: Partial<ContactSetting>): Promise<ContactSetting> {
    return this.settingsRepository.updateContactSettings(settings);
  }

  async getCompanySettings(): Promise<CompanySetting[]> {
    return this.settingsRepository.getCompanySettings();
  }

  async updateCompanySetting(key: string, value: string): Promise<CompanySetting> {
    return this.settingsRepository.updateCompanySetting(key, value);
  }

  async getSocialLinks(filters?: { isVisible?: boolean }): Promise<SocialLink[]> {
    return this.settingsRepository.getSocialLinks(filters);
  }

  async addSocialLink(link: Omit<SocialLink, "id">): Promise<SocialLink> {
    return this.settingsRepository.createSocialLink(link);
  }

  async updateSocialLink(id: string, link: Partial<SocialLink>): Promise<SocialLink> {
    return this.settingsRepository.updateSocialLink(id, link);
  }

  async removeSocialLink(id: string): Promise<boolean> {
    return this.settingsRepository.deleteSocialLink(id);
  }
}
