import React from 'react';

export function OpportunityCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex gap-4">
          {/* Image skeleton */}
          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gray-200" />

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title & Org */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>

            {/* SDGs */}
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-20" />
              <div className="h-6 bg-gray-200 rounded-full w-24" />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
            </div>

            {/* Meta & Actions */}
            <div className="flex gap-2 items-center">
              <div className="h-8 bg-gray-200 rounded w-20" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-4/5" />

        {/* Org name */}
        <div className="h-4 bg-gray-200 rounded w-2/3" />

        {/* Location */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        {/* SDGs */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Meta */}
        <div className="flex gap-3">
          <div className="h-3 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-20" />
        </div>

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}

export function ProjectRowSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex gap-4">
        {/* Image skeleton */}
        <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-200" />

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Title & Org */}
          <div>
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Meta */}
          <div className="flex gap-4">
            <div className="h-3 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>

          {/* SDGs */}
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-6 bg-gray-200 rounded-full w-24" />
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-16" />
              <div className="h-3 bg-gray-200 rounded w-10" />
            </div>
            <div className="h-2 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificateCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      {/* Icon & Title */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-4/5" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>

      {/* Meta */}
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>

      {/* Button */}
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-8 bg-gray-200 rounded w-16" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function OpportunitiesGridSkeleton({ count = 6, variant = 'grid' }: { count?: number; variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <OpportunityCardSkeleton key={i} variant="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <OpportunityCardSkeleton key={i} variant="grid" />
      ))}
    </div>
  );
}

export function ProjectsListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function CertificatesGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CertificateCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function KPISummarySkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
  );
}
