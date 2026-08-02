"use server";

import { container } from "@/backend/di/container";
import { ContactSetting, SocialLink } from "@/backend/core/domain/types";

export async function saveContactSettingsAction(settings: Partial<ContactSetting>) {
  try {
    await container.settingsService.updateContactSettings(settings);
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to save contact settings:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to save contact settings" };
  }
}

export async function saveSocialLinksAction(links: SocialLink[]) {
  try {
    // We will just do a brute force delete and recreate for simplicity of sync
    // Or, find the ones to delete, update, add.
    // Let's just fetch existing, and run updates.
    
    // Instead of complex diffing, if our backend supported a bulk replace it would be easier.
    // The MockSettingsRepository has add, update, remove.
    // For simplicity, we'll sync by updating existing, adding new, and removing missing.
    
    const existingLinks = await container.settingsService.getSocialLinks();
    
    // Remove deleted
    for (const existing of existingLinks) {
      if (!links.find(l => l.id === existing.id)) {
        await container.settingsService.removeSocialLink(existing.id);
      }
    }
    
    // Update or Add
    for (const link of links) {
      if (link.id && existingLinks.find(l => l.id === link.id)) {
        await container.settingsService.updateSocialLink(link.id, link);
      } else {
        await container.settingsService.addSocialLink({
          platform: link.platform,
          url: link.url,
          displayName: link.displayName,
          icon: link.icon,
          isVisible: link.isVisible,
          sortOrder: link.sortOrder,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to save social links:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to save social links" };
  }
}
