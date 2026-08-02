import { NextResponse } from "next/server";
import { container } from "@/backend/di/container";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedTestimonial = await container.testimonialService.updateTestimonial(id, body);
    
    if (!updatedTestimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await container.testimonialService.deleteTestimonial(id);
    
    if (!success) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
