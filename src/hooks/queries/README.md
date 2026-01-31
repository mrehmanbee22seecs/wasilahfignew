# Query Hooks - React Query Implementation

## Overview

This directory contains production-grade React Query hooks for managing all CRUD operations in the Wasilah application. These hooks provide automatic caching, optimistic updates, and comprehensive error handling.

## 📁 Files

### Projects (Task A2)
- **`useProjects.ts`** - Fetch projects list with filtering and pagination
- **`useProject.ts`** - Fetch a single project by ID
- **`useProjectMutations.ts`** - Create, update, and delete mutations

### Applications (Task A3)
- **`useApplications.ts`** - Fetch applications list with filtering
- **`useApplication.ts`** - Fetch a single application by ID
- **`useApplicationMutations.ts`** - Create, review, withdraw, and bulk operations

### Volunteers (Task A4)
- **`useVolunteersQuery.ts`** - Fetch volunteers list with filtering
- **`useVolunteer.ts`** - Fetch a single volunteer by ID
- **`useVolunteerMutations.ts`** - Update volunteer, log hours, and background checks

### Admin (Task A5)
- **`useAdmin.ts`** - Fetch platform stats, users, vetting queue, audit logs
- **`useAdminMutations.ts`** - User management, vetting operations, bulk actions

### Central Exports
- **`index.ts`** - Central export point for all hooks

## 🚀 Quick Start

### Installation

All dependencies are already installed (from Task A1):
- `@tanstack/react-query@5.90.20`
- `@tanstack/react-query-devtools@5.91.3`

### Basic Usage

```tsx
// Projects
import { useProjects, useProject, useCreateProject } from '@/hooks/queries';

// Applications
import { useApplications, useApplication, useCreateApplication } from '@/hooks/queries';

// Volunteers
import { useVolunteers, useVolunteer, useUpdateVolunteer } from '@/hooks/queries';

// Admin
import { usePlatformStats, useAllUsers, useUpdateUserRole } from '@/hooks/queries';

// In your component
function MyComponent() {
  const { data, isLoading, error } = useProjects();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.data.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

## 📖 API Reference

### useProjects

Fetch a list of projects with optional filtering and pagination.

```tsx
const { 
  data,        // PaginatedResponse<Project>
  isLoading,   // boolean
  error,       // Error | null
  refetch      // () => Promise<...>
} = useProjects(filters, pagination);
```

**Parameters:**
- `filters` (optional): `ProjectFilters` object
  - `status`: Array of project statuses
  - `corporate_id`: Filter by corporate ID
  - `ngo_id`: Filter by NGO ID
  - `city`: Filter by city
  - `province`: Filter by province
  - `sdg_goals`: Array of SDG goals
  - `search`: Search query string
  
- `pagination` (optional): `PaginationParams` object
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `sortBy`: Field to sort by
  - `sortOrder`: 'asc' or 'desc'

**Returns:**
- `data.data`: Array of projects
- `data.total`: Total number of projects
- `data.page`: Current page
- `data.totalPages`: Total pages

### useProject

Fetch a single project by ID.

```tsx
const { 
  data,        // Project
  isLoading,   // boolean
  error        // Error | null
} = useProject(projectId);
```

**Parameters:**
- `projectId`: string | null (query is disabled if null)

**Returns:**
- `data`: Project object with full details

### useCreateProject

Create a new project.

```tsx
const createProject = useCreateProject({
  onSuccess: (project) => {
    console.log('Created:', project.id);
  },
  onError: (error) => {
    console.error('Failed:', error.message);
  }
});

// Usage
createProject.mutate({
  title: 'New Project',
  description: 'Description',
  budget: 100000,
  // ... other required fields
});
```

**Options:**
- `onSuccess`: Callback when mutation succeeds
- `onError`: Callback when mutation fails
- `onSettled`: Callback when mutation completes (success or error)

**Mutation Object:**
- `mutate()`: Execute mutation
- `mutateAsync()`: Execute mutation and return Promise
- `isPending`: boolean
- `isError`: boolean
- `error`: Error | null

### useUpdateProject

Update an existing project with optimistic updates.

```tsx
const updateProject = useUpdateProject({
  onSuccess: () => console.log('Updated!')
});

// Usage
updateProject.mutate({
  id: 'project-123',
  updates: {
    title: 'New Title',
    status: 'active'
  }
});
```

**Parameters:**
- `id`: string - Project ID to update
- `updates`: Partial<Project> - Fields to update

**Features:**
- Optimistic updates (UI updates immediately)
- Automatic rollback on error
- Cache invalidation

### useDeleteProject

Delete a project with optimistic cache removal.

```tsx
const deleteProject = useDeleteProject({
  onSuccess: () => console.log('Deleted!')
});

