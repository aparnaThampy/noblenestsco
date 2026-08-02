/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma } from '@prisma/client';
import prisma from './client';
import { 
  IPropertyRepository, 
  ILeadRepository, 
  IHomepageSectionRepository, 
  ITestimonialRepository, 
  ISettingsRepository,
  ISiteVisitRepository,
  ISiteVisitSlotRepository,
  ISalesTargetRepository,
  IBookingTimelineRepository,
  INotificationRepository
} from '../../../core/ports';
import { 
  Property, 
  Lead, 
  HomepageSection, 
  Testimonial, 
  SocialLink, 
  ContactSetting, 
  CompanySetting,
  SiteVisit,
  SiteVisitSlot,
  SalesTarget,
  BookingTimeline,
  Notification,
  PropertyFinancials,
  PropertyLocation,
  PropertyMedia,
  PropertySEO,
  PropertyContact,
  PropertyImage
} from '../../../core/domain/types';

export class PrismaPropertyRepository implements IPropertyRepository {
  async findById(id: string): Promise<Property | null> {
    const property = await prisma.property.findUnique({ where: { id } });
    return property ? this.mapToDomain(property) : null;
  }

  async findBySlug(slug: string): Promise<Property | null> {
    const property = await prisma.property.findUnique({ where: { slug } });
    return property ? this.mapToDomain(property) : null;
  }

  async findAll(filters?: { city?: string; budget?: string; isFeatured?: boolean }): Promise<Property[]> {
    const where: Prisma.PropertyWhereInput = {};
    if (filters?.city) where.city = { equals: filters.city, mode: 'insensitive' };
    if (filters?.isFeatured !== undefined) where.isFeatured = filters.isFeatured;

    const properties = await prisma.property.findMany({ where });
    return properties.map(p => this.mapToDomain(p));
  }

  async create(propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
    const created = await prisma.property.create({
      data: {
        ...propertyData,
        investmentHighlights: propertyData.investmentHighlights || null,
        rera: propertyData.rera || null,
        bedrooms: propertyData.bedrooms || null,
        bathrooms: propertyData.bathrooms || null,
        parking: propertyData.parking || null,
        availability: propertyData.availability || null,
        amenities: propertyData.amenities as any,
        financials: propertyData.financials as any,
        location: propertyData.location as any,
        media: ((propertyData.media as any) || null),
        seo: ((propertyData.seo as any) || null),
        contact: ((propertyData.contact as any) || null),
        images: propertyData.images as any,
      }
    });
    return this.mapToDomain(created);
  }

  async update(id: string, propertyData: Partial<Property>): Promise<Property> {
    const updateData: Prisma.PropertyUpdateInput = {
      title: propertyData.title,
      slug: propertyData.slug,
      description: propertyData.description,
      investmentHighlights: propertyData.investmentHighlights,
      price: propertyData.price,
      type: propertyData.type,
      status: propertyData.status,
      builder: propertyData.builder,
      area: propertyData.area,
      rera: propertyData.rera,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      parking: propertyData.parking,
      isFeatured: propertyData.isFeatured,
      city: propertyData.city,
      availability: propertyData.availability,
    };
    
    if (propertyData.amenities) updateData.amenities = propertyData.amenities as any;
    if (propertyData.financials) updateData.financials = propertyData.financials as any;
    if (propertyData.location) updateData.location = propertyData.location as any;
    if (propertyData.media !== undefined) updateData.media = (propertyData.media as any) || null;
    if (propertyData.seo !== undefined) updateData.seo = (propertyData.seo as any) || null;
    if (propertyData.contact !== undefined) updateData.contact = (propertyData.contact as any) || null;
    if (propertyData.images) updateData.images = propertyData.images as any;

    const updated = await prisma.property.update({
      where: { id },
      data: updateData
    });
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.property.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  private mapToDomain(model: any): Property {
    return {
      ...model,
      amenities: model.amenities as string[],
      financials: model.financials as PropertyFinancials,
      location: model.location as PropertyLocation,
      media: model.media ? (model.media as PropertyMedia) : undefined,
      seo: model.seo ? (model.seo as PropertySEO) : undefined,
      contact: model.contact ? (model.contact as PropertyContact) : undefined,
      images: model.images as PropertyImage[],
      availability: model.availability as Property["availability"],
      status: model.status as Property["status"],
    };
  }
}

export class PrismaLeadRepository implements ILeadRepository {
  async findById(id: string): Promise<Lead | null> {
    const lead = await prisma.lead.findUnique({ where: { id } });
    return lead ? (lead as Lead) : null;
  }

