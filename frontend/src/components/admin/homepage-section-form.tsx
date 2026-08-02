"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HomepageSectionFormData {
  sectionId: string;
  title: string;
  subtitle: string;
  content: string;
  sortOrder: number;
  isVisible: boolean;
}

interface HomepageSectionFormProps {
  brand: string;
  initialData?: HomepageSectionFormData & { id: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function HomepageSectionForm({ brand, initialData, onSuccess, onCancel }: HomepageSectionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<HomepageSectionFormData>({
    defaultValues: initialData || {
      sectionId: "",
      title: "",
      subtitle: "",
      content: "",
      sortOrder: 0,
      isVisible: true,
    }
  });

  const onSubmit = async (data: HomepageSectionFormData) => {
    setIsSubmitting(true);
    setError("");
    
    try {
      const url = initialData 
        ? `/${brand}/api/homepage/${initialData.id}` 
        : `/${brand}/api/homepage`;
        
      const method = initialData ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save homepage section");
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
          <label className="block text-sm font-medium text-white/80 mb-2">Section ID *</label>
          <Input 
            {...register("sectionId", { required: "Section ID is required" })} 
            className="bg-white/5 border-white/10 text-white font-mono" 
            placeholder="e.g. hero, featured-properties" 
          />
          {errors.sectionId && <span className="text-red-500 text-xs mt-1">{errors.sectionId.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Sort Order *</label>
          <Input 
            type="number" 
            {...register("sortOrder", { required: "Sort order is required", valueAsNumber: true })} 
            className="bg-white/5 border-white/10 text-white" 
          />
          {errors.sortOrder && <span className="text-red-500 text-xs mt-1">{errors.sortOrder.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Title *</label>
          <Input {...register("title", { required: "Title is required" })} className="bg-white/5 border-white/10 text-white" />
          {errors.title && <span className="text-red-500 text-xs mt-1">{errors.title.message}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Subtitle</label>
          <Input {...register("subtitle")} className="bg-white/5 border-white/10 text-white" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80 mb-2">Content</label>
          <Textarea {...register("content")} rows={4} className="bg-white/5 border-white/10 text-white" />
        </div>
        
        <div className="md:col-span-2 flex items-center gap-2 mt-4">
          <input type="checkbox" id="isVisible" {...register("isVisible")} className="w-4 h-4 bg-white/5 border-white/10 rounded accent-gold-500" />
          <label htmlFor="isVisible" className="text-sm font-medium text-white/80">Active / Visible on Website</label>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="bg-gold-500 text-black hover:bg-gold-600">
          {isSubmitting ? "Saving..." : (initialData ? "Update Section" : "Add Section")}
        </Button>
      </div>
    </form>
  );
}
