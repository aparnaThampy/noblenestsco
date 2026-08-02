import { MapPin, Phone, Mail } from "lucide-react"
import { ContactForm } from "./contact-form"
import { container } from "@/backend/di/container"

export default async function ContactPage() {
  const contactSettings = await container.settingsService.getContactSettings()

  return (
    <div className="bg-background min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Contact Info */}
          <div>
            <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">Get In Touch</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Let&apos;s Build Your <span className="text-primary">Wealth Portfolio.</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-md">
              Speak with a dedicated investment advisor to explore verified luxury assets tailored to your financial goals.
            </p>

            <div className="space-y-6">
              {[
                { icon: Phone, label: "Direct Line", value: contactSettings?.phoneNumber || "Phone number unavailable" },
                { icon: Mail, label: "Email Us", value: contactSettings?.email || "Email unavailable" },
                { icon: MapPin, label: "Corporate Office", value: contactSettings?.officeAddress || "Address unavailable" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="p-4 bg-card border border-border shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1 uppercase tracking-widest text-xs">{label}</h4>
                    <p className="text-muted-foreground whitespace-pre-line text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <ContactForm />

        </div>
      </div>
    </div>
  )
}
