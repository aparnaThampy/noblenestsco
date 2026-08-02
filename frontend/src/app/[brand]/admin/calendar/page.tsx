import { container } from "@/backend/di/container";
import { getBrandPath } from "@/lib/config/brands";
import { CalendarClient } from "./CalendarClient";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const allVisits = await container.crmService.getAllVisits();
  
  // Get related property titles for visits
  const properties = await container.propertyService.getAllProperties();
  const propertyMap = new Map(properties.map(p => [p.id, p.title]));
  
  // Get lead names
  const leads = await container.leadService.getAllLeads();
  const leadMap = new Map(leads.map(l => [l.id, l]));

  const mappedVisits = allVisits.map(visit => ({
    ...visit,
    propertyTitle: propertyMap.get(visit.propertyId) || "Unknown Property",
    leadName: leadMap.get(visit.leadId)?.name || "Unknown Lead",
    leadPhone: leadMap.get(visit.leadId)?.phone || "No Phone",
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-light text-white mb-2">Calendar</h1>
        <p className="text-white/50">View and manage upcoming site visits.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-md p-6">
        <CalendarClient initialVisits={mappedVisits} brandPath={getBrandPath("")} />
      </div>
    </div>
  );
}
