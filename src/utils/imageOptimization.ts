import imageCompression from 'browser-image-compression';

/**
 * Image Upload Utilities
 * 
 * Utilities for optimizing user-uploaded images on the client side
 * before sending to the server. This reduces bandwidth usage and
 * improves upload performance.
 */

export interface ImageCompressionOptions {
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Maximum width/height */
  maxWidthOrHeight?: number;
  /** Use WebP format if supported */
  useWebWorker?: boolean;
  /** JPEG/WebP quality (0-1) */
  quality?: number;
  /** File type to convert to */
  fileType?: string;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

export interface OptimizedImageResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  width: number;
  height: number;
  format: string;
}

/**
 * Default compression settings
 */
export const DEFAULT_COMPRESSION_OPTIONS: ImageCompressionOptions = {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  quality: 0.85,
};

/**
 * Maximum file sizes by category
 */
export const MAX_FILE_SIZES = {
  PROFILE_PHOTO: 2, // 2 MB
  COVER_IMAGE: 5,   // 5 MB
  GALLERY: 5,       // 5 MB
  DOCUMENT: 10,     // 10 MB
  LOGO: 1,          // 1 MB
};

/**
 * Allowed image formats
 */
export const ALLOWED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

/**
 * Recommended image dimensions by use case
 */
export const RECOMMENDED_DIMENSIONS = {
  PROFILE_PHOTO: { width: 400, height: 400 },
  COVER_IMAGE: { width: 1600, height: 900 },
  GALLERY: { width: 1200, height: 800 },
  LOGO: { width: 512, height: 512 },
  THUMBNAIL: { width: 300, height: 200 },
};

/**
 * Validate image file before upload
 */
export function validateImageFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedFormats?: string[];
    minWidth?: number;
    minHeight?: number;
  } = {}
): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    const {
      maxSizeMB = 5,
      allowedFormats = ALLOWED_IMAGE_FORMATS,
      minWidth,
      minHeight,
    } = options;

    // Check file type
    if (!allowedFormats.includes(file.type)) {
      resolve({
        valid: false,
        error: `Invalid file type. Allowed formats: ${allowedFormats.join(', ')}`,
      });
      return;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      resolve({
        valid: false,
        error: `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`,
      });
      return;
    }

    // Check dimensions if specified
    if (minWidth || minHeight) {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        
        const warnings: string[] = [];
        
        if (minWidth && img.width < minWidth) {
          warnings.push(`Image width (${img.width}px) is less than recommended minimum (${minWidth}px)`);
        }
        
        if (minHeight && img.height < minHeight) {
          warnings.push(`Image height (${img.height}px) is less than recommended minimum (${minHeight}px)`);
        }

        resolve({
          valid: true,
          warnings: warnings.length > 0 ? warnings : undefined,
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          valid: false,
          error: 'Failed to load image. File may be corrupted.',
        });
      };

      img.src = url;
    } else {
      resolve({ valid: true });
    }
  });
}

/**
 * Compress and optimize an image file
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<OptimizedImageResult> {
  const opts = { ...DEFAULT_COMPRESSION_OPTIONS, ...options };
  
  // Get original dimensions
  const dimensions = await getImageDimensions(file);
  
  try {
    // Compress the image
    const compressedFile = await imageCompression(file, {
      maxSizeMB: opts.maxSizeMB!,
      maxWidthOrHeight: opts.maxWidthOrHeight,
      useWebWorker: opts.useWebWorker,
      initialQuality: opts.quality,
      fileType: opts.fileType,
    });

    const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100;

    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressionRatio: Math.max(0, compressionRatio),
      width: dimensions.width,
      height: dimensions.height,
      format: compressedFile.type,
    };
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      width: dimensions.width,
      height: dimensions.height,
      format: file.type,
    };
  }
}

/**
 * Get image dimensions from a file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Resize image to specific dimensions
 */
export async function resizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio = true
): Promise<File> {
  const options: ImageCompressionOptions = {
    maxWidthOrHeight: Math.max(targetWidth, targetHeight),
    quality: 0.9,
    useWebWorker: true,
  };

  const compressed = await compressImage(file, options);
  return compressed.file;
}

/**
 * Convert image to WebP format
 */
export async function convertToWebP(file: File, quality = 0.85): Promise<File> {
  const options: ImageCompressionOptions = {
    quality,
    fileType: 'image/webp',
    useWebWorker: true,
  };

  const compressed = await compressImage(file, options);
  return compressed.file;
}

/**
 * Batch compress multiple images
 */
export async function compressMultipleImages(
  files: File[],
  options: ImageCompressionOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<OptimizedImageResult[]> {
  const results: OptimizedImageResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await compressImage(files[i], options);
    results.push(result);
    onProgress?.(i + 1, files.length);
  }

  return results;
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 0 || !isFinite(bytes)) return '0 B';
  if (bytes === 0) return '0 B';
  if (bytes < 1) return `${bytes} B`;
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    const img = new Image();
    
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = webP;
  });
}

/**
 * Check if browser supports AVIF
 */
export function supportsAVIF(): Promise<boolean> {
  return new Promise((resolve) => {
    const avif = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    const img = new Image();
    
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src = avif;
  });
}

/**
 * Generate image preview URL
 */
export function generatePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke image preview URL to free memory
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
