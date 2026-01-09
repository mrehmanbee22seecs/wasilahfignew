import React from 'react';
import { Award, Eye, Download } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: 'certificate' | 'badge' | 'training';
  sdgs?: number[];
}

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'certificate':
        return 'from-blue-500 to-blue-600';
      case 'badge':
        return 'from-emerald-500 to-emerald-600';
      case 'training':
        return 'from-violet-500 to-violet-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'certificate':
        return 'from-blue-50 to-blue-100';
      case 'badge':
        return 'from-emerald-50 to-emerald-100';
      case 'training':
        return 'from-violet-50 to-violet-100';
      default:
        return 'from-slate-50 to-slate-100';
    }
  };

  const sdgColors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-red-600',
    'bg-orange-500', 'bg-cyan-500', 'bg-yellow-400', 'bg-red-700',
    'bg-orange-600', 'bg-pink-500', 'bg-orange-400', 'bg-yellow-600',
    'bg-green-600', 'bg-blue-500', 'bg-green-700', 'bg-blue-600',
    'bg-blue-700'
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-slate-900 mb-8">Certifications & Badges</h2>

        {certifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-slate-200">
            <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-slate-900 mb-2">No Certifications Yet</h3>
            <p className="text-slate-600">Certifications and training badges will appear here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className={`bg-gradient-to-br ${getTypeBgColor(cert.type)} rounded-xl p-6 border-2 border-slate-200 hover:shadow-xl transition-all`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${getTypeColor(cert.type)} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                  <Award className="w-8 h-8" />
                </div>

                {/* Title & Issuer */}
                <h3 className="text-slate-900 mb-2">{cert.title}</h3>
                <p className="text-slate-600 text-sm mb-1">{cert.issuer}</p>
                <p className="text-slate-500 text-xs mb-4">{cert.date}</p>

                {/* SDGs if applicable */}
                {cert.sdgs && cert.sdgs.length > 0 && (
                  <div className="flex items-center gap-1 mb-4 flex-wrap">
                    {cert.sdgs.map((sdg) => (
                      <div
                        key={sdg}
                        className={`w-6 h-6 ${sdgColors[sdg - 1]} rounded text-white text-xs flex items-center justify-center shadow-sm`}
                        title={`SDG ${sdg}`}
                      >
                        {sdg}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-slate-700 rounded-lg border border-slate-300 hover:border-blue-600 hover:text-blue-600 transition-all text-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
