# Quick Setup Guide

## 🚀 Get Started in 2 Minutes

This guide gets you up and running with Task A2 hooks and test infrastructure.

---

## Step 1: Install Dependencies (REQUIRED)

```bash
cd /path/to/wasilahfignew
npm install
```

**What this does**: Installs test framework (vitest) and testing libraries.

**Time**: ~10-20 seconds

---

## Step 2: Verify Everything Works

```bash
# Run tests
npm run test:run
```

**Expected output**: `✓ 17 tests passed`

```bash
# Verify build
npm run build
```

**Expected output**: `✓ built in ~7s`

---

## Step 3: Start Using the Hooks

### Import the hooks

```typescript
import { 
  useProjects, 
  useProject, 
  useCreateProject,
  useUpdateProject,
  useDeleteProject 
} from '@/hooks/queries';
```

### Example: Fetch projects

```tsx
function ProjectsList() {
  const { data, isLoading, error } = useProjects(
    { status: ['active'] },
    { page: 1, limit: 10 }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Projects ({data.total})</h1>
      {data.data.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Example: Create a project

```tsx
function CreateProject() {
  const createProject = useCreateProject({
    onSuccess: (project) => {
      toast.success('Project created!');
      navigate(`/projects/${project.id}`);
    }
  });

  return (
    <button onClick={() => createProject.mutate(formData)}>
      {createProject.isPending ? 'Creating...' : 'Create'}
    </button>
  );
}
```

---

## Step 4: Write Tests (Optional)

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { createQueryWrapper } from '../../../test/queryUtils';

describe('MyComponent', () => {
  it('should work', async () => {
    const { result } = renderHook(() => useProjects(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
```

---

## Available Commands

```bash
npm test              # Watch mode
npm run test:run      # Single run (CI)
npm run test:ui       # Visual UI
npm run test:coverage # Coverage report
npm run build         # Production build
npm run dev           # Development server
```

---

## Need Help?

- **API Reference**: `src/hooks/queries/README.md`
- **Examples**: `src/examples/ProjectsExample.tsx`
- **Testing Guide**: `TESTING.md`
- **Full Verification**: `VERIFICATION_REPORT.md`

---

## That's It! 🎉

You're ready to use the React Query hooks and test infrastructure.

**Key Points**:
- ✅ All hooks use React Query for caching
- ✅ Optimistic updates for mutations
- ✅ Full TypeScript support
- ✅ 17 tests all passing
- ✅ Comprehensive documentation
