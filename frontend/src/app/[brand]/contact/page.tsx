"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react"

const BUDGET_OPTIONS = [
  { value: "", label: "Select Budget", disabled: true },
  { value: "2-5cr", label: "₹2 Cr – ₹5 Cr" },
  { value: "5-10cr", label: "₹5 Cr – ₹10 Cr" },
  { value: "10cr+", label: "₹10 Cr+" },
]

const CITY_OPTIONS = [
  { value: "", label: "Select City", disabled: true },
  { value: "Bangalore", label: "Bangalore" },
  { value: "Kochi", label: "Kochi" },
  { value: "Other", label: "Other" },
]

const PURPOSE_OPTIONS = [
  { value: "", label: "Select Purpose", disabled: true },
  { value: "investment", label: "Investment / High ROI" },
  { value: "end-use", label: "End Use / Self Living" },
  { value: "second-home", label: "Second Home / Vacation" },
]

export default function ContactPage() {
  const [form, setForm] = React.useState({
    name: "", phone: "", email: "", budget: "", city: "", purpose: ""
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.")
      }

      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectClass = "w-full flex h-12 border border-border bg-background/50 px-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-white cursor-pointer appearance-none"

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
                { icon: Phone, label: "Direct Line", value: "+91 98765 43210" },
                { icon: Mail, label: "Email Us", value: "invest@noblenests.co" },
                { icon: MapPin, label: "Corporate Office", value: "Level 15, UB Tower, UB City\nVittal Mallya Road, Bangalore" },
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
          <div className="bg-card border border-border p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            {submitted ? (
              <div className="min-h-[420px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-3">Request Received</h3>
                <p className="text-muted-foreground max-w-xs">
                  An elite investment advisor from Noble Nests Co will contact you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <h3 className="font-heading text-2xl font-bold text-white mb-8">Request a Consultation</h3>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Full Name *</label>
                  <Input required name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="bg-background/50 border-border h-12" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Phone Number *</label>
                  <Input required type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 90000 00000" className="bg-background/50 border-border h-12" />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Email (optional)</label>
                  <Input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="bg-background/50 border-border h-12" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Budget *</label>
                    <select required name="budget" value={form.budget} onChange={handleChange} className={selectClass}>
                      {BUDGET_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">City *</label>
                    <select required name="city" value={form.city} onChange={handleChange} className={selectClass}>
                      {CITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Investment Purpose *</label>
                  <select required name="purpose" value={form.purpose} onChange={handleChange} className={selectClass}>
                    {PURPOSE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full h-14 mt-4 text-base font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By submitting, you agree to our privacy policy. Your data is strictly confidential.
                </p>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
