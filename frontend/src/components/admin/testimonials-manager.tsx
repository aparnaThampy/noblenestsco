"use client";

import { useState } from "react";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { useRouter } from "next/navigation";

export function TestimonialsManager({ brand, initialTestimonials }: { brand: string, initialTestimonials: any[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const router = useRouter();

  const handleAdd = () => {
    setEditingTestimonial(null);
    setIsEditing(true);
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      const response = await fetch(`/${brand}/api/testimonials/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete testimonial");
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setEditingTestimonial(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingTestimonial(null);
  };

  if (isEditing) {
    return (
      <div className="bg-card p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-medium mb-6">
          {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
        </h2>
        <TestimonialForm 
          brand={brand} 
          initialData={editingTestimonial} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-wide">Testimonials</h1>
          <p className="text-white/60 mt-1">Manage client testimonials and reviews.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add Testimonial
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-white/50 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Testimonial</th>
                <th className="px-6 py-4">Property / Year</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {initialTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-white/60 italic">No testimonials available.</p>
                  </td>
                </tr>
              ) : (
                initialTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{testimonial.name}</div>
                      <div className="text-white/50 text-xs mt-1">{testimonial.designation} at {testimonial.company}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="truncate">{testimonial.testimonial}</div>
                      <div className="text-yellow-500 text-xs mt-1">{"★".repeat(testimonial.rating)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{testimonial.propertyPurchased || "-"}</div>
                      <div className="text-white/50 text-xs mt-1">{testimonial.purchaseYear || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs ${testimonial.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                        {testimonial.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleEdit(testimonial)} className="text-gold-500 hover:text-gold-400 font-medium text-sm mr-4">Edit</button>
                      <button onClick={() => handleDelete(testimonial.id)} className="text-red-500 hover:text-red-400 font-medium text-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
