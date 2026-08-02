import { NextResponse } from "next/server";
import { container } from "@/backend/di/container";

export async function GET() {
  try {
    const links = await container.settingsService.getSocialLinks();
    return NextResponse.json(links);
  } catch (error) {
    console.error("Failed to fetch social links:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
