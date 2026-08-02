"use server";

import { container } from "@/backend/di/container";

export async function submitSiteVisitBooking(data: {
  propertyId: string;
  date: string;
  time: string;
  numberOfVisitors: number;
  notes?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
}) {
  try {
    const visit = await container.crmService.bookSiteVisit(data);
    return { success: true, visitId: visit.id };
  } catch (error: unknown) {
    console.error("Failed to submit site visit booking:", error);
    return { success: false, error: (error instanceof Error ? error.message : undefined) || "Failed to submit booking" };
  }
}
