import Link from "next/link";
import { LayoutDashboard, Users, Building, Settings, LogOut, Calendar } from "lucide-react";
import { getBrandPath } from "@/lib/config/brands";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "CRM / Site Visits", href: "/admin/crm", icon: Calendar },
    { name: "Leads", href: "/admin/leads", icon: Users },
    { name: "Properties", href: "/admin/properties", icon: Building },
    { name: "Testimonials", href: "/admin/testimonials", icon: Users },
    { name: "Homepage Sections", href: "/admin/homepage", icon: LayoutDashboard },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href={getBrandPath("/admin")} className="text-xl font-bold tracking-widest text-gold-500 uppercase">
            Noble Nests <span className="text-white/50 text-xs tracking-normal block mt-1">Admin Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-md text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Icon className="w-5 h-5 text-gold-500" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href={getBrandPath("/")} className="flex items-center gap-3 px-4 py-3 rounded-md text-white/50 hover:text-white transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Exit to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black">
          <span className="font-bold tracking-widest text-gold-500 uppercase">Noble Nests</span>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
