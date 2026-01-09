import React, { useState } from 'react';
import { Image, FileText, ChevronDown, ChevronUp, HelpCircle, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import type { RecentUpload } from '../../types/ngo';

interface RightColumnProps {
  recent_uploads: RecentUpload[];
}

export function RightColumn({ recent_uploads }: RightColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Collapse Toggle (Tablet/Desktop) */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between p-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <span className="text-sm text-slate-700 font-medium">
            {isCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
          </span>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Recent Uploads Gallery */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-indigo-600" />
              <h3 className="text-slate-900">Recent Uploads</h3>
            </div>

            {recent_uploads.length > 0 ? (
              <div className="space-y-3">
                {recent_uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="group relative overflow-hidden rounded-lg border-2 border-slate-200 hover:border-indigo-300 transition-all cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-full aspect-video bg-slate-100">
                      {upload.thumbnail_url ? (
                        <img
                          src={upload.thumbnail_url}
                          alt={upload.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-xs font-medium truncate">
                          {upload.filename}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-600 truncate flex-1">
                          {upload.filename.length > 20
                            ? `${upload.filename.substring(0, 20)}...`
                            : upload.filename}
                        </p>
                        <span className="text-xs text-slate-500 ml-2">
                          {formatTimeAgo(upload.uploaded_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-600">No recent uploads</p>
              </div>
            )}
          </div>

          {/* Quick Help Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-200 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-slate-900 mb-1">How Verification Works</h3>
                <p className="text-xs text-slate-600">
                  Get your organization verified in 4 simple steps
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 mb-1">1. Complete Profile</p>
                  <p className="text-xs text-slate-600">
                    Fill in all organization details and contact information
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 mb-1">2. Upload Documents</p>
                  <p className="text-xs text-slate-600">
                    Submit required legal, financial, and safeguarding documents
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 mb-1">3. Request Verification</p>
                  <p className="text-xs text-slate-600">
                    Submit your request and wait for Wasilah team review (2-5 days)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-900 mb-1">4. Site Visit</p>
                  <p className="text-xs text-slate-600">
                    Our team conducts an on-site verification of your facilities
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t-2 border-indigo-200">
              <a
                href="#"
                className="block text-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
              >
                View Full Guide
              </a>
            </div>
          </div>

          {/* Support Contact Card */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
            <h4 className="text-sm text-slate-900 mb-3">Need Help?</h4>
            <p className="text-xs text-slate-600 mb-4">
              Our support team is here to help you with the verification process
            </p>
            <div className="space-y-2">
              <a
                href="mailto:support@wasilah.org"
                className="block px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors text-xs text-center"
              >
                Email Support
              </a>
              <a
                href="#"
                className="block px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-lg transition-colors text-xs text-center"
              >
                Live Chat
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
