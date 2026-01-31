/**
 * Example Component - Demonstrates React Query Hooks Usage
 * 
 * @fileoverview
 * This is a reference implementation showing how to use the new React Query hooks
 * for projects. This file can be used as a guide for migrating existing components.
 * 
 * @module examples/ProjectsExample
 * @since 2026-01-31
 */

import React, { useState } from 'react';
import { 
  useProjects, 
  useProject, 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject 
} from '../hooks/queries';
import { ProjectFilters } from '../lib/api/projects';
import { PaginationParams } from '../lib/api/base';

/**
 * Example: Fetching Projects List
 */
export function ProjectsList() {
  const [filters] = useState<ProjectFilters>({
    status: ['active'],
    city: 'Lahore'
  });
  
  const { data, isLoading, error } = useProjects(filters, { page: 1, limit: 10 });

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Projects ({data?.total})</h1>
      {data?.data.map((project) => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
