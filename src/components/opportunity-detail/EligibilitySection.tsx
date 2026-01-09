import React from 'react';
import { Users, Award, Languages, AlertCircle } from 'lucide-react';

interface EligibilitySectionProps {
  eligibility: {
    skills: string[];
    academicBackground?: string;
    languages: string[];
    commitmentExpectations: string[];
    prerequisites?: string[];
  };
}

export function EligibilitySection({ eligibility }: EligibilitySectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-slate-900">Who Can Apply</h2>
        </div>

        <p className="text-slate-600 mb-8 max-w-3xl">
          We're looking for dedicated individuals who are passionate about making a difference. 
          Review the requirements below to see if this opportunity is right for you.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Skills Required */}
            <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-teal-600" />
                <h3 className="text-slate-900">Skills Required</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {eligibility.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Academic Background */}
            {eligibility.academicBackground && (
              <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="text-slate-900">Academic Background</h3>
                </div>
                <p className="text-slate-700">{eligibility.academicBackground}</p>
              </div>
            )}

            {/* Language Requirements */}
            <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Languages className="w-5 h-5 text-violet-600" />
                <h3 className="text-slate-900">Languages</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {eligibility.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Commitment Expectations */}
            <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-slate-900">Commitment Expectations</h3>
              </div>
              <ul className="space-y-2">
                {eligibility.commitmentExpectations.map((expectation, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>{expectation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            {eligibility.prerequisites && eligibility.prerequisites.length > 0 && (
              <div className="bg-slate-50 rounded-xl border-2 border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-slate-600" />
                  <h3 className="text-slate-900">Prerequisites</h3>
                </div>
                <ul className="space-y-2">
                  {eligibility.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-700">
                      <span className="text-slate-400 mt-1">•</span>
                      <span>{prerequisite}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
