"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HomepageSection } from "@/backend/core/domain/types";

interface HomepageSectionFormProps {
  initialData?: HomepageSection | null;
  onSave: (data: HomepageSection) => void;
  onCancel: () => void;
}

export function HomepageSectionForm({ initialData, onSave, onCancel }: HomepageSectionFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<HomepageSection>({
    defaultValues: initialData || {
      id: "",
      sectionId: "",
      title: "",
      subtitle: "",
      description: "",
      ctaText: "",
      ctaLink: "",
      theme: "light",
      sortOrder: 0,
      isVisible: true,
    }
  });

  const onSubmit = (data: HomepageSection) => {
    if (initialData?.id) {
      data.id = initialData.id;
    }
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-xl">
      <h3 className="text-xl font-medium">{initialData ? "Edit Section" : "Add Section"}</h3>
      
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
          <label className="block text-sm font-medium text-white/80 mb-2">Description / Content</label>
          <Textarea {...register("description")} rows={4} className="bg-white/5 border-white/10 text-white" />
        </div>
        
        <div className="md:col-span-2 flex items-center gap-2 mt-4">
          <input type="checkbox" id="isVisible" {...register("isVisible")} className="w-4 h-4 bg-white/5 border-white/10 rounded accent-gold-500" />
          <label htmlFor="isVisible" className="text-sm font-medium text-white/80">Active / Visible on Website</label>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gold-500 text-black hover:bg-gold-600">
          Apply to List
        </Button>
      </div>
    </form>
  );
}
