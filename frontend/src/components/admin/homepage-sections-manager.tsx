"use client";

import { useState, useEffect } from "react";
import { HomepageSectionForm } from "@/components/admin/homepage-section-form";
import { useRouter } from "next/navigation";
import { bulkSaveHomepageSectionsAction } from "@/app/[brand]/admin/homepage/actions";
import { Button } from "@/components/ui/button";
import { HomepageSection } from "@/backend/core/domain/types";

export function HomepageSectionsManager({ brand, initialSections }: { brand: string, initialSections: HomepageSection[] }) {
  const router = useRouter();
  
  const [sections, setSections] = useState<HomepageSection[]>([...initialSections].sort((a, b) => a.sortOrder - b.sortOrder));
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Compute if we have unsaved changes by comparing JSON strings (ignoring dates if present)
  const initial = [...initialSections].sort((a, b) => a.sortOrder - b.sortOrder);
  const current = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
  
  // Strip timestamps for comparison
  const strip = (arr: HomepageSection[]) => arr.map(s => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, ...rest } = s;
    return rest;
  });

  const hasUnsavedChanges = JSON.stringify(strip(initial)) !== JSON.stringify(strip(current));

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleAdd = () => {
    setEditingSection(null);
    setIsEditing(true);
  };

  const handleEdit = (section: HomepageSection) => {
    setEditingSection(section);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this section from the list? (Requires saving to persist)")) return;
    setSections(sections.filter(s => s.id !== id));
  };

  const handleApplyForm = (data: HomepageSection) => {
    if (data.id) {
      setSections(sections.map(s => s.id === data.id ? { ...s, ...data } : s));
    } else {
      // New section (temp ID)
      setSections([...sections, { ...data, id: `temp-${Date.now()}` }]);
    }
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleCancelForm = () => {
    setIsEditing(false);
    setEditingSection(null);
  };

  const handleCancel = () => {
    if (!confirm("Discard all unsaved changes and reset to current published state?")) return;
    setSections([...initialSections].sort((a, b) => a.sortOrder - b.sortOrder));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await bulkSaveHomepageSectionsAction(sections);
      if (!res.success) throw new Error(res.error);
      
      alert("Sections saved successfully!");
      router.refresh();
      // On refresh, initialSections will update, resetting hasUnsavedChanges
    } catch (error) {
      console.error(error);
      alert("Failed to save sections.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    window.open(`/${brand}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-wide">Homepage Sections</h1>
          <p className="text-white/60 mt-1">Manage content, visibility, and order of homepage sections.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handlePreview} className="bg-white/5 border-white/10 text-white">
            Preview Site
          </Button>
          
          <Button variant="outline" onClick={handleCancel} disabled={!hasUnsavedChanges || isSaving} className="bg-white/5 border-white/10 text-white">
            Cancel
          </Button>

          <Button 
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`${hasUnsavedChanges ? "bg-gold-500 hover:bg-gold-600 text-black" : "bg-white/10 text-white/40 cursor-not-allowed"} px-4 py-2 font-medium transition-colors`}
          >
            {isSaving ? "Saving..." : hasUnsavedChanges ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-md text-sm font-medium flex items-center justify-between">
          <span>You have unsaved changes. Don&apos;t forget to save!</span>
        </div>
      )}

      {isEditing ? (
        <HomepageSectionForm 
          initialData={editingSection} 
          onSave={handleApplyForm} 
          onCancel={handleCancelForm} 
        />
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-end">
            <Button onClick={handleAdd} size="sm" className="bg-white/10 hover:bg-white/20 text-white">
              + Add Section
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="bg-white/5 text-white/50 font-medium uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Section ID</th>
                  <th className="px-6 py-4">Title & Subtitle</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {sections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-white/60 italic">No sections available.</p>
                    </td>
                  </tr>
                ) : (
                  sections.map((section) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button onClick={() => handleEdit(section)} className="text-gold-500 hover:text-gold-400 font-medium text-sm mr-4">Edit</button>
                        <button onClick={() => handleDelete(section.id)} className="text-red-500 hover:text-red-400 font-medium text-sm">Remove</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
