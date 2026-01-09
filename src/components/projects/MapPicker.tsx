import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';

interface MapPickerProps {
  city: string;
  address: string;
  onLocationChange: (lat: number, lng: number, formattedAddress: string) => void;
}

const PAKISTANI_CITIES = [
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Rawalpindi', lat: 33.5651, lng: 73.0169 },
  { name: 'Faisalabad', lat: 31.4504, lng: 73.1350 },
  { name: 'Multan', lat: 30.1575, lng: 71.5249 },
  { name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
  { name: 'Quetta', lat: 30.1798, lng: 66.9750 },
  { name: 'Sialkot', lat: 32.4945, lng: 74.5229 },
  { name: 'Gujranwala', lat: 32.1877, lng: 74.1945 },
];

export function MapPicker({ city, address, onLocationChange }: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cityData = PAKISTANI_CITIES.find(c => c.name.toLowerCase() === city.toLowerCase()) || PAKISTANI_CITIES[0];

  const handleSelectLocation = (lat: number, lng: number, name: string) => {
    setSelectedLocation({ lat, lng });
    onLocationChange(lat, lng, name);
  };

  const filteredCities = PAKISTANI_CITIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <div className="relative w-full h-64 bg-slate-100 rounded-xl border-2 border-slate-200 overflow-hidden">
        {/* Static map-like grid background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50" />
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Center marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <MapPin className="w-10 h-10 text-teal-600 drop-shadow-lg" fill="currentColor" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="px-3 py-1 bg-white rounded-full border-2 border-teal-600 text-xs text-teal-700 font-medium shadow-lg">
                {city || 'Select City'}
              </div>
            </div>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 flex items-center justify-center text-slate-700 font-semibold">
            +
          </button>
          <button className="w-8 h-8 bg-white border-2 border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 flex items-center justify-center text-slate-700 font-semibold">
            −
          </button>
        </div>

        {/* Coordinates display */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 text-xs text-slate-600">
          📍 {cityData.lat.toFixed(4)}°N, {cityData.lng.toFixed(4)}°E
        </div>
      </div>

      {/* City Quick Select */}
      <div>
        <label className="block text-sm text-slate-700 mb-2">Quick Select City</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities..."
            className="w-full pl-9 pr-4 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
          {filteredCities.map(c => (
            <button
              key={c.name}
              onClick={() => handleSelectLocation(c.lat, c.lng, c.name)}
              className={`px-3 py-2 text-left text-sm rounded-lg border-2 transition-colors ${
                city.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-teal-50 border-teal-600 text-teal-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <MapPin className="w-3 h-3 inline mr-1" />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        💡 In production, this would integrate with Google Maps or Mapbox for interactive map selection
      </p>
    </div>
  );
}
