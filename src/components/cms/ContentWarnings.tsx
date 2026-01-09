import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

/**
 * ContentWarnings - Non-blocking warnings for content quality
 * 
 * Features:
 * - Missing alt text warnings
 * - Missing summary warnings
 * - Content length warnings
 * - Dismissible warnings
 * - Does NOT block publishing
 * 
 * Different from validation errors (which block publishing)
 */

export type ContentWarning = {
  id: string;
  type: 'alt-text' | 'summary' | 'length' | 'seo' | 'accessibility';
  message: string;
  field?: string;
  severity: 'warning' | 'info';
};

type ContentWarningsProps = {
  warnings: ContentWarning[];
  onDismiss?: (warningId: string) => void;
  className?: string;
};

export function ContentWarnings({ warnings, onDismiss, className = '' }: ContentWarningsProps) {
  if (warnings.length === 0) return null;

  const groupedWarnings = {
    warning: warnings.filter(w => w.severity === 'warning'),
    info: warnings.filter(w => w.severity === 'info'),
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Warnings */}
      {groupedWarnings.warning.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-amber-900 mb-2">
                Content Quality Warnings ({groupedWarnings.warning.length})
              </h4>
              <p className="text-xs text-amber-700 mb-3">
                These won't prevent publishing, but fixing them will improve content quality.
              </p>
              <ul className="space-y-2">
                {groupedWarnings.warning.map((warning) => (
                  <li key={warning.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-amber-900">{warning.message}</p>
                      {warning.field && (
                        <p className="text-xs text-amber-600 mt-0.5">
                          Field: {warning.field}
                        </p>
                      )}
                    </div>
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(warning.id)}
                        className="p-1 text-amber-600 hover:text-amber-800 rounded hover:bg-amber-100"
                        title="Dismiss warning"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Info messages */}
      {groupedWarnings.info.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Suggestions ({groupedWarnings.info.length})
              </h4>
              <ul className="space-y-2">
                {groupedWarnings.info.map((warning) => (
                  <li key={warning.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-blue-900">{warning.message}</p>
                      {warning.field && (
                        <p className="text-xs text-blue-600 mt-0.5">
                          Field: {warning.field}
                        </p>
                      )}
                    </div>
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(warning.id)}
                        className="p-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-100"
                        title="Dismiss suggestion"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Utility function to generate content warnings
 */
export function generateContentWarnings(content: {
  title?: string;
  subtitle?: string;
  body?: string;
  featuredImage?: { alt?: string };
  metaDescription?: string;
  tags?: string[];
}): ContentWarning[] {
  const warnings: ContentWarning[] = [];

  // Check for missing alt text
  if (content.featuredImage && !content.featuredImage.alt) {
    warnings.push({
      id: 'missing-alt',
      type: 'alt-text',
      message: 'Featured image is missing alt text for accessibility',
      field: 'Featured Image',
      severity: 'warning',
    });
  }

  // Check for missing meta description
  if (!content.metaDescription || content.metaDescription.trim() === '') {
    warnings.push({
      id: 'missing-meta',
      type: 'summary',
      message: 'Meta description is empty - this helps with SEO',
      field: 'Meta Description',
      severity: 'info',
    });
  }

  // Check meta description length
  if (content.metaDescription && content.metaDescription.length > 160) {
    warnings.push({
      id: 'meta-too-long',
      type: 'seo',
      message: `Meta description is too long (${content.metaDescription.length} chars). Recommended: 120-160 chars`,
      field: 'Meta Description',
      severity: 'warning',
    });
  }

  if (content.metaDescription && content.metaDescription.length < 70) {
    warnings.push({
      id: 'meta-too-short',
      type: 'seo',
      message: `Meta description is too short (${content.metaDescription.length} chars). Recommended: 120-160 chars`,
      field: 'Meta Description',
      severity: 'info',
    });
  }

  // Check body content length
  const bodyText = content.body?.replace(/<[^>]*>/g, '') || '';
  const wordCount = bodyText.split(/\s+/).filter(w => w.length > 0).length;

  if (wordCount < 300) {
    warnings.push({
      id: 'content-short',
      type: 'length',
      message: `Content is short (${wordCount} words). Consider adding more detail for better SEO.`,
      field: 'Body Content',
      severity: 'info',
    });
  }

  if (wordCount > 3000) {
    warnings.push({
      id: 'content-long',
      type: 'length',
      message: `Content is very long (${wordCount} words). Consider breaking into multiple articles.`,
      field: 'Body Content',
      severity: 'info',
    });
  }

  // Check for missing tags
  if (!content.tags || content.tags.length === 0) {
    warnings.push({
      id: 'missing-tags',
      type: 'seo',
      message: 'No tags added - tags help with content organization and discovery',
      field: 'Tags',
      severity: 'info',
    });
  }

  // Check title length
  if (content.title && content.title.length > 70) {
    warnings.push({
      id: 'title-long',
      type: 'seo',
      message: `Title is too long (${content.title.length} chars). Recommended: 50-60 chars for SEO`,
      field: 'Title',
      severity: 'warning',
    });
  }

  return warnings;
}
