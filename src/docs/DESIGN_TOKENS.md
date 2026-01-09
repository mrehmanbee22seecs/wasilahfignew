# Wasilah CMS - Design Tokens

## 📋 Export Format

This document contains all design tokens used in the Wasilah CMS platform, exportable in multiple formats: CSS Variables, SCSS, JSON, and JavaScript.

---

## 🎨 Color Tokens

### Brand Colors (Blue-Emerald-White Palette)

#### CSS Variables
```css
:root {
  /* Primary - Blue */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;

  /* Secondary - Emerald */
  --color-secondary-50: #ecfdf5;
  --color-secondary-100: #d1fae5;
  --color-secondary-200: #a7f3d0;
  --color-secondary-300: #6ee7b7;
  --color-secondary-400: #34d399;
  --color-secondary-500: #10b981;
  --color-secondary-600: #059669;
  --color-secondary-700: #047857;
  --color-secondary-800: #065f46;
  --color-secondary-900: #064e3b;
  --color-secondary-950: #022c22;

  /* Success - Green */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-300: #86efac;
  --color-success-400: #4ade80;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;
  --color-success-800: #166534;
  --color-success-900: #14532d;

  /* Warning - Amber */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-300: #fcd34d;
  --color-warning-400: #fbbf24;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-warning-800: #92400e;
  --color-warning-900: #78350f;

  /* Error - Red */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-300: #fca5a5;
  --color-error-400: #f87171;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;
  --color-error-800: #991b1b;
  --color-error-900: #7f1d1d;

  /* Neutral - Gray */
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-300: #d1d5db;
  --color-neutral-400: #9ca3af;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1f2937;
  --color-neutral-900: #111827;
  --color-neutral-950: #030712;

  /* Base Colors */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-transparent: transparent;
}
```

#### JSON Format
```json
{
  "colors": {
    "primary": {
      "50": "#eff6ff",
      "100": "#dbeafe",
      "200": "#bfdbfe",
      "300": "#93c5fd",
      "400": "#60a5fa",
      "500": "#3b82f6",
      "600": "#2563eb",
      "700": "#1d4ed8",
      "800": "#1e40af",
      "900": "#1e3a8a",
      "950": "#172554"
    },
    "secondary": {
      "50": "#ecfdf5",
      "100": "#d1fae5",
      "200": "#a7f3d0",
      "300": "#6ee7b7",
      "400": "#34d399",
      "500": "#10b981",
      "600": "#059669",
      "700": "#047857",
      "800": "#065f46",
      "900": "#064e3b",
      "950": "#022c22"
    },
    "success": {
      "500": "#22c55e",
      "600": "#16a34a"
    },
    "warning": {
      "500": "#f59e0b",
      "600": "#d97706"
    },
    "error": {
      "500": "#ef4444",
      "600": "#dc2626"
    },
    "neutral": {
      "50": "#f9fafb",
      "100": "#f3f4f6",
      "200": "#e5e7eb",
      "300": "#d1d5db",
      "400": "#9ca3af",
      "500": "#6b7280",
      "600": "#4b5563",
      "700": "#374151",
      "800": "#1f2937",
      "900": "#111827"
    }
  }
}
```

---

## 📏 Typography Tokens

### CSS Variables
```css
:root {
  /* Font Families */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

  /* Font Sizes */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */

  /* Font Weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Line Heights */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Letter Spacing */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}
```

### JSON Format
```json
{
  "typography": {
    "fontFamily": {
      "sans": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      "serif": "Georgia, Cambria, 'Times New Roman', Times, serif",
      "mono": "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem"
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "lineHeight": {
      "none": 1,
      "tight": 1.25,
      "snug": 1.375,
      "normal": 1.5,
      "relaxed": 1.625,
      "loose": 2
    },
    "letterSpacing": {
      "tighter": "-0.05em",
      "tight": "-0.025em",
      "normal": "0",
      "wide": "0.025em",
      "wider": "0.05em",
      "widest": "0.1em"
    }
  }
}
```

---

## 📐 Spacing Tokens

### CSS Variables
```css
:root {
  /* Spacing Scale (4px base) */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0-5: 0.125rem;  /* 2px */
  --spacing-1: 0.25rem;     /* 4px */
  --spacing-1-5: 0.375rem;  /* 6px */
  --spacing-2: 0.5rem;      /* 8px */
  --spacing-2-5: 0.625rem;  /* 10px */
  --spacing-3: 0.75rem;     /* 12px */
  --spacing-3-5: 0.875rem;  /* 14px */
  --spacing-4: 1rem;        /* 16px */
  --spacing-5: 1.25rem;     /* 20px */
  --spacing-6: 1.5rem;      /* 24px */
  --spacing-7: 1.75rem;     /* 28px */
  --spacing-8: 2rem;        /* 32px */
  --spacing-9: 2.25rem;     /* 36px */
  --spacing-10: 2.5rem;     /* 40px */
  --spacing-11: 2.75rem;    /* 44px */
  --spacing-12: 3rem;       /* 48px */
  --spacing-14: 3.5rem;     /* 56px */
  --spacing-16: 4rem;       /* 64px */
  --spacing-20: 5rem;       /* 80px */
  --spacing-24: 6rem;       /* 96px */
  --spacing-32: 8rem;       /* 128px */
}
```

