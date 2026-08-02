"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, TrendingUp, ArrowRight } from "lucide-react"
import Link from "next/link"

const ALL_LOCATIONS = [
  {
    city: "Bangalore",
    subtitle: "The Silicon Valley",
    roi: "12-15%",
    potential: "High Growth",
    popularAreas: ["North Bangalore", "Whitefield", "Sarjapur"],
    imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2000&auto=format&fit=crop"
  },
  {
    city: "Kochi",
    subtitle: "The Emerging Hub",
    roi: "10-14%",
    potential: "Steady Appreciation",
    popularAreas: ["Marine Drive", "Kakkanad", "Edappally"],
    imageUrl: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?q=80&w=2000&auto=format&fit=crop"
  },
  {
    city: "Dubai",
    subtitle: "Global Hub",
    roi: "8-12%",
    potential: "Stable Luxury",
    popularAreas: ["Downtown", "Palm Jumeirah", "Marina"],
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2000&auto=format&fit=crop"
  },
  {
    city: "Mumbai",
    subtitle: "Financial Capital",
    roi: "9-13%",
    potential: "High Value",
    popularAreas: ["Bandra", "South Mumbai", "Worli"],
    imageUrl: "https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?q=80&w=2000&auto=format&fit=crop"
  }
]

import { HomepageSection } from "@/backend/core/domain/types"

interface FeaturedLocationsProps {
  locations?: string[]; // Dynamic active cities
  sectionData?: HomepageSection;
}

export function FeaturedLocations({ locations = [], sectionData }: FeaturedLocationsProps) {
  if (sectionData && !sectionData.isVisible) return null;

  const title = sectionData?.title || "Prime Investment Hubs";
  const description = sectionData?.description || "We focus on macro-markets backed by strong infrastructure growth, corporate expansion, and demographic shifts.";

  // If we have dynamic locations, filter our rich list to match them.
  // Otherwise default to empty or maybe a fallback.
  const displayLocations = ALL_LOCATIONS.filter(loc => 
    locations.some(activeCity => activeCity.toLowerCase() === loc.city.toLowerCase())
  );

  // If no dynamic locations match, we could hide the section or show a fallback.
  if (displayLocations.length === 0 && locations.length > 0) {
    // If there are dynamic locations but none match our predefined metadata, we could generate basic cards
    locations.forEach(loc => {
      displayLocations.push({
        city: loc,
        subtitle: "Investment Destination",
        roi: "Varies",
        potential: "High Demand",
        popularAreas: ["Prime Locations"],
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
      });
    });
  }

  if (displayLocations.length === 0 && !sectionData?.jsonContent) return null;

  const finalLocations = (sectionData?.jsonContent as any)?.locations || displayLocations;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">
              {subtitle}
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight">
              {title}
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {finalLocations.map((loc: any, idx: number) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="group relative h-[450px] overflow-hidden rounded-sm cursor-pointer"
            >
              <Image
                src={loc.imageUrl}
                alt={loc.city}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-primary font-medium tracking-wider text-sm mb-2 uppercase">{loc.subtitle}</p>
                <h3 className="font-heading text-3xl font-bold text-white mb-4">{loc.city}</h3>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-sm">
                    <span className="text-muted-foreground text-xs block mb-1">Expected ROI</span>
                    <span className="text-white font-semibold">{loc.roi}</span>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-sm">
                    <span className="text-muted-foreground text-xs block mb-1">Outlook</span>
                    <span className="text-white font-semibold">{loc.potential}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <p className="text-sm text-gray-300">
                    <span className="text-white font-semibold">Key Corridors:</span> {loc.popularAreas.join(" • ")}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
