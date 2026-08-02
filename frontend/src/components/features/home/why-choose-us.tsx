"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Shield, MapPin, Handshake, Search, CheckCircle, FileText } from "lucide-react"

const REASONS = [
  {
    title: "Verified Opportunities",
    description: "Every property undergoes strict due diligence before it is presented to our investors.",
    icon: <CheckCircle className="w-8 h-8 text-primary" />
  },
  {
    title: "Transparent Pricing",
    description: "No hidden charges or unexpected fees. We believe in complete financial clarity.",
    icon: <Search className="w-8 h-8 text-primary" />
  },
  {
    title: "Dedicated Advisor",
    description: "A single point of contact for personalized investment guidance and portfolio management.",
    icon: <Handshake className="w-8 h-8 text-primary" />
  },
  {
    title: "Legal Due Diligence",
    description: "Comprehensive legal checks ensuring secure titles and hassle-free ownership.",
    icon: <FileText className="w-8 h-8 text-primary" />
  },
  {
    title: "Builder Verification",
    description: "We partner exclusively with Grade-A developers with a proven track record of delivery.",
    icon: <Shield className="w-8 h-8 text-primary" />
  },
  {
    title: "Personal Site Visits",
    description: "Curated property tours arranged at your convenience with our local experts.",
    icon: <MapPin className="w-8 h-8 text-primary" />
  }
]

import { HomepageSection } from "@/backend/core/domain/types"

interface WhyChooseUsProps {
  sectionData?: HomepageSection;
}

export function WhyChooseUs({ sectionData }: WhyChooseUsProps) {
  if (sectionData && !sectionData.isVisible) return null;

  const title = sectionData?.title || "Why Noble Nests";
  const description = sectionData?.description || "We are not just a marketplace. We are your premium investment advisory partner, committed to high-growth, secure wealth creation.";

  const reasons = (sectionData?.jsonContent as any)?.reasons || REASONS;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 border border-border bg-card/50 hover:bg-card transition-colors duration-300 group"
            >
              <div className="mb-6 p-4 rounded-full bg-primary/10 inline-block group-hover:scale-110 transition-transform duration-300">
                {/* Dynamically render icon based on string name if possible, fallback to a default */}
                {reason.icon === "CheckCircle" && <CheckCircle className="w-8 h-8 text-primary" />}
                {reason.icon === "Search" && <Search className="w-8 h-8 text-primary" />}
                {reason.icon === "Handshake" && <Handshake className="w-8 h-8 text-primary" />}
                {reason.icon === "FileText" && <FileText className="w-8 h-8 text-primary" />}
                {reason.icon === "Shield" && <Shield className="w-8 h-8 text-primary" />}
                {reason.icon === "MapPin" && <MapPin className="w-8 h-8 text-primary" />}
                {!reason.icon && <CheckCircle className="w-8 h-8 text-primary" />}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-3 text-white tracking-wide">
                {reason.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
