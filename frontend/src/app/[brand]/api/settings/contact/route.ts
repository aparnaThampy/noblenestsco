import { NextResponse } from "next/server";
import { container } from "@/backend/di/container";

export async function GET() {
  try {
    const settings = await container.settingsService.getContactSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch contact settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
