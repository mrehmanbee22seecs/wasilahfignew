import React, { useState } from 'react';

interface SDGSelectorProps {
  label: string;
  selected: number[];
  onChange: (selected: number[]) => void;
  hint?: string;
}

const SDG_DATA = [
  { id: 1, name: 'No Poverty', color: 'bg-red-500' },
  { id: 2, name: 'Zero Hunger', color: 'bg-yellow-500' },
  { id: 3, name: 'Good Health', color: 'bg-green-500' },
  { id: 4, name: 'Quality Education', color: 'bg-red-600' },
  { id: 5, name: 'Gender Equality', color: 'bg-orange-500' },
  { id: 6, name: 'Clean Water', color: 'bg-cyan-500' },
  { id: 7, name: 'Clean Energy', color: 'bg-yellow-400' },
  { id: 8, name: 'Decent Work', color: 'bg-red-700' },
  { id: 9, name: 'Industry & Innovation', color: 'bg-orange-600' },
  { id: 10, name: 'Reduced Inequalities', color: 'bg-pink-500' },
  { id: 11, name: 'Sustainable Cities', color: 'bg-orange-400' },
  { id: 12, name: 'Responsible Consumption', color: 'bg-yellow-600' },
  { id: 13, name: 'Climate Action', color: 'bg-green-600' },
  { id: 14, name: 'Life Below Water', color: 'bg-blue-500' },
  { id: 15, name: 'Life on Land', color: 'bg-green-700' },
  { id: 16, name: 'Peace & Justice', color: 'bg-blue-600' },
  { id: 17, name: 'Partnerships', color: 'bg-blue-700' }
];

export function SDGSelector({ label, selected, onChange, hint }: SDGSelectorProps) {
  const [hoveredSDG, setHoveredSDG] = useState<number | null>(null);

  const toggleSDG = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-slate-700 mb-2">{label}</label>
      {hint && (
        <p className="text-slate-600 text-sm mb-3">{hint}</p>
      )}
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
        {SDG_DATA.map((sdg) => {
          const isSelected = selected.includes(sdg.id);
          
          return (
            <div key={sdg.id} className="relative">
              <button
                type="button"
                onClick={() => toggleSDG(sdg.id)}
                onMouseEnter={() => setHoveredSDG(sdg.id)}
                onMouseLeave={() => setHoveredSDG(null)}
                className={`w-full aspect-square rounded-lg ${sdg.color} text-white flex items-center justify-center text-sm transition-all shadow-sm
                  ${isSelected 
                    ? 'ring-4 ring-teal-600 ring-offset-2 scale-110' 
                    : 'hover:scale-105 hover:shadow-md'
                  }
                `}
                title={sdg.name}
              >
                {sdg.id}
              </button>
              {hoveredSDG === sdg.id && (
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap">
                  {sdg.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selected.length > 0 && (
        <p className="text-slate-500 text-sm mt-3">
          {selected.length} SDG{selected.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
