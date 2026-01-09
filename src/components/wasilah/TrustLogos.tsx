import React from 'react';

export function TrustLogos() {
  const logos = [
    'Engro Corporation',
    'Fauji Foundation',
    'Lucky Cement',
    'Habib Bank Ltd',
    'Pakistan Petroleum',
    'K-Electric',
    'Akhuwat Foundation',
    'The Citizens Foundation'
  ];

  return (
    <section className="bg-white py-16 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-slate-500">Trusted by Pakistan's Leading Organizations</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="flex items-center justify-center h-16 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300 cursor-pointer"
            >
              <div className="text-center">
                <div className="w-20 h-12 bg-slate-200 rounded flex items-center justify-center mb-1">
                  <span className="text-slate-400 text-xs">LOGO</span>
                </div>
                <p className="text-slate-400 text-xs">{logo.split(' ')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
