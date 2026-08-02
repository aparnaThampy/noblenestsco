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

  if (displayLocations.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayLocations.map((location, idx) => (
            <motion.div
              key={location.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="group relative overflow-hidden h-[500px] border border-border"
            >
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
                <img 
                  src={location.imageUrl} 
                  alt={location.city} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="text-primary w-5 h-5" />
                  <span className="text-primary font-semibold tracking-wider uppercase text-sm">
                    {location.subtitle}
                  </span>
                </div>
                <h3 className="font-heading text-4xl font-bold text-white mb-6">
                  {location.city}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 backdrop-blur border border-white/10 p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Average ROI</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" /> {location.roi}
                    </p>
                  </div>
                  <div className="bg-black/40 backdrop-blur border border-white/10 p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Potential</p>
                    <p className="text-white font-bold">{location.potential}</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="text-sm text-gray-300">
                    <span className="text-primary">Key Areas: </span>
                    {location.popularAreas.join(", ")}
                  </div>
                  <Link href={`/noblenestsco/properties?city=${encodeURIComponent(location.city)}`} className="flex items-center gap-2 text-white hover:text-primary transition-colors uppercase tracking-widest text-sm font-semibold group/btn">
                    Explore 
                    <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
