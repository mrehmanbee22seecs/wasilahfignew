import React, { useState } from 'react';
import {
  Save,
  Eye,
  Send,
  Calendar,
  Clock,
  User,
  Tag,
  Globe,
  FileText,
  History,
  Share2,
  Trash2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * PublishPanel Component
 * 
 * Side panel for content editor with:
 * - Publish status controls
 * - Schedule publishing
 * - Audit notes
 * - Version history
 * - SEO meta fields
 * - Social preview
 * - Author selection
 * 
 * @accessibility Full keyboard navigation, proper labels
 */

export type ContentStatus = 'draft' | 'published' | 'scheduled';

export type PublishPanelProps = {
  status: ContentStatus;
  scheduledAt?: string | null;
  author?: string;
  lastSaved?: string;
  versionCount?: number;
  onSaveDraft: () => void;
  onPublish: (auditNote: string) => void;
  onSchedule: (datetime: string, auditNote: string) => void;
  onUnpublish: () => void;
  onDelete: () => void;
  onViewVersions: () => void;
  onPreview: () => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  className?: string;
};

export function PublishPanel({
  status,
  scheduledAt,
  author = 'Current User',
  lastSaved,
  versionCount = 0,
  onSaveDraft,
  onPublish,
  onSchedule,
  onUnpublish,
  onDelete,
  onViewVersions,
  onPreview,
  isSaving = false,
  hasUnsavedChanges = false,
  className = '',
}: PublishPanelProps) {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [auditNote, setAuditNote] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(author);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);

  const handlePublish = () => {
    if (!auditNote.trim()) {
      toast.error('Audit note is required');
      return;
    }
    onPublish(auditNote);
    setShowPublishModal(false);
    setAuditNote('');
  };

  const handleSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error('Please select date and time');
      return;
    }
    if (!auditNote.trim()) {
      toast.error('Audit note is required');
      return;
    }
    
    const datetime = `${scheduleDate}T${scheduleTime}`;
    onSchedule(datetime, auditNote);
    setShowScheduleModal(false);
    setAuditNote('');
    setScheduleDate('');
    setScheduleTime('');
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
            <FileText className="w-3 h-3" />
            Draft
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            <CheckCircle className="w-3 h-3" />
            Published
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            <Clock className="w-3 h-3" />
            Scheduled
          </span>
        );
    }
  };

  return (
    <div className={`bg-white border-l border-gray-200 ${className}`}>
      <div className="p-4 space-y-6">
        {/* Status Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-900">Status</label>
            {getStatusBadge()}
          </div>

          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              {isSaving ? (
                <>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                  Saving...
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  Unsaved changes
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  Last saved {lastSaved}
                </>
              )}
            </div>
          )}

          {/* Scheduled date */}
          {status === 'scheduled' && scheduledAt && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Scheduled for</p>
                  <p className="text-blue-700">
                    {new Date(scheduledAt).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Asia/Karachi',
                    })}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Timezone: PKT (Asia/Karachi)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={onSaveDraft}
            disabled={isSaving || !hasUnsavedChanges}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>

          <button
            onClick={onPreview}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          {status === 'draft' || status === 'scheduled' ? (
            <>
              <button
                onClick={() => setShowPublishModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Send className="w-4 h-4" />
                Publish Now
              </button>
              
              <button
                onClick={() => setShowScheduleModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
            </>
          ) : (
            <button
              onClick={onUnpublish}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Unpublish
            </button>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4" />

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Author
          </label>
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Current User</option>
            <option>Sarah Ahmed</option>
            <option>Ali Khan</option>
            <option>Fatima Malik</option>
          </select>
        </div>

        {/* Version History */}
        <div>
          <button
            onClick={onViewVersions}
            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <History className="w-4 h-4" />
              Version History
            </div>
            <span className="text-xs text-gray-500">{versionCount} versions</span>
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4" />

        {/* SEO Section */}
        <div>
          <button
            onClick={() => setShowSeoFields(!showSeoFields)}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium text-gray-900">SEO & Social</span>
            <Globe className="w-4 h-4 text-gray-400" />
          </button>

          {showSeoFields && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  SEO Title {seoTitle.length}/60
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  maxLength={60}
                  placeholder="Optimized title for search engines"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Meta Description {metaDescription.length}/160
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder="Brief description for search results"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-600 mb-1">Canonical URL</label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://wasilah.pk/..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-gray-700">Allow search engines to index</span>
              </label>

              {/* Social Preview */}
              <div className="mt-4 p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <Share2 className="w-3 h-3" />
                  Social Media Preview
                </div>
                <div className="bg-gray-50 rounded p-3 space-y-2">
                  <div className="w-full h-32 bg-gray-200 rounded" />
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {seoTitle || 'Article Title'}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {metaDescription || 'Description will appear here...'}
                  </p>
                  <p className="text-xs text-gray-500">wasilah.pk</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4" />

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Content</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audit Note <span className="text-red-600">*</span>
              </label>
              <textarea
                value={auditNote}
                onChange={(e) => setAuditNote(e.target.value)}
                rows={3}
                placeholder="Describe what changes were made..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                This note will be saved in the version history for audit purposes.
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-900">
                  Publishing will make this content immediately visible to all users.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPublishModal(false);
                  setAuditNote('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={!auditNote.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Publishing</h3>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time <span className="text-red-600">*</span>
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Timezone: PKT (Asia/Karachi)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audit Note <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={auditNote}
                  onChange={(e) => setAuditNote(e.target.value)}
                  rows={3}
                  placeholder="Describe what changes were made..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setAuditNote('');
                  setScheduleDate('');
                  setScheduleTime('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!scheduleDate || !scheduleTime || !auditNote.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
