import React from 'react';
import type { TrustLogo } from '../../types/impact';

interface LogoGridProps {
  logos: TrustLogo[];
  title?: string;
  subtitle?: string;
}

export function LogoGrid({ logos, title, subtitle }: LogoGridProps) {
  return (
    <div>
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className="text-slate-900 text-3xl md:text-4xl mb-3">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {logos.map((logo) => (
          <div
            key={logo.id}
            className="bg-white rounded-xl border-2 border-slate-200 p-6 flex items-center justify-center hover:border-teal-300 hover:shadow-lg transition-all group"
          >
            <img
              src={logo.logo}
              alt={logo.name}
              className="w-full h-12 object-contain grayscale group-hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
