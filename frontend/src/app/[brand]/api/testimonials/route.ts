import { NextResponse } from "next/server";
import { container } from "@/backend/di/container";

export async function GET() {
  try {
    const testimonials = await container.testimonialService.getAllTestimonials({ isActive: true });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTestimonial = await container.testimonialService.createTestimonial(body);
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
