"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const DEFAULT_TESTIMONIALS = [
  {
    id: '1',
    name: "Rajesh Mehta",
    designation: "Managing Director",
    company: "Venture Capital",
    location: "Bangalore",
    testimonial: "Noble Nests Co completely changed how I look at real estate. Their due diligence process is unlike any broker I've met. I got into Prestige Golfshire at exactly the right time and it's already appreciated by 18%.",
    propertyPurchased: "Prestige Golfshire",
    purchaseYear: "2023",
    rating: 5,
  },
  {
    id: '2',
    name: "Priya Krishnamurthy",
    designation: "Chief Financial Officer",
    company: "SaaS Startup",
    location: "Kochi",
    testimonial: "I was sceptical about investing this much in real estate, but the team walked me through every single legal document and explained the macro tailwinds. I feel confident I made the right decision.",
    propertyPurchased: "Marine Drive",
    purchaseYear: "2024",
    rating: 5,
  }
]

import { HomepageSection, Testimonial } from "@/backend/core/domain/types"

interface TestimonialsProps {
  testimonials?: Testimonial[];
  sectionData?: HomepageSection;
}

export function Testimonials({ testimonials = [], sectionData }: TestimonialsProps) {
  if (sectionData && !sectionData.isVisible) return null;

  const title = sectionData?.title || "Trusted by Discerning Investors";
  const subtitle = sectionData?.subtitle || "What Our Investors Say";

  const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  if (displayTestimonials.length === 0) return null;

  return (
    <section className="py-24 bg-card border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">{subtitle}</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTestimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="bg-background border border-border p-8 relative flex flex-col"
            >
              {/* Gold top accent */}
              <div className="absolute top-0 left-0 w-12 h-0.5 bg-primary" />

              <Quote className="w-8 h-8 text-primary/40 mb-6 shrink-0" />

              <p className="text-muted-foreground leading-relaxed text-sm flex-1 mb-8">
                &quot;{t.testimonial}&quot;
              </p>

              <div className="flex items-end justify-between border-t border-border pt-6">
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.designation} {t.company && `at ${t.company}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Property</p>
                  <p className="text-primary font-semibold text-sm truncate max-w-[100px]" title={t.propertyPurchased}>
                    {t.propertyPurchased || "-"}
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
