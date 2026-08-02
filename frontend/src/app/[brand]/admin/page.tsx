import { container } from "@/backend/di/container";
import { Users, PhoneCall, Mail } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const leadService = container.leadService;
  const leads = await leadService.getAllLeads();

  const newLeads = leads.filter(l => l.status === "New").length;
  const contactedLeads = leads.filter(l => l.status === "Contacted").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-light tracking-wide">Dashboard</h1>
        <p className="text-white/60 mt-1">Overview of your real estate advisory platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium">Total Leads</h3>
            <Users className="w-5 h-5 text-gold-500" />
          </div>
          <p className="text-4xl font-light">{leads.length}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium">New Leads</h3>
            <Mail className="w-5 h-5 text-gold-500" />
          </div>
          <p className="text-4xl font-light">{newLeads}</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/60 font-medium">Contacted</h3>
            <PhoneCall className="w-5 h-5 text-gold-500" />
          </div>
          <p className="text-4xl font-light">{contactedLeads}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-light mb-6">Recent Activity</h2>
        {leads.length === 0 ? (
          <p className="text-white/40 italic">No leads found.</p>
        ) : (
          <div className="space-y-4">
            {leads.slice(0, 5).map(lead => (
              <div key={lead.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-white/50">{lead.email}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    lead.status === "New" ? "bg-gold-500/20 text-gold-400" :
                    lead.status === "Qualified" ? "bg-green-500/20 text-green-400" :
                    "bg-white/10 text-white/70"
                  }`}>
                    {lead.status}
                  </span>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
