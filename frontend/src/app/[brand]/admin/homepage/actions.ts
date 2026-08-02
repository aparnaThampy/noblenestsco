"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/backend/di/container";
import { HomepageSection } from "@/backend/core/domain/types";

export async function bulkSaveHomepageSectionsAction(sections: HomepageSection[]) {
  try {
    const existingSections = await container.homepageService.getAllSections();

    // Iterate and update, create, or delete
    for (const section of sections) {
      if (section.id && existingSections.find(s => s.id === section.id)) {
        await container.homepageService.updateSection(section.id, section);
      } else {
        await container.homepageService.createSection(section);
      }
    }

    // Delete removed sections
    for (const existing of existingSections) {
      if (!sections.find(s => s.id === existing.id)) {
        await container.homepageService.deleteSection(existing.id);
      }
    }

    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to bulk save homepage sections:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to save sections" };
  }
}
