import { PropertyForm } from "@/components/admin/property-form";
import { Property } from "@/backend/core/domain/types";

export const dynamic = "force-dynamic";

export default function NewPropertyPage() {
  const handleCreate = async (data: Partial<Property>) => {
    "use server";
    
    // In Server Actions, we can just call our API internally or call the container
    // Let's just do a fetch to our API so we have the same path, or we can use container directly.
    // For simplicity with server components, we'll use a Next.js server action wrapped over a fetch.
    
    // Wait, Server Action is easier:
    const { container } = await import("@/backend/di/container");
    
    try {
      await container.propertyService.addProperty(data as Omit<Property, "id" | "createdAt" | "updatedAt">);
    } catch (e: unknown) {
      throw new Error(e instanceof Error ? e.message : "Failed to create property");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-wide">Add New Property</h1>
        <p className="text-white/60 mt-1">Create a new investment property listing.</p>
      </div>

      <PropertyForm onSubmitAction={handleCreate} />
    </div>
  );
}
