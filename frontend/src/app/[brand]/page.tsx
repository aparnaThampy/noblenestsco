import { HeroSection } from "@/components/features/home/hero-section"
import { WhyChooseUs } from "@/components/features/home/why-choose-us"
import { FeaturedProperties } from "@/components/features/home/featured-properties"
import { FeaturedLocations } from "@/components/features/home/featured-locations"
import { MarketInsights } from "@/components/features/home/market-insights"
import { Testimonials } from "@/components/features/home/testimonials"
import { HomeCTA } from "@/components/features/home/home-cta"
import { container } from "@/backend/di/container"

export const metadata = {
  title: "Noble Nests Co — Luxury Real Estate Investment Advisory",
  description:
    "Noble Nests Co curates verified, high-growth luxury real estate investments in Bangalore, Kochi, and beyond. Not a listing site — an advisory platform.",
}

export default async function HomePage() {
  const [contactSettings, properties, testimonials, homepageSections] = await Promise.all([
    container.settingsService.getContactSettings(),
    container.propertyService.getAllProperties({ status: "active" }),
    container.testimonialService.getAllTestimonials({ isActive: true }),
    container.homepageService.getAllSections()
  ]);
  
  const whatsappNumber = contactSettings?.whatsappNumber?.replace(/[^0-9]/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined;

  const citiesMap = new Map<string, number>();
  
  properties.forEach(p => {
    if (p.location?.city) {
      citiesMap.set(p.location.city, (citiesMap.get(p.location.city) || 0) + 1);
    }
  });

  const activeLocations = Array.from(citiesMap.keys());

  const getSection = (id: string) => homepageSections.find(s => s.sectionId === id);

  return (
    <>
      <HeroSection whatsappUrl={whatsappUrl} sectionData={getSection("hero")} />
      <MarketInsights sectionData={getSection("market-insights")} />
      <WhyChooseUs sectionData={getSection("why-choose-us")} />
      <FeaturedProperties sectionData={getSection("featured-properties")} />
      <FeaturedLocations locations={activeLocations} sectionData={getSection("featured-locations")} />
      <Testimonials testimonials={testimonials} sectionData={getSection("testimonials")} />
      <HomeCTA sectionData={getSection("home-cta")} />
    </>
  )
}
