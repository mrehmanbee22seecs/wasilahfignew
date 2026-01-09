import React from 'react';
import { Calendar, Clock, Briefcase, Heart } from 'lucide-react';

interface AvailabilitySectionProps {
  availability: {
    days: string[];
    hours: string;
    preferredRoles: string[];
    preferredCauses: string[];
  };
}

export function AvailabilitySection({ availability }: AvailabilitySectionProps) {
  const dayColors: Record<string, string> = {
    'Monday': 'bg-blue-100 text-blue-700',
    'Tuesday': 'bg-violet-100 text-violet-700',
    'Wednesday': 'bg-teal-100 text-teal-700',
    'Thursday': 'bg-emerald-100 text-emerald-700',
    'Friday': 'bg-blue-100 text-blue-700',
    'Saturday': 'bg-violet-100 text-violet-700',
    'Sunday': 'bg-teal-100 text-teal-700'
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8">Availability & Preferences</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Days Available */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-slate-900">Days Available</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availability.days.map((day) => (
                <span
                  key={day}
                  className={`px-4 py-2 rounded-lg ${dayColors[day] || 'bg-slate-100 text-slate-700'}`}
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Hours Available */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-slate-900">Hours Available</h3>
            </div>
            <p className="text-slate-700">{availability.hours}</p>
          </div>

          {/* Preferred Roles */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-slate-900">Preferred Roles</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availability.preferredRoles.map((role, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-teal-50 text-teal-700 rounded-lg border border-teal-200 text-sm"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Causes */}
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-slate-900">Preferred Causes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {availability.preferredCauses.map((cause, index) => (
                <span
                  key={index}
                  className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm"
                >
                  {cause}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
