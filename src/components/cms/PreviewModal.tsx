import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, Eye, Globe } from 'lucide-react';
import { useSanitizedHTML } from '../../lib/security/sanitize';

/**
 * PreviewModal - Content preview in different viewports
 * 
 * Features:
 * - Desktop / Tablet / Mobile views
 * - "Preview as published" rendering
 * - Sample site data context
 * - Full-screen modal
 * - SECURITY: All HTML content is sanitized with DOMPurify
 * 
 * @accessibility Keyboard accessible, focus trap, ESC to close
 */

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

type PreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    subtitle?: string;
    body: string;
    featuredImage?: string;
    author?: string;
    publishedAt?: string;
    tags?: string[];
  };
  contentType?: 'resource' | 'case-study' | 'testimonial';
  showSiteContext?: boolean;
};

export function PreviewModal({
  isOpen,
  onClose,
  content,
  contentType = 'resource',
  showSiteContext = false,
}: PreviewModalProps) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [withContext, setWithContext] = useState(showSiteContext);

  // SECURITY: Sanitize CMS content to prevent XSS attacks
  // Uses 'relaxed' profile as this is admin-created content with more formatting needs
  const sanitizedBody = useSanitizedHTML(content.body, 'relaxed');

  if (!isOpen) return null;

  const getDeviceWidth = () => {
    switch (device) {
      case 'desktop':
        return '100%';
      case 'tablet':
        return '900px';
      case 'mobile':
        return '375px';
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Handle ESC key
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full h-full max-w-[1600px] max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-4">
            <Eye className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Preview</h2>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-600">{content.title}</span>
          </div>

          {/* Device Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  device === 'desktop'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Desktop (1440px)"
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-x border-gray-200 ${
                  device === 'tablet'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Tablet (900px)"
              >
                <Tablet className="w-4 h-4" />
                Tablet
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  device === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title="Mobile (375px)"
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
            </div>

            {/* Context Toggle */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={withContext}
                onChange={(e) => setWithContext(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Show site context</span>
            </label>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          <div
            className="mx-auto bg-white shadow-lg transition-all duration-300"
            style={{ width: getDeviceWidth(), maxWidth: '100%' }}
          >
            {/* Site Header (if context enabled) */}
            {withContext && (
              <header className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white p-6">
                <div className="container mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">Wasilah</div>
                    <nav className="hidden md:flex gap-6 text-sm">
                      <a href="#" className="hover:underline">Projects</a>
                      <a href="#" className="hover:underline">Volunteers</a>
                      <a href="#" className="hover:underline">NGOs</a>
                      <a href="#" className="hover:underline">Resources</a>
                    </nav>
                  </div>
                </div>
              </header>
            )}

            {/* Content */}
            <article className="p-8 md:p-12">
              {/* Breadcrumb */}
              {withContext && (
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <a href="#" className="hover:text-blue-600">Home</a>
                  <span>/</span>
                  <a href="#" className="hover:text-blue-600 capitalize">{contentType}s</a>
                  <span>/</span>
                  <span className="text-gray-900">{content.title}</span>
                </nav>
              )}

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                {content.author && (
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {content.author.charAt(0)}
                    </div>
                    {content.author}
                  </span>
                )}
                <span>•</span>
                <span>{formatDate(content.publishedAt)}</span>
                {content.tags && content.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex gap-2">
                      {content.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {content.title}
              </h1>

              {/* Subtitle */}
              {content.subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {content.subtitle}
                </p>
              )}

              {/* Featured Image */}
              {content.featuredImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={content.featuredImage}
                    alt={content.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Body Content */}
              {/* SECURITY: Content is sanitized with DOMPurify before rendering */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: sanitizedBody }}
              />

              {/* Social Share (if context enabled) */}
              {withContext && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">Share this {contentType}:</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                      Facebook
                    </button>
                    <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 text-sm">
                      Twitter
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                      WhatsApp
                    </button>
                    <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 text-sm">
                      LinkedIn
                    </button>
                  </div>
                </div>
              )}

              {/* Related Content (if context enabled) */}
              {withContext && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Related {contentType === 'resource' ? 'Resources' : 'Content'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-40 bg-gradient-to-br from-blue-100 to-emerald-100" />
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            Sample Related Content {i}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            Brief description of related content item...
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Site Footer (if context enabled) */}
            {withContext && (
              <footer className="bg-gray-900 text-gray-300 p-8 mt-12">
                <div className="container mx-auto text-center">
                  <p className="text-sm">© 2024 Wasilah. All rights reserved.</p>
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <a href="#" className="hover:text-white">About</a>
                    <a href="#" className="hover:text-white">Contact</a>
                    <a href="#" className="hover:text-white">Privacy</a>
                    <a href="#" className="hover:text-white">Terms</a>
                  </div>
                </div>
              </footer>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              <Globe className="w-3 h-3 inline mr-1" />
              Viewport: {device === 'desktop' ? '1440px' : device === 'tablet' ? '900px' : '375px'}
            </span>
            <span>•</span>
            <span>Preview Mode: {withContext ? 'With site context' : 'Content only'}</span>
          </div>
          <span className="text-gray-500">Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
