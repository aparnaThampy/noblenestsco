"use client";

import { useState } from "react";
import { ContactSetting, SocialLink } from "@/backend/core/domain/types";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialContact: ContactSetting | null;
  initialSocial: SocialLink[];
}

export function SettingsForm({ initialContact, initialSocial }: SettingsFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [contact, setContact] = useState<ContactSetting | null>(initialContact);
  
  const handleContactChange = (field: keyof ContactSetting, value: string) => {
    if (!contact) return;
    setContact({ ...contact, [field]: value });
  };

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/settings/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });

      if (!response.ok) {
        throw new Error("Failed to save contact settings");
      }
      
      router.refresh();
      alert("Settings saved successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-2xl">
        <h2 className="text-xl font-light mb-6 border-b border-white/10 pb-4">Contact Information</h2>
        
        {contact ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
              <input 
                type="email" 
                value={contact.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
              <input 
                type="text" 
                value={contact.phoneNumber}
                onChange={(e) => handleContactChange("phoneNumber", e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">WhatsApp Number</label>
              <input 
                type="text" 
                value={contact.whatsappNumber}
                onChange={(e) => handleContactChange("whatsappNumber", e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Office Address</label>
              <textarea 
                value={contact.officeAddress}
                onChange={(e) => handleContactChange("officeAddress", e.target.value)}
                rows={3}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Google Maps URL</label>
              <input 
                type="url" 
                value={contact.googleMapsUrl}
                onChange={(e) => handleContactChange("googleMapsUrl", e.target.value)}
                className="w-full bg-black border border-white/20 rounded-md px-4 py-2 text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                onClick={handleSaveContact}
                disabled={isSaving}
                className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Contact Settings"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white/60">Contact settings not initialized.</p>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-2xl">
        <h2 className="text-xl font-light mb-6 border-b border-white/10 pb-4">Social Links</h2>
        <div className="space-y-4">
          {initialSocial.map((social) => (
            <div key={social.id} className="flex items-center justify-between bg-black p-4 rounded-md border border-white/10">
              <div className="flex items-center space-x-4">
                <span className="font-medium text-white">{social.platform}</span>
                <span className="text-white/50 text-sm">{social.displayName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded text-xs ${social.isVisible ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                  {social.isVisible ? "Visible" : "Hidden"}
                </span>
                {/* Normally we'd have edit/toggle visibility actions here */}
              </div>
            </div>
          ))}
          <p className="text-xs text-white/40 mt-4">Note: Social link management is a placeholder. Full CRUD can be added later.</p>
        </div>
      </div>
    </div>
  );
}
