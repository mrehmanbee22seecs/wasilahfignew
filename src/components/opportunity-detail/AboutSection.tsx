import React from 'react';
import { FileText } from 'lucide-react';

interface AboutSectionProps {
  description: string;
}

export function AboutSection({ description }: AboutSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-slate-900">About This Opportunity</h2>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 text-lg leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