### JSON Format
```json
{
  "spacing": {
    "0": "0",
    "px": "1px",
    "0.5": "0.125rem",
    "1": "0.25rem",
    "1.5": "0.375rem",
    "2": "0.5rem",
    "2.5": "0.625rem",
    "3": "0.75rem",
    "3.5": "0.875rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    "11": "2.75rem",
    "12": "3rem",
    "14": "3.5rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "32": "8rem"
  }
}
```

---

## 🔲 Border Radius Tokens

### CSS Variables
```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-base: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;
}
```

### JSON Format
```json
{
  "borderRadius": {
    "none": "0",
    "sm": "0.125rem",
    "base": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "full": "9999px"
  }
}
```

---

## 🌊 Shadow Tokens

### CSS Variables
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  --shadow-none: none;
}
```

### JSON Format
```json
{
  "boxShadow": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    "none": "none"
  }
}
```

---

## ⏱️ Animation Tokens

### CSS Variables
```css
:root {
  /* Durations */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;

  /* Timing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Transitions */
  --transition-all: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-colors: background-color, border-color, color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-opacity: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-shadow: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-transform: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### JSON Format
```json
{
  "animation": {
    "duration": {
      "75": "75ms",
      "100": "100ms",
      "150": "150ms",
      "200": "200ms",
      "300": "300ms",
      "500": "500ms",
      "700": "700ms",
      "1000": "1000ms"
    },
    "timingFunction": {
      "linear": "linear",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)",
      "inOut": "cubic-bezier(0.4, 0, 0.2, 1)"
    }
  }
}
```

---

## 🖼️ Z-Index Tokens

### CSS Variables
```css
:root {
  --z-index-0: 0;
  --z-index-10: 10;
  --z-index-20: 20;
  --z-index-30: 30;
  --z-index-40: 40;
  --z-index-50: 50;
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
}
```

### JSON Format
```json
{
  "zIndex": {
    "0": 0,
    "10": 10,
    "20": 20,
    "30": 30,
    "40": 40,
    "50": 50,
    "dropdown": 1000,
    "sticky": 1020,
    "fixed": 1030,
    "modalBackdrop": 1040,
    "modal": 1050,
    "popover": 1060,
    "tooltip": 1070
  }
}
```

---

## 📱 Breakpoint Tokens

### CSS Variables
```css
:root {
  --screen-sm: 640px;
  --screen-md: 768px;
  --screen-lg: 1024px;
  --screen-xl: 1280px;
  --screen-2xl: 1536px;
}
```

### JSON Format
```json
{
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  }
}
```

### Media Queries
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }

