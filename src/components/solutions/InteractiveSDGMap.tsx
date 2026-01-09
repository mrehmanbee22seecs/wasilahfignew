import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InteractiveSDGMapProps {
  onSDGClick: (sdgId: number | null) => void;
  selectedSDG: number | null;
}

const SDG_DATA = [
  { id: 1, name: 'No Poverty', color: 'bg-red-500', services: ['CSR Strategy & Planning', 'End-to-End Project Execution'] },
  { id: 2, name: 'Zero Hunger', color: 'bg-yellow-500', services: ['End-to-End Project Execution'] },
  { id: 3, name: 'Good Health', color: 'bg-green-500', services: ['End-to-End Project Execution'] },
  { id: 4, name: 'Quality Education', color: 'bg-red-600', services: ['CSR Strategy & Planning', 'End-to-End Project Execution'] },
  { id: 5, name: 'Gender Equality', color: 'bg-orange-500', services: ['CSR Strategy & Planning', 'NGO Vetting & Verification'] },
  { id: 6, name: 'Clean Water', color: 'bg-cyan-500', services: ['End-to-End Project Execution'] },
  { id: 7, name: 'Clean Energy', color: 'bg-yellow-400', services: ['CSR Strategy & Planning'] },
  { id: 8, name: 'Decent Work', color: 'bg-red-700', services: ['CSR Strategy & Planning', 'Corporate Experiences'] },
  { id: 9, name: 'Industry & Innovation', color: 'bg-orange-600', services: ['CSR Strategy & Planning'] },
  { id: 10, name: 'Reduced Inequalities', color: 'bg-pink-500', services: ['NGO Vetting & Verification'] },
  { id: 11, name: 'Sustainable Cities', color: 'bg-orange-400', services: ['End-to-End Project Execution'] },
  { id: 12, name: 'Responsible Consumption', color: 'bg-yellow-600', services: ['CSR Strategy & Planning'] },
  { id: 13, name: 'Climate Action', color: 'bg-green-600', services: ['End-to-End Project Execution'] },
  { id: 14, name: 'Life Below Water', color: 'bg-blue-500', services: ['End-to-End Project Execution'] },
  { id: 15, name: 'Life on Land', color: 'bg-green-700', services: ['End-to-End Project Execution'] },
  { id: 16, name: 'Peace & Justice', color: 'bg-blue-600', services: ['NGO Vetting & Verification'] },
  { id: 17, name: 'Partnerships', color: 'bg-blue-700', services: ['NGO Vetting & Verification', 'Corporate Experiences'] }
];

export function InteractiveSDGMap({ onSDGClick, selectedSDG }: InteractiveSDGMapProps) {
  const [hoveredSDG, setHoveredSDG] = useState<number | null>(null);

  const handleSDGClick = (sdgId: number) => {
    if (selectedSDG === sdgId) {
      onSDGClick(null); // Deselect if clicking same SDG
    } else {
      onSDGClick(sdgId);
    }
  };

  const displaySDG = hoveredSDG || selectedSDG;

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Info className="w-6 h-6 text-teal-600" />
            <h2 className="text-slate-900">Interactive SDG Map</h2>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Click on a Sustainable Development Goal to see which services map to it
          </p>
        </div>

        {/* SDG Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-3 mb-8">
          {SDG_DATA.map((sdg) => {
            const isSelected = selectedSDG === sdg.id;
            const isHovered = hoveredSDG === sdg.id;
            
            return (
              <button
                key={sdg.id}
                onClick={() => handleSDGClick(sdg.id)}
                onMouseEnter={() => setHoveredSDG(sdg.id)}
                onMouseLeave={() => setHoveredSDG(null)}
                data-analytics="sdg_click"
                data-sdg-id={sdg.id}
                className={`aspect-square rounded-lg ${sdg.color} text-white flex items-center justify-center text-lg transition-all shadow-sm relative group
                  ${isSelected 
                    ? 'ring-4 ring-teal-600 ring-offset-2 scale-110 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md'
                  }
                `}
                title={sdg.name}
                aria-label={`SDG ${sdg.id}: ${sdg.name}`}
              >
                {sdg.id}
                
                {/* Tooltip on hover */}
                {isHovered && !isSelected && (
                  <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded whitespace-nowrap shadow-lg">
                    {sdg.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info Panel */}
        {displaySDG && (
          <div className="bg-white rounded-xl border-2 border-teal-600 p-8 shadow-lg animate-in slide-in-from-bottom-2 duration-200">
            {(() => {
              const sdg = SDG_DATA.find(s => s.id === displaySDG);
              return sdg ? (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 ${sdg.color} rounded-xl text-white flex items-center justify-center text-2xl shadow-lg`}>
                      {sdg.id}
                    </div>
                    <div>
                      <h3 className="text-slate-900">SDG {sdg.id}: {sdg.name}</h3>
                      <p className="text-slate-600">Mapped to {sdg.services.length} service{sdg.services.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h4 className="text-slate-900 mb-3">Related Services:</h4>
                    <ul className="space-y-2">
                      {sdg.services.map((service, index) => (
                        <li key={index} className="flex items-center gap-2 text-slate-700">
                          <div className="w-2 h-2 bg-teal-600 rounded-full" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-slate-600 text-sm mt-4 italic">
                    Click the SDG again to clear the filter
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </section>
  );
}
