import React from 'react';
import { Users, Search } from 'lucide-react';

interface DirectoryHeroProps {
  totalVolunteers: number;
  onSearchChange: (query: string) => void;
}

export function DirectoryHero({ totalVolunteers, onSearchChange }: DirectoryHeroProps) {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-violet-50 to-teal-50 border-b-2 border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
            <Users className="w-4 h-4" />
            {totalVolunteers}+ Verified Student Volunteers
          </div>
          
          <h1 className="text-slate-900 mb-4">
            Discover Student Volunteers
          </h1>
          
          <p className="text-slate-600 max-w-3xl mx-auto text-xl leading-relaxed">
            Connect with talented, verified student volunteers from Pakistan's top universities. 
            Filter by skills, experience, SDG alignment, and availability to find the perfect match for your CSR initiatives.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, skills, university, or cause area..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none text-slate-900 placeholder-slate-400"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
