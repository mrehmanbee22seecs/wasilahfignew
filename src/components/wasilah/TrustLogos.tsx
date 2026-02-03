import React from 'react';

// Brand colors matching the logo
const BRAND = {
  navy: '#1B2A4E',
  teal: '#2EC4B6',
  cream: '#F5EFE6',
};

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
    <section 
      className="py-16 border-y"
      style={{ 
        backgroundColor: 'white',
        borderColor: `${BRAND.navy}10`
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-gray-500 font-medium">Trusted by Pakistan's Leading Organizations</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {logos.map((logo, index) => (
            <div 
              key={index}
              className="flex items-center justify-center h-16 opacity-40 hover:opacity-100 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center">
                <div 
                  className="w-20 h-12 rounded-lg flex items-center justify-center mb-1 transition-colors duration-300"
                  style={{ 
                    backgroundColor: `${BRAND.navy}08`,
                  }}
                >
                  <span 
                    className="text-xs font-semibold transition-colors duration-300"
                    style={{ color: BRAND.navy }}
                  >
                    LOGO
                  </span>
                </div>
                <p 
                  className="text-xs transition-colors duration-300"
                  style={{ color: BRAND.navy }}
                >
                  {logo.split(' ')[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
