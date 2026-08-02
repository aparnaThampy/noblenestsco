/**
 * Dependency Injection Container
 *
 * This is the single composition root for the entire application.
 * To swap implementations (e.g., MockRepo → PostgresRepo, LocalStorage → R2),
 * only this file needs to change. No other code is affected.
 *
 * Architecture: Hexagonal / Ports & Adapters
 */

import { 
  PrismaPropertyRepository, 
  PrismaLeadRepository, 
  PrismaHomepageSectionRepository, 
  PrismaTestimonialRepository, 
  PrismaSettingsRepository, 
  PrismaSiteVisitRepository, 
  PrismaSiteVisitSlotRepository, 
  PrismaBookingTimelineRepository, 
  PrismaNotificationRepository, 
  PrismaSalesTargetRepository 
} from "../infrastructure/persistence/prisma/repositories";
import { LocalStorageProvider } from "../infrastructure/storage/local-storage";
import { R2StorageProvider } from "../infrastructure/storage/r2-storage";
import { PropertyService } from "../application/services/property-service";
import { LeadService } from "../application/services/lead-service";
import { HomepageService } from "../application/services/homepage-service";
import { TestimonialService } from "../application/services/testimonial-service";
import { SettingsService } from "../application/services/settings-service";
import { CRMService } from "../application/services/crm-service";
import { IPropertyRepository, ILeadRepository, IStorageProvider, IHomepageSectionRepository, ITestimonialRepository, ISettingsRepository, ISiteVisitRepository, ISiteVisitSlotRepository, IBookingTimelineRepository, INotificationRepository, ISalesTargetRepository } from "../core/ports";

// ─── Storage Provider Factory ─────────────────────────────────────────────────
// To use R2 in production: set STORAGE_PROVIDER=cloudflare-r2 in .env
function createStorageProvider(): IStorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "cloudflare-r2":
      return new R2StorageProvider();
    case "local":
    default:
      return new LocalStorageProvider();
  }
}

// ─── Repository Factory ───────────────────────────────────────────────────────
// Uses Prisma PostgreSQL Repositories
function createPropertyRepository(): IPropertyRepository {
  return new PrismaPropertyRepository();
}

function createLeadRepository(): ILeadRepository {
  return new PrismaLeadRepository();
}

function createHomepageSectionRepository(): IHomepageSectionRepository {
  return new PrismaHomepageSectionRepository();
}

function createTestimonialRepository(): ITestimonialRepository {
  return new PrismaTestimonialRepository();
}

function createSettingsRepository(): ISettingsRepository {
  return new PrismaSettingsRepository();
}

function createSiteVisitRepository(): ISiteVisitRepository {
  return new PrismaSiteVisitRepository();
}

function createSiteVisitSlotRepository(): ISiteVisitSlotRepository {
  return new PrismaSiteVisitSlotRepository();
}

function createBookingTimelineRepository(): IBookingTimelineRepository {
  return new PrismaBookingTimelineRepository();
}

function createNotificationRepository(): INotificationRepository {
  return new PrismaNotificationRepository();
}

function createSalesTargetRepository(): ISalesTargetRepository {
  return new PrismaSalesTargetRepository();
}

// ─── Container ────────────────────────────────────────────────────────────────
class Container {
  private static instance: Container;

  readonly storageProvider: IStorageProvider;
  readonly propertyRepo: IPropertyRepository;
  readonly leadRepo: ILeadRepository;
  readonly homepageSectionRepo: IHomepageSectionRepository;
  readonly testimonialRepo: ITestimonialRepository;
  readonly settingsRepo: ISettingsRepository;
  
  readonly siteVisitRepo: ISiteVisitRepository;
  readonly slotRepo: ISiteVisitSlotRepository;
  readonly timelineRepo: IBookingTimelineRepository;
  readonly notificationRepo: INotificationRepository;
  readonly salesTargetRepo: ISalesTargetRepository;
  
  readonly propertyService: PropertyService;
  readonly leadService: LeadService;
  readonly homepageService: HomepageService;
  readonly testimonialService: TestimonialService;
  readonly settingsService: SettingsService;
  readonly crmService: CRMService;

  private constructor() {
    this.storageProvider = createStorageProvider();
    
    this.propertyRepo = createPropertyRepository();
    this.leadRepo = createLeadRepository();
    this.homepageSectionRepo = createHomepageSectionRepository();
    this.testimonialRepo = createTestimonialRepository();
    this.settingsRepo = createSettingsRepository();
    
    this.siteVisitRepo = createSiteVisitRepository();
    this.slotRepo = createSiteVisitSlotRepository();
    this.timelineRepo = createBookingTimelineRepository();
    this.notificationRepo = createNotificationRepository();
    this.salesTargetRepo = createSalesTargetRepository();
    
    this.propertyService = new PropertyService(this.propertyRepo, this.storageProvider);
    this.leadService = new LeadService(this.leadRepo);
    this.homepageService = new HomepageService(this.homepageSectionRepo);
    this.testimonialService = new TestimonialService(this.testimonialRepo);
    this.settingsService = new SettingsService(this.settingsRepo);
    
    this.crmService = new CRMService(
      this.siteVisitRepo,
      this.slotRepo,
      this.leadRepo,
      this.timelineRepo,
      this.notificationRepo,
      this.salesTargetRepo
    );
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}

// Export a singleton container
export const container = Container.getInstance();
