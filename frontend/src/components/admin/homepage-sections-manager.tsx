"use client";

import { useState } from "react";
import { HomepageSectionForm } from "@/components/admin/homepage-section-form";
import { useRouter } from "next/navigation";

export function HomepageSectionsManager({ brand, initialSections }: { brand: string, initialSections: any[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const router = useRouter();

  const handleAdd = () => {
    setEditingSection(null);
    setIsEditing(true);
  };

  const handleEdit = (section: any) => {
    setEditingSection(section);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    
    try {
      const response = await fetch(`/${brand}/api/homepage/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete section");
    }
  };

  const handleSuccess = () => {
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingSection(null);
  };

  if (isEditing) {
    return (
      <div className="bg-card p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-medium mb-6">
          {editingSection ? "Edit Section" : "Add New Section"}
        </h2>
        <HomepageSectionForm 
          brand={brand} 
          initialData={editingSection} 
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
          <h1 className="text-3xl font-light tracking-wide">Homepage Sections</h1>
          <p className="text-white/60 mt-1">Manage content, visibility, and order of homepage sections.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-md font-medium transition-colors"
        >
          Add Section
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-white/50 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Section ID</th>
                <th className="px-6 py-4">Title & Subtitle</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {initialSections.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-white/60 italic">No sections available.</p>
                  </td>
                </tr>
              ) : (
                initialSections.map((section) => (
                  <tr key={section.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-white/10 px-2 py-1 rounded text-white/80 font-mono text-xs">{section.sortOrder}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-xs text-gold-500">{section.sectionId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{section.title}</div>
                      <div className="text-white/50 text-xs mt-1">{section.subtitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-xs ${section.isVisible ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                        {section.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleEdit(section)} className="text-gold-500 hover:text-gold-400 font-medium text-sm mr-4">Edit</button>
                      <button onClick={() => handleDelete(section.id)} className="text-red-500 hover:text-red-400 font-medium text-sm">Delete</button>
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
