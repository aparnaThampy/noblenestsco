"use client";

import { useState } from "react";
import { BookingStatus } from "@/backend/core/domain/types";

interface MappedVisit {
  id: string;
  propertyId: string;
  leadId: string;
  date: string;
  time: string;
  numberOfVisitors: number;
  status: BookingStatus;
  notes?: string;
  propertyTitle: string;
  leadName: string;
  leadPhone: string;
}

export function CalendarClient({ initialVisits, brandPath }: { initialVisits: MappedVisit[], brandPath: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Simple calendar logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const getVisitsForDay = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return initialVisits.filter(v => v.date === dStr);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "Pending": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "Confirmed": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      case "Completed": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "Cancelled": return "bg-red-500/20 text-red-500 border-red-500/30";
      case "Rescheduled": return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      default: return "bg-white/10 text-white/50 border-white/20";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-white">{monthName} {year}</h2>
        <div className="flex space-x-2">
          <button onClick={prevMonth} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-white/70 transition-colors">Prev</button>
          <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-white/70 transition-colors">Today</button>
          <button onClick={nextMonth} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md text-white/70 transition-colors">Next</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-black p-3 text-center text-sm font-medium text-white/50">
            {day}
          </div>
        ))}

        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="bg-black/50 min-h-[120px] p-2"></div>
        ))}

        {days.map(day => {
          const dayVisits = getVisitsForDay(day);
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

          return (
            <div key={day} className={`bg-black min-h-[120px] p-2 border-t border-white/5 ${isToday ? 'bg-white/5' : ''}`}>
              <div className={`text-right text-sm mb-2 ${isToday ? 'text-gold-500 font-bold' : 'text-white/50'}`}>
                {day}
              </div>
              <div className="space-y-1">
                {dayVisits.map(visit => (
                  <a 
                    href={`${brandPath}/admin/crm/visits/${visit.id}`} 
                    key={visit.id}
                    className={`block p-1.5 text-xs rounded border ${getStatusColor(visit.status)} hover:opacity-80 transition-opacity truncate`}
                  >
                    <span className="font-medium">{visit.time}</span> {visit.leadName}
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
