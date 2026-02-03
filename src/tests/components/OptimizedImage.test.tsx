/**
 * OptimizedImage Component Tests
 * 
 * Tests for the OptimizedImage component including:
 * - Lazy loading behavior
 * - Skeleton placeholder display
 * - Error handling
 * - Responsive image attributes
 * - Priority loading
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OptimizedImage, Picture } from '@/components/images/OptimizedImage';

describe('OptimizedImage Component', () => {
  describe('Basic Rendering', () => {
    it('should render image with correct attributes', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('/test-image.jpg');
      expect(img?.getAttribute('width')).toBe('800');
      expect(img?.getAttribute('height')).toBe('600');
    });

    it('should apply lazy loading by default', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
        />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('lazy');
    });

    it('should apply eager loading when priority is true', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          priority={true}
        />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('loading')).toBe('eager');
    });

    it('should set decoding to async', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
        />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('decoding')).toBe('async');
    });
  });

  describe('Skeleton Placeholder', () => {
    it('should show skeleton placeholder initially', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          showSkeleton={true}
        />
      );

      const skeleton = container.querySelector('[aria-label="Loading image"]');
      expect(skeleton).toBeTruthy();
    });

    it('should not show skeleton when showSkeleton is false', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          showSkeleton={false}
        />
      );

      const skeleton = container.querySelector('[aria-label="Loading image"]');
      expect(skeleton).toBeFalsy();
    });
  });

  describe('Responsive Images', () => {
    it('should apply sizes attribute', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('sizes')).toBe('(max-width: 768px) 100vw, 50vw');
    });

    it('should not generate srcset for external URLs', () => {
      const { container } = render(
        <OptimizedImage
          src="https://example.com/image.jpg"
          alt="Test image"
        />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('srcset')).toBeFalsy();
    });

    it('should not generate srcset for data URLs', () => {
      const { container } = render(
        <OptimizedImage
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          alt="Test image"
        />
      );

      const img = container.querySelector('img');
      expect(img?.getAttribute('srcset')).toBeFalsy();
    });
  });

  describe('Aspect Ratio', () => {
    it('should calculate aspect ratio from width and height', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          width={800}
          height={600}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      const paddingBottom = wrapper.style.paddingBottom;
      
      // 600/800 * 100 = 75%
      expect(paddingBottom).toBe('75%');
    });

    it('should not set padding when dimensions are not provided', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.paddingBottom).toBe('');
    });
  });

  describe('Custom Classes', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <OptimizedImage
          src="/test-image.jpg"
          alt="Test image"
          className="custom-class"
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('custom-class');
    });
  });
});

describe('Picture Component', () => {
  it('should render picture element', () => {
    const { container } = render(
      <Picture
        src="/test-image.jpg"
        alt="Test image"
        modernFormats={true}
      />
    );

    const picture = container.querySelector('picture');
    expect(picture).toBeTruthy();
  });

  it('should include AVIF source', () => {
    const { container } = render(
      <Picture
        src="/test-image.jpg"
        alt="Test image"
        modernFormats={true}
      />
    );

    const avifSource = container.querySelector('source[type="image/avif"]');
    expect(avifSource).toBeTruthy();
  });

  it('should include WebP source', () => {
    const { container } = render(
      <Picture
        src="/test-image.jpg"
        alt="Test image"
        modernFormats={true}
      />
    );

    const webpSource = container.querySelector('source[type="image/webp"]');
    expect(webpSource).toBeTruthy();
  });

  it('should include fallback img element', () => {
    const { container } = render(
      <Picture
        src="/test-image.jpg"
        alt="Test image"
        modernFormats={true}
      />
    );

    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.tagName).toBe('IMG');
  });

  it('should skip modern formats when disabled', () => {
    const { container } = render(
      <Picture
        src="/test-image.jpg"
        alt="Test image"
        modernFormats={false}
      />
    );

    const avifSource = container.querySelector('source[type="image/avif"]');
    const webpSource = container.querySelector('source[type="image/webp"]');
    
    expect(avifSource).toBeFalsy();
    expect(webpSource).toBeFalsy();
  });

  it('should pass sizes attribute to sources', () => {
    const { container } = render(
      <Picture
        src="/test-image.jpg"
        alt="Test image"
        sizes="(max-width: 768px) 100vw, 50vw"
        modernFormats={true}
      />
    );

    const sources = container.querySelectorAll('source');
    expect(sources.length).toBeGreaterThan(0);
    sources.forEach(source => {
      expect(source.getAttribute('sizes')).toBe('(max-width: 768px) 100vw, 50vw');
    });
  });
});

describe('Image Optimization Integration', () => {
  it('should handle rapid src changes gracefully', () => {
    const { container, rerender } = render(
      <OptimizedImage
        src="/image1.jpg"
        alt="Test image"
      />
    );

    rerender(
      <OptimizedImage
        src="/image2.jpg"
        alt="Test image"
      />
    );

    rerender(
      <OptimizedImage
        src="/image3.jpg"
        alt="Test image"
      />
    );

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/image3.jpg');
  });

  it('should clean up resources on unmount', () => {
    const { container, unmount } = render(
      <OptimizedImage
        src="/test-image.jpg"
        alt="Test image"
      />
    );

    const imgBefore = container.querySelector('img');
    expect(imgBefore).toBeTruthy();

    unmount();
    
    // Component should unmount without errors
    const imgAfter = container.querySelector('img');
    expect(imgAfter).toBeFalsy();
  });
});
