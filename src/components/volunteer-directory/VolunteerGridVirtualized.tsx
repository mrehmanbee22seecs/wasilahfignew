import React, { useState, useEffect, useRef } from 'react';
import { VolunteerCard } from './VolunteerCard';
import { Users } from 'lucide-react';
import { VirtualGrid } from '../virtual/VirtualGrid';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [columnCount, setColumnCount] = useState(3);

  // Update container width and column count on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        
        // Match the responsive breakpoints from the original grid
        // md:grid-cols-2 xl:grid-cols-3
        if (width >= 1280) {
          setColumnCount(3);
        } else if (width >= 768) {
          setColumnCount(2);
        } else {
          setColumnCount(1);
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (volunteers.length === 0) {
    return (
      <div className="col-span-full text-center py-16 bg-slate-50 rounded-xl border-2 border-slate-200">
        <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-slate-900 mb-2">No volunteers found</h3>
        <p className="text-slate-600">Try adjusting your filters or search query</p>
      </div>
    );
  }

  // Calculate column width based on container width and gaps
  const gap = 24; // 1.5rem = 24px
  const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

  return (
    <div ref={containerRef} className="w-full">
      <VirtualGrid
        items={volunteers}
        height={800}
        width={containerWidth}
        columnCount={columnCount}
        rowHeight={420}
        columnWidth={columnWidth}
        renderItem={(volunteer, index, style) => (
          <div style={{ ...style, padding: '12px' }}>
            <VolunteerCard
              key={volunteer.id}
              volunteer={volunteer}
              onClick={() => onVolunteerClick(volunteer.id)}
            />
          </div>
        )}
        overscanRowCount={2}
      />
    </div>
  );
}
