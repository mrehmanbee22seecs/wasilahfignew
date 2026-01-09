import React from 'react';
import { CheckCircle, Clipboard } from 'lucide-react';

interface ResponsibilitiesSectionProps {
  responsibilities: string[];
}

export function ResponsibilitiesSection({ responsibilities }: ResponsibilitiesSectionProps) {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clipboard className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-slate-900">Your Responsibilities</h2>
        </div>

        <div className="bg-white rounded-xl border-2 border-slate-200 p-8">
          <ul className="space-y-4">
            {responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-slate-700 leading-relaxed">{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