/* Desktop First */
@media (max-width: 639px) { /* < sm */ }
@media (max-width: 767px) { /* < md */ }
@media (max-width: 1023px) { /* < lg */ }
@media (max-width: 1279px) { /* < xl */ }
@media (max-width: 1535px) { /* < 2xl */ }
```

---

## 🎯 Semantic Tokens (Context-Specific)

### CSS Variables
```css
:root {
  /* CMS-Specific Colors */
  --cms-bg-primary: var(--color-white);
  --cms-bg-secondary: var(--color-neutral-50);
  --cms-bg-tertiary: var(--color-neutral-100);
  
  --cms-text-primary: var(--color-neutral-900);
  --cms-text-secondary: var(--color-neutral-600);
  --cms-text-tertiary: var(--color-neutral-500);
  
  --cms-border-light: var(--color-neutral-200);
  --cms-border-medium: var(--color-neutral-300);
  --cms-border-dark: var(--color-neutral-400);
  
  /* Status Colors */
  --status-draft: var(--color-neutral-500);
  --status-draft-bg: var(--color-neutral-100);
  --status-published: var(--color-success-600);
  --status-published-bg: var(--color-success-100);
  --status-scheduled: var(--color-primary-600);
  --status-scheduled-bg: var(--color-primary-100);
  
  /* Interactive Elements */
  --button-primary-bg: var(--color-primary-600);
  --button-primary-hover: var(--color-primary-700);
  --button-primary-text: var(--color-white);
  
  --button-secondary-bg: var(--color-secondary-600);
  --button-secondary-hover: var(--color-secondary-700);
  --button-secondary-text: var(--color-white);
  
  --button-ghost-bg: transparent;
  --button-ghost-hover: var(--color-neutral-100);
  --button-ghost-text: var(--color-neutral-700);
  
  /* Focus States */
  --focus-ring-color: var(--color-primary-500);
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;
}
```

---

## 🎨 Component-Specific Tokens

### Buttons
```css
:root {
  --button-padding-x-sm: var(--spacing-3);
  --button-padding-y-sm: var(--spacing-1-5);
  --button-font-size-sm: var(--font-size-sm);
  
  --button-padding-x-md: var(--spacing-4);
  --button-padding-y-md: var(--spacing-2);
  --button-font-size-md: var(--font-size-base);
  
  --button-padding-x-lg: var(--spacing-6);
  --button-padding-y-lg: var(--spacing-3);
  --button-font-size-lg: var(--font-size-lg);
  
  --button-radius: var(--radius-lg);
  --button-font-weight: var(--font-weight-medium);
}
```

### Input Fields
```css
:root {
  --input-padding-x: var(--spacing-4);
  --input-padding-y: var(--spacing-2);
  --input-font-size: var(--font-size-base);
  --input-border-width: 1px;
  --input-border-color: var(--color-neutral-200);
  --input-border-color-focus: var(--color-primary-500);
  --input-radius: var(--radius-lg);
  --input-bg: var(--color-white);
  --input-text-color: var(--color-neutral-900);
  --input-placeholder-color: var(--color-neutral-400);
}
```

### Cards
```css
:root {
  --card-padding: var(--spacing-6);
  --card-radius: var(--radius-lg);
  --card-bg: var(--color-white);
  --card-border-width: 1px;
  --card-border-color: var(--color-neutral-200);
  --card-shadow: var(--shadow-sm);
  --card-shadow-hover: var(--shadow-md);
}
```

### Modals
```css
:root {
  --modal-width-sm: 400px;
  --modal-width-md: 600px;
  --modal-width-lg: 800px;
  --modal-width-xl: 1200px;
  --modal-padding: var(--spacing-6);
  --modal-radius: var(--radius-xl);
  --modal-bg: var(--color-white);
  --modal-backdrop-bg: rgba(0, 0, 0, 0.5);
  --modal-shadow: var(--shadow-2xl);
}
```

---

## 📦 Complete Export (All Formats)

### JavaScript/TypeScript Export
```typescript
// tokens.ts
export const tokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    secondary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    // ... (truncated for brevity)
  },
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem',
    1: '0.25rem',
    // ... (truncated for brevity)
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Tokens = typeof tokens;
```

---

### SCSS Export
```scss
// _tokens.scss

// Colors
$color-primary-600: #2563eb;
$color-secondary-600: #059669;
$color-success-600: #16a34a;
$color-warning-600: #d97706;
$color-error-600: #dc2626;

// Spacing
$spacing-1: 0.25rem;
$spacing-2: 0.5rem;
$spacing-3: 0.75rem;
$spacing-4: 1rem;
$spacing-6: 1.5rem;
$spacing-8: 2rem;
$spacing-12: 3rem;

// Typography
$font-size-xs: 0.75rem;
$font-size-sm: 0.875rem;
$font-size-base: 1rem;
$font-size-lg: 1.125rem;
$font-size-xl: 1.25rem;
$font-size-2xl: 1.5rem;

$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Border Radius
$radius-sm: 0.125rem;
$radius-base: 0.25rem;
$radius-md: 0.375rem;
$radius-lg: 0.5rem;
$radius-xl: 0.75rem;

// Shadows
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

---

## 🎯 Usage Examples

### CSS Custom Properties
```css
.button-primary {
  background-color: var(--color-primary-600);
  color: var(--color-white);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-all);
}

.button-primary:hover {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-md);
}
```

### Tailwind CSS (Already configured)
```jsx
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-blue-700 hover:shadow-md transition-all">
  Button
</button>
```

### JavaScript/TypeScript
```typescript
import { tokens } from './tokens';

const buttonStyle = {
  backgroundColor: tokens.colors.primary[600],
  color: tokens.colors.white,
  padding: `${tokens.spacing[2]} ${tokens.spacing[4]}`,
  borderRadius: tokens.borderRadius.lg,
  fontSize: tokens.fontSize.base,
  fontWeight: tokens.fontWeight.medium,
};
```

---

## 📥 Download Formats

### JSON Export
[Download tokens.json](#)

### CSS Export
[Download tokens.css](#)

### SCSS Export
[Download tokens.scss](#)

### TypeScript Export
[Download tokens.ts](#)

### Figma Tokens Plugin Format
[Download figma-tokens.json](#)

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-07 | Initial release with complete token set |

---

**Maintained by:** Wasilah Design Team  
**Last Updated:** January 7, 2024
