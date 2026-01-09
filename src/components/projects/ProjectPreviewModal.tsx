import React from 'react';
import { X, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { SDG_LIST } from '../../types/projects';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    description: string;
    selectedSDGs: string[];
    city: string;
    country: string;
    address: string;
    startDate: string;
    endDate: string;
    volunteerTarget: string;
    budget: string;
    budgetBreakdown: Array<{ category: string; amount: number; notes: string }>;
    imageFiles: Array<{ url?: string; name: string; isCover?: boolean }>;
  };
}

export function ProjectPreviewModal({ isOpen, onClose, data }: ProjectPreviewModalProps) {
  if (!isOpen) return null;

  const coverImage = data.imageFiles.find(f => f.isCover)?.url || data.imageFiles[0]?.url;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-[60] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b-2 border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-slate-900">Project Preview</h2>
              <p className="text-sm text-slate-600">Read-only preview of your project</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Cover Image */}
            {coverImage && (
              <div className="w-full h-64 rounded-xl overflow-hidden border-2 border-slate-200">
                <img src={coverImage} alt="Project cover" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Title & Description */}
            <div>
              <h1 className="text-slate-900 mb-3">{data.title}</h1>
              <p className="text-slate-700 leading-relaxed">{data.description}</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">Location</span>
                </div>
                <p className="text-slate-900 font-medium">{data.city}</p>
                <p className="text-xs text-slate-600">{data.country}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Duration</span>
                </div>
                <p className="text-slate-900 font-medium text-sm">
                  {data.startDate && new Date(data.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
                <p className="text-xs text-slate-600">
                  to {data.endDate && new Date(data.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              <div className="p-4 bg-teal-50 rounded-xl">
                <div className="flex items-center gap-2 text-teal-600 mb-2">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Volunteers</span>
                </div>
                <p className="text-teal-900 font-medium text-xl">{data.volunteerTarget || 0}</p>
                <p className="text-xs text-teal-600">needed</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-xs">Budget</span>
                </div>
                <p className="text-blue-900 font-medium">
                  PKR {data.budget ? parseFloat(data.budget).toLocaleString('en-PK') : 0}
                </p>
              </div>
            </div>

            {/* SDGs */}
            {data.selectedSDGs.length > 0 && (
              <div>
                <h3 className="text-slate-900 mb-3">UN Sustainable Development Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {data.selectedSDGs.map(id => {
                    const sdg = SDG_LIST.find(s => s.id === id);
                    return (
                      <div
                        key={id}
                        className="px-4 py-2 bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-lg"
                      >
                        <p className="text-sm text-slate-900 font-medium">{sdg?.id}. {sdg?.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Budget Breakdown */}
            {data.budgetBreakdown.filter(b => b.category && b.amount > 0).length > 0 && (
              <div>
                <h3 className="text-slate-900 mb-3">Budget Breakdown</h3>
                <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Category</th>
                        <th className="px-4 py-3 text-right text-xs text-slate-600 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs text-slate-600 uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-200">
                      {data.budgetBreakdown.filter(b => b.category && b.amount > 0).map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-slate-900">{item.category}</td>
                          <td className="px-4 py-3 text-sm text-slate-900 text-right">
                            PKR {item.amount.toLocaleString('en-PK')}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{item.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {data.imageFiles.filter(f => f.url).length > 0 && (
              <div>
                <h3 className="text-slate-900 mb-3">Project Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.imageFiles.filter(f => f.url).map((file, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 group">
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      {file.isCover && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-teal-600 text-white text-xs rounded-full">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
