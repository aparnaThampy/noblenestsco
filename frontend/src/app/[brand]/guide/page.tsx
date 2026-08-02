import { Metadata } from "next"
import Link from "next/link"
export const metadata: Metadata = {
  title: "Investment Guide — Noble Nests Co",
  description: "Learn how to evaluate luxury real estate investments in India. Our guide covers ROI analysis, legal due diligence, builder grading, and portfolio strategy.",
}

const GUIDE_STEPS = [
  {
    step: "01",
    title: "Define Your Investment Mandate",
    description: "Before looking at any property, get clear on your objectives: Are you seeking annual rental yield, capital appreciation over 5–7 years, or a balanced combination? Your mandate determines which asset class (villa, commercial floor, or high-rise) best suits you.",
    tips: ["Set a clear target ROI (e.g., 12% p.a. minimum)", "Decide your holding period (short-term vs. long-term)", "Assess your liquidity needs — real estate is illiquid"]
  },
  {
    step: "02",
    title: "Understand the Macro Context",
    description: "Great real estate investment isn't about the flat — it's about the geography and the tailwinds behind it. Infrastructure investments, corporate expansions, and demographic shifts are the real drivers of long-term appreciation.",
    tips: ["Study infrastructure pipelines (metro, airports, SEZs)", "Track hiring trends in IT corridors", "Follow FSI (Floor Space Index) policy changes"]
  },
  {
    step: "03",
    title: "Conduct Legal & Title Due Diligence",
    description: "This is where most retail investors fail. A title is only as clean as its chain of ownership. We recommend a minimum of 30-year title search through a Tier-1 law firm, RERA verification, and encumbrance certificate checks.",
    tips: ["Verify RERA registration at rera.karnataka.gov.in", "Obtain Encumbrance Certificate (EC) for at least 15 years", "Check for pending litigation via CERSAI and court records"]
  },
  {
    step: "04",
    title: "Evaluate Builder Grade",
    description: "In luxury real estate, the builder's track record is more important than the brochure. At Noble Nests Co, we only work with Grade A+ developers — those with a documented history of zero delivery defaults, RERA compliance, and institutional-grade construction quality.",
    tips: ["Review past project delivery timelines", "Check for any RERA complaints filed", "Evaluate construction quality through independent inspection"]
  },
  {
    step: "05",
    title: "Model Your Financial Returns",
    description: "Run a detailed discounted cash flow (DCF) model. Factor in stamp duty, registration, annual maintenance costs, property tax, and the cost of carry before arriving at a net ROI figure.",
    tips: ["Don't ignore transaction costs (7–10% of purchase price)", "Model rental yield conservatively at 60–70% occupancy", "Account for property management fees (8–12% of rental income)"]
  },
  {
    step: "06",
    title: "Structure & Close",
    description: "Structuring matters — especially for high-net-worth individuals and NRIs. Decide on individual vs. company ownership, FEMA compliance for NRI buyers, and succession planning implications before you sign the agreement.",
    tips: ["NRIs must comply with FEMA regulations for property acquisition", "Consider HUF or LLP structure for tax optimisation", "Engage a CA for stamp duty optimisation strategies"]
  },
]

export default function InvestmentGuidePage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <p className="text-primary font-semibold uppercase tracking-[0.3em] text-sm mb-4">Noble Nests Co</p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            The Serious Investor&apos;s Guide to Luxury Real Estate
          </h1>
          <p className="text-muted-foreground text-xl leading-relaxed">
            Real estate is India&apos;s most preferred wealth-building asset class. But navigating it without structured knowledge is expensive. This guide distills what we&apos;ve learned from advising over 300+ high-net-worth investors.
          </p>
        </div>
      </section>

      {/* Guide Steps */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="space-y-16">
            {GUIDE_STEPS.map((step) => (
              <div key={step.step} className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-12">
                {/* Step Number */}
                <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                  <span className="font-heading text-4xl md:text-5xl font-bold text-primary/30 leading-none">{step.step}</span>
                  <div className="hidden md:block w-px h-full bg-border mt-4 ml-[19px]" />
                </div>

                {/* Content */}
                <div className="pb-8 border-b border-border">
                  <h2 className="font-heading text-2xl font-bold text-white mb-4">{step.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>

                  <div className="bg-card border border-border p-6">
                    <p className="text-xs text-primary uppercase tracking-widest mb-4">Key Actions</p>
                    <ul className="space-y-3">
                      {step.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="text-primary mt-0.5 shrink-0">→</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-card border-t border-border text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="font-heading text-3xl font-bold text-white mb-4">Ready to put this into practice?</h2>
          <p className="text-muted-foreground mb-8">Our advisors will help you apply every step of this framework to your specific investment goals.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-black px-10 py-4 font-semibold hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm">
            Speak to an Advisor
          </Link>
        </div>
      </section>
    </div>
  )
}
