import * as React from "react"
import { PropertyCard, mapPropertyToCardProps } from "@/components/shared/property-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, SlidersHorizontal } from "lucide-react"
import { container } from "@/backend/di/container"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const propertyService = container.propertyService;
  
  // Future: Parse searchParams for pagination and filters
  const properties = await propertyService.getAllProperties();
  const propertyCards = properties.map(mapPropertyToCardProps);

  return (
    <div className="bg-background min-h-screen">
      {/* Header Section */}
      <section className="bg-card py-16 border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white">Investment Portfolio</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Browse our curated selection of high-return real estate assets. Each property is thoroughly vetted for maximum ROI and long-term appreciation.
          </p>
          
          {/* Search Bar */}
          <div className="bg-background border border-border p-4 flex flex-col md:flex-row gap-4 max-w-5xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Search by location, builder, or property name..." 
                className="pl-10 h-12 border-none bg-transparent focus-visible:ring-0 text-base"
              />
            </div>
            <div className="hidden md:block w-px bg-border my-2" />
            <select className="h-12 px-4 bg-transparent border-none text-foreground focus:outline-none cursor-pointer">
              <option value="">All Cities</option>
              <option value="bangalore">Bangalore</option>
              <option value="kochi">Kochi</option>
            </select>
            <div className="hidden md:block w-px bg-border my-2" />
            <select className="h-12 px-4 bg-transparent border-none text-foreground focus:outline-none cursor-pointer">
              <option value="">Any Budget</option>
              <option value="2-5">₹2 Cr - ₹5 Cr</option>
              <option value="5-10">₹5 Cr - ₹10 Cr</option>
              <option value="10+">₹10 Cr+</option>
            </select>
            <Button variant="outline" className="shrink-0 h-12 px-6 gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              More Filters
            </Button>
            <Button className="shrink-0 h-12 px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-heading font-semibold text-white">Showing {propertyCards.length} Properties</h2>
            <select className="h-10 px-3 bg-card border border-border text-sm text-foreground focus:outline-none cursor-pointer">
              <option value="relevance">Sort by: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="roi-desc">Highest ROI</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {propertyCards.length === 0 ? (
              <div className="col-span-full py-12 text-center text-white/60 italic">
                No properties available.
              </div>
            ) : (
              propertyCards.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
