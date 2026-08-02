import Link from "next/link"
import { getBrandPath } from "@/lib/config/brands"
import { container } from "@/backend/di/container"

export async function Footer() {
  const settingsService = container.settingsService;
  
  const [contactSettings, socialLinks] = await Promise.all([
    settingsService.getContactSettings(),
    settingsService.getSocialLinks({ isVisible: true })
  ]);

  const whatsappNumber = contactSettings?.whatsappNumber?.replace(/[^0-9]/g, "");
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : undefined;

  return (
    <footer className="bg-background border-t border-border/40 py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href={getBrandPath("/")} className="inline-block mb-6">
              <span className="font-heading text-xl font-bold uppercase tracking-widest text-primary">
                Noble Nests
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Curating luxury real estate investments for discerning HNI investors. 
              Verified projects, transparent advisory, exceptional returns.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold uppercase tracking-widest mb-6 text-foreground">Investments</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href={getBrandPath("/properties")} className="hover:text-primary transition-colors">Premium Villas</Link></li>
              <li><Link href={getBrandPath("/properties")} className="hover:text-primary transition-colors">Luxury Apartments</Link></li>
              <li><Link href={getBrandPath("/properties")} className="hover:text-primary transition-colors">Land Banks</Link></li>
              <li><Link href={getBrandPath("/properties")} className="hover:text-primary transition-colors">Commercial Spaces</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold uppercase tracking-widest mb-6 text-foreground">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href={getBrandPath("/about")} className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href={getBrandPath("/guide")} className="hover:text-primary transition-colors">Investment Guide</Link></li>
              <li><Link href={getBrandPath("/contact")} className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href={getBrandPath("/admin/properties")} className="hover:text-primary transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold uppercase tracking-widest mb-6 text-foreground">Connect</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {whatsappUrl && (
                <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp Advisor</a></li>
              )}
              {contactSettings?.email && (
                <li><a href={`mailto:${contactSettings.email}`} className="hover:text-primary transition-colors">{contactSettings.email}</a></li>
              )}
              {socialLinks.length > 0 && (
                <li className="pt-2 flex gap-4 flex-wrap">
                  {socialLinks.map((social) => (
                    <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title={social.platform}>
                      {social.platform}
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Noble Nests Co. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href={getBrandPath("/privacy")} className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href={getBrandPath("/terms")} className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
