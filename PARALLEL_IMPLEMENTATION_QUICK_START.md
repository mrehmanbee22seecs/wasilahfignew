# Quick Start Guide: Parallel React Query Implementation

## 🎯 TL;DR

**YES, you can work on Tasks A3, A4, and A5 in parallel!**

This guide provides the essential information to get started quickly. For comprehensive details, see [REACT_QUERY_PARALLELIZATION_ASSESSMENT.md](./REACT_QUERY_PARALLELIZATION_ASSESSMENT.md).

---

## Task Assignments

| Task | Team/Developer | Files to Create | Domain |
|------|----------------|-----------------|--------|
| **A3** | Team Alpha | `useApplications.ts`, `useApplication.ts`, `useApplicationMutations.ts`, `useVolunteers.ts`, `useVolunteer.ts`, `useVolunteerMutations.ts` | Applications & Volunteers |
| **A4** | Team Beta | `usePayments.ts`, `usePayment.ts`, `usePaymentMutations.ts`, `useOrganizations.ts`, `useOrganization.ts`, `useOrganizationMutations.ts` | Payments & Organizations |
| **A5** | Team Gamma | `useAdminStats.ts`, `useVettingQueue.ts`, `useAuditLogs.ts`, `useAdminMutations.ts` | Admin Operations |

---

## Before You Start

### 1. Review Existing Implementation (A2)

```bash
# Look at these files to understand the pattern:
src/hooks/queries/useProjects.ts
src/hooks/queries/useProject.ts
src/hooks/queries/useProjectMutations.ts
src/hooks/queries/queryKeys.ts  # ← IMPORTANT: Use this!
```

### 2. Create Your Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/A3-applications-volunteers-queries  # Or A4/A5
```

### 3. Review the Query Keys Factory

**CRITICAL**: All hooks MUST use `queryKeys` from `./queryKeys.ts`

```typescript
// ✅ CORRECT
import { queryKeys } from './queryKeys';

const { data } = useQuery({
  queryKey: queryKeys.applications.list(filters),
  queryFn: () => fetchApplications(filters)
});

// ❌ WRONG - Don't do this!
const { data } = useQuery({
  queryKey: ['applications', 'list', filters],  // Hardcoded!
  queryFn: () => fetchApplications(filters)
});
```

---

## Development Checklist

### For Each Hook You Create

- [ ] Import and use `queryKeys` from `./queryKeys.ts`
- [ ] Follow the pattern from `useProjects.ts` / `useProject.ts`
- [ ] Add comprehensive JSDoc comments
- [ ] Export TypeScript types
- [ ] Use the existing API modules (`src/lib/api/`)
- [ ] Add to `index.ts` (your exports section)
- [ ] Document in `README.md` (your assigned section)

---

## Query Keys: Your Domain

### Task A3 - Applications & Volunteers

```typescript
import { queryKeys } from './queryKeys';

// Applications
queryKeys.applications.all              // ['applications']
queryKeys.applications.list(filters)    // ['applications', 'list', filters]
queryKeys.applications.detail(id)       // ['applications', 'detail', id]
queryKeys.applications.byVolunteer(id)  // ['applications', 'by-volunteer', id, ...]
queryKeys.applications.byProject(id)    // ['applications', 'by-project', id, ...]

// Volunteers
queryKeys.volunteers.all                 // ['volunteers']
queryKeys.volunteers.list(filters)       // ['volunteers', 'list', filters]
queryKeys.volunteers.detail(id)          // ['volunteers', 'detail', id]
queryKeys.volunteers.applications(id)    // ['volunteers', 'detail', id, 'applications']
```

### Task A4 - Payments & Organizations

```typescript
import { queryKeys } from './queryKeys';

// Payments
queryKeys.payments.all                    // ['payments']
queryKeys.payments.list(filters)          // ['payments', 'list', filters]
queryKeys.payments.detail(id)             // ['payments', 'detail', id]
queryKeys.payments.byCorporate(id)        // ['payments', 'by-corporate', id, ...]
queryKeys.payments.byProject(id)          // ['payments', 'by-project', id, ...]

// Organizations (NGOs)
queryKeys.organizations.all               // ['organizations']
queryKeys.organizations.list(filters)     // ['organizations', 'list', filters]
queryKeys.organizations.detail(id)        // ['organizations', 'detail', id]
queryKeys.organizations.projects(id)      // ['organizations', 'detail', id, 'projects', ...]
```

### Task A5 - Admin Operations

```typescript
import { queryKeys } from './queryKeys';

// Admin
queryKeys.admin.stats()                   // ['admin', 'stats']
queryKeys.admin.vettingQueue(filters)     // ['admin', 'vetting-queue', filters]
queryKeys.admin.vettingItem(id)           // ['admin', 'vetting-queue', id]
queryKeys.admin.auditLogs(filters)        // ['admin', 'audit-logs', filters]
queryKeys.admin.users(filters)            // ['admin', 'users', filters]
queryKeys.admin.user(userId)              // ['admin', 'users', userId]
```

---

## Shared Files: Coordination Required

### ⚠️ `index.ts` - Add Your Exports

```typescript
// src/hooks/queries/index.ts

// Projects (A2) - Already exists
export { useProjects } from './useProjects';
export { useProject } from './useProject';
export { useProjectMutations } from './useProjectMutations';

// ========================================
// A3: ADD YOUR EXPORTS HERE
// ========================================
export { useApplications } from './useApplications';
export { useApplication } from './useApplication';
// ... etc

