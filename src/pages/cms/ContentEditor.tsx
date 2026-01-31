import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Eye, Languages, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { WysiwygEditor } from '../../components/cms/WysiwygEditor';
import { PublishPanel, ContentStatus } from '../../components/cms/PublishPanel';
import { MediaUploader, MediaFile } from '../../components/cms/MediaUploader';
import { PreviewModal } from '../../components/cms/PreviewModal';
import { VersionHistoryModal, mockVersions } from '../../components/cms/VersionHistoryModal';
import { toast } from 'sonner';

/**
 * ContentEditor - Unified editor for all content types
 * 
 * Two-column layout (desktop), stacked (mobile)
 * Left: Editor form
 * Right: Publish panel
 * 
 * Supports: Testimonials, Case Studies, Resources
 */

type ContentData = {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  body: string;
  language: 'en' | 'ur';
  status: ContentStatus;
  scheduledAt?: string;
  tags: string[];
  featuredImage?: MediaFile;
  // Type-specific fields
  quote?: string;
  personName?: string;
  personRole?: string;
  company?: string;
  caseType?: string;
  location?: string;
  sdgs?: string[];
  readingTime?: number;
};

type ContentEditorProps = {
  contentType?: string;
  id?: string;
  onNavigate?: (section: any) => void;
};

