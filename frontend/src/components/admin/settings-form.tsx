"use client";

import { useState } from "react";
import { ContactSetting, SocialLink } from "@/backend/core/domain/types";
import { useRouter } from "next/navigation";
import { saveContactSettingsAction, saveSocialLinksAction } from "@/app/[brand]/admin/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SettingsFormProps {
  initialContact: ContactSetting | null;
  initialSocial: SocialLink[];
}

const SOCIAL_PLATFORMS = [
  "WhatsApp", "Phone", "Email", "Instagram", "Facebook", 
  "LinkedIn", "YouTube", "X", "Threads", "Telegram"
];

export function SettingsForm({ initialContact, initialSocial }: SettingsFormProps) {
  const router = useRouter();
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  
  const [contact, setContact] = useState<ContactSetting | null>(initialContact);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    [...initialSocial].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  
  const handleContactChange = (field: keyof ContactSetting, value: string) => {
    if (!contact) return;
    setContact({ ...contact, [field]: value });
  };

  const handleSaveContact = async () => {
    if (!contact) return;
    setIsSavingContact(true);
    try {
      const res = await saveContactSettingsAction(contact);
      if (!res.success) throw new Error(res.error);
      router.refresh();
      alert("Contact settings saved successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving contact settings");
    } finally {
      setIsSavingContact(false);
    }
  };

  const handleSaveSocial = async () => {
    setIsSavingSocial(true);
    try {
      // Clean up orders
      const cleanLinks = socialLinks.map((s, idx) => ({ ...s, sortOrder: idx + 1 }));
      const res = await saveSocialLinksAction(cleanLinks);
      if (!res.success) throw new Error(res.error);
      
      setSocialLinks(cleanLinks);
      router.refresh();
      alert("Social links saved successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving social links");
    } finally {
      setIsSavingSocial(false);
    }
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `temp-${Date.now()}`, // Temporary ID to track in state
      platform: "Instagram",
      url: "",
      displayName: "",
      icon: "instagram",
      isVisible: true,
      sortOrder: socialLinks.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setSocialLinks([...socialLinks, newLink]);
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string | boolean) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    if (confirm("Remove this social link?")) {
      const updated = [...socialLinks];
      updated.splice(index, 1);
      setSocialLinks(updated);
    }
  };

  const moveSocialLink = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === socialLinks.length - 1) return;
    
    const updated = [...socialLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setSocialLinks(updated);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-3xl">
        <h2 className="text-xl font-light mb-6 border-b border-white/10 pb-4">Contact Information</h2>
        
        {contact ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                <Input 
                  type="email" 
                  value={contact.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
                <Input 
                  type="text" 
                  value={contact.phoneNumber}
                  onChange={(e) => handleContactChange("phoneNumber", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">WhatsApp Number</label>
                <Input 
                  type="text" 
                  value={contact.whatsappNumber}
                  onChange={(e) => handleContactChange("whatsappNumber", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Google Maps URL</label>
                <Input 
                  type="url" 
                  value={contact.googleMapsUrl}
                  onChange={(e) => handleContactChange("googleMapsUrl", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Office Address</label>
              <Textarea 
                value={contact.officeAddress}
                onChange={(e) => handleContactChange("officeAddress", e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                onClick={handleSaveContact}
                disabled={isSavingContact}
                className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-2 rounded-md font-medium transition-colors"
              >
                {isSavingContact ? "Saving..." : "Save Contact Settings"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-white/60">Contact settings not initialized.</p>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h2 className="text-xl font-light">Social Links</h2>
          <Button onClick={addSocialLink} variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            + Add Link
          </Button>
        </div>
        
        <div className="space-y-4 mb-6">
          {socialLinks.length === 0 ? (
            <p className="text-white/50 text-sm italic">No social links configured.</p>
          ) : (
            socialLinks.map((social, index) => (
              <div key={social.id} className="flex flex-col md:flex-row gap-4 items-start md:items-end bg-black/40 p-4 rounded-lg border border-white/5 relative">
                
                <div className="absolute right-4 top-4 md:static flex items-center space-x-1">
                  <button type="button" onClick={() => moveSocialLink(index, 'up')} disabled={index === 0} className="text-white/40 hover:text-white disabled:opacity-30 p-1">
                    ▲
                  </button>
                  <button type="button" onClick={() => moveSocialLink(index, 'down')} disabled={index === socialLinks.length - 1} className="text-white/40 hover:text-white disabled:opacity-30 p-1">
                    ▼
                  </button>
                </div>

                <div className="w-full md:w-40 space-y-1">
                  <label className="text-xs text-white/50 font-medium">Platform</label>
                  <select 
                    value={social.platform} 
                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-black px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    {SOCIAL_PLATFORMS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 w-full space-y-1">
                  <label className="text-xs text-white/50 font-medium">URL</label>
                  <Input 
                    value={social.url} 
                    onChange={(e) => updateSocialLink(index, "url", e.target.value)} 
                    placeholder="https://" 
                  />
                </div>

                <div className="w-full md:w-48 space-y-1">
                  <label className="text-xs text-white/50 font-medium">Display Name (Optional)</label>
                  <Input 
                    value={social.displayName} 
                    onChange={(e) => updateSocialLink(index, "displayName", e.target.value)} 
                    placeholder="@handle" 
                  />
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <input 
                    type="checkbox" 
                    id={`visible-${social.id}`}
                    checked={social.isVisible} 
                    onChange={(e) => updateSocialLink(index, "isVisible", e.target.checked)} 
                    className="w-4 h-4 rounded border-white/10 bg-transparent text-gold-500 focus:ring-gold-500"
                  />
                  <label htmlFor={`visible-${social.id}`} className="text-sm font-medium text-white/80 whitespace-nowrap">Active</label>
                </div>

                <Button type="button" variant="destructive" size="sm" onClick={() => removeSocialLink(index)} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 w-full md:w-auto h-10">
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <Button 
            onClick={handleSaveSocial} 
            disabled={isSavingSocial}
            className="bg-gold-500 hover:bg-gold-600 text-black px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isSavingSocial ? "Saving..." : "Save Social Links"}
          </Button>
        </div>
      </div>
    </div>
  );
}