// ========================================
// A4: ADD YOUR EXPORTS HERE
// ========================================
export { usePayments } from './usePayments';
// ... etc

// ========================================
// A5: ADD YOUR EXPORTS HERE
// ========================================
export { useAdminStats } from './useAdminStats';
// ... etc
```

### ⚠️ `README.md` - Your Documentation Section

**Assigned Sections:**
- **A3**: Lines 400-700
- **A4**: Lines 700-1000
- **A5**: Lines 1000-1300

Add your hook documentation in your assigned section following the A2 pattern.

---

## DO NOT Modify These Files

🚫 **Locked Files** (read-only during A3/A4/A5):

- `src/lib/queryClient.ts` - Already configured
- `src/lib/api/base.ts` - Stable utilities
- `src/contexts/QueryProvider.tsx` - Already set up

If you think you need to modify these, discuss with all teams first!

---

## API Modules You'll Use

### Task A3

```typescript
// Already exist - just use them:
import { applicationsApi } from '@/lib/api/applications';
import { volunteersApi } from '@/lib/api/volunteers';
```

### Task A4

```typescript
// Already exist - just use them:
import { paymentsApi } from '@/lib/api/payments';
import { ngosApi } from '@/lib/api/ngos';
```

### Task A5

```typescript
// Already exist - just use them:
import { adminApi } from '@/lib/api/admin';
```

---

## Hook Template

Copy this template for each hook:

```typescript
/**
 * useEntityName Hook - React Query Hook for Entity List
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching entities.
 * Provides automatic caching, background refetching, error handling.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on mount/reconnect
 * - Filter support
 * - Type-safe with full TypeScript support
 * 
 * ## Usage:
 * 
 * ```tsx
 * const { data, isLoading, error } = useEntityName(filters);
 * 
 * if (isLoading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 * return <EntityList data={data} />;
 * ```
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { entityApi } from '@/lib/api/entity';
import { queryKeys } from './queryKeys';

export function useEntityName(
  filters: EntityFilters = {}
): UseQueryResult<EntityResponse, Error> {
  return useQuery<EntityResponse, Error>({
    queryKey: queryKeys.entity.list(filters),
    queryFn: async () => {
      const response = await entityApi.list(filters);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch entities');
      }
      
      return response.data;
    },
  });
}
```

---

## Testing Your Work

```bash
# Build check
npm run build

# If tests exist
npm test

# If dev server
npm run dev
```

All should pass before creating PR!

---

## Merge Strategy

### Recommended: Sequential Merge

1. **A3 completes first** → Create PR → Review → Merge
2. **A4 rebases on main** → Create PR → Review → Merge
3. **A5 rebases on main** → Create PR → Review → Merge

### When Rebasing

```bash
git checkout main
git pull origin main
git checkout feature/A4-payments-organizations-queries
git rebase main

# Resolve conflicts in:
# - src/hooks/queries/index.ts (just add your exports)
# - src/hooks/queries/README.md (just add your docs)

git push --force-with-lease
```

---

## Common Pitfalls to Avoid

### ❌ Don't hardcode query keys
```typescript
// WRONG
queryKey: ['applications', 'list', filters]
```

### ✅ Use queryKeys factory
```typescript
// CORRECT
queryKey: queryKeys.applications.list(filters)
```

---

### ❌ Don't invalidate other domains' caches
```typescript
// WRONG - A3 team invalidating projects
queryClient.invalidateQueries({ queryKey: ['projects'] });
```

### ✅ Only invalidate your domain
```typescript
// CORRECT - A3 team invalidating applications
queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
```

---

### ❌ Don't modify shared config files
```typescript
// WRONG - changing QueryClient config
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // DON'T CHANGE THIS!
    }
  }
});
```

### ✅ Use existing configuration
```typescript
// CORRECT - just import and use
import { queryClient } from '@/lib/queryClient';
```

---

## Daily Sync Questions

Quick 15-minute daily standup:

1. What files are you working on today?
2. Any planned changes to shared files (index.ts, README.md)?
3. When do you expect to complete your task?
4. Any blockers or conflicts with other teams?

---

## Need Help?

1. **Pattern questions**: Look at `useProjects.ts`, `useProject.ts`, `useProjectMutations.ts`
2. **Query keys**: Check `queryKeys.ts` - all domains are pre-defined
3. **API calls**: Check `src/lib/api/` - your API module already exists
4. **Detailed info**: Read `REACT_QUERY_PARALLELIZATION_ASSESSMENT.md`

---

## Success Criteria

Before creating your PR:

- [ ] All hooks use queryKeys factory
- [ ] JSDoc documentation is complete
- [ ] TypeScript types are exported
- [ ] Exports added to index.ts
- [ ] Documentation added to README.md
- [ ] Build passes (`npm run build`)
- [ ] No TypeScript errors
- [ ] Only modified files in your domain (+ index.ts, README.md)

---

## Time Estimates

Based on A2 completion:

- **useEntities** (list query): ~30-45 minutes
- **useEntity** (detail query): ~20-30 minutes
- **useEntityMutations** (CRUD mutations): ~45-60 minutes
- **Documentation**: ~30 minutes
- **Tests** (if needed): ~30-45 minutes

**Total per domain**: ~2.5-3 hours

---

## Questions?

- Slack: #react-query-hooks channel
- Review: `REACT_QUERY_PARALLELIZATION_ASSESSMENT.md`
- Example: `src/hooks/queries/useProjects.ts`

**Good luck! 🚀**
