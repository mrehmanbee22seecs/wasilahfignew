/**
 * Image Optimization Tests
 * 
 * Tests for image optimization utilities including:
 * - File validation
 * - Client-side compression
 * - Format conversion
 * - Size calculations
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateImageFile,
  compressImage,
  getImageDimensions,
  formatFileSize,
  supportsWebP,
  supportsAVIF,
  MAX_FILE_SIZES,
  ALLOWED_IMAGE_FORMATS,
  RECOMMENDED_DIMENSIONS,
} from '@/utils/imageOptimization';

// Helper to create a mock image file
function createMockImageFile(
  name: string,
  size: number,
  type: string = 'image/jpeg'
): File {
  const blob = new Blob(['x'.repeat(size)], { type });
  return new File([blob], name, { type });
}

// Helper to create actual image blob for dimension testing
function createImageBlob(width: number, height: number): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(0, 0, width, height);
    }
    
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/jpeg');
  });
}

describe('Image Optimization Utils', () => {
  describe('validateImageFile', () => {
    it('should accept valid JPEG file', async () => {
      const file = createMockImageFile('test.jpg', 1024 * 1024, 'image/jpeg');
      const result = await validateImageFile(file, { maxSizeMB: 5 });
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should accept valid PNG file', async () => {
      const file = createMockImageFile('test.png', 1024 * 1024, 'image/png');
      const result = await validateImageFile(file, { maxSizeMB: 5 });
      
      expect(result.valid).toBe(true);
    });

    it('should accept valid WebP file', async () => {
      const file = createMockImageFile('test.webp', 1024 * 1024, 'image/webp');
      const result = await validateImageFile(file, { maxSizeMB: 5 });
      
      expect(result.valid).toBe(true);
    });

    it('should reject file exceeding size limit', async () => {
      const file = createMockImageFile('large.jpg', 10 * 1024 * 1024, 'image/jpeg');
      const result = await validateImageFile(file, { maxSizeMB: 5 });
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should reject invalid file type', async () => {
      const file = createMockImageFile('test.pdf', 1024 * 1024, 'application/pdf');
      const result = await validateImageFile(file, {
        maxSizeMB: 5,
        allowedFormats: ALLOWED_IMAGE_FORMATS,
      });
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file type');
    });

    it('should validate file size under 1MB for logo', async () => {
      const file = createMockImageFile('logo.png', 512 * 1024, 'image/png');
      const result = await validateImageFile(file, {
        maxSizeMB: MAX_FILE_SIZES.LOGO,
      });
      
      expect(result.valid).toBe(true);
    });

    it('should reject oversized logo', async () => {
      const file = createMockImageFile('logo.png', 2 * 1024 * 1024, 'image/png');
      const result = await validateImageFile(file, {
        maxSizeMB: MAX_FILE_SIZES.LOGO,
      });
      
      expect(result.valid).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(100)).toBe('100 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle large numbers', () => {
      const result = formatFileSize(5 * 1024 * 1024);
      expect(result).toBe('5 MB');
    });

    it('should round to 2 decimal places', () => {
      const result = formatFileSize(1234567);
      expect(result).toMatch(/^\d+\.\d{2} MB$/);
    });
  });

  describe('Constants', () => {
    it('should have correct max file sizes', () => {
      expect(MAX_FILE_SIZES.PROFILE_PHOTO).toBe(2);
      expect(MAX_FILE_SIZES.COVER_IMAGE).toBe(5);
      expect(MAX_FILE_SIZES.GALLERY).toBe(5);
      expect(MAX_FILE_SIZES.DOCUMENT).toBe(10);
      expect(MAX_FILE_SIZES.LOGO).toBe(1);
    });

    it('should have valid allowed formats', () => {
      expect(ALLOWED_IMAGE_FORMATS).toContain('image/jpeg');
      expect(ALLOWED_IMAGE_FORMATS).toContain('image/png');
      expect(ALLOWED_IMAGE_FORMATS).toContain('image/webp');
      expect(ALLOWED_IMAGE_FORMATS).toContain('image/gif');
    });

    it('should have recommended dimensions', () => {
      expect(RECOMMENDED_DIMENSIONS.PROFILE_PHOTO).toEqual({ width: 400, height: 400 });
      expect(RECOMMENDED_DIMENSIONS.COVER_IMAGE).toEqual({ width: 1600, height: 900 });
      expect(RECOMMENDED_DIMENSIONS.LOGO).toEqual({ width: 512, height: 512 });
    });
  });

  describe('Browser Support Detection', () => {
    it.skip('should detect WebP support', async () => {
      // Skip in test environment - requires real browser Image API
      const supported = await supportsWebP();
      // Most modern browsers support WebP
      expect(typeof supported).toBe('boolean');
    });

    it.skip('should detect AVIF support', async () => {
      // Skip in test environment - requires real browser Image API
      const supported = await supportsAVIF();
      // AVIF support varies by browser
      expect(typeof supported).toBe('boolean');
    });
  });

  describe('File Size Validation', () => {
    it('should validate profile photo size limit (2MB)', async () => {
      const validFile = createMockImageFile('profile.jpg', 1.5 * 1024 * 1024, 'image/jpeg');
      const result = await validateImageFile(validFile, {
        maxSizeMB: MAX_FILE_SIZES.PROFILE_PHOTO,
      });
      expect(result.valid).toBe(true);
    });

    it('should reject profile photo exceeding 2MB', async () => {
      const invalidFile = createMockImageFile('profile.jpg', 3 * 1024 * 1024, 'image/jpeg');
      const result = await validateImageFile(invalidFile, {
        maxSizeMB: MAX_FILE_SIZES.PROFILE_PHOTO,
      });
      expect(result.valid).toBe(false);
    });

    it('should validate gallery image size limit (5MB)', async () => {
      const validFile = createMockImageFile('gallery.jpg', 4 * 1024 * 1024, 'image/jpeg');
      const result = await validateImageFile(validFile, {
        maxSizeMB: MAX_FILE_SIZES.GALLERY,
      });
      expect(result.valid).toBe(true);
    });
  });
});

describe('Image Optimization Performance', () => {
  it('should define compression defaults', () => {
    expect(MAX_FILE_SIZES).toBeDefined();
    expect(ALLOWED_IMAGE_FORMATS).toBeDefined();
    expect(RECOMMENDED_DIMENSIONS).toBeDefined();
  });

  it('should format file sizes efficiently', () => {
    const sizes = [0, 1024, 1024 * 1024, 1024 * 1024 * 1024];
    sizes.forEach(size => {
      const result = formatFileSize(size);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  it('should handle edge cases in file size formatting', () => {
    expect(formatFileSize(-1)).toBe('0 B');
    expect(formatFileSize(0.5)).toBe('0.5 B');  
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1025)).toBe('1 KB');
  });
});

describe('Image Upload Scenarios', () => {
  it('should validate typical user profile photo', async () => {
    const file = createMockImageFile('profile.jpg', 500 * 1024, 'image/jpeg');
    const result = await validateImageFile(file, {
      maxSizeMB: MAX_FILE_SIZES.PROFILE_PHOTO,
      allowedFormats: ALLOWED_IMAGE_FORMATS,
    });
    
    expect(result.valid).toBe(true);
  });

  it('should validate typical cover image', async () => {
    const file = createMockImageFile('cover.jpg', 2 * 1024 * 1024, 'image/jpeg');
    const result = await validateImageFile(file, {
      maxSizeMB: MAX_FILE_SIZES.COVER_IMAGE,
      allowedFormats: ALLOWED_IMAGE_FORMATS,
    });
    
    expect(result.valid).toBe(true);
  });

  it('should reject non-image file', async () => {
    const file = createMockImageFile('document.txt', 100 * 1024, 'text/plain');
    const result = await validateImageFile(file, {
      maxSizeMB: 5,
      allowedFormats: ALLOWED_IMAGE_FORMATS,
    });
    
    expect(result.valid).toBe(false);
  });
});
