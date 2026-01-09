import React from 'react';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { TagBadge } from './TagBadge';
import type { Article } from '../../types/resources';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export function ArticleCard({ article, onClick }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article 
      className="group bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Read article: ${article.title}`}
    >
      {article.coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-slate-100">
          <img 
            src={article.coverImage} 
            alt="" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tags.slice(0, 2).map((tag) => (
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
        <h3 className="text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTime} min
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
          <span className="flex items-center gap-1 text-emerald-600 font-medium group-hover:gap-2 transition-all">
            Read article
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </article>
  );
}

// Skeleton loading state
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-slate-200" />
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-20 bg-slate-200 rounded-full" />
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 bg-slate-200 rounded mb-2" />
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-slate-200 rounded mb-2" />
        <div className="h-4 bg-slate-200 rounded w-2/3 mb-4" />
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
