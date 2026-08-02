export interface PropertyFinancials {
  roi: string;
  appreciation: string;
}

export interface PropertyLocation {
  country?: string;
  state?: string;
  zone?: string;
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyPlaces?: Array<{ name: string; distance: string }>;
}

export interface PropertyMedia {
  videos?: string[];
  floorPlans?: string[];
  brochures?: string[];
}

export interface PropertySEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface PropertyContact {
  contactName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  investmentHighlights?: string;
  price: string;
  type: string;
  status: "Draft" | "Published" | "Sold";
  builder: string;
  area: string;
  rera?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  amenities: string[];
  financials: PropertyFinancials;
  location: PropertyLocation;
  media?: PropertyMedia;
  seo?: PropertySEO;
  contact?: PropertyContact;
  images: PropertyImage[];
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  /** Denormalised for convenient filtering without joining location */
  city: string;
  availability?: "Available" | "Limited Inventory" | "Sold Out" | "Hidden" | "Archived";
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  budget: string;
  city: string;
  purpose: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  createdAt: Date;
  updatedAt: Date;
}

export interface HomepageSection {
  id: string;
  sectionId: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  isVisible: boolean;
  sortOrder: number;
  theme: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  city: string;
  investorType: string;
  rating: number;
  testimonial: string;
  imageUrl?: string;
  propertyPurchased?: string;
  purchaseYear?: number;
  isVerified: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  displayName: string;
  icon: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanySetting {
  id: string;
  settingKey: string;
  settingValue: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactSetting {
  id: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  officeAddress: string;
  googleMapsUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MapSetting {
  id: string;
  defaultLat: number;
  defaultLng: number;
  defaultZoom: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── CRM Entities ─────────────────────────────────────────────────────────────

export interface SiteVisitSlot {
  id: string;
  propertyId: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  date?: string; // YYYY-MM-DD for specific overrides
  time: string; // HH:mm
  maxVisitors: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled" | "Rescheduled";

export interface SiteVisit {
  id: string;
  leadId: string;
  propertyId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  numberOfVisitors: number;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SalesPeriod = "Monthly" | "Quarterly" | "Yearly";

export interface SalesTarget {
  id: string;
  period: SalesPeriod;
  startDate: Date;
  endDate: Date;
  targetRevenue: number;
  targetBookings: number;
  targetVisits: number;
  achievedRevenue: number;
  achievedBookings: number;
  achievedVisits: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TimelineAction = "Created" | "StatusChanged" | "NoteAdded" | "NotificationSent" | "Rescheduled";

export interface BookingTimeline {
  id: string;
  bookingId: string;
  action: TimelineAction;
  description: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  recipientId: string; // Could be leadId or 'admin'
  type: "Email" | "WhatsApp" | "SMS" | "Dashboard";
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