// Usage
if (confirm('Delete?')) {
  deleteProject.mutate('project-123');
}
```

**Parameters:**
- `projectId`: string - Project ID to delete

**Features:**
- Optimistic cache removal
- Automatic rollback on error
- Cache invalidation

## 🎯 Features

### Automatic Caching
- Data cached for 5 minutes (staleTime)
- Background refetch when data becomes stale
- Garbage collected after 10 minutes of inactivity

### Optimistic Updates
- Mutations update UI immediately
- Automatic rollback on error
- Cache synchronization on success

### Error Handling
- Automatic retry on failure (1 attempt)
- Type-safe error objects
- Custom error callbacks

### Cache Invalidation
- Create: Invalidates project lists
- Update: Updates detail cache + invalidates lists
- Delete: Removes from cache + invalidates lists

## 🔄 Migration Guide

### Old Pattern (src/hooks/useProjects.ts)

```tsx
const { projects, loading, error, refetch } = useProjects(filters);
```

### New Pattern (src/hooks/queries/useProjects.ts)

```tsx
const { data, isLoading, error, refetch } = useProjects(filters, pagination);
// Access: data.data, data.total, data.page
```

### Key Differences

1. **Loading State**: `loading` → `isLoading`
2. **Data Structure**: `projects` → `data.data` (PaginatedResponse)
3. **Caching**: Automatic caching with background refetch
4. **Granular States**: `isLoading`, `isFetching`, `isRefetching`
5. **Mutations**: Separate hooks with optimistic updates

## 📝 Examples

See `src/examples/ProjectsExample.tsx` for complete usage examples:
- Fetching projects list
- Fetching single project
- Creating a project
- Updating a project
- Deleting a project
- Complete CRUD component

## 🔍 Testing

The project uses React Query's built-in caching and testing utilities. Tests can be found in:

### Projects (Task A2)
- `src/hooks/queries/__tests__/useProjects.test.ts`
- `src/hooks/queries/__tests__/useProject.test.ts`
- `src/hooks/queries/__tests__/useProjectMutations.test.ts`

### Applications (Task A3)
- `src/hooks/queries/__tests__/useApplications.test.ts`
- `src/hooks/queries/__tests__/useApplication.test.ts`
- `src/hooks/queries/__tests__/useApplicationMutations.test.ts`

### Volunteers (Task A4)
- `src/hooks/queries/__tests__/useVolunteersQuery.test.ts`
- `src/hooks/queries/__tests__/useVolunteer.test.ts`
- `src/hooks/queries/__tests__/useVolunteerMutations.test.ts`

### Admin (Task A5)
- `src/hooks/queries/__tests__/useAdmin.test.ts`
- `src/hooks/queries/__tests__/useAdminMutations.test.ts`

**Total Tests**: 86 tests across 11 test files

## 🐛 Debugging

### React Query DevTools

The DevTools are included in development mode:
1. Look for the React Query icon in the bottom corner
2. Click to open the DevTools panel
3. View cache status, active queries, and mutations

### Common Issues

**Query not fetching:**
- Check if `enabled` option is true
- Verify projectId is not null for useProject

**Stale data:**
- Data is cached for 5 minutes by default
- Use `refetch()` to force update
- Or adjust `staleTime` in query options

**Mutations not updating cache:**
- Check cache invalidation in onSuccess
- Verify query keys match
- Check optimistic update logic

## 🎨 Best Practices

1. **Always handle loading states**
   ```tsx
   if (isLoading) return <Spinner />;
   ```

2. **Handle errors gracefully**
   ```tsx
   if (error) return <ErrorMessage error={error} />;
   ```

3. **Use callbacks for side effects**
   ```tsx
   useCreateProject({
     onSuccess: () => navigate('/projects'),
     onError: (err) => toast.error(err.message)
   });
   ```

4. **Leverage optimistic updates**
   - Mutations update UI immediately
   - Automatic rollback on error
   - Better user experience

5. **Use query keys consistently**
   - Follow the pattern: ['entity', 'action', ...params]
   - Example: ['projects', 'list', filters, pagination]

## 📚 Resources

- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Error Handling](https://tanstack.com/query/latest/docs/react/guides/query-retries)

## ⏱️ Time Estimates

### Task A2 - Projects
- **useProjects.ts**: 30-45 minutes
- **useProject.ts**: 20-30 minutes
- **useProjectMutations.ts**: 45-60 minutes

### Task A3 - Applications
- Similar to A2: ~2-3 hours

### Task A4 - Volunteers
- Similar to A2: ~2-3 hours

### Task A5 - Admin
- **useAdmin.ts**: 45-60 minutes (5 query hooks)
- **useAdminMutations.ts**: 60-90 minutes (11 mutation hooks)
- **Tests**: 30-40 minutes

**Total for all tasks**: ~10-12 hours

## 📄 License

Part of the Wasilah project - internal use only.

---

**Last Updated**: 2026-01-31  
**Author**: GitHub Copilot  
**Version**: 1.0.0
