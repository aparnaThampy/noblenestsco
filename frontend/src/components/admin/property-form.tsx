"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { Property } from "@/backend/core/domain/types";

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmitAction: (data: Partial<Property>) => Promise<void>;
}

const TABS = ["Basic", "Location", "Media", "Details", "SEO", "Contact"];

export function PropertyForm({ initialData, onSubmitAction }: PropertyFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: initialData || {
      title: "",
      slug: "",
      type: "Luxury Villa",
      status: "Draft",
      builder: "",
      price: "",
      description: "",
      investmentHighlights: "",
      area: "",
      rera: "",
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      isFeatured: false,
      city: "",
      location: {
        country: "",
        state: "",
        zone: "",
        address: "",
        city: "",
        coordinates: { lat: 0, lng: 0 },
        nearbyPlaces: [],
      },
      media: {
        videos: [],
        floorPlans: [],
        brochures: [],
      },
      seo: {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      },
      contact: {
        contactName: "",
        phone: "",
        whatsapp: "",
        email: "",
      },
      amenities: [],
      financials: {
        roi: "",
        appreciation: "",
      },
      images: [],
    },
  });

  // Watch title to auto-generate slug if not editing
  const title = watch("title");
  
  const handleAutoSlug = () => {
    if (!initialData && title) {
      setValue("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const onSubmit = async (data: Partial<Property>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Sync the top-level city with the location city
      data.city = data.location?.city;
      
      // Clean up array fields
      if (data.images && data.images.length > 0) {
        data.images = data.images.filter((img: { url?: string }) => img.url);
      }
      
      await onSubmitAction(data);
      router.push("/admin/properties");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save property.");
      setIsSubmitting(false);
    }
  };

  const { fields: nearbyFields, append: addNearby, remove: removeNearby } = useFieldArray({
    control,
    name: "location.nearbyPlaces",
  });

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-2 border-b border-white/10 pb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab ? "bg-gold-500 text-black" : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* BASIC TAB */}
        {activeTab === "Basic" && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="text-xl font-light text-white mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Property Title</label>
                <Input {...register("title")} onBlur={handleAutoSlug} placeholder="e.g. Prestige Golfshire Villas" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Slug</label>
                <Input {...register("slug")} placeholder="e.g. prestige-golfshire-villas" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Property Type</label>
                <select {...register("type")} className="flex h-10 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                  <option value="Luxury Villa" className="bg-zinc-900 text-white">Luxury Villa</option>
                  <option value="Penthouse" className="bg-zinc-900 text-white">Penthouse</option>
                  <option value="Apartment" className="bg-zinc-900 text-white">Apartment</option>
                  <option value="Mansion" className="bg-zinc-900 text-white">Mansion</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Status</label>
                <select {...register("status")} className="flex h-10 w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500">
                  <option value="Draft" className="bg-zinc-900 text-white">Draft</option>
                  <option value="Published" className="bg-zinc-900 text-white">Published</option>
                  <option value="Sold" className="bg-zinc-900 text-white">Sold</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Builder</label>
                <Input {...register("builder")} placeholder="e.g. Prestige Group" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Price</label>
                <Input {...register("price")} placeholder="e.g. ₹12.5 Cr onwards" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Description</label>
              <textarea {...register("description")} rows={4} className="flex w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500" placeholder="Enter property description..."></textarea>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Investment Highlights</label>
              <textarea {...register("investmentHighlights")} rows={4} className="flex w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500" placeholder="Enter investment highlights..."></textarea>
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <input type="checkbox" id="isFeatured" {...register("isFeatured")} className="w-4 h-4 rounded border-white/10 bg-transparent text-gold-500 focus:ring-gold-500 focus:ring-offset-background" />
              <label htmlFor="isFeatured" className="text-sm font-medium text-white">Feature on Homepage</label>
            </div>
          </Card>
        )}

        {/* LOCATION TAB */}
        {activeTab === "Location" && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="text-xl font-light text-white mb-4">Location Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Country</label>
                <Input {...register("location.country")} placeholder="e.g. India" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">State</label>
                <Input {...register("location.state")} placeholder="e.g. Karnataka" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">City</label>
                <Input {...register("location.city")} placeholder="e.g. Bangalore" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Zone / Locality</label>
                <Input {...register("location.zone")} placeholder="e.g. North Bangalore" />
              </div>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Address</label>
              <Input {...register("location.address")} placeholder="e.g. Nandi Hills" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Latitude</label>
                <Input type="number" step="any" {...register("location.coordinates.lat", { valueAsNumber: true })} placeholder="13.235" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Longitude</label>
                <Input type="number" step="any" {...register("location.coordinates.lng", { valueAsNumber: true })} placeholder="77.683" />
              </div>
            </div>
            
            <div className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium text-white">Nearby Places</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => addNearby({ name: "", distance: "" })}>
                  + Add Place
                </Button>
              </div>
              
              {nearbyFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 mb-3 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs text-white/60">Place Name</label>
                    <Input {...register(`location.nearbyPlaces.${index}.name` as const)} placeholder="e.g. Airport" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs text-white/60">Distance / Time</label>
                    <Input {...register(`location.nearbyPlaces.${index}.distance` as const)} placeholder="e.g. 20 Mins" />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeNearby(index)}>
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* MEDIA TAB */}
        {activeTab === "Media" && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="text-xl font-light text-white mb-4">Media Assets</h2>
            <p className="text-sm text-white/50 mb-6">Note: For this iteration, provide absolute URLs to media files (e.g. Cloudflare R2 URLs or Unsplash placeholders).</p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Primary Image URL</label>
              <Input {...register("images.0.url")} placeholder="https://..." />
              <input type="hidden" {...register("images.0.isPrimary")} value="true" />
              <input type="hidden" {...register("images.0.order")} value="1" />
              <input type="hidden" {...register("images.0.id")} value="img1" />
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Gallery Image 2 URL</label>
              <Input {...register("images.1.url")} placeholder="https://..." />
              <input type="hidden" {...register("images.1.isPrimary")} value="false" />
              <input type="hidden" {...register("images.1.order")} value="2" />
              <input type="hidden" {...register("images.1.id")} value="img2" />
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Gallery Image 3 URL</label>
              <Input {...register("images.2.url")} placeholder="https://..." />
              <input type="hidden" {...register("images.2.isPrimary")} value="false" />
              <input type="hidden" {...register("images.2.order")} value="3" />
              <input type="hidden" {...register("images.2.id")} value="img3" />
            </div>
            
            <div className="space-y-2 pt-6 border-t border-white/10">
              <label className="text-sm font-medium text-white/80">YouTube Video URL</label>
              <Input {...register("media.videos.0")} placeholder="https://youtube.com/watch?v=..." />
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Brochure PDF URL</label>
              <Input {...register("media.brochures.0")} placeholder="https://..." />
            </div>
          </Card>
        )}

        {/* DETAILS TAB */}
        {activeTab === "Details" && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="text-xl font-light text-white mb-4">Property Specifics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Total Area</label>
                <Input {...register("area")} placeholder="e.g. 7,500 sq.ft" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Bedrooms</label>
                <Input type="number" {...register("bedrooms", { valueAsNumber: true })} placeholder="4" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Bathrooms</label>
                <Input type="number" {...register("bathrooms", { valueAsNumber: true })} placeholder="5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Parking Spots</label>
                <Input type="number" {...register("parking", { valueAsNumber: true })} placeholder="2" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-white/80">RERA Registration</label>
                <Input {...register("rera")} placeholder="PRM/KA/RERA/..." />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Expected ROI</label>
                <Input {...register("financials.roi")} placeholder="e.g. 14% p.a." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Appreciation</label>
                <Input {...register("financials.appreciation")} placeholder="e.g. 22% in 3 years" />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <label className="text-sm font-medium text-white/80">Amenities (comma separated)</label>
              <Controller
                control={control}
                name="amenities"
                render={({ field: { onChange, value } }) => (
                  <textarea
                    rows={3}
                    className="flex w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                    placeholder="Golf Course, Private Pool, Clubhouse..."
                    value={Array.isArray(value) ? value.join(", ") : value}
                    onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  />
                )}
              />
            </div>
          </Card>
        )}

        {/* SEO TAB */}
        {activeTab === "SEO" && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="text-xl font-light text-white mb-4">Search Engine Optimization</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Meta Title</label>
              <Input {...register("seo.metaTitle")} placeholder="Property Title | Luxury Real Estate" />
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Meta Description</label>
              <textarea {...register("seo.metaDescription")} rows={3} className="flex w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500" placeholder="Brief description for search engines..."></textarea>
            </div>
            
            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-white/80">Keywords (comma separated)</label>
              <Controller
                control={control}
                name="seo.keywords"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="luxury villas, bangalore real estate..."
                    value={Array.isArray(value) ? value.join(", ") : value}
                    onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  />
                )}
              />
            </div>
          </Card>
        )}

        {/* CONTACT TAB */}
        {activeTab === "Contact" && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <h2 className="text-xl font-light text-white mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Contact Name</label>
                <Input {...register("contact.contactName")} placeholder="e.g. Noble Nests Advisor" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Email</label>
                <Input type="email" {...register("contact.email")} placeholder="invest@noblenests.co" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Phone Number</label>
                <Input {...register("contact.phone")} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">WhatsApp Number</label>
                <Input {...register("contact.whatsapp")} placeholder="1234567890" />
              </div>
            </div>
          </Card>
        )}

        {/* Submit Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/properties")} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="bg-gold-500 text-black hover:bg-gold-600" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
