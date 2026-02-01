/**
 * CSRF Integration Example
 * 
 * @fileoverview
 * Example demonstrating how to integrate CSRF protection with
 * existing React Query mutation hooks.
 * 
 * This example shows updating the useProjectMutations hook to
 * include CSRF protection for all state-changing operations.
 */

import { useCSRFMutation } from '../../hooks/useCSRFMutation';
import { useQueryClient } from '@tanstack/react-query';
import { projectsApi, Project, CreateProjectInput, UpdateProjectInput } from '../../lib/api/projects';

/**
 * Example: Create Project with CSRF Protection
 * 
 * This demonstrates how to add CSRF protection to an existing
 * mutation hook without major refactoring.
 */
export function useCreateProjectWithCSRF() {
  const queryClient = useQueryClient();
  
  return useCSRFMutation({
    // The mutation function remains unchanged
    mutationFn: async (input: CreateProjectInput) => {
      const response = await projectsApi.create(input);
      if (!response.success) {
        throw new Error(response.error || 'Failed to create project');
      }
      return response.data as Project;
    },
    
    // Add CSRF metadata
    method: 'POST',
    endpoint: '/api/projects',
    
    // Cache invalidation (same as before)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * Example: Update Project with CSRF Protection
 */
export function useUpdateProjectWithCSRF() {
  const queryClient = useQueryClient();
  
  return useCSRFMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: UpdateProjectInput }) => {
      const response = await projectsApi.update(id, updates);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update project');
      }
      return response.data as Project;
    },
    
    // Add CSRF metadata
    method: 'PUT',
    endpoint: (variables) => `/api/projects/${variables.id}`,
    
    // Optimistic updates (same as before)
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['projects', 'detail', id] });
      
      const previousProject = queryClient.getQueryData<Project>(['projects', 'detail', id]);
      
      if (previousProject) {
        queryClient.setQueryData<Project>(
          ['projects', 'detail', id],
          { ...previousProject, ...updates }
        );
      }
      
      return { previousProject };
    },
    
    onError: (_error, { id }, context) => {
      if (context?.previousProject) {
        queryClient.setQueryData(['projects', 'detail', id], context.previousProject);
      }
    },
    
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
    },
  });
}

/**
 * Example: Delete Project with CSRF Protection
 */
export function useDeleteProjectWithCSRF() {
  const queryClient = useQueryClient();
  
  return useCSRFMutation({
    mutationFn: async (projectId: string) => {
      const response = await projectsApi.delete(projectId);
      if (!response.success) {
        throw new Error(response.error || 'Failed to delete project');
      }
      return response.data;
    },
    
    // Add CSRF metadata
    method: 'DELETE',
    endpoint: (projectId) => `/api/projects/${projectId}`,
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * Example Component Using CSRF-Protected Mutations
 */
export function ProjectFormExample() {
  const createProject = useCreateProjectWithCSRF();
  const updateProject = useUpdateProjectWithCSRF();
  const deleteProject = useDeleteProjectWithCSRF();
  
  const handleCreate = () => {
    createProject.mutate(
      {
        title: 'New Project',
        description: 'Description',
        budget: 100000,
        // ... other fields
      },
      {
        onSuccess: (project) => {
          console.log('Project created:', project);
        },
        onError: (error: any) => {
          if (error.code === 'CSRF_TOKEN_MISSING') {
            alert('Session expired. Please refresh the page.');
          } else {
            alert('Failed to create project: ' + error.message);
          }
        },
      }
    );
  };
  
  const handleUpdate = (projectId: string) => {
    updateProject.mutate(
      {
        id: projectId,
        updates: {
          title: 'Updated Title',
        },
      },
      {
        onSuccess: () => {
          console.log('Project updated successfully');
        },
      }
    );
  };
  
  const handleDelete = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject.mutate(projectId, {
        onSuccess: () => {
          console.log('Project deleted successfully');
        },
      });
    }
  };
  
  return (
    <div>
      <button onClick={handleCreate} disabled={createProject.isPending}>
        {createProject.isPending ? 'Creating...' : 'Create Project'}
      </button>
      
      <button onClick={() => handleUpdate('project-123')} disabled={updateProject.isPending}>
        {updateProject.isPending ? 'Updating...' : 'Update Project'}
      </button>
      
      <button onClick={() => handleDelete('project-123')} disabled={deleteProject.isPending}>
        {deleteProject.isPending ? 'Deleting...' : 'Delete Project'}
      </button>
    </div>
  );
}

/**
 * Notes:
 * 
 * 1. The mutation logic remains unchanged
 * 2. Only need to add method and endpoint metadata
 * 3. CSRF token is automatically included
 * 4. Errors are automatically handled
 * 5. CSRF violations are automatically logged
 * 
 * Migration Process:
 * 1. Replace `useMutation` with `useCSRFMutation`
 * 2. Add `method` parameter
 * 3. Add `endpoint` parameter
 * 4. Test the mutation
 * 
 * That's it! The rest of the mutation logic stays the same.
 */
