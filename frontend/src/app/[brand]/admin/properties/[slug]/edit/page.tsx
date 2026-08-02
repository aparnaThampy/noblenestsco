import { notFound } from "next/navigation";
import { container } from "@/backend/di/container";
import { PropertyForm } from "@/components/admin/property-form";
import { Property } from "@/backend/core/domain/types";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const property = await container.propertyService.getPropertyBySlug(slug);
  
  if (!property) {
    notFound();
  }

  const handleUpdate = async (data: Partial<Property>) => {
    "use server";
    const { container } = await import("@/backend/di/container");
    
    try {
      await container.propertyService.updateProperty(property.id, data);
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : "Failed to update property");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-wide">Edit Property</h1>
        <p className="text-white/60 mt-1">Editing: {property.title}</p>
      </div>

      <PropertyForm initialData={property} onSubmitAction={handleUpdate} />
    </div>
  );
}
