import { container } from "@/backend/di/container";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLeadsPage() {
  const leadService = container.leadService;
  const leads = await leadService.getAllLeads();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light tracking-wide">Leads</h1>
          <p className="text-white/60 mt-1">Manage investment inquiries.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/80">
            <thead className="bg-white/5 text-white/50 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Property Interest</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-white/60 italic mb-4">No contact enquiries available.</p>
                    <Link href="/admin/leads" className="inline-block bg-gold-500 hover:bg-gold-600 text-black px-6 py-2 rounded-md font-medium transition-colors">
                      Refresh
                    </Link>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{lead.email}</div>
                      <div className="text-white/50 text-xs mt-1">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      {lead.purpose ? lead.purpose : <span className="text-white/30">General Inquiry</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.budget ? `$${lead.budget}` : <span className="text-white/30">-</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        lead.status === "New" ? "bg-gold-500/20 text-gold-400" :
                        lead.status === "Qualified" ? "bg-green-500/20 text-green-400" :
                        "bg-white/10 text-white/70"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white/50">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
