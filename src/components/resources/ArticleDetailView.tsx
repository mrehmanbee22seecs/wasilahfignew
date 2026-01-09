import React from 'react';
import { X, Clock, Calendar, Share2, Copy, Check } from 'lucide-react';
import { TagBadge } from './TagBadge';
import type { Article } from '../../types/resources';

interface ArticleDetailViewProps {
  article: Article;
  onClose: () => void;
  relatedArticles?: Article[];
}

export function ArticleDetailView({ article, onClose, relatedArticles = [] }: ArticleDetailViewProps) {
  const [copied, setCopied] = React.useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/resources/${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: 'linkedin' | 'twitter') => {
    const url = `${window.location.origin}/resources/${article.slug}`;
    const text = article.title;
    
    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  // Simple markdown to HTML converter (basic implementation)
  const renderMarkdown = (markdown: string) => {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    return html;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900 transition-colors text-sm flex items-center gap-2"
            >
              ← Back to Resources
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close article"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img 
                src={article.coverImage} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="px-6 md:px-12 py-8">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag) => (
                <TagBadge key={tag} label={tag} />
              ))}
              {article.sdgs.length > 0 && (
                <TagBadge 
                  label={`SDG ${article.sdgs.join(', ')}`} 
                  variant="sdg" 
                />
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl text-slate-900 mb-4">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <img 
                  src={article.author.avatar} 
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="text-sm font-medium text-slate-900">{article.author.name}</div>
                  <div className="text-xs text-slate-500">{formatDate(article.publishedAt)}</div>
                </div>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                {article.readingTime} min read
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm text-slate-600 font-medium">Share:</span>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 bg-[#0077B5] text-white rounded-lg hover:bg-[#006399] transition-colors"
                aria-label="Share on LinkedIn"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy link</span>
                  </>
                )}
              </button>
            </div>

            {/* Article Body - Using prose styling */}
            <div 
              className="prose prose-slate max-w-none
                prose-headings:text-slate-900 prose-headings:font-bold
                prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
                prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
                prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                prose-li:text-slate-700 prose-li:mb-2
                prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 
                prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
                prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-img:rounded-lg prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
            />
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="px-6 md:px-12 py-8 bg-slate-50 border-t border-slate-200">
              <h2 className="text-2xl text-slate-900 mb-6">Related Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.slice(0, 2).map((related) => (
                  <div 
                    key={related.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-2 mb-2">
                      {related.tags.slice(0, 1).map((tag) => (
                        <TagBadge key={tag} label={tag} size="sm" />
                      ))}
                    </div>
                    <h3 className="text-sm font-medium text-slate-900 mb-1 line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                      {related.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {related.readingTime} min
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
