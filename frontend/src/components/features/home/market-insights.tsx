"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, Building, Users, Award } from "lucide-react"

const STATS = [
  { icon: TrendingUp, value: "₹480 Cr+", label: "Assets Under Advisory" },
  { icon: Building, value: "42", label: "Curated Projects" },
  { icon: Users, value: "310+", label: "Investors Served" },
  { icon: Award, value: "13.2%", label: "Average Annual ROI" },
]

const MARKET_TRENDS = [
  {
    title: "North Bangalore Rising",
    category: "Macro Trend",
    excerpt: "With KIAL Phase 2 operational and Devanahalli business district expanding, North Bangalore corridors are seeing 22–28% capital appreciation over 36 months.",
    tag: "Residential + Commercial",
  },
  {
    title: "Kochi: India's Emerging Smart City",
    category: "Emerging Market",
    excerpt: "GIFT City-equivalent infrastructure investments, METRO Phase 2, and a growing expat population are driving Kochi residential demand to a 5-year high.",
    tag: "High Demand",
  },
  {
    title: "NRI Repatriation Tailwind",
    category: "Macro Signal",
    excerpt: "RBI FEMA liberalisation and a weaker rupee-dollar spread is making luxury property acquisition increasingly attractive for the NRI diaspora.",
    tag: "NRI Investment",
  },
]

export function MarketInsights() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-24">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-background flex flex-col items-center justify-center py-10 px-6 text-center"
            >
              <stat.icon className="w-6 h-6 text-primary mb-4" />
              <p className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Market Intelligence */}
        <div className="text-center mb-16">
          <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">Market Intelligence</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
            Where Smart Money <br className="hidden md:block" />
            Is Moving
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MARKET_TRENDS.map((trend, idx) => (
            <motion.div
              key={trend.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="border border-border p-8 group hover:border-primary/50 transition-colors duration-300 relative"
            >
              {/* Gold left rule */}
              <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />

              <p className="text-xs text-primary uppercase tracking-[0.2em] mb-3 pl-4">{trend.category}</p>
              <h3 className="font-heading text-xl font-bold text-white mb-4 pl-4">{trend.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm mb-6 pl-4">{trend.excerpt}</p>
              <span className="ml-4 inline-block text-xs border border-border px-3 py-1 text-muted-foreground">{trend.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
