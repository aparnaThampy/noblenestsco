import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Noble Nests Co — Luxury Real Estate Investment Advisory",
  description: "Noble Nests Co is a boutique investment advisory firm. Learn about our philosophy, our team, and why we only work with a select set of verified, high-growth projects.",
}

const VALUES = [
  {
    title: "Radical Transparency",
    description: "We share the financials, risks, and legal details of every project before you invest. No hidden clauses, no sales pressure."
  },
  {
    title: "Curated, Not Aggregated",
    description: "We list fewer than 50 projects at any time. Every property must pass our 14-point internal due diligence process before it appears on our platform."
  },
  {
    title: "Conflict-Free Advisory",
    description: "We do not take developer commissions that create perverse incentives. Our fee is a transparent advisory fee — ensuring our interests are aligned with yours."
  },
  {
    title: "Long-Term Relationships",
    description: "Our best clients have been with us for 7+ years, across multiple investments. We treat this as a relationship, not a transaction."
  },
]

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-28 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">Our Story</p>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
                We Are Not a Real Estate Portal.
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Noble Nests Co was born out of frustration. Our founders, having personally lost money on developer-recommended properties that turned out to be legal quagmires, decided to build the firm they wished they had access to: one that functions entirely in the investor&apos;s interest.
              </p>
            </div>
            <div className="bg-card border border-border p-10 relative">
              <div className="absolute top-0 left-0 w-12 h-0.5 bg-primary" />
              <p className="font-heading text-6xl font-bold text-primary mb-2">2019</p>
              <p className="text-muted-foreground text-sm uppercase tracking-widest mb-6">Founded in Bangalore</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-heading text-3xl font-bold text-white">₹480 Cr+</p>
                  <p className="text-muted-foreground text-xs mt-1">Assets Under Advisory</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-white">310+</p>
                  <p className="text-muted-foreground text-xs mt-1">HNI Investors</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-white">13.2%</p>
                  <p className="text-muted-foreground text-xs mt-1">Average Annual ROI</p>
                </div>
                <div>
                  <p className="font-heading text-3xl font-bold text-white">0</p>
                  <p className="text-muted-foreground text-xs mt-1">Legal Disputes Filed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Our Core Principles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VALUES.map((v, idx) => (
              <div key={v.title} className="border border-border p-8 relative group hover:border-primary/40 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-8 h-0.5 bg-primary/30 group-hover:bg-primary group-hover:w-16 transition-all duration-500" />
                <p className="text-primary/30 font-heading text-4xl font-bold mb-4">0{idx + 1}</p>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 md:py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">How We Work</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">The Noble Nests Process</h2>
          </div>

          <div className="relative">
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
            <div className="space-y-12">
              {["Intake & Goal Setting", "Market Analysis & Asset Shortlisting", "14-Point Due Diligence", "Financial Modelling & Structuring", "Negotiation & Closing", "Post-Purchase Portfolio Monitoring"].map((step, i) => (
                <div key={step} className={`flex items-start gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} pl-14 md:pl-0`}>
                    <p className="text-primary text-xs uppercase tracking-widest mb-1">Step {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="font-heading text-lg font-bold text-white">{step}</h3>
                  </div>
                  <div className="absolute left-5 md:relative md:left-auto shrink-0 w-10 h-10 bg-card border-2 border-primary rounded-full flex items-center justify-center z-10">
                    <span className="text-primary font-bold text-sm">{i + 1}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
