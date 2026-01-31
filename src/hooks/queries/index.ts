/**
 * Project Query Hooks - Centralized Exports
 * 
 * @fileoverview
 * Central export point for all project-related React Query hooks.
 * Provides easy imports for consuming components.
 * 
 * @example
 * ```tsx
 * import { useProjects, useProject, useCreateProject } from '@/hooks/queries';
 * ```
 * 
 * @module hooks/queries
 * @since 2026-01-31
 */

// Query hooks
export { useProjects } from './useProjects';
export { useProject } from './useProject';

// Mutation hooks
export {
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from './useProjectMutations';

// Type exports
export type { UseProjectsReturn } from './useProjects';
export type { UseProjectReturn } from './useProject';
export type {
  UseCreateProjectReturn,
  UseUpdateProjectReturn,
  UseDeleteProjectReturn,
} from './useProjectMutations';
