import * as React from "react"
import { PropertyCard, mapPropertyToCardProps } from "@/components/shared/property-card"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBrandPath } from "@/lib/config/brands"
import { container } from "@/backend/di/container"
import Link from "next/link"

export async function FeaturedProperties() {
  const propertyService = container.propertyService;
  const properties = await propertyService.getAllProperties({ isFeatured: true });
  const propertyCards = properties.map(mapPropertyToCardProps);

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">Investment Opportunities</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">Curated For You</h2>
          </div>
          <Link href={getBrandPath("/properties")} passHref>
            <Button variant="outline" className="hidden md:flex gap-2">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyCards.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/60 italic">
              No featured properties available.
            </div>
          ) : (
            propertyCards.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
