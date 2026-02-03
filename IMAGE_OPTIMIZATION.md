# Image Optimization Guide

## Overview

This guide explains how to optimize images throughout the Wasilah application for best performance, rapid page loads, and bandwidth efficiency.

## Table of Contents

1. [Using Optimized Images](#using-optimized-images)
2. [Adding New Static Images](#adding-new-static-images)
3. [User Upload Optimization](#user-upload-optimization)
4. [Build-Time Optimization](#build-time-optimization)
5. [Performance Best Practices](#performance-best-practices)
6. [CDN Configuration](#cdn-configuration)
7. [Testing and Validation](#testing-and-validation)

---

## Using Optimized Images

### OptimizedImage Component

The `OptimizedImage` component provides automatic lazy loading, skeleton placeholders, and modern format support.

```tsx
import { OptimizedImage } from '@/components/images/OptimizedImage';

// Basic usage
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero banner"
  width={1600}
  height={900}
/>

// With responsive sizes
<OptimizedImage
  src="/images/card.jpg"
  alt="Card image"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Priority loading (above-the-fold images)
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero banner"
  width={1600}
  height={900}
  priority={true}
  showSkeleton={false}
/>
```

### Features

- ✅ **Lazy Loading**: Automatically applied via `loading="lazy"`
- ✅ **Skeleton Placeholder**: Shows animated placeholder while loading
- ✅ **Error Handling**: Graceful fallback on load failure
- ✅ **Responsive Images**: Supports `srcset` and `sizes` attributes
- ✅ **Modern Formats**: Ready for WebP/AVIF with fallbacks
- ✅ **Aspect Ratio**: Prevents layout shift during load

### Picture Component (Modern Formats)

For maximum browser compatibility with modern formats:

```tsx
import { Picture } from '@/components/images/OptimizedImage';

<Picture
  src="/images/hero.jpg"
  alt="Hero banner"
  width={1600}
  height={900}
  modernFormats={true}
/>
```

This generates:
```html
<picture>
  <source type="image/avif" srcset="hero.avif" />
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="Hero banner" />
</picture>
```

---

## Adding New Static Images

### Step 1: Place Images in Public Directory

Store static images in appropriate directories:
```
public/
  images/
    heroes/          # Hero banners
    logos/           # Organization logos
    thumbnails/      # Card thumbnails
    backgrounds/     # Background images
    icons/           # Icon images
```

### Step 2: Use Recommended Formats and Sizes

#### Recommended Dimensions

| Use Case | Dimensions | Max Size | Format |
|----------|------------|----------|--------|
| Hero Banners | 1600×900 | 200 KB | JPG/WebP |
| Cover Images | 1200×675 | 150 KB | JPG/WebP |
| Card Thumbnails | 400×300 | 50 KB | JPG/WebP |
| Profile Photos | 400×400 | 50 KB | JPG/WebP |
| Logos | 512×512 | 20 KB | PNG/WebP |
| Icons | 64×64 | 5 KB | PNG/SVG |

### Step 3: Optimize Before Adding

#### Using Command Line Tools

```bash
# Install sharp-cli
npm install -g sharp-cli

# Convert to WebP
sharp -i input.jpg -o output.webp --webp-quality 85

# Convert to AVIF
sharp -i input.jpg -o output.avif --avif-quality 80

# Resize image
sharp -i input.jpg -o output.jpg --resize 1600,900
```

#### Using Online Tools

- [Squoosh.app](https://squoosh.app/) - Google's image optimization tool
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Compressor.io](https://compressor.io/) - Lossy/lossless compression

### Step 4: Add to Component

```tsx
import { OptimizedImage } from '@/components/images/OptimizedImage';

function HeroSection() {
  return (
    <OptimizedImage
      src="/images/heroes/main-hero.jpg"
      alt="Volunteer helping community"
      width={1600}
      height={900}
      priority={true}
      sizes="100vw"
    />
  );
}
```

---

## User Upload Optimization

### EnhancedMediaUploader Component

The `EnhancedMediaUploader` automatically optimizes user uploads on the client side before sending to the server.

```tsx
import { EnhancedMediaUploader } from '@/components/images/EnhancedMediaUploader';

function UploadForm() {
  const handleUploadComplete = (files) => {
    // Files are already optimized
    console.log('Optimized files:', files);
  };

  return (
    <EnhancedMediaUploader
      onUploadComplete={handleUploadComplete}
      maxFiles={5}
      category="GALLERY"
      autoOptimize={true}
      compressionQuality={0.85}
    />
  );
}
```

### Features

- ✅ **Client-Side Compression**: Reduces bandwidth usage
- ✅ **Automatic Validation**: Type, size, and dimension checks
- ✅ **Progress Indicators**: Real-time upload status
- ✅ **Size Reduction Display**: Shows compression savings
- ✅ **Format Conversion**: Converts to optimal formats

### Upload Categories and Limits

```typescript
MAX_FILE_SIZES = {
  PROFILE_PHOTO: 2,  // 2 MB
  COVER_IMAGE: 5,    // 5 MB
  GALLERY: 5,        // 5 MB
  DOCUMENT: 10,      // 10 MB
  LOGO: 1,           // 1 MB
}
```

### Using Image Optimization Utils Directly

```tsx
import {
  validateImageFile,
  compressImage,
  resizeImage,
  convertToWebP,
} from '@/utils/imageOptimization';

// Validate before upload
const validation = await validateImageFile(file, {
  maxSizeMB: 5,
  allowedFormats: ['image/jpeg', 'image/png'],
});

if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Compress image
const result = await compressImage(file, {
  maxSizeMB: 2,
  maxWidthOrHeight: 1920,
  quality: 0.85,
});

console.log(`Reduced by ${result.compressionRatio}%`);
console.log(`Original: ${result.originalSize} bytes`);
console.log(`Compressed: ${result.compressedSize} bytes`);

// Convert to WebP
const webpFile = await convertToWebP(file, 0.85);
```

---

## Build-Time Optimization

### Vite Image Plugin

The project uses `vite-imagetools` for build-time image optimization.

#### Configuration (vite.config.ts)

```typescript
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        return new URLSearchParams();
      },
    }),
  ],
});
```

#### Using Image Directives

Import images with directives to generate optimized versions:

```tsx
// Generate multiple formats
import heroJpg from './hero.jpg';
import heroWebp from './hero.jpg?format=webp';
import heroAvif from './hero.jpg?format=avif';

// Generate responsive sizes
import heroSmall from './hero.jpg?w=640';
import heroMedium from './hero.jpg?w=1024';
import heroLarge from './hero.jpg?w=1920';

// Use in component
<picture>
  <source type="image/avif" srcSet={heroAvif} />
  <source type="image/webp" srcSet={heroWebp} />
  <img src={heroJpg} alt="Hero" />
</picture>
```

#### Available Directives

| Directive | Description | Example |
|-----------|-------------|---------|
| `format` | Convert format | `?format=webp` |
| `w` | Resize width | `?w=800` |
| `h` | Resize height | `?h=600` |
| `quality` | Set quality (1-100) | `?quality=85` |
| `fit` | Fit mode | `?fit=cover` |

---

## Performance Best Practices

### 1. Lazy Loading

**DO**: Use lazy loading for below-the-fold images
```tsx
<OptimizedImage
  src="/images/content.jpg"
  alt="Content"
  loading="lazy"  // default
/>
```

**DON'T**: Lazy load above-the-fold images
```tsx
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero"
  priority={true}  // Loads immediately
/>
```

### 2. Appropriate Sizing

**DO**: Serve appropriately sized images
```tsx
<OptimizedImage
  src="/images/thumbnail.jpg"
  alt="Thumbnail"
  width={300}
  height={200}
  sizes="(max-width: 768px) 100vw, 300px"
/>
```

**DON'T**: Use full-resolution images for small displays
```tsx
// ❌ BAD - 4K image for a 300px thumbnail
<img src="/images/hero-4k.jpg" width="300" />
```

### 3. Modern Formats

**DO**: Use WebP/AVIF with fallbacks
```tsx
<Picture
  src="/images/photo.jpg"
  alt="Photo"
  modernFormats={true}
/>
```

**DON'T**: Use only legacy formats
```tsx
// ❌ BAD - Missing modern formats
<img src="/images/photo.jpg" />
```

### 4. Aspect Ratios

**DO**: Specify width and height to prevent layout shift
```tsx
<OptimizedImage
  src="/images/card.jpg"
  alt="Card"
  width={400}
  height={300}  // Aspect ratio calculated
/>
```

**DON'T**: Omit dimensions
```tsx
// ❌ BAD - Causes layout shift
<img src="/images/card.jpg" />
```

### 5. Alt Text

**DO**: Always provide descriptive alt text
```tsx
<OptimizedImage
  src="/images/volunteer.jpg"
  alt="Volunteer teaching children in classroom"
/>
```

**DON'T**: Use empty or generic alt text
```tsx
// ❌ BAD
<img src="/images/volunteer.jpg" alt="image" />
```

---

## CDN Configuration

### Cache Headers

Configure cache headers for optimal CDN performance (in `vercel.json` or hosting config):

```json
{
  "headers": [
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Content-Type",
          "value": "image/webp"
        }
      ]
    }
  ]
}
```

### Recommended Cache Durations

| Resource Type | Cache Duration | Rationale |
|--------------|----------------|-----------|
| Static images | 1 year | Rarely change |
| User uploads | 30 days | May be updated |
| Avatars | 1 day | Frequently updated |
| Dynamic images | No cache | Generated on request |

---

## Testing and Validation

### Running Tests

```bash
# Run all tests
npm test

# Run image optimization tests specifically
npm test -- image-optimization

# Run with coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Images load with lazy loading
- [ ] Skeleton placeholders appear while loading
- [ ] Images don't cause layout shift
- [ ] Error states display properly
- [ ] Upload compression reduces file size
- [ ] Modern formats (WebP/AVIF) are served
- [ ] Images are responsive across devices

### Performance Metrics

#### Lighthouse Audit

Run Lighthouse audit to measure image performance:

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

**Target Scores:**
- Performance: > 90
- Best Practices: > 90
- Accessibility: > 90

#### Web Vitals

Monitor Core Web Vitals in production:

```typescript
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getLCP(console.log);  // Largest Contentful Paint
```

**Target Metrics:**
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Browser DevTools

1. Open DevTools → Network tab
2. Filter by Images
3. Check:
   - File sizes (should be optimized)
   - Loading order (lazy loaded images after viewport)
   - Format (WebP/AVIF in supported browsers)
   - Cache headers

---

## Troubleshooting

### Images Not Loading

**Problem**: Images show error placeholder

**Solutions**:
1. Check image path is correct
2. Verify image exists in public folder
3. Check file permissions
4. Inspect network tab for 404 errors

### Compression Not Working

**Problem**: Uploaded images not compressed

**Solutions**:
1. Verify `autoOptimize={true}` is set
2. Check browser console for errors
3. Ensure `browser-image-compression` is installed
4. Check file size limits

### Poor Performance

**Problem**: Slow image loading

**Solutions**:
1. Reduce image dimensions
2. Increase compression (lower quality)
3. Use modern formats (WebP/AVIF)
4. Enable lazy loading
5. Add CDN cache headers

### Layout Shift

**Problem**: Content jumps when images load

**Solutions**:
1. Always specify `width` and `height`
2. Use aspect ratio containers
3. Show skeleton placeholders

---

## Quick Reference

### Component Import Map

```typescript
// Optimized image component
import { OptimizedImage, Picture } from '@/components/images/OptimizedImage';

// Enhanced uploader with compression
import { EnhancedMediaUploader } from '@/components/images/EnhancedMediaUploader';

// Utilities
import {
  validateImageFile,
  compressImage,
  resizeImage,
  formatFileSize,
} from '@/utils/imageOptimization';
```

### Common Patterns

```tsx
// Hero image (above fold)
<OptimizedImage
  src="/images/hero.jpg"
  alt="Description"
  width={1600}
  height={900}
  priority={true}
  sizes="100vw"
/>

// Card thumbnail
<OptimizedImage
  src="/images/card.jpg"
  alt="Description"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
/>

// Gallery image with modern formats
<Picture
  src="/images/gallery.jpg"
  alt="Description"
  width={800}
  height={600}
  modernFormats={true}
/>
```

---

## Support

For questions or issues:
1. Check this documentation
2. Review component source code
3. Run tests to verify implementation
4. Contact the development team

**Last Updated**: 2026-02-03
