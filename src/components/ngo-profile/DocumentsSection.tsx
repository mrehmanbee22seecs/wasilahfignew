import React from 'react';
import { FileText, Download, CheckCircle, BarChart3, FileCheck } from 'lucide-react';

export function DocumentsSection() {
  const documents = [
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: 'Registration Certificate',
      description: 'SECP Registration - Verified 2023',
      type: 'PDF',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Annual Report 2023',
      description: 'Financial statements & impact summary',
      type: 'PDF',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Impact Metrics Report',
      description: 'Q4 2023 beneficiary data & outcomes',
      type: 'PDF',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'from-violet-50 to-violet-100'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Verification Documents',
      description: 'Wasilah verification package',
      type: 'PDF',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-50 to-teal-100'
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-slate-900 mb-2">
            Documents & Certificates
          </h2>
          <p className="text-slate-600">
            Official documentation and verification materials for transparency
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${doc.bgColor} rounded-xl p-6 border-2 border-slate-200 hover:shadow-lg transition-all`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 bg-gradient-to-br ${doc.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg`}>
                {doc.icon}
              </div>

              {/* Document Info */}
              <h3 className="text-slate-900 mb-2">
                {doc.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                {doc.description}
              </p>

              {/* Type Badge */}
              <div className="mb-4">
                <span className="px-2 py-1 bg-white border border-slate-300 text-slate-700 rounded text-xs">
                  {doc.type}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm">
                  View
                </button>
                <button className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Note */}
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-violet-50 border-2 border-blue-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-slate-900 mb-2">Verified by Wasilah</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                This NGO has completed our comprehensive verification process including legal documentation review, 
                background evaluation, and operational assessment. All documents have been verified by our compliance team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
