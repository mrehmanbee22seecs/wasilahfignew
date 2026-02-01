/**
 * Skeleton Components Library
 * 
 * A comprehensive collection of skeleton loaders for all major UI patterns.
 * All components support dark mode and are fully responsive.
 * 
 * Components:
 * - BaseSkeleton: Foundation component with shimmer animation
 * - TextSkeleton: Text lines with varying widths
 * - ButtonSkeleton: Button placeholders
 * - HeaderSkeleton: Page headers with title and actions
 * - CardSkeleton: Generic card layouts
 * - ListSkeleton: List views with items
 * - ProfileSkeleton: User/organization profiles
 * - FormSkeleton: Form layouts with fields
 * - TableRowSkeleton: Table row placeholders
 * - ProjectCardSkeleton: Specialized project cards
 * - SidebarSkeleton: Navigation sidebars
 * - ChartSkeleton: Chart and graph placeholders
 * - DashboardSkeleton: Complete dashboard layouts
 * 
 * @module components/skeletons
 */

// Base component
export { BaseSkeleton } from './BaseSkeleton';
export type { BaseSkeletonProps } from './BaseSkeleton';

// Text and buttons
export { TextSkeleton } from './TextSkeleton';
export type { TextSkeletonProps } from './TextSkeleton';

export { ButtonSkeleton } from './ButtonSkeleton';
export type { ButtonSkeletonProps } from './ButtonSkeleton';

// Headers and navigation
export { HeaderSkeleton } from './HeaderSkeleton';
export type { HeaderSkeletonProps } from './HeaderSkeleton';

export { SidebarSkeleton } from './SidebarSkeleton';
export type { SidebarSkeletonProps } from './SidebarSkeleton';

// Cards and lists
export { CardSkeleton } from './CardSkeleton';
export type { CardSkeletonProps } from './CardSkeleton';

export { ListSkeleton } from './ListSkeleton';
export type { ListSkeletonProps } from './ListSkeleton';

export { ProjectCardSkeleton } from './ProjectCardSkeleton';
export type { ProjectCardSkeletonProps } from './ProjectCardSkeleton';

// Profiles and forms
export { ProfileSkeleton } from './ProfileSkeleton';
export type { ProfileSkeletonProps } from './ProfileSkeleton';

export { FormSkeleton } from './FormSkeleton';
export type { FormSkeletonProps } from './FormSkeleton';

// Tables and data
export { TableRowSkeleton } from './TableRowSkeleton';
export type { TableRowSkeletonProps } from './TableRowSkeleton';

export { ChartSkeleton } from './ChartSkeleton';
export type { ChartSkeletonProps } from './ChartSkeleton';

// Complex layouts
export { DashboardSkeleton } from './DashboardSkeleton';
export type { DashboardSkeletonProps } from './DashboardSkeleton';
