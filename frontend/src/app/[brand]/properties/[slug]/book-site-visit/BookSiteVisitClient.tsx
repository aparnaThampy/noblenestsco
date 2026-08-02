"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { submitSiteVisitBooking } from "./actions";

interface Slot {
  date: string;
  time: string;
}

export function BookSiteVisitClient({ 
  propertyId, 
  propertyTitle,
  availableSlots,
  brandPath
}: { 
  propertyId: string;
  propertyTitle: string;
  availableSlots: Slot[];
  brandPath: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [visitors, setVisitors] = useState<number>(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const availableDates = Array.from(new Set(availableSlots.map(s => s.date)));
  const availableTimes = selectedDate 
    ? availableSlots.filter(s => s.date === selectedDate).map(s => s.time)
    : [];

  const handleNext = () => {
    if (step === 1) {
      if (!selectedDate || !selectedTime) {
        setError("Please select a date and time");
        return;
      }
      setError("");
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitSiteVisitBooking({
        propertyId,
        date: selectedDate,
        time: selectedTime,
        numberOfVisitors: visitors,
        notes: formData.notes,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        }
      });

      if (result.success) {
        setStep(3);
      } else {
        setError(result.error || "Failed to submit booking");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  if (step === 3) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-white mb-4">Request Submitted</h2>
        <p className="text-white/70 mb-8 max-w-md mx-auto">
          Thank you, {formData.name}. Your site visit request for {propertyTitle} on {selectedDate} at {selectedTime} has been received. Our luxury advisor will contact you shortly to confirm the appointment.
        </p>
        <Button 
          onClick={() => router.push(`${brandPath}/properties`)}
          variant="outline"
          className="h-12 px-8 border-gold-500 text-gold-500 hover:bg-gold-500/10"
        >
          Return to Properties
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-center mb-10">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${step === 1 ? 'bg-gold-500 text-black' : 'bg-gold-500/20 text-gold-500 border border-gold-500/50'}`}>1</div>
        <div className={`w-20 h-px ${step > 1 ? 'bg-gold-500' : 'bg-white/10'}`}></div>
        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${step === 2 ? 'bg-gold-500 text-black' : step > 2 ? 'bg-gold-500/20 text-gold-500 border border-gold-500/50' : 'bg-white/5 border border-white/10 text-white/50'}`}>2</div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 text-red-500 rounded-md text-sm">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-2xl font-light text-white border-b border-white/10 pb-4">When would you like to visit?</h2>
          
          <div className="space-y-4">
            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-500" /> Select Date
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {availableDates.map(date => {
                const d = new Date(date);
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = d.getDate();
                const month = d.toLocaleDateString('en-US', { month: 'short' });
                
                return (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedTime(""); }}
                    className={`p-3 border rounded-md text-center transition-all ${
                      selectedDate === date 
                        ? 'bg-gold-500/10 border-gold-500 text-white' 
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wider">{dayName}</div>
                    <div className="text-xl font-medium my-1">{dayNum}</div>
                    <div className="text-xs">{month}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="space-y-4 animate-in fade-in">
              <label className="text-sm font-medium text-white/70 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-500" /> Select Time
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 border rounded-md text-center text-sm font-medium transition-all ${
                      selectedTime === time 
                        ? 'bg-gold-500/10 border-gold-500 text-white' 
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-500" /> Number of Visitors
            </label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setVisitors(Math.max(1, visitors - 1))}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >-</button>
              <span className="text-xl font-medium text-white w-8 text-center">{visitors}</span>
              <button 
                onClick={() => setVisitors(Math.min(10, visitors + 1))}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >+</button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <Button 
              onClick={handleNext} 
              disabled={!selectedDate || !selectedTime}
              className="h-12 px-8 bg-gold-500 hover:bg-gold-600 text-black flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4">
          <h2 className="text-2xl font-light text-white border-b border-white/10 pb-4">Your Details</h2>
          
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Full Name *</label>
              <Input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your full name" 
                className="h-12 bg-white/5 border-white/10 focus-visible:ring-gold-500 text-white" 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Email Address *</label>
                <Input 
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com" 
                  className="h-12 bg-white/5 border-white/10 focus-visible:ring-gold-500 text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/70">Phone Number *</label>
                <Input 
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+91 98765 43210" 
                  className="h-12 bg-white/5 border-white/10 focus-visible:ring-gold-500 text-white" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Any specific requirements or notes?</label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={4}
                placeholder="Optional notes for our team..." 
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 resize-none" 
              />
            </div>
          </div>

          <div className="p-4 bg-white/5 border border-white/10 rounded-md space-y-2">
            <p className="text-sm text-white/70"><span className="font-medium text-white">Summary:</span> Site Visit to {propertyTitle}</p>
            <p className="text-sm text-white/50">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime} for {visitors} {visitors === 1 ? 'person' : 'people'}</p>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-between items-center">
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="text-white/50 hover:text-white font-medium text-sm transition-colors"
            >
              Back to scheduling
            </button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-12 px-8 bg-gold-500 hover:bg-gold-600 text-black flex items-center gap-2 font-medium"
            >
              {isSubmitting ? "Submitting..." : "Confirm Request"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