  async findAll(): Promise<Lead[]> {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    return leads as Lead[];
  }

  async create(leadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status">): Promise<Lead> {
    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        status: "New"
      }
    });
    return lead as Lead;
  }

  async updateStatus(id: string, status: Lead["status"]): Promise<Lead> {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status }
    });
    return lead as Lead;
  }
}

export class PrismaHomepageSectionRepository implements IHomepageSectionRepository {
  async findAll(): Promise<HomepageSection[]> {
    const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' } });
    return sections as HomepageSection[];
  }

  async findById(id: string): Promise<HomepageSection | null> {
    const section = await prisma.homepageSection.findUnique({ where: { id } });
    return section ? (section as HomepageSection) : null;
  }

  async create(section: Omit<HomepageSection, "id">): Promise<HomepageSection> {
    const created = await prisma.homepageSection.create({ data: section as any });
    return created as HomepageSection;
  }

  async update(id: string, section: Partial<HomepageSection>): Promise<HomepageSection> {
    const updated = await prisma.homepageSection.update({
      where: { id },
      data: section as any
    });
    return updated as HomepageSection;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.homepageSection.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export class PrismaTestimonialRepository implements ITestimonialRepository {
  async findAll(filters?: { isActive?: boolean }): Promise<Testimonial[]> {
    const where = filters?.isActive !== undefined ? { isActive: filters.isActive } : {};
    const items = await prisma.testimonial.findMany({ where, orderBy: { sortOrder: 'asc' } });
    return items as Testimonial[];
  }

  async findById(id: string): Promise<Testimonial | null> {
    const item = await prisma.testimonial.findUnique({ where: { id } });
    return item ? (item as Testimonial) : null;
  }

  async create(testimonial: Omit<Testimonial, "id">): Promise<Testimonial> {
    const created = await prisma.testimonial.create({ data: testimonial as any });
    return created as Testimonial;
  }

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: testimonial as any
    });
    return updated as Testimonial;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.testimonial.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export class PrismaSettingsRepository implements ISettingsRepository {
  async getContactSettings(): Promise<ContactSetting | null> {
    return await prisma.contactSetting.findFirst() as ContactSetting | null;
  }

  async updateContactSettings(settings: Partial<ContactSetting>): Promise<ContactSetting> {
    const current = await prisma.contactSetting.findFirst();
    if (current) {
      return await prisma.contactSetting.update({
        where: { id: current.id },
        data: settings as any
      }) as ContactSetting;
    } else {
      return await prisma.contactSetting.create({
        data: settings as any
      }) as ContactSetting;
    }
  }

  async getCompanySettings(): Promise<CompanySetting[]> {
    return await prisma.companySetting.findMany() as CompanySetting[];
  }

  async updateCompanySetting(key: string, value: string): Promise<CompanySetting> {
    const current = await prisma.companySetting.findUnique({ where: { settingKey: key } });
    if (current) {
      return await prisma.companySetting.update({
        where: { id: current.id },
        data: { settingValue: value }
      }) as CompanySetting;
    } else {
      return await prisma.companySetting.create({
        data: { settingKey: key, settingValue: value }
      }) as CompanySetting;
    }
  }

  async getSocialLinks(filters?: { isVisible?: boolean }): Promise<SocialLink[]> {
    const where = filters?.isVisible !== undefined ? { isVisible: filters.isVisible } : {};
    return await prisma.socialLink.findMany({ where, orderBy: { sortOrder: 'asc' } }) as SocialLink[];
  }

  async createSocialLink(link: Omit<SocialLink, "id">): Promise<SocialLink> {
    return await prisma.socialLink.create({ data: link as any }) as SocialLink;
  }

  async updateSocialLink(id: string, link: Partial<SocialLink>): Promise<SocialLink> {
    return await prisma.socialLink.update({ where: { id }, data: link as any }) as SocialLink;
  }

  async deleteSocialLink(id: string): Promise<boolean> {
    try {
      await prisma.socialLink.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export class PrismaSiteVisitRepository implements ISiteVisitRepository {
  async findById(id: string): Promise<SiteVisit | null> {
    const visit = await prisma.siteVisit.findUnique({ where: { id } });
    return visit ? (visit as SiteVisit) : null;
  }

  async findAll(filters?: { propertyId?: string; date?: string; status?: SiteVisit["status"] }): Promise<SiteVisit[]> {
    const where: any = {};
    if (filters?.propertyId) where.propertyId = filters.propertyId;
    if (filters?.date) where.date = filters.date;
    if (filters?.status) where.status = filters.status;
    return await prisma.siteVisit.findMany({ where, orderBy: { createdAt: 'desc' } }) as SiteVisit[];
  }

  async create(visit: Omit<SiteVisit, "id" | "createdAt" | "updatedAt">): Promise<SiteVisit> {
    return await prisma.siteVisit.create({ data: visit as any }) as SiteVisit;
  }

  async updateStatus(id: string, status: SiteVisit["status"]): Promise<SiteVisit> {
    return await prisma.siteVisit.update({ where: { id }, data: { status } }) as SiteVisit;
  }
}

export class PrismaSiteVisitSlotRepository implements ISiteVisitSlotRepository {
  async findByPropertyId(propertyId: string): Promise<SiteVisitSlot[]> {
    return await prisma.siteVisitSlot.findMany({ where: { propertyId } }) as SiteVisitSlot[];
  }

  async create(slot: Omit<SiteVisitSlot, "id" | "createdAt" | "updatedAt">): Promise<SiteVisitSlot> {
    return await prisma.siteVisitSlot.create({ data: slot as any }) as SiteVisitSlot;
  }

  async update(id: string, slot: Partial<SiteVisitSlot>): Promise<SiteVisitSlot> {
    return await prisma.siteVisitSlot.update({ where: { id }, data: slot as any }) as SiteVisitSlot;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.siteVisitSlot.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export class PrismaSalesTargetRepository implements ISalesTargetRepository {
  async getCurrentTarget(): Promise<SalesTarget | null> {
    const target = await prisma.salesTarget.findFirst({ orderBy: { createdAt: 'desc' } });
    return target ? (target as any) : null;
  }

  async findAll(): Promise<SalesTarget[]> {
    return await prisma.salesTarget.findMany({ orderBy: { createdAt: 'desc' } }) as any[];
  }

  async create(target: Omit<SalesTarget, "id" | "createdAt" | "updatedAt">): Promise<SalesTarget> {
    return await prisma.salesTarget.create({ data: target as any }) as any;
  }

  async update(id: string, target: Partial<SalesTarget>): Promise<SalesTarget> {
    return await prisma.salesTarget.update({ where: { id }, data: target as any }) as any;
  }
}

export class PrismaBookingTimelineRepository implements IBookingTimelineRepository {
  async findByBookingId(bookingId: string): Promise<BookingTimeline[]> {
    return await prisma.bookingTimeline.findMany({ where: { bookingId }, orderBy: { timestamp: 'asc' } }) as any[];
  }

  async create(entry: Omit<BookingTimeline, "id">): Promise<BookingTimeline> {
    return await prisma.bookingTimeline.create({ data: entry as any }) as any;
  }
}

export class PrismaNotificationRepository implements INotificationRepository {
  async findAll(filters?: { recipientId?: string; isRead?: boolean }): Promise<Notification[]> {
    const where: any = {};
    if (filters?.recipientId) where.recipientId = filters.recipientId;
    if (filters?.isRead !== undefined) where.isRead = filters.isRead;
    return await prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' } }) as any[];
  }

  async create(notification: Omit<Notification, "id" | "createdAt" | "isRead">): Promise<Notification> {
    return await prisma.notification.create({ data: notification as any }) as any;
  }

  async markAsRead(id: string): Promise<Notification> {
    return await prisma.notification.update({ where: { id }, data: { isRead: true } }) as any;
  }
}
