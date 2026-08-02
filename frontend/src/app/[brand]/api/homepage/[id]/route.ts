import { NextResponse } from "next/server";
import { container } from "@/backend/di/container";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedSection = await container.homepageService.updateSection(id, body);
    
    if (!updatedSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error("Failed to update homepage section:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await container.homepageService.deleteSection(id);
    
    if (!success) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete homepage section:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
