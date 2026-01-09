import React from 'react';
import { VolunteerCard } from './VolunteerCard';
import { Users } from 'lucide-react';

interface Volunteer {
  id: string;
  name: string;
  role: string;
  location: string;
  university: string;
  verified: boolean;
  sdgs: number[];
  totalHours: number;
  rating?: number;
  topSkills: string[];
  availability: string;
  profileImage?: string;
}

interface VolunteerGridProps {
  volunteers: Volunteer[];
  onVolunteerClick: (volunteerId: string) => void;
}

export function VolunteerGrid({ volunteers, onVolunteerClick }: VolunteerGridProps) {
  if (volunteers.length === 0) {
    return (
      <div className="col-span-full text-center py-16 bg-slate-50 rounded-xl border-2 border-slate-200">
        <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-slate-900 mb-2">No volunteers found</h3>
        <p className="text-slate-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <>
      {volunteers.map((volunteer) => (
        <VolunteerCard
          key={volunteer.id}
          volunteer={volunteer}
          onClick={() => onVolunteerClick(volunteer.id)}
        />
      ))}
    </>
  );
}
