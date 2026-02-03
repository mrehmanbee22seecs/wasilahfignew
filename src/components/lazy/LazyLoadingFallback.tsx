/**
 * Lazy Loading Fallback Component
 * 
 * Provides loading indicators for lazy-loaded components.
 * Uses skeleton loaders for better UX during code chunk loading.
 */

import React from 'react';
import { BaseSkeleton } from '../skeletons/BaseSkeleton';

interface LazyLoadingFallbackProps {
  /**
   * The type of content being loaded (affects skeleton appearance)
   */
  type?: 'page' | 'dashboard' | 'modal';
  
  /**
   * Optional custom message to display
   */
  message?: string;
}

export function LazyLoadingFallback({ 
  type = 'page', 
  message = 'Loading...' 
}: LazyLoadingFallbackProps) {
  if (type === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <BaseSkeleton width="300px" height="32px" />
            <BaseSkeleton width="500px" height="20px" />
          </div>
          
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 space-y-3">
                <BaseSkeleton width="120px" height="16px" />
                <BaseSkeleton width="80px" height="36px" />
              </div>
            ))}
          </div>
          
          {/* Chart Skeleton */}
          <div className="bg-white rounded-lg p-6 space-y-4">
            <BaseSkeleton width="200px" height="24px" />
            <BaseSkeleton width="100%" height="300px" />
          </div>
        </div>
      </div>
    );
  }
  
  if (type === 'modal') {
    return (
      <div className="p-6 space-y-4">
        <BaseSkeleton width="200px" height="24px" />
        <BaseSkeleton width="100%" height="100px" />
        <div className="flex gap-3">
          <BaseSkeleton width="100px" height="40px" />
          <BaseSkeleton width="100px" height="40px" />
        </div>
      </div>
    );
  }
  
  // Default page skeleton
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="space-y-4 mb-12">
          <BaseSkeleton width="400px" height="48px" />
          <BaseSkeleton width="600px" height="24px" />
        </div>
        
        {/* Content Sections */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <BaseSkeleton width="250px" height="28px" />
              <BaseSkeleton width="100%" height="200px" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Loading indicator for accessibility */}
      <div className="sr-only" role="status" aria-live="polite">
        {message}
      </div>
    </div>
  );
}

/**
 * Simple spinner fallback for inline components
 */
export function SpinnerFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
