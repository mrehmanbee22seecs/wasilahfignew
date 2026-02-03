import React, { useState, useEffect } from 'react';
import { cn } from '@/components/ui/utils';

/**
 * OptimizedImage Component
 * 
 * A high-performance image component with:
 * - Lazy loading with loading="lazy"
 * - Skeleton placeholder during load
 * - Modern format support (WebP, AVIF) with fallbacks
 * - Responsive images with srcset
 * - Error handling with fallback
 * - Reduced motion support
 * 
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero banner"
 *   width={1600}
 *   height={900}
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 * />
 * ```
 */

export interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  /** Image source URL or path */
  src: string;
  /** Alternative text (required for accessibility) */
  alt: string;
  /** Image width (used for aspect ratio) */
  width?: number;
  /** Image height (used for aspect ratio) */
  height?: number;
  /** Responsive image sizes attribute */
  sizes?: string;
  /** Priority loading (disables lazy load for above-the-fold images) */
  priority?: boolean;
  /** Custom className */
  className?: string;
  /** Show skeleton placeholder while loading */
  showSkeleton?: boolean;
  /** Object fit style */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /** Callback when image loads */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
}

const ERROR_IMG_SRC = 
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=';

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  priority = false,
  className = '',
  showSkeleton = true,
  objectFit = 'cover',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(src);

  // Reset state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImageSrc(src);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setImageSrc(ERROR_IMG_SRC);
    onError?.();
  };

  // Calculate aspect ratio for skeleton
  const aspectRatio = width && height ? (height / width) * 100 : undefined;

  // Generate srcset for responsive images
  const generateSrcSet = (src: string): string | undefined => {
    // Skip data URLs and external URLs
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
      return undefined;
    }

    // Generate responsive sizes (1x, 2x for retina)
    const baseSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const ext = src.match(/\.(jpg|jpeg|png|webp)$/i)?.[0] || '.jpg';
    
    return `${baseSrc}${ext} 1x, ${baseSrc}@2x${ext} 2x`;
  };

  const srcSet = generateSrcSet(src);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { paddingBottom: `${aspectRatio}%` } : undefined}
    >
      {/* Skeleton placeholder */}
      {isLoading && showSkeleton && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-label="Loading image"
        />
      )}

      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={!hasError ? srcSet : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          aspectRatio ? 'absolute inset-0 w-full h-full' : '',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          isLoading ? 'opacity-0' : 'opacity-100',
          hasError && 'opacity-50'
        )}
        {...props}
      />

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-400">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

/**
 * Utility function to generate image URLs for different formats
 * Used with vite-imagetools to generate optimized versions
 */
export function getOptimizedImageUrls(src: string) {
  // Skip data URLs and external URLs
  if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
    return { webp: src, avif: src, fallback: src };
  }

  const baseSrc = src.replace(/\.(jpg|jpeg|png)$/i, '');
  
  return {
    avif: `${baseSrc}.avif`,
    webp: `${baseSrc}.webp`,
    fallback: src,
  };
}

/**
 * Picture component for modern format support with fallbacks
 * Provides maximum browser compatibility with AVIF/WebP/JPEG cascade
 */
export interface PictureProps extends OptimizedImageProps {
  /** Generate WebP and AVIF versions */
  modernFormats?: boolean;
}

export function Picture({
  src,
  alt,
  width,
  height,
  sizes,
  modernFormats = true,
  ...props
}: PictureProps) {
  const urls = modernFormats ? getOptimizedImageUrls(src) : { fallback: src };

  return (
    <picture>
      {modernFormats && urls.avif && (
        <source type="image/avif" srcSet={urls.avif} sizes={sizes} />
      )}
      {modernFormats && urls.webp && (
        <source type="image/webp" srcSet={urls.webp} sizes={sizes} />
      )}
      <OptimizedImage
        src={urls.fallback}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        {...props}
      />
    </picture>
  );
}
