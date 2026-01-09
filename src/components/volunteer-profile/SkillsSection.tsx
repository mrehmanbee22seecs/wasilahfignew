import React from 'react';
import { Award } from 'lucide-react';

interface SkillsSectionProps {
  skills: Array<{
    name: string;
    level: 'basic' | 'intermediate' | 'advanced';
  }>;
  topStrengths?: Array<{
    name: string;
    percentage: number;
  }>;
}

export function SkillsSection({ skills, topStrengths }: SkillsSectionProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'basic':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'intermediate':
        return 'bg-violet-100 text-violet-700 border-violet-300';
      case 'advanced':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getLevelLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-slate-900">Skills & Competencies</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Skills Tags */}
          <div className="lg:col-span-2">
            <h3 className="text-slate-900 mb-4">All Skills</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getLevelColor(skill.level)} transition-all hover:shadow-md`}
                >
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-75">• {getLevelLabel(skill.level)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Strengths */}
          {topStrengths && topStrengths.length > 0 && (
            <div className="lg:col-span-1">
              <h3 className="text-slate-900 mb-4">Top Strengths</h3>
              <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
                <div className="space-y-4">
                  {topStrengths.map((strength, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-700 text-sm">{strength.name}</span>
                        <span className="text-slate-600 text-xs">{strength.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-violet-600 h-2 rounded-full transition-all"
                          style={{ width: `${strength.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
