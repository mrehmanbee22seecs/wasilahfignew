import React from 'react';
import { FileText } from 'lucide-react';

interface AboutOrganizationSectionProps {
  about: {
    whyExists: string;
    whoServes: string;
    howOperates: string;
  };
}

export function AboutOrganizationSection({ about }: AboutOrganizationSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-teal-600" />
          </div>
          <h2 className="text-slate-900">About the Organization</h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-slate-900 mb-2">Why We Exist</h3>
            <p className="text-slate-700 leading-relaxed">
              {about.whyExists}
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 mb-2">Who We Serve</h3>
            <p className="text-slate-700 leading-relaxed">
              {about.whoServes}
            </p>
          </div>

          <div>
            <h3 className="text-slate-900 mb-2">How We Operate</h3>
            <p className="text-slate-700 leading-relaxed">
              {about.howOperates}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
