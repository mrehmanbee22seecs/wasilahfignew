import React from 'react';
import { Download, Award, Calendar, Clock } from 'lucide-react';

export type CertificateCardProps = {
  id: string;
  projectName: string;
  hours: number;
  issuedDate: string; // ISO date string
  downloadUrl: string;
  language?: 'en' | 'ur';
  organizationName?: string;
  className?: string;
};

export function CertificateCard({
  id,
  projectName,
  hours,
  issuedDate,
  downloadUrl,
  language = 'en',
  organizationName,
  className = '',
}: CertificateCardProps) {
  const handleDownload = () => {
    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `certificate-${id}.pdf`;
    link.click();
  };

  const formattedDate = new Date(issuedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-lg p-6
        hover:border-emerald-500 transition-colors
        ${language === 'ur' ? 'text-right' : ''}
        ${className}
      `}
      role="article"
      aria-label={`Certificate for ${projectName}, ${hours} hours, issued ${formattedDate}`}
    >
      {/* Icon & Title */}
      <div className={`flex items-start gap-4 mb-4 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
          <Award className="w-6 h-6 text-emerald-600" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg text-gray-900 truncate">{projectName}</h3>
          {organizationName && (
            <p className="text-sm text-gray-600 truncate">{organizationName}</p>
          )}
        </div>
      </div>

      {/* Meta Information */}
      <div className={`flex flex-wrap gap-4 mb-4 text-sm text-gray-600 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
          <Clock className="w-4 h-4" aria-hidden="true" />
          <span>
            {hours} {language === 'ur' ? 'گھنٹے' : 'hours'}
          </span>
        </div>
        <div className={`flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Language Badge (if Urdu) */}
      {language === 'ur' && (
        <div className="mb-4">
          <span className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
            اردو
          </span>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2
          bg-emerald-600 text-white rounded-lg
          hover:bg-emerald-700 transition-colors
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          ${language === 'ur' ? 'flex-row-reverse' : ''}
        `}
        aria-label={`Download certificate for ${projectName}`}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>{language === 'ur' ? 'ڈاؤن لوڈ کریں' : 'Download Certificate'}</span>
      </button>
    </div>
  );
}
