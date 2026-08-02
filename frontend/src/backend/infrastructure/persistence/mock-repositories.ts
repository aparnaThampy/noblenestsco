import { IPropertyRepository, ILeadRepository } from "../../core/ports";
import { Property, Lead } from "../../core/domain/types";

const MOCK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "Prestige Golfshire Villas",
    slug: "prestige-golfshire-villas",
    price: "₹12.5 Cr onwards",
    location: {
      address: "Nandi Hills",
      city: "Bangalore",
      coordinates: { lat: 13.235, lng: 77.683 },
      nearbyPlaces: [{ name: "Airport", distance: "20 Mins" }]
    },
    city: "Bangalore",
    area: "7,500 sq.ft",
    type: "Luxury Villa",
    builder: "Prestige Group",
    financials: {
      roi: "14% p.a.",
      appreciation: "22% in 3 years"
    },
    status: "Published",
    description: "Ultra-luxury villas with a championship 18-hole golf course.",
    investmentHighlights: "Set against the picturesque Nandi Hills, Prestige Golfshire is Bangalore's most premium golf resort development. Designed for those who appreciate the finer things in life, these ultra-luxury villas offer unparalleled views, a championship 18-hole golf course, and a 5-star Marriott hotel on campus. The perfect asset for capital preservation and high rental yields targeting expat executives.",
    rera: "PRM/KA/RERA/1251/309/PR/170915/000155",
    bedrooms: 4,
    bathrooms: 5,
    parking: 2,
    images: [
      { id: "img1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop", isPrimary: true, order: 1 },
      { id: "img2", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop", isPrimary: false, order: 2 },
      { id: "img3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", isPrimary: false, order: 3 }
    ],
    media: {
      videos: [],
      floorPlans: [],
      brochures: []
    },
    contact: {
      contactName: "Noble Nests Advisor",
      phone: "+91 98765 43210",
      whatsapp: "1234567890",
      email: "invest@noblenests.co"
    },
    seo: {
      metaTitle: "Prestige Golfshire Villas | Luxury Real Estate Bangalore",
      metaDescription: "Invest in ultra-luxury villas at Prestige Golfshire, Bangalore. 18-hole golf course, premium amenities, high ROI.",
      keywords: ["luxury villas", "bangalore real estate", "prestige golfshire", "investment"]
    },
    amenities: ["18-Hole Golf Course", "Private Pool", "Clubhouse", "Helipad", "Concierge Service", "Spa & Wellness"],
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export class MockPropertyRepository implements IPropertyRepository {
  private properties: Property[] = [...MOCK_PROPERTIES];

  async findById(id: string): Promise<Property | null> {
    return this.properties.find(p => p.id === id) || null;
  }

  async findBySlug(slug: string): Promise<Property | null> {
    return this.properties.find(p => p.slug === slug) || null;
  }

  async findAll(filters?: { city?: string; budget?: string; isFeatured?: boolean }): Promise<Property[]> {
    let result = this.properties;
    if (filters?.city) {
      result = result.filter(p => p.city.toLowerCase() === filters.city?.toLowerCase());
    }
    if (filters?.isFeatured !== undefined) {
      result = result.filter(p => p.isFeatured === filters.isFeatured);
    }
    return result;
  }

  async create(propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
    const newProperty: Property = {
      ...propertyData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  async update(id: string, propertyData: Partial<Property>): Promise<Property> {
    const idx = this.properties.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Property not found");
    
    this.properties[idx] = { ...this.properties[idx], ...propertyData, updatedAt: new Date() };
    return this.properties[idx];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.properties.length;
    this.properties = this.properties.filter(p => p.id !== id);
    return this.properties.length !== initialLength;
  }
}

export class MockLeadRepository implements ILeadRepository {
  private leads: Lead[] = [];

  async findById(id: string): Promise<Lead | null> {
    return this.leads.find(l => l.id === id) || null;
  }

  async findAll(): Promise<Lead[]> {
    return this.leads;
  }

  async create(leadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status">): Promise<Lead> {
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      status: "New",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.leads.push(newLead);
    return newLead;
  }

  async updateStatus(id: string, status: Lead["status"]): Promise<Lead> {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) throw new Error("Lead not found");
    
    this.leads[idx] = { ...this.leads[idx], status, updatedAt: new Date() };
    return this.leads[idx];
  }
}

import { IHomepageSectionRepository, ITestimonialRepository, ISettingsRepository } from "../../core/ports";
import { HomepageSection, Testimonial, SocialLink, ContactSetting, CompanySetting } from "../../core/domain/types";

const MOCK_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'hs-1', sectionId: 'hero', title: 'Curated Wealth in Brick & Mortar', subtitle: 'Exclusive Luxury Real Estate Advisory', description: 'Discover Bangalore\'s most exclusive high-yield luxury properties, handpicked for discerning investors.', ctaText: 'Explore Investments', ctaLink: '/noblenestsco/properties', isVisible: true, sortOrder: 1, theme: 'dark', createdAt: new Date(), updatedAt: new Date() },
  { id: 'hs-2', sectionId: 'insights', title: 'Market Insights', subtitle: 'Data-Driven Decisions', description: 'Leverage our deep market intelligence to maximize your capital appreciation.', ctaText: 'Read Report', ctaLink: '/noblenestsco/insights', isVisible: true, sortOrder: 2, theme: 'light', createdAt: new Date(), updatedAt: new Date() },
  { id: 'hs-3', sectionId: 'why-us', title: 'The Noble Nests Advantage', subtitle: 'Why Partner With Us', description: 'We are not brokers; we are your investment partners focused on capital preservation and growth.', ctaText: 'Book Consultation', ctaLink: '/noblenestsco/contact', isVisible: true, sortOrder: 3, theme: 'dark', createdAt: new Date(), updatedAt: new Date() },
  { id: 'hs-4', sectionId: 'featured-properties', title: 'Curated For You', subtitle: 'Investment Opportunities', description: 'Explore our hand-picked selection of luxury assets available for immediate acquisition.', ctaText: 'View All Properties', ctaLink: '/noblenestsco/properties', isVisible: true, sortOrder: 4, theme: 'dark', createdAt: new Date(), updatedAt: new Date() },
  { id: 'hs-5', sectionId: 'prime-hubs', title: 'Strategic Locations', subtitle: 'Prime Investment Hubs', description: 'Invest in high-growth corridors engineered for significant appreciation.', ctaText: '', ctaLink: '', isVisible: true, sortOrder: 5, theme: 'light', createdAt: new Date(), updatedAt: new Date() },
  { id: 'hs-6', sectionId: 'testimonials', title: 'Trusted by Discerning Investors', subtitle: 'Client Success', description: 'Hear from our global clientele about their investment journeys with us.', ctaText: '', ctaLink: '', isVisible: true, sortOrder: 6, theme: 'dark', createdAt: new Date(), updatedAt: new Date() },
  { id: 'hs-7', sectionId: 'cta', title: 'Ready to Build Your Legacy?', subtitle: 'Take the Next Step', description: 'Connect with our advisory team for a private consultation tailored to your wealth goals.', ctaText: 'Talk to an Advisor', ctaLink: '/noblenestsco/contact', isVisible: true, sortOrder: 7, theme: 'gold', createdAt: new Date(), updatedAt: new Date() },
];

