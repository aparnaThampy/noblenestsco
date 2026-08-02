"use server";

import { container } from "@/backend/di/container";
import { revalidatePath } from "next/cache";

export async function deletePropertyAction(slug: string) {
  try {
    const existing = await container.propertyService.getPropertyBySlug(slug);
    if (!existing) {
      return { success: false, error: "Property not found" };
    }
    await container.propertyService.deleteProperty(existing.id);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete property:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to delete property" };
  }
}

export async function toggleFeatureAction(slug: string, isFeatured: boolean) {
  try {
    const existing = await container.propertyService.getPropertyBySlug(slug);
    if (!existing) {
      return { success: false, error: "Property not found" };
    }
    await container.propertyService.updateProperty(existing.id, { isFeatured });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to feature property:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to update property" };
  }
}

export async function togglePublishAction(slug: string, currentStatus: string) {
  try {
    const existing = await container.propertyService.getPropertyBySlug(slug);
    if (!existing) {
      return { success: false, error: "Property not found" };
    }
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    await container.propertyService.updateProperty(existing.id, { status: newStatus as "Draft" | "Published" | "Sold" });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to publish property:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to update property" };
  }
}
