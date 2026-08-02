import { ISiteVisitRepository, ISiteVisitSlotRepository, ILeadRepository, IBookingTimelineRepository, INotificationRepository, ISalesTargetRepository } from "../../core/ports";
import { SiteVisit, SiteVisitSlot, Lead, BookingStatus } from "../../core/domain/types";

export class CRMService {
  constructor(
    private readonly siteVisitRepo: ISiteVisitRepository,
    private readonly slotRepo: ISiteVisitSlotRepository,
    private readonly leadRepo: ILeadRepository,
    private readonly timelineRepo: IBookingTimelineRepository,
    private readonly notificationRepo: INotificationRepository,
    private readonly salesTargetRepo: ISalesTargetRepository
  ) {}

  // ─── Booking Flow ─────────────────────────────────────────────────────────────

  async bookSiteVisit(data: {
    propertyId: string;
    date: string;
    time: string;
    numberOfVisitors: number;
    notes?: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
  }): Promise<SiteVisit> {
    // 1. Find or create lead
    const leads = await this.leadRepo.findAll();
    let lead = leads.find(l => l.email === data.customer.email || l.phone === data.customer.phone);
    
    if (!lead) {
      lead = await this.leadRepo.create({
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        budget: "To be defined", // Default
        city: "Unknown", // Can be inferred from property
        purpose: "Investment",
      });
    }

    // 2. Create Site Visit
    const visit = await this.siteVisitRepo.create({
      leadId: lead.id,
      propertyId: data.propertyId,
      date: data.date,
      time: data.time,
      numberOfVisitors: data.numberOfVisitors,
      status: "Pending",
      notes: data.notes,
    });

    // 3. Add to Timeline
    await this.timelineRepo.create({
      bookingId: visit.id,
      action: "Created",
      description: `Booking requested by ${lead.name} for ${data.date} at ${data.time}`,
      timestamp: new Date(),
    });

    // 4. Send Notifications (Mock)
    await this.notificationRepo.create({
      recipientId: lead.id,
      type: "Email",
      subject: "Site Visit Request Received",
      message: `Dear ${lead.name}, your site visit request for ${data.date} is pending confirmation.`,
    });

    await this.notificationRepo.create({
      recipientId: "admin",
      type: "Dashboard",
      subject: "New Site Visit Booking",
      message: `${lead.name} requested a site visit on ${data.date} at ${data.time}.`,
    });

    return visit;
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus, note?: string): Promise<SiteVisit> {
    const visit = await this.siteVisitRepo.updateStatus(bookingId, status);
    
    await this.timelineRepo.create({
      bookingId: visit.id,
      action: "StatusChanged",
      description: `Status changed to ${status}${note ? `: ${note}` : ''}`,
      timestamp: new Date(),
    });

    return visit;
  }

  // ─── Slot Management ──────────────────────────────────────────────────────────

  async getAvailableSlots(propertyId: string, date: string): Promise<SiteVisitSlot[]> {
    const slots = await this.slotRepo.findByPropertyId(propertyId);
    // In a real implementation, this would cross-reference with booked SiteVisits
    // and respect specific date overrides vs dayOfWeek.
    // For now, we return all slots configured as available.
    return slots.filter(s => s.isAvailable);
  }

  async configureSlots(propertyId: string, slots: Omit<SiteVisitSlot, "id" | "createdAt" | "updatedAt">[]) {
    const existing = await this.slotRepo.findByPropertyId(propertyId);
    for (const slot of existing) {
      await this.slotRepo.delete(slot.id);
    }
    
    for (const slot of slots) {
      await this.slotRepo.create(slot);
    }
  }

  // ─── Dashboard Metrics ────────────────────────────────────────────────────────

  async getDashboardMetrics() {
    const today = new Date().toISOString().split('T')[0];
    
    const allVisits = await this.siteVisitRepo.findAll();
    const todayVisits = allVisits.filter(v => v.date === today);
    const pendingVisits = allVisits.filter(v => v.status === "Pending");
    const completedVisits = allVisits.filter(v => v.status === "Completed");
    
    const leads = await this.leadRepo.findAll();
    const newLeads = leads.filter(l => l.status === "New");

    const target = await this.salesTargetRepo.getCurrentTarget();

    return {
      todayVisits: todayVisits.length,
      pendingVisits: pendingVisits.length,
      completedVisits: completedVisits.length,
      newLeads: newLeads.length,
      target
    };
  }

  async getAllVisits() {
    return this.siteVisitRepo.findAll();
  }
}