export class MockHomepageSectionRepository implements IHomepageSectionRepository {
  private sections: HomepageSection[] = [...MOCK_HOMEPAGE_SECTIONS];

  async findAll(): Promise<HomepageSection[]> {
    return this.sections.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async findById(id: string): Promise<HomepageSection | null> {
    return this.sections.find(s => s.id === id) || null;
  }

  async create(section: Omit<HomepageSection, "id">): Promise<HomepageSection> {
    const newSection: HomepageSection = { ...section, id: Math.random().toString(36).substring(2, 9), createdAt: new Date(), updatedAt: new Date() };
    this.sections.push(newSection);
    return newSection;
  }

  async update(id: string, section: Partial<HomepageSection>): Promise<HomepageSection> {
    const idx = this.sections.findIndex(s => s.id === id);
    if (idx === -1) throw new Error("Section not found");
    this.sections[idx] = { ...this.sections[idx], ...section, updatedAt: new Date() };
    return this.sections[idx];
  }

  async delete(id: string): Promise<boolean> {
    const len = this.sections.length;
    this.sections = this.sections.filter(s => s.id !== id);
    return this.sections.length !== len;
  }
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', name: 'Rajesh Kumar', designation: 'CEO', company: 'Tech Innovators', city: 'Bangalore', investorType: 'HNI Investor', rating: 5, testimonial: 'Noble Nests Co provided an exceptionally curated list of luxury properties. Their advisory approach helped me secure a high-yield asset without the usual hassle.', propertyPurchased: 'Prestige Golfshire Villas', purchaseYear: 2023, isVerified: true, isActive: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'test-2', name: 'Anita Desai', designation: 'Director', company: 'Global Enterprises', city: 'Dubai', investorType: 'NRI Investor', rating: 5, testimonial: 'Living in Dubai, I needed a trusted partner for my investments in India. The team at Noble Nests Co was transparent, highly professional, and secured an off-market deal for me.', propertyPurchased: 'Sattva Aeropolis', purchaseYear: 2024, isVerified: true, isActive: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
];

export class MockTestimonialRepository implements ITestimonialRepository {
  private testimonials: Testimonial[] = [...MOCK_TESTIMONIALS];

