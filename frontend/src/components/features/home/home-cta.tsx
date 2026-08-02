"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBrandPath } from "@/lib/config/brands"

import { HomepageSection } from "@/backend/core/domain/types"

interface HomeCTAProps {
  sectionData?: HomepageSection;
}

export function HomeCTA({ sectionData }: HomeCTAProps) {
  if (sectionData && !sectionData.isVisible) return null;

  const title = sectionData?.title || "Your Next Investment Decision Should Be Your Best One.";
  const subtitle = sectionData?.subtitle || "Begin Your Journey";
  const description = sectionData?.description || "Our advisors work with a limited number of serious investors at a time — ensuring undivided attention and deeply personalised guidance.";
  const ctaText = sectionData?.ctaText || "Schedule a Consultation";
  const ctaLink = sectionData?.ctaLink || "/contact";

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-primary/10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-6">{subtitle}</p>
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-line">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base h-12" asChild>
                <Link href={getBrandPath(ctaLink)}>
                  {ctaText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-12 border-primary text-primary hover:bg-primary/10" asChild>
                <Link href={getBrandPath("/properties")}>Explore Portfolio</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
