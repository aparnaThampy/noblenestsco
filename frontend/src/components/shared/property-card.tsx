import * as React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MapPin, Maximize, TrendingUp, Building2 } from "lucide-react"

import { Property } from "@/backend/core/domain/types"

export interface PropertyProps {
  id: string
  title: string
  slug: string
  price: string
  location: string
  city: string
  area: string
  type: string
  builder: string
  roi: string
  imageUrl: string
  isFeatured?: boolean
}

export function mapPropertyToCardProps(property: Property): PropertyProps {
  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    price: property.price,
    location: property.location.address,
    city: property.city,
    area: property.area,
    type: property.type,
    builder: property.builder,
    roi: property.financials.roi,
    imageUrl: property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url || "",
    isFeatured: property.isFeatured,
  };
}

export function PropertyCard({ property }: { property: PropertyProps }) {
  return (
    <Card className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-colors duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-colors z-10" />
        {/* We use standard img for now since next/image might have host issues with placeholders */}
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {property.isFeatured && (
            <Badge variant="gold">Featured Investment</Badge>
          )}
          <Badge className="bg-black/80 backdrop-blur text-white border-none">{property.type}</Badge>
        </div>
        <div className="absolute bottom-4 left-4 z-20">
          <p className="text-2xl font-heading font-bold text-white drop-shadow-md">
            {property.price}
          </p>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-heading font-semibold text-white mb-2 line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-muted-foreground text-sm gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>ROI: {property.roi}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Maximize className="w-4 h-4 text-primary" />
            <span>{property.area}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 col-span-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>By {property.builder}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-4">
        <Link href={`/noblenestsco/properties/${property.slug}`} className="flex-1 w-full h-12 flex items-center justify-center border border-primary text-primary hover:bg-primary hover:text-black transition-colors uppercase tracking-wider text-xs font-semibold">
          View Details
        </Link>
        <a 
          href={`https://wa.me/1234567890?text=I am interested in ${property.title} (${property.location})`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 w-full h-12 flex items-center justify-center bg-[#25D366] text-black hover:bg-[#1DA851] transition-colors uppercase tracking-wider text-xs font-semibold"
        >
          WhatsApp
        </a>
      </CardFooter>
    </Card>
  )
}
