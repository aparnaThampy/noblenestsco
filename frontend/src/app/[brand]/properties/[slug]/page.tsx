import * as React from "react"
import { container } from "@/backend/di/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, TrendingUp, Maximize, Building2, Download, Calendar, ChevronRight, Check, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { getBrandPath } from "@/lib/config/brands"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function PropertyDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const propertyService = container.propertyService;
  const [property, contactSettings] = await Promise.all([
    propertyService.getPropertyBySlug(slug),
    container.settingsService.getContactSettings()
  ]);

  if (!property) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Property Not Found</h1>
          <Link href={getBrandPath("/properties")}>
            <Button variant="outline">Back to Properties</Button>
          </Link>
        </div>
      </div>
    )
  }

  const primaryImage = property.images?.find(img => img.isPrimary)?.url || property.images?.[0]?.url || "";
  const secondaryImage = property.images?.[1]?.url || primaryImage;
  const tertiaryImage = property.images?.[2]?.url || primaryImage;
  
  const whatsappContact = property.contact?.whatsapp || contactSettings?.whatsappNumber?.replace(/[^0-9]/g, "");

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Image Gallery */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="w-2/3 h-full border-r border-background/20 relative group">
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
             <img src={primaryImage} alt="Primary view" className="w-full h-full object-cover" />
             <div className="absolute bottom-8 left-8 z-20">
               <div className="flex items-center gap-2 text-sm text-white/50 mb-6 uppercase tracking-widest">
                 <Link href={getBrandPath("/properties")} className="hover:text-white transition-colors">Properties</Link>
                 <ChevronRight className="h-3 w-3" />
                 <span>{property.title}</span>
               </div>
               <Badge className="mb-4 bg-primary text-black hover:bg-primary/90">{property.type}</Badge>
               <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">{property.title}</h1>
               <div className="flex items-center text-white/80 gap-2">
                 <MapPin className="w-5 h-5 text-primary" /> {property.location.address}, {property.city}
               </div>
             </div>
          </div>
          <div className="w-1/3 h-full flex flex-col">
             <div className="h-1/2 border-b border-background/20">
               <img src={secondaryImage} alt="Interior view" className="w-full h-full object-cover" />
             </div>
             <div className="h-1/2 relative cursor-pointer group">
               <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors z-10 flex items-center justify-center">
                 <span className="text-white font-semibold uppercase tracking-widest">View Gallery</span>
               </div>
               <img src={tertiaryImage} alt="Exterior view" className="w-full h-full object-cover" />
             </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column - Details */}
          <div className="flex-1 space-y-12">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-border">
              {property.financials?.roi && (
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Expected ROI</p>
                  <p className="text-xl font-bold text-white flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> {property.financials.roi}</p>
                </div>
              )}
              {property.financials?.appreciation && (
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Appreciation</p>
                  <p className="text-xl font-bold text-white">{property.financials.appreciation}</p>
                </div>
              )}
              {property.area && (
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Area</p>
                  <p className="text-xl font-bold text-white flex items-center gap-2"><Maximize className="w-5 h-5 text-primary" /> {property.area}</p>
                </div>
              )}
              {property.builder && (
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Builder</p>
                  <p className="text-xl font-bold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-primary" /> {property.builder}</p>
                </div>
              )}
              {property.rera && (
                <div className="col-span-2 md:col-span-4 mt-2 pt-4 border-t border-white/5">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">RERA Number</p>
                  <p className="text-sm font-medium text-white/80">{property.rera}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-6">Investment Highlights</h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                {property.investmentHighlights || property.description}
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Verified Title:</strong> 100% clear legal title, vetted by our Tier-1 legal partners.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span><strong>Builder Grade:</strong> Grade A+ developer with zero delivery defaults in 20 years.</span>
                </li>
              </ul>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-white mb-6">Premium Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Nearby */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-white mb-6">Location Dynamics</h2>
              <div className="bg-card border border-border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-lg text-white">{property.location.address}, {property.city}</span>
                  </div>
                  {property.location.nearbyPlaces && property.location.nearbyPlaces.length > 0 && (
                    <div className="space-y-4">
                      {property.location.nearbyPlaces.map((place: { name: string; distance: string }) => (
                        <div key={place.name} className="flex justify-between items-center border-b border-border/50 pb-2">
                          <span className="text-muted-foreground">{place.name}</span>
                          <span className="text-white font-medium">{place.distance}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Google Maps Embed */}
                {property.location.coordinates?.lat && property.location.coordinates?.lng && (
                  <div className="w-full h-64 border-t border-border bg-black/50 flex flex-col items-center justify-center relative">
                    {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                      <iframe 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        loading="lazy" 
                        allowFullScreen 
                        referrerPolicy="no-referrer-when-downgrade" 
                        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${property.location.coordinates.lat},${property.location.coordinates.lng}&zoom=14`}
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 space-y-3 p-4 text-center">
                        <MapPin className="w-8 h-8 text-white/30" />
                        <div>
                          <p className="font-medium text-white/70">Map View Unavailable</p>
                          <p className="text-sm">Please open in Google Maps to view the exact location.</p>
                        </div>
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${property.location.coordinates.lat},${property.location.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Open in Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column - CTA Sidebar */}
          <div className="lg:w-[400px]">
            <Card className="sticky top-28 border-border bg-card">
              <div className="p-8 border-b border-border text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Investment Starting From</p>
                <p className="text-4xl font-heading font-bold text-white">{property.price}</p>
                <p className="text-xs text-primary mt-2">Prices subject to inventory availability</p>
              </div>
              
              <div className="p-8 space-y-4">
                <Link href={getBrandPath(`/properties/${property.slug}/book-site-visit`)} className="block w-full">
                  <Button className="w-full h-14 text-base flex items-center justify-center gap-2" size="lg">
                    <Calendar className="w-5 h-5" /> Book a Site Visit
                  </Button>
                </Link>
                
                {whatsappContact && (
                  <a 
                    href={`https://wa.me/${whatsappContact}?text=Hello Noble Nests Co,%0aI am interested in:%0aProperty: ${property.title}%0aLocation: ${property.location.address}%0aPlease arrange a consultation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button variant="secondary" className="w-full h-14 text-base bg-[#25D366] text-black hover:bg-[#1DA851] border-none flex items-center justify-center gap-2" size="lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Talk on WhatsApp
                    </Button>
                  </a>
                )}
                
                {property.media?.brochures && property.media.brochures.length > 0 && (
                  <a href={property.media.brochures[0]} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full h-14 text-base flex items-center justify-center gap-2" size="lg">
                      <Download className="w-5 h-5" /> Download Brochure
                    </Button>
                  </a>
                )}
              </div>

              <div className="bg-primary/5 p-6 text-center border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Have specific investment questions?</p>
                <Link href={getBrandPath("/contact")} className="text-primary font-semibold hover:underline decoration-primary underline-offset-4 uppercase tracking-widest text-sm">
                  Contact an Advisor {property.contact?.contactName && `(${property.contact.contactName})`}
                </Link>
              </div>
            </Card>
          </div>

        </div>
      </section>
    </div>
  )
}
