/**
 * Wasilah Brand Constants
 * 
 * These colors are derived from the official Wasilah logo (logo.jpeg)
 * and should be used consistently across all pages, dashboards, and components.
 */

export const BRAND = {
  // Primary Colors
  navy: '#1B2A4E',
  navyLight: '#2A3F6E',
  navyDark: '#111D36',
  
  // Accent Colors
  teal: '#2EC4B6',
  tealLight: '#4DD8CB',
  tealDark: '#22A89B',
  
  // Background Colors
  cream: '#F5EFE6',
  creamLight: '#FAF8F4',
  creamDark: '#E8E0D4',
  
  // Neutral Colors
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
} as const;

// CSS Custom Properties for use in stylesheets
export const BRAND_CSS_VARS = {
  '--brand-navy': BRAND.navy,
  '--brand-navy-light': BRAND.navyLight,
  '--brand-navy-dark': BRAND.navyDark,
  '--brand-teal': BRAND.teal,
  '--brand-teal-light': BRAND.tealLight,
  '--brand-teal-dark': BRAND.tealDark,
  '--brand-cream': BRAND.cream,
  '--brand-cream-light': BRAND.creamLight,
  '--brand-cream-dark': BRAND.creamDark,
} as const;

// Tailwind-style utility classes for consistent styling
export const BRAND_STYLES = {
  // Gradients
  gradientNavyTeal: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)`,
  gradientTealNavy: `linear-gradient(135deg, ${BRAND.teal} 0%, ${BRAND.navy} 100%)`,
  gradientNavyLight: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyLight} 100%)`,
  
  // Button Active States
  buttonPrimary: {
    backgroundColor: BRAND.navy,
    color: BRAND.white,
    hoverBg: BRAND.teal,
  },
  buttonSecondary: {
    backgroundColor: BRAND.teal,
    color: BRAND.white,
    hoverBg: BRAND.navy,
  },
  buttonOutline: {
    borderColor: BRAND.navy,
    color: BRAND.navy,
    hoverBg: BRAND.navy,
    hoverColor: BRAND.white,
  },
  
  // Sidebar Active State
  sidebarActive: {
    background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.teal} 100%)`,
    color: BRAND.white,
    boxShadow: '0 4px 12px rgba(27, 42, 78, 0.3)',
  },
  
  // Card Hover Effects
  cardHover: {
    boxShadow: '0 25px 50px -12px rgba(27, 42, 78, 0.15)',
    transform: 'translateY(-2px)',
  },
  
  // Alpha colors for consistency
  tealAlpha10: `${BRAND.teal}10`,
  tealAlpha15: `${BRAND.teal}15`,
  tealAlpha30: `${BRAND.teal}30`,
  navyAlpha10: `${BRAND.navy}10`,
  navyAlpha15: `${BRAND.navy}15`,
  navyAlpha20: `${BRAND.navy}20`,
} as const;

// Status Colors (keeping some semantic colors)
export const STATUS_COLORS = {
  success: '#10B981',
  warning: '#F59E0B', 
  error: '#EF4444',
  info: BRAND.teal,
} as const;

export default BRAND;
