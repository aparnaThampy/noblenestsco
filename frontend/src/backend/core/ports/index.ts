import { Property, Lead } from "../domain/types";

export interface IPropertyRepository {
  findById(id: string): Promise<Property | null>;
  findBySlug(slug: string): Promise<Property | null>;
  findAll(filters?: { city?: string; budget?: string; isFeatured?: boolean; status?: Property["status"] }): Promise<Property[]>;
  create(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property>;
  update(id: string, property: Partial<Property>): Promise<Property>;
  delete(id: string): Promise<boolean>;
}

export interface ILeadRepository {
  findById(id: string): Promise<Lead | null>;
  findAll(): Promise<Lead[]>;
  create(lead: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status">): Promise<Lead>;
  updateStatus(id: string, status: Lead["status"]): Promise<Lead>;
}

export interface IStorageProvider {
  uploadFile(fileBytes: Uint8Array, fileName: string, mimeType: string, pathPrefix?: string): Promise<string>;
  deleteFile(fileUrl: string): Promise<boolean>;
  getPresignedUrl?(fileName: string): Promise<string>;
}

import { HomepageSection, Testimonial, SocialLink, ContactSetting, CompanySetting } from "../domain/types";

export interface IHomepageSectionRepository {
  findAll(): Promise<HomepageSection[]>;
  findById(id: string): Promise<HomepageSection | null>;
  create(section: Omit<HomepageSection, "id">): Promise<HomepageSection>;
  update(id: string, section: Partial<HomepageSection>): Promise<HomepageSection>;
  delete(id: string): Promise<boolean>;
}

export interface ITestimonialRepository {
  findAll(filters?: { isActive?: boolean }): Promise<Testimonial[]>;
  findById(id: string): Promise<Testimonial | null>;
  create(testimonial: Omit<Testimonial, "id">): Promise<Testimonial>;
  update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial>;
  delete(id: string): Promise<boolean>;
}

export interface ISettingsRepository {
  getContactSettings(): Promise<ContactSetting | null>;
  updateContactSettings(settings: Partial<ContactSetting>): Promise<ContactSetting>;
  
  getCompanySettings(): Promise<CompanySetting[]>;
  updateCompanySetting(key: string, value: string): Promise<CompanySetting>;
  
  getSocialLinks(filters?: { isVisible?: boolean }): Promise<SocialLink[]>;
  createSocialLink(link: Omit<SocialLink, "id">): Promise<SocialLink>;
  updateSocialLink(id: string, link: Partial<SocialLink>): Promise<SocialLink>;
  deleteSocialLink(id: string): Promise<boolean>;
}

import { SiteVisit, SiteVisitSlot, SalesTarget, BookingTimeline, Notification } from "../domain/types";

export interface ISiteVisitRepository {
  findById(id: string): Promise<SiteVisit | null>;
  findAll(filters?: { propertyId?: string; date?: string; status?: SiteVisit["status"] }): Promise<SiteVisit[]>;
  create(visit: Omit<SiteVisit, "id" | "createdAt" | "updatedAt">): Promise<SiteVisit>;
  updateStatus(id: string, status: SiteVisit["status"]): Promise<SiteVisit>;
}

export interface ISiteVisitSlotRepository {
  findByPropertyId(propertyId: string): Promise<SiteVisitSlot[]>;
  create(slot: Omit<SiteVisitSlot, "id" | "createdAt" | "updatedAt">): Promise<SiteVisitSlot>;
  update(id: string, slot: Partial<SiteVisitSlot>): Promise<SiteVisitSlot>;
  delete(id: string): Promise<boolean>;
}

export interface ISalesTargetRepository {
  getCurrentTarget(): Promise<SalesTarget | null>;
  findAll(): Promise<SalesTarget[]>;
  create(target: Omit<SalesTarget, "id" | "createdAt" | "updatedAt">): Promise<SalesTarget>;
  update(id: string, target: Partial<SalesTarget>): Promise<SalesTarget>;
}

export interface IBookingTimelineRepository {
  findByBookingId(bookingId: string): Promise<BookingTimeline[]>;
  create(entry: Omit<BookingTimeline, "id">): Promise<BookingTimeline>;
}

export interface INotificationRepository {
  findAll(filters?: { recipientId?: string; isRead?: boolean }): Promise<Notification[]>;
  create(notification: Omit<Notification, "id" | "createdAt" | "isRead">): Promise<Notification>;
  markAsRead(id: string): Promise<Notification>;
}