  async findAll(filters?: { isActive?: boolean }): Promise<Testimonial[]> {
    let result = this.testimonials;
    if (filters?.isActive !== undefined) {
      result = result.filter(t => t.isActive === filters.isActive);
    }
    return result.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async findById(id: string): Promise<Testimonial | null> {
    return this.testimonials.find(t => t.id === id) || null;
  }

  async create(testimonial: Omit<Testimonial, "id">): Promise<Testimonial> {
    const newT: Testimonial = { ...testimonial, id: Math.random().toString(36).substring(2, 9), createdAt: new Date(), updatedAt: new Date() };
    this.testimonials.push(newT);
    return newT;
  }

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const idx = this.testimonials.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Testimonial not found");
    this.testimonials[idx] = { ...this.testimonials[idx], ...testimonial, updatedAt: new Date() };
    return this.testimonials[idx];
  }

  async delete(id: string): Promise<boolean> {
    const len = this.testimonials.length;
    this.testimonials = this.testimonials.filter(t => t.id !== id);
    return this.testimonials.length !== len;
  }
}

const MOCK_CONTACT_SETTINGS: ContactSetting = {
  id: 'contact-1',
  whatsappNumber: '+919876543210',
  phoneNumber: '+918041234567',
  email: 'invest@noblenests.co',
  officeAddress: 'Noble Nests Co. Headquarters, UB City, Vittal Mallya Road, Bangalore 560001, Karnataka, India',
  googleMapsUrl: 'https://maps.google.com/?q=UB+City',
  createdAt: new Date(),
  updatedAt: new Date()
};

const MOCK_SOCIAL_LINKS: SocialLink[] = [
  { id: 'social-1', platform: 'Instagram', url: 'https://instagram.com/noblenestsco', displayName: '@noblenestsco', icon: 'instagram', isVisible: true, sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: 'social-2', platform: 'LinkedIn', url: 'https://linkedin.com/company/noblenestsco', displayName: 'Noble Nests Co', icon: 'linkedin', isVisible: true, sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: 'social-3', platform: 'WhatsApp', url: 'https://wa.me/919876543210', displayName: 'WhatsApp', icon: 'whatsapp', isVisible: true, sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
  { id: 'social-4', platform: 'Facebook', url: 'https://facebook.com/noblenestsco', displayName: 'Noble Nests Co', icon: 'facebook', isVisible: true, sortOrder: 4, createdAt: new Date(), updatedAt: new Date() }
];

export class MockSettingsRepository implements ISettingsRepository {
  private contactSettings = { ...MOCK_CONTACT_SETTINGS };
  private companySettings: CompanySetting[] = [];
  private socialLinks: SocialLink[] = [...MOCK_SOCIAL_LINKS];

  async getContactSettings(): Promise<ContactSetting | null> {
    return this.contactSettings;
  }

  async updateContactSettings(settings: Partial<ContactSetting>): Promise<ContactSetting> {
    this.contactSettings = { ...this.contactSettings, ...settings, updatedAt: new Date() };
    return this.contactSettings;
  }

  async getCompanySettings(): Promise<CompanySetting[]> {
    return this.companySettings;
  }

  async updateCompanySetting(key: string, value: string): Promise<CompanySetting> {
    const idx = this.companySettings.findIndex(s => s.settingKey === key);
    if (idx === -1) {
      const newSetting = { id: Math.random().toString(36).substring(2, 9), settingKey: key, settingValue: value, createdAt: new Date(), updatedAt: new Date() };
      this.companySettings.push(newSetting);
      return newSetting;
    }
    this.companySettings[idx] = { ...this.companySettings[idx], settingValue: value, updatedAt: new Date() };
    return this.companySettings[idx];
  }

  async getSocialLinks(filters?: { isVisible?: boolean }): Promise<SocialLink[]> {
    let result = this.socialLinks;
    if (filters?.isVisible !== undefined) {
      result = result.filter(s => s.isVisible === filters.isVisible);
    }
    return result.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createSocialLink(link: Omit<SocialLink, "id">): Promise<SocialLink> {
    const newL: SocialLink = { ...link, id: Math.random().toString(36).substring(2, 9), createdAt: new Date(), updatedAt: new Date() };
    this.socialLinks.push(newL);
    return newL;
  }

  async updateSocialLink(id: string, link: Partial<SocialLink>): Promise<SocialLink> {
    const idx = this.socialLinks.findIndex(s => s.id === id);
    if (idx === -1) throw new Error("Social Link not found");
    this.socialLinks[idx] = { ...this.socialLinks[idx], ...link, updatedAt: new Date() };
    return this.socialLinks[idx];
  }

  async deleteSocialLink(id: string): Promise<boolean> {
    const len = this.socialLinks.length;
    this.socialLinks = this.socialLinks.filter(s => s.id !== id);
    return this.socialLinks.length !== len;
  }
}
