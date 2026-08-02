import { container } from "@/backend/di/container";
import { TestimonialsManager } from "@/components/admin/testimonials-manager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;
  
  // Note: we fetch all testimonials here, including inactive ones for the admin panel
  const testimonials = await container.testimonialService.getAllTestimonials();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <TestimonialsManager brand={brand} initialTestimonials={testimonials} />
    </div>
  );
}
