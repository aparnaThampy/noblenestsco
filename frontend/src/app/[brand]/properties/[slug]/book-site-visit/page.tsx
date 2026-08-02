import { notFound } from "next/navigation";
import { container } from "@/backend/di/container";
import { BookSiteVisitClient } from "./BookSiteVisitClient";
import Link from "next/link";
import { getBrandPath } from "@/lib/config/brands";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookSiteVisitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const property = await container.propertyService.getPropertyBySlug(slug);
  
  if (!property) {
    notFound();
  }

  // Generate some mock available slots for today and next few days
  const today = new Date();
  const availableSlots = [];
  
  for (let i = 1; i <= 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Add morning and afternoon slots
    availableSlots.push({ date: dateStr, time: "10:00 AM" });
    availableSlots.push({ date: dateStr, time: "02:00 PM" });
    availableSlots.push({ date: dateStr, time: "04:30 PM" });
  }

  return (
    <div className="bg-background min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-4 uppercase tracking-widest">
            <Link href={getBrandPath("/properties")} className="hover:text-white transition-colors">Properties</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={getBrandPath(`/properties/${property.slug}`)} className="hover:text-white transition-colors">{property.title}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Book Site Visit</span>
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">Book a Site Visit</h1>
          <p className="text-white/60 text-lg">Schedule a private tour of {property.title} with one of our luxury property advisors.</p>
        </div>

        <div className="bg-card border border-border p-6 md:p-10 rounded-md">
          <BookSiteVisitClient 
            propertyId={property.id} 
            propertyTitle={property.title}
            availableSlots={availableSlots}
            brandPath={getBrandPath("")}
          />
        </div>
      </div>
    </div>
  );
}
