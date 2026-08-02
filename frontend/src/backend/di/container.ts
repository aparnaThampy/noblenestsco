/**
 * Dependency Injection Container
 *
 * This is the single composition root for the entire application.
 * To swap implementations (e.g., MockRepo → PostgresRepo, LocalStorage → R2),
 * only this file needs to change. No other code is affected.
 *
 * Architecture: Hexagonal / Ports & Adapters
 */

import { MockPropertyRepository, MockLeadRepository, MockHomepageSectionRepository, MockTestimonialRepository, MockSettingsRepository } from "../infrastructure/persistence/mock-repositories";
import { LocalStorageProvider } from "../infrastructure/storage/local-storage";
import { R2StorageProvider } from "../infrastructure/storage/r2-storage";
import { PropertyService } from "../application/services/property-service";
import { LeadService } from "../application/services/lead-service";
import { HomepageService } from "../application/services/homepage-service";
import { TestimonialService } from "../application/services/testimonial-service";
import { SettingsService } from "../application/services/settings-service";
import { IPropertyRepository, ILeadRepository, IStorageProvider, IHomepageSectionRepository, ITestimonialRepository, ISettingsRepository } from "../core/ports";

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
// To use a real DB: swap MockPropertyRepository → PostgresPropertyRepository
// The service layer never needs to change.
function createPropertyRepository(): IPropertyRepository {
  return new MockPropertyRepository();
}

function createLeadRepository(): ILeadRepository {
  return new MockLeadRepository();
}

function createHomepageSectionRepository(): IHomepageSectionRepository {
  return new MockHomepageSectionRepository();
}

function createTestimonialRepository(): ITestimonialRepository {
  return new MockTestimonialRepository();
}

function createSettingsRepository(): ISettingsRepository {
  return new MockSettingsRepository();
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
  
  readonly propertyService: PropertyService;
  readonly leadService: LeadService;
  readonly homepageService: HomepageService;
  readonly testimonialService: TestimonialService;
  readonly settingsService: SettingsService;

  private constructor() {
    this.storageProvider = createStorageProvider();
    
    this.propertyRepo = createPropertyRepository();
    this.leadRepo = createLeadRepository();
    this.homepageSectionRepo = createHomepageSectionRepository();
    this.testimonialRepo = createTestimonialRepository();
    this.settingsRepo = createSettingsRepository();
    
    this.propertyService = new PropertyService(this.propertyRepo, this.storageProvider);
    this.leadService = new LeadService(this.leadRepo);
    this.homepageService = new HomepageService(this.homepageSectionRepo);
    this.testimonialService = new TestimonialService(this.testimonialRepo);
    this.settingsService = new SettingsService(this.settingsRepo);
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