export default function ContentEditor({ contentType = 'resources', id, onNavigate }: ContentEditorProps) {
  const isNew = id === 'new' || !id;

  const [content, setContent] = useState<ContentData>({
    title: '',
    subtitle: '',
    slug: '',
    body: '',
    language: 'en',
    status: 'draft',
    tags: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showMobilePublish, setShowMobilePublish] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadContent();
    }
  }, [id]);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasUnsavedChanges) {
        handleAutoSave();
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [content, hasUnsavedChanges]);

  // Auto-generate slug from title
  useEffect(() => {
    if (isNew && content.title && !content.slug) {
      const slug = content.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setContent({ ...content, slug });
    }
  }, [content.title]);

  const loadContent = () => {
    // Mock load
    const mockContent: ContentData = {
      id,
      title: 'How to Create Impactful CSR Programs',
      subtitle: 'A comprehensive guide for Pakistani corporates',
      slug: 'how-to-create-impactful-csr-programs',
      body: '<h2>Introduction</h2><p>Corporate Social Responsibility (CSR) is essential...</p>',
      language: 'en',
      status: 'draft',
      tags: ['CSR', 'Guide', 'Best Practices'],
      sdgs: ['SDG1', 'SDG4'],
    };
    setContent(mockContent);
  };

  const handleAutoSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      toast.success('Auto-saved', { duration: 1000 });
    }, 500);
  };

  const handleSaveDraft = () => {
    setContent({ ...content, status: 'draft' });
    toast.success('Draft saved');
    setHasUnsavedChanges(false);
  };

  const handlePublish = (auditNote: string) => {
    const errors = validateContent();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix validation errors before publishing');
      return;
    }

    setContent({ ...content, status: 'published' });
    toast.success('Content published successfully');
    // In real app, would send auditNote to backend
  };

  const handleSchedule = (datetime: string, auditNote: string) => {
    setContent({ ...content, status: 'scheduled', scheduledAt: datetime });
    toast.success(`Scheduled for ${new Date(datetime).toLocaleString()}`);
  };

  const handleUnpublish = () => {
    setContent({ ...content, status: 'draft' });
    toast.success('Content unpublished');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this content?')) {
      toast.success('Content deleted');
      if (onNavigate) {
        onNavigate(`/admin/cms/${contentType}`);
      }
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleRestore = (versionId: string) => {
    toast.success('Version restored successfully');
    setShowVersionHistory(false);
    // In real app, would reload content from restored version
  };

  const validateContent = (): string[] => {
    const errors: string[] = [];
    
    if (!content.title.trim()) errors.push('Title is required');
    if (!content.subtitle.trim()) errors.push('Summary is required');
    if (!content.body.trim()) errors.push('Body content is required');
    if (!content.featuredImage) errors.push('Featured image is recommended');
    if (content.subtitle.length > 160) errors.push('Summary should be under 160 characters');
    
    return errors;
  };

  const handleMediaUpload = (files: MediaFile[]) => {
    if (files.length > 0) {
      setContent({ ...content, featuredImage: files[0] });
      setShowMediaUploader(false);
      toast.success('Image uploaded');
    }
  };

  const handleImageInsert = () => {
    setShowMediaUploader(true);
  };

  const getTypeLabel = () => {
    const labels: Record<string, string> = {
      testimonials: 'Testimonial',
      'case-studies': 'Case Study',
      resources: 'Resource',
    };
    return labels[contentType] || 'Content';
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (onNavigate) {
                  onNavigate(`/admin/cms/${contentType}`);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {isNew ? `New ${getTypeLabel()}` : 'Edit Content'}
              </h1>
              <p className="text-sm text-gray-500">
                {content.status === 'draft' && 'Draft'}
                {content.status === 'published' && 'Published'}
                {content.status === 'scheduled' && `Scheduled for ${content.scheduledAt}`}
              </p>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowMobilePublish(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">
                Please fix the following issues:
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setValidationErrors([])}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Editor Column */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Language Toggle */}
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-gray-400" />
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setContent({ ...content, language: 'en' })}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      content.language === 'en'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setContent({ ...content, language: 'ur' })}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      content.language === 'ur'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    اردو
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => {
                    setContent({ ...content, title: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Enter title..."
                  className="w-full px-4 py-3 text-xl font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{content.title.length} characters</p>
              </div>

              {/* Subtitle/Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Summary <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={content.subtitle}
                  onChange={(e) => {
                    setContent({ ...content, subtitle: e.target.value });
                    setHasUnsavedChanges(true);
                  }}
                  maxLength={160}
                  rows={2}
                  placeholder="Brief description (max 160 characters)..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.subtitle.length}/160 characters
                </p>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">URL Slug</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">wasilah.pk/</span>
                  <input
                    type="text"
                    value={content.slug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                      setContent({ ...content, slug });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="url-slug"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Featured Image
                </label>
                {content.featuredImage ? (
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden group">
                    <img
                      src={content.featuredImage.preview}
                      alt={content.featuredImage.alt || 'Featured'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setShowMediaUploader(true)}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => setContent({ ...content, featuredImage: undefined })}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowMediaUploader(true)}
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-600"
                  >
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">Click to upload featured image</span>
                  </button>
                )}
              </div>

              {/* Body Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Content <span className="text-red-600">*</span>
                </label>
                <WysiwygEditor
                  value={content.body}
                  onChange={(value) => {
                    setContent({ ...content, body: value });
                    setHasUnsavedChanges(true);
                  }}
                  onImageInsert={handleImageInsert}
                  minHeight="400px"
                  showWordCount
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Add tags (comma-separated)..."
                  value={content.tags.join(', ')}
                  onChange={(e) => {
                    const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
                    setContent({ ...content, tags });
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SDG Selection (for case studies) */}
              {contentType === 'case-studies' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    UN SDG Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['SDG1', 'SDG2', 'SDG3', 'SDG4', 'SDG5', 'SDG6'].map((sdg) => (
                      <label key={sdg} className="flex items-center gap-2 p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={content.sdgs?.includes(sdg)}
                          onChange={(e) => {
                            const sdgs = content.sdgs || [];
                            if (e.target.checked) {
                              setContent({ ...content, sdgs: [...sdgs, sdg] });
                            } else {
                              setContent({ ...content, sdgs: sdgs.filter((s) => s !== sdg) });
                            }
                            setHasUnsavedChanges(true);
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{sdg}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonial-specific fields */}
              {contentType === 'testimonials' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Person Name
                    </label>
                    <input
                      type="text"
                      value={content.personName || ''}
                      onChange={(e) => {
                        setContent({ ...content, personName: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Role & Company
                    </label>
                    <input
                      type="text"
                      value={content.personRole || ''}
                      onChange={(e) => {
                        setContent({ ...content, personRole: e.target.value });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g., CEO, Engro Corporation"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Publish Panel (Desktop) */}
          <div className="hidden lg:block w-96 flex-shrink-0">
            <PublishPanel
              status={content.status}
              scheduledAt={content.scheduledAt}
              lastSaved={lastSaved}
              versionCount={mockVersions.length}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onSchedule={handleSchedule}
              onUnpublish={handleUnpublish}
              onDelete={handleDelete}
              onViewVersions={() => setShowVersionHistory(true)}
              onPreview={handlePreview}
              isSaving={isSaving}
              hasUnsavedChanges={hasUnsavedChanges}
              className="h-full overflow-y-auto"
            />
          </div>
        </div>
      </div>

      {/* Media Uploader Modal */}
      {showMediaUploader && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Upload Image</h2>
              <button
                onClick={() => setShowMediaUploader(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <MediaUploader
              onUploadComplete={handleMediaUpload}
              maxFiles={1}
              maxSizeMB={5}
              recommendedSize="1600×900"
              aspectRatio="16:9"
            />
          </div>
        </div>
      )}

      {/* Mobile Publish Panel */}
      {showMobilePublish && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <PublishPanel
              status={content.status}
              scheduledAt={content.scheduledAt}
              lastSaved={lastSaved}
              versionCount={3}
              onSaveDraft={handleSaveDraft}
              onPublish={handlePublish}
              onSchedule={handleSchedule}
              onUnpublish={handleUnpublish}
              onDelete={handleDelete}
              onViewVersions={() => setShowVersionHistory(true)}
              onPreview={handlePreview}
              isSaving={isSaving}
              hasUnsavedChanges={hasUnsavedChanges}
            />
            <button
              onClick={() => setShowMobilePublish(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        content={{
          title: content.title,
          subtitle: content.subtitle,
          body: content.body,
          featuredImage: content.featuredImage?.preview,
          author: 'Current User',
          publishedAt: content.status === 'published' ? new Date().toISOString() : undefined,
          tags: content.tags,
        }}
        contentType={contentType === 'case-studies' ? 'case-study' : contentType === 'testimonials' ? 'testimonial' : 'resource'}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        onRestore={handleRestore}
        versions={mockVersions}
        contentTitle={content.title || 'Untitled'}
      />
    </div>
  );
}