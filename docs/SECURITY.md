# HTML Sanitization & XSS Protection

## Overview

This application implements comprehensive HTML sanitization using **DOMPurify** to prevent Cross-Site Scripting (XSS) attacks.

## Security Status: ✅ PROTECTED

### Protected Components

1. **ArticleDetailView** - Markdown content rendering - ✅ Sanitized
2. **PreviewModal** - CMS content preview - ✅ Sanitized
3. **chart.tsx** - CSS generation - ✅ Safe (no user input)

## Implementation

### Sanitization Profiles

1. **Strict** - User comments, untrusted input
2. **Moderate** - Blog posts, articles
3. **Markdown** - Markdown-generated content
4. **Relaxed** - Admin CMS content

### Security Features

- ✅ Blocks `<script>` tags
- ✅ Removes event handlers
- ✅ Blocks `javascript:` URLs
- ✅ Adds `rel="noopener noreferrer"` to external links

## Usage

```typescript
import { useSanitizedHTML } from '@/lib/security/sanitize';

const cleanHTML = useSanitizedHTML(content, 'markdown');
<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
```

## Testing

Run: `npm test -- src/tests/security/sanitize.test.ts`

**Status**: ✅ Production Ready
