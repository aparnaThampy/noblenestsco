import { container } from "@/backend/di/container";
import { Users, Calendar, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { getBrandPath } from "@/lib/config/brands";
import { BookingStatus } from "@/backend/core/domain/types";

export const dynamic = "force-dynamic";

export default async function CRMPage() {
  const metrics = await container.crmService.getDashboardMetrics();
  const allVisits = await container.crmService.getAllVisits();
  
  // Sort visits by date descending
  allVisits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get related property titles for visits
  const properties = await container.propertyService.getAllProperties();
  const propertyMap = new Map(properties.map(p => [p.id, p.title]));
  
  // Get lead names
  const leads = await container.leadService.getAllLeads();
  const leadMap = new Map(leads.map(l => [l.id, l]));

  const stats = [
    { name: "Today's Visits", value: metrics.todayVisits, icon: Calendar, change: "+2 from yesterday" },
    { name: "Pending Requests", value: metrics.pendingVisits, icon: Users, change: "Requires action" },
    { name: "Completed Visits", value: metrics.completedVisits, icon: CheckCircle, change: "This month" },
    { name: "Sales Target", value: `${Math.round((metrics.target?.achievedVisits || 0) / (metrics.target?.targetVisits || 1) * 100)}%`, icon: TrendingUp, change: `${metrics.target?.achievedVisits || 0} / ${metrics.target?.targetVisits || 0} visits` },
  ];

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "Pending": return "text-yellow-500 bg-yellow-500/10";
      case "Confirmed": return "text-blue-500 bg-blue-500/10";
      case "Completed": return "text-green-500 bg-green-500/10";
      case "Cancelled": return "text-red-500 bg-red-500/10";
      case "Rescheduled": return "text-purple-500 bg-purple-500/10";
      default: return "text-white/50 bg-white/5";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-white mb-2">CRM Dashboard</h1>
          <p className="text-white/50">Manage site visits, view sales targets, and track performance.</p>
        </div>
        <Link 
          href={getBrandPath("/admin/calendar")}
          className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-black rounded-sm font-medium transition-colors flex items-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          View Calendar
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white/5 border border-white/10 p-6 rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold-500" />
                </div>
                <span className="text-xs text-white/50">{stat.change}</span>
              </div>
              <p className="text-white/50 text-sm mb-1">{stat.name}</p>
              <p className="text-3xl font-light text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Visits List */}
      <div className="bg-white/5 border border-white/10 rounded-md">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-light">Recent Site Visits</h2>
        </div>
        
        {allVisits.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No site visits</h3>
            <p className="text-white/50">No site visits have been booked yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-sm text-white/50 uppercase tracking-wider">
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Lead</th>
                  <th className="p-4 font-medium">Property</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {allVisits.map((visit) => {
                  const lead = leadMap.get(visit.leadId);
                  const propertyTitle = propertyMap.get(visit.propertyId) || "Unknown Property";
                  
                  return (
                    <tr key={visit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-white">{visit.date}</div>
                        <div className="text-white/50">{visit.time}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">{lead?.name || "Unknown"}</div>
                        <div className="text-white/50">{lead?.phone || "-"}</div>
                      </td>
                      <td className="p-4 text-white/70">{propertyTitle}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(visit.status)}`}>
                          {visit.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <Link href={getBrandPath(`/admin/crm/visits/${visit.id}`)} className="text-gold-500 hover:text-gold-400">
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
