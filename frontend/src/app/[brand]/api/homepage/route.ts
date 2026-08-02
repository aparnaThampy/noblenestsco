import { NextResponse } from "next/server";
import { container } from "@/backend/di/container";

export async function GET() {
  try {
    const sections = await container.homepageService.getAllSections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error("Failed to fetch homepage sections:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSection = await container.homepageService.createSection(body);
    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.error("Failed to create homepage section:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
