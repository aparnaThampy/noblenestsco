"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TestimonialFormData {
  name: string;
  designation: string;
  company: string;
  testimonial: string;
  rating: number;
  propertyPurchased?: string;
  purchaseYear?: string;
  isActive: boolean;
}

interface TestimonialFormProps {
  brand: string;
  initialData?: TestimonialFormData & { id: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TestimonialForm({ brand, initialData, onSuccess, onCancel }: TestimonialFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<TestimonialFormData>({
    defaultValues: initialData || {
      name: "",
      designation: "",
      company: "",
      testimonial: "",
      rating: 5,
      propertyPurchased: "",
      purchaseYear: "",
      isActive: true,
    }
  });

  const onSubmit = async (data: TestimonialFormData) => {
    setIsSubmitting(true);
    setError("");
    
    try {
      const url = initialData 
        ? `/${brand}/api/testimonials/${initialData.id}` 
        : `/${brand}/api/testimonials`;
        
      const method = initialData ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save testimonial");
      }

      router.refresh();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Client Name *</label>
          <Input {...register("name", { required: "Name is required" })} className="bg-white/5 border-white/10 text-white" />
          {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Designation *</label>
          <Input {...register("designation", { required: "Designation is required" })} className="bg-white/5 border-white/10 text-white" />
          {errors.designation && <span className="text-red-500 text-xs mt-1">{errors.designation.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Company *</label>
          <Input {...register("company", { required: "Company is required" })} className="bg-white/5 border-white/10 text-white" />
          {errors.company && <span className="text-red-500 text-xs mt-1">{errors.company.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Rating (1-5) *</label>
          <Input type="number" min="1" max="5" {...register("rating", { required: "Rating is required", valueAsNumber: true })} className="bg-white/5 border-white/10 text-white" />
          {errors.rating && <span className="text-red-500 text-xs mt-1">{errors.rating.message}</span>}
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80 mb-2">Testimonial *</label>
          <Textarea {...register("testimonial", { required: "Testimonial is required" })} rows={4} className="bg-white/5 border-white/10 text-white" />
          {errors.testimonial && <span className="text-red-500 text-xs mt-1">{errors.testimonial.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Property Purchased</label>
          <Input {...register("propertyPurchased")} className="bg-white/5 border-white/10 text-white" placeholder="e.g. Prestige Golfshire" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Purchase Year</label>
          <Input {...register("purchaseYear")} className="bg-white/5 border-white/10 text-white" placeholder="e.g. 2023" />
        </div>
        
        <div className="md:col-span-2 flex items-center gap-2 mt-4">
          <input type="checkbox" id="isActive" {...register("isActive")} className="w-4 h-4 bg-white/5 border-white/10 rounded accent-gold-500" />
          <label htmlFor="isActive" className="text-sm font-medium text-white/80">Active / Visible on Website</label>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="bg-gold-500 text-black hover:bg-gold-600">
          {isSubmitting ? "Saving..." : (initialData ? "Update Testimonial" : "Add Testimonial")}
        </Button>
      </div>
    </form>
  );
}
