import React from 'react';
import { TrendingUp, Building2, Calendar, Award } from 'lucide-react';

export function SidebarPanel() {
  const trendingCauses = [
    { name: 'Education Access', count: 24, color: 'bg-blue-600' },
    { name: 'Climate Action', count: 18, color: 'bg-green-600' },
    { name: 'Women Empowerment', count: 15, color: 'bg-violet-600' },
    { name: 'Healthcare', count: 12, color: 'bg-red-600' },
    { name: 'Poverty Alleviation', count: 10, color: 'bg-orange-600' }
  ];

  const recommendedNGOs = [
    { name: 'The Citizens Foundation', verified: true },
    { name: 'Akhuwat Foundation', verified: true },
    { name: 'Shaukat Khanum Hospital', verified: true },
    { name: 'LRBT', verified: true }
  ];

  const upcomingEvents = [
    { title: 'CSR Summit 2024', date: 'Dec 20, 2024' },
    { title: 'Volunteer Training Workshop', date: 'Jan 5, 2025' },
    { title: 'NGO Networking Mixer', date: 'Jan 12, 2025' }
  ];

  return (
    <div className="space-y-6">
      {/* Trending Causes */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <h3 className="text-slate-900">Trending Causes</h3>
        </div>

        <div className="space-y-3">
          {trendingCauses.map((cause, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 ${cause.color} rounded-full`} />
                <span className="text-slate-700 text-sm">{cause.name}</span>
              </div>
              <span className="text-slate-500 text-sm">{cause.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended NGOs */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-slate-900">Recommended NGOs</h3>
        </div>

        <div className="space-y-3">
          {recommendedNGOs.map((ngo, index) => (
            <div key={index} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-slate-600 text-xs">{ngo.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-slate-900 text-sm truncate">{ngo.name}</div>
                {ngo.verified && (
                  <div className="text-blue-600 text-xs">✓ Verified</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm">
          View All NGOs
        </button>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-violet-600" />
          </div>
          <h3 className="text-slate-900">Upcoming Events</h3>
        </div>

        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
              <div className="text-slate-900 text-sm mb-1">{event.title}</div>
              <div className="text-slate-600 text-xs">{event.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Corporate Programs */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl border-2 border-teal-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Award className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-slate-900">Corporate Programs</h3>
        </div>

        <p className="text-slate-600 text-sm mb-4">
          Exclusive opportunities sponsored by leading Pakistani corporates
        </p>

        <button className="w-full px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm">
          Explore Programs
        </button>
      </div>
    </div>
  );
}
