# React Query Hooks Parallelization Assessment

## Executive Summary

**Recommendation: Tasks A3, A4, and A5 CAN be executed in PARALLEL** ✅

After thorough analysis of the Wasilah CSR Platform codebase, these three React Query hook implementation tasks can be safely developed simultaneously by different developers/teams. While there are some shared resources, they are primarily read-only dependencies (types, base utilities, QueryClient configuration) that do not conflict during parallel development.

---

## Assessment Context

### Background
- **Task A1** (Query Foundation) and **Task A2** (Project Query Hooks) are already complete
- QueryClient is configured at `src/lib/queryClient.ts` with standard settings
- API layer exists at `src/lib/api/` with entity-specific modules
- Type definitions exist at `src/types/` for all domains

### Tasks Under Assessment

| Task | Scope | Primary Files |
|------|-------|---------------|
| **A3** | Applications & Volunteers Query Hooks | `src/hooks/queries/useApplications.ts`, `useVolunteers.ts`, `useApplicationMutations.ts`, `useVolunteerMutations.ts` |
| **A4** | Payments & Organizations Query Hooks | `src/hooks/queries/usePayments.ts`, `useOrganizations.ts`, `usePaymentMutations.ts`, `useOrganizationMutations.ts` |
| **A5** | Admin Operations Query Hooks | `src/hooks/queries/useAdmin.ts`, `useVettingQueue.ts`, `useAuditLogs.ts`, `useAdminMutations.ts` |

---

## Dependency Analysis

### ✅ Separate API Modules (No Conflicts)

Each task operates on distinct API modules:

```
Task A3 → src/lib/api/applications.ts (191 lines)
       → src/lib/api/volunteers.ts (248 lines)

Task A4 → src/lib/api/payments.ts (193 lines)
       → src/lib/api/ngos.ts (255 lines)

Task A5 → src/lib/api/admin.ts (255 lines)
```

**Analysis**: These API files are independent and do not import from each other. Each can be enhanced or modified without affecting the others.

### ✅ Separate Type Definitions (Low Conflict)

Type files are also separate:

```
Task A3 → src/types/volunteer.ts (388 lines)
       → src/types/volunteer-verification.ts

Task A4 → src/types/ngo-payments.ts (99 lines)
       → src/types/ngo.ts

Task A5 → (Uses types from admin.ts API, may need new admin-specific types)
```

**Analysis**: Type files are read-only during hook development. If new types are needed, they should be added to existing files following the pattern already established.

### ⚠️ Shared Resources (Requires Coordination)

The following files are shared across all tasks:

#### 1. **QueryClient Configuration** (`src/lib/queryClient.ts`)
- **Current State**: 28 lines, fully configured
- **Usage**: Import-only, no modifications needed
- **Conflict Risk**: ⚠️ LOW - Teams only import this file, not modify it
- **Recommendation**: Lock this file - no changes during A3/A4/A5

#### 2. **Base API Utilities** (`src/lib/api/base.ts`)
- **Current State**: 178 lines with `ApiResponse`, `PaginationParams`, error handling
- **Usage**: Imported by all API modules
- **Conflict Risk**: ⚠️ LOW - Provides stable utilities
- **Recommendation**: Lock this file - no changes during A3/A4/A5

#### 3. **Query Hooks Index** (`src/hooks/queries/index.ts`)
- **Current State**: 33 lines, exports from useProjects hooks
- **Usage**: Central export point for all query hooks
- **Conflict Risk**: ⚠️ MEDIUM - All three tasks will add exports here
- **Recommendation**: Use separate branches and merge carefully (see strategy below)

#### 4. **Documentation** (`src/hooks/queries/README.md`)
- **Current State**: ~350 lines documenting Project hooks
- **Usage**: Each task will add their hook documentation
- **Conflict Risk**: ⚠️ MEDIUM - All three tasks will modify this file
- **Recommendation**: Each task documents in separate sections

### 🔍 Cross-Domain Dependencies

#### Admin Operations References Other Domains

The `admin.ts` API includes aggregations from other domains:

```typescript
// From src/lib/api/admin.ts getPlatformStats()
const [usersRes, projectsRes, ngosRes, volunteersRes, hoursRes] = await Promise.all([
  supabase.from('users').select('id, role, last_login_at'),
  supabase.from('projects').select('id, status, budget'),
  supabase.from('organizations').select('id, verification_status').eq('type', 'ngo'),
  supabase.from('profiles').select('id').eq('role', 'volunteer'),
  supabase.from('volunteer_hours').select('hours').eq('status', 'approved'),
]);
```

**Analysis**: Admin hooks read from other domains but do not modify them. This is a one-way dependency that does not block parallelization.

#### Vetting Queue Touches Multiple Entity Types

```typescript
entity_type: 'ngo' | 'volunteer' | 'project' | 'document'
```

**Analysis**: Admin vetting operations touch multiple domains, but as read-only aggregations. No blocking conflicts.

---

## Parallelization Feasibility

### ✅ CAN Parallelize

| Factor | Assessment | Explanation |
|--------|------------|-------------|
| **Separate Code Files** | ✅ Yes | Each task creates new files in `src/hooks/queries/` |
| **Distinct API Modules** | ✅ Yes | No cross-imports between applications, volunteers, payments, ngos, admin |
| **Separate Types** | ✅ Yes | Type files are domain-specific |
| **Independent Tests** | ✅ Yes | Test files will be in separate `__tests__/` subdirectories |
| **No Shared State** | ✅ Yes | Each domain has independent cache keys |
| **Database Independence** | ✅ Yes | Each domain queries different tables |

### ⚠️ Requires Coordination

| Resource | Why | Mitigation Strategy |
|----------|-----|---------------------|
| **index.ts exports** | All tasks add exports | Use git merge + manual review |
| **README.md** | All tasks document hooks | Assign sections (A3: lines 400-600, A4: lines 600-800, A5: lines 800-1000) |
| **Query key patterns** | Need consistency | Establish convention upfront (see below) |

---

## Recommended Strategy

### Branch Management

Use **feature branches** with clear naming:

```bash
# Task A3
feature/A3-applications-volunteers-queries

# Task A4
feature/A4-payments-organizations-queries

# Task A5
feature/A5-admin-operations-queries
```

### Development Order (Parallel Execution)

**Week 1-2: All teams start simultaneously**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Team A3       │  │   Team A4       │  │   Team A5       │
│                 │  │                 │  │                 │
│ Applications    │  │ Payments        │  │ Admin Stats     │
│ Volunteers      │  │ Organizations   │  │ Vetting Queue   │
│                 │  │ (NGOs)          │  │ Audit Logs      │
└─────────────────┘  └─────────────────┘  └─────────────────┘
        │                    │                    │
        └────────────────────┴────────────────────┘
                             │
                    Merge to main (coordinated)
```

### Merge Strategy

**Option 1: Sequential Merge (Recommended)**
```
1. A3 completes → PR review → Merge to main
2. A4 rebases on main → PR review → Merge to main  
3. A5 rebases on main → PR review → Merge to main
```

**Option 2: Simultaneous Merge (Advanced)**
```
1. All tasks complete around same time
2. Coordinate merge window (1-2 hour period)
3. First merge: A3 (smallest changes to index.ts)
4. Quick rebase: A4 pulls main, resolves conflicts
5. Quick rebase: A5 pulls main, resolves conflicts
6. All three merged within 2 hours
```

---

## Query Key Naming Convention

**Critical for avoiding cache conflicts**

Establish these conventions BEFORE starting:

```typescript
// Task A3: Applications & Volunteers
['applications', 'list', filters]
['applications', 'detail', id]
['volunteers', 'list', filters]
['volunteers', 'detail', id]

// Task A4: Payments & Organizations
['payments', 'list', filters]
['payments', 'detail', id]
['organizations', 'list', filters]
['organizations', 'detail', id]

// Task A5: Admin Operations
['admin', 'stats']
['admin', 'vetting-queue', filters]
['admin', 'audit-logs', filters]
['admin', 'users', filters]
```

**Pattern**: `[domain, operation, ...params]`

This ensures no cache key collisions between tasks.

---

## File Structure Convention

Each task should follow the A2 pattern:

```
src/hooks/queries/
├── useProjects.ts              # ✅ A2 (existing)
├── useProject.ts               # ✅ A2 (existing)
├── useProjectMutations.ts      # ✅ A2 (existing)
│
├── useApplications.ts          # 🆕 A3
├── useApplication.ts           # 🆕 A3
├── useApplicationMutations.ts  # 🆕 A3
├── useVolunteers.ts            # 🆕 A3
├── useVolunteer.ts             # 🆕 A3
├── useVolunteerMutations.ts    # 🆕 A3
│
├── usePayments.ts              # 🆕 A4
├── usePayment.ts               # 🆕 A4
├── usePaymentMutations.ts      # 🆕 A4
├── useOrganizations.ts         # 🆕 A4
├── useOrganization.ts          # 🆕 A4
├── useOrganizationMutations.ts # 🆕 A4
│
├── useAdminStats.ts            # 🆕 A5
├── useVettingQueue.ts          # 🆕 A5
├── useAuditLogs.ts             # 🆕 A5
├── useAdminMutations.ts        # 🆕 A5
│
├── __tests__/
│   ├── useApplications.test.ts       # 🆕 A3
│   ├── useVolunteers.test.ts         # 🆕 A3
│   ├── usePayments.test.ts           # 🆕 A4
│   ├── useOrganizations.test.ts      # 🆕 A4
│   ├── useAdminStats.test.ts         # 🆕 A5
│   └── useVettingQueue.test.ts       # 🆕 A5
│
├── index.ts                    # ⚠️ SHARED - careful merge
└── README.md                   # ⚠️ SHARED - careful merge
```

---

## Conflict Resolution Guidelines

### index.ts Merge Conflicts

**Before (A2 only):**
```typescript
// src/hooks/queries/index.ts
export { useProjects } from './useProjects';
export { useProject } from './useProject';
export { useProjectMutations } from './useProjectMutations';
```

**After (A3, A4, A5 all merged):**
```typescript
// src/hooks/queries/index.ts

// Projects (A2)
export { useProjects } from './useProjects';
export { useProject } from './useProject';
export { useProjectMutations } from './useProjectMutations';

// Applications & Volunteers (A3)
export { useApplications } from './useApplications';
export { useApplication } from './useApplication';
export { useApplicationMutations } from './useApplicationMutations';
export { useVolunteers } from './useVolunteers';
export { useVolunteer } from './useVolunteer';
export { useVolunteerMutations } from './useVolunteerMutations';

// Payments & Organizations (A4)
export { usePayments } from './usePayments';
export { usePayment } from './usePayment';
export { usePaymentMutations } from './usePaymentMutations';
export { useOrganizations } from './useOrganizations';
export { useOrganization } from './useOrganization';
export { useOrganizationMutations } from './useOrganizationMutations';

// Admin Operations (A5)
export { useAdminStats } from './useAdminStats';
export { useVettingQueue } from './useVettingQueue';
export { useAuditLogs } from './useAuditLogs';
export { useAdminMutations } from './useAdminMutations';
```

**Resolution**: Simple append - each team adds their exports in their domain section.

### README.md Merge Conflicts

**Strategy**: Assign line ranges upfront

```markdown
# React Query Hooks Documentation

## Project Hooks (Lines 1-400) - A2 ✅
[Existing content for Projects]

## Applications & Volunteers Hooks (Lines 400-700) - A3 🆕
### useApplications
[A3 team documents here]

### useVolunteers  
[A3 team documents here]

## Payments & Organizations Hooks (Lines 700-1000) - A4 🆕
### usePayments
[A4 team documents here]

### useOrganizations
[A4 team documents here]

## Admin Operations Hooks (Lines 1000-1300) - A5 🆕
### useAdminStats
[A5 team documents here]

### useVettingQueue
[A5 team documents here]
```

**Resolution**: If conflicts occur, each team owns their section - simple copy/paste to resolve.

---

## Best Practices for Minimizing Conflicts

### 1. **Lock Shared Configuration Files**

Do NOT modify during A3/A4/A5:
- `src/lib/queryClient.ts` ✋
- `src/lib/api/base.ts` ✋
- `src/contexts/QueryProvider.tsx` ✋

If modifications are truly needed, discuss with all teams first.

### 2. **DRY Principle for Query Keys**

Create a query key factory file **before starting**:

```typescript
// src/hooks/queries/queryKeys.ts (create this first)

export const queryKeys = {
  // Projects (A2)
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },
  
  // Applications (A3)
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.applications.lists(), filters] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
  },
  
  // Volunteers (A3)
  volunteers: {
    all: ['volunteers'] as const,
    lists: () => [...queryKeys.volunteers.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.volunteers.lists(), filters] as const,
    details: () => [...queryKeys.volunteers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.volunteers.details(), id] as const,
  },
  
  // Payments (A4)
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.payments.lists(), filters] as const,
    details: () => [...queryKeys.payments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.payments.details(), id] as const,
  },
  
  // Organizations (A4)
  organizations: {
    all: ['organizations'] as const,
    lists: () => [...queryKeys.organizations.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.organizations.lists(), filters] as const,
    details: () => [...queryKeys.organizations.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.organizations.details(), id] as const,
  },
  
  // Admin (A5)
  admin: {
    all: ['admin'] as const,
    stats: () => [...queryKeys.admin.all, 'stats'] as const,
    vettingQueue: (filters: any) => [...queryKeys.admin.all, 'vetting-queue', filters] as const,
    auditLogs: (filters: any) => [...queryKeys.admin.all, 'audit-logs', filters] as const,
  },
};
```

**Benefit**: Each team adds their section to this file. Merge conflicts are isolated to their domain section.

### 3. **Consistent Type Safety Patterns**

All hooks should export return types:

```typescript
// Example from useProjects (A2)
export type UseProjectsReturn = {
  data: PaginatedResponse<Project> | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useProjects(
  filters?: ProjectFilters,
  pagination?: PaginationParams
): UseProjectsReturn {
  // implementation
}
```

Each team follows this pattern for their hooks.

### 4. **Test Independence**

Each task's tests should:
- Use separate test databases/mocks
- Not share test fixtures with other tasks
- Mock the QueryClient per test suite
- Follow naming: `useEntityName.test.ts`

### 5. **Documentation Standards**

Each hook should have JSDoc following the A2 pattern:

```typescript
/**
 * useApplications Hook - React Query Hook for Applications List
 * 
 * @fileoverview
 * Production-grade React Query hook for fetching and managing volunteer applications.
 * Provides automatic caching, background refetching, error handling, and filter support.
 * 
 * ## Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on mount/reconnect
 * - Filter support (status, volunteer_id, project_id, date range)
 * - Pagination support with cursor-based loading
 * - Type-safe with full TypeScript support
 * 
 * ## Usage:
 * 
 * ```tsx
 * const { data, isLoading, error } = useApplications({
 *   status: ['pending', 'approved'],
 *   volunteer_id: 'user-123'
 * });
 * ```
 */
```

---

## Risk Assessment

### Low Risk ✅

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Type conflicts | Low | Low | Types are domain-specific |
| API conflicts | Low | Low | Separate API modules |
| Test conflicts | Low | Low | Separate test files |
| Cache key collisions | Low | Medium | Use queryKeys factory |

### Medium Risk ⚠️

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| index.ts merge conflicts | High | Low | Sequential merge or coordination |
| README.md merge conflicts | High | Low | Assign sections upfront |
| Inconsistent patterns | Medium | Medium | Code review before merge |
| Query key inconsistency | Medium | High | Create queryKeys.ts first |

### High Risk ❌

None identified. All risks are manageable with proper coordination.

---

## Success Criteria

### For Parallelization to Succeed

1. ✅ **No Breaking Changes**: Existing A2 hooks continue working
2. ✅ **Type Safety**: All new hooks are fully type-safe
3. ✅ **Test Coverage**: Each task has comprehensive tests
4. ✅ **Documentation**: Each hook is well-documented
5. ✅ **No Cache Conflicts**: Query keys follow the established pattern
6. ✅ **Build Passes**: `npm run build` succeeds after all merges
7. ✅ **No Runtime Errors**: App runs without console errors

### Merge Acceptance Criteria

Before merging any task (A3, A4, or A5):

- [ ] All new hooks follow the A2 pattern
- [ ] Query keys use the queryKeys factory
- [ ] JSDoc documentation is complete
- [ ] Tests are passing (if test infrastructure exists)
- [ ] README section is complete
- [ ] index.ts exports are added
- [ ] No modifications to shared config files
- [ ] Types are exported properly
- [ ] Build passes locally
- [ ] No TypeScript errors

---

## Coordination Checklist

### Before Starting (All Teams)

- [ ] Review this assessment document
- [ ] Create `queryKeys.ts` factory (one person, merge first)
- [ ] Agree on query key naming convention
- [ ] Assign README.md sections
- [ ] Set up feature branches
- [ ] Schedule daily sync meetings (15 min)

### During Development (Each Team)

- [ ] Follow the A2 pattern for hook structure
- [ ] Use queryKeys factory for all cache keys
- [ ] Document hooks with JSDoc
- [ ] Add tests (if vitest configured)
- [ ] Only modify files in your domain
- [ ] Do not modify shared config files

### Before Merge (Each Team)

- [ ] Run `npm run build` - ensure no errors
- [ ] Review index.ts changes
- [ ] Review README.md changes
- [ ] Ensure all exports are present
- [ ] Coordinate with other teams on merge timing

### After First Merge (Remaining Teams)

- [ ] Pull latest main branch
- [ ] Rebase feature branch on main
- [ ] Resolve any conflicts (likely in index.ts, README.md)
- [ ] Re-run build and tests
- [ ] Submit PR

---

## Timeline Estimation

### Parallel Execution (Recommended)

```
Week 1-2: All teams develop simultaneously
├─ A3: Applications & Volunteers (2 weeks)
├─ A4: Payments & Organizations (2 weeks)
└─ A5: Admin Operations (2 weeks)

Week 3: Sequential merging & integration
├─ Day 1: A3 merge to main
├─ Day 2: A4 rebase & merge to main
├─ Day 3: A5 rebase & merge to main
├─ Day 4-5: Integration testing

Total: 3 weeks (vs. 6-8 weeks sequential)
```

### Sequential Execution (Conservative)

```
Week 1-2: A3 (Applications & Volunteers)
Week 3-4: A4 (Payments & Organizations)
Week 5-6: A5 (Admin Operations)
Week 7: Integration testing

Total: 7 weeks
```

**Time Savings**: Parallel execution saves ~4 weeks (57% reduction)

---

## Gotchas & Edge Cases

### 1. **Admin Queries Aggregate Other Domains**

```typescript
// Admin stats query reads from multiple domains
const stats = await adminApi.getPlatformStats();
// Returns: users, projects, ngos, volunteers, hours
```

**Gotcha**: If A3 or A4 change their database schema, A5 admin queries might break.

**Solution**: Admin queries should use the API layer, not direct DB queries. This decouples dependencies.

### 2. **Volunteer Applications Bridge Volunteers and Projects**

```typescript
// Application links volunteer to project
interface VolunteerApplication {
  volunteer_id: string;
  project_id: string;
  // ...
}
```

**Gotcha**: A3 might invalidate project cache when application status changes.

**Solution**: A3 should invalidate ONLY application and volunteer caches, not project caches. Projects are managed by A2.

### 3. **Payment Approvals Link Projects and Corporates**

```typescript
// Payment links project to corporate
interface PaymentApproval {
  project_id: string;
  corporate_id: string;
  // ...
}
```

**Gotcha**: A4 might invalidate project or corporate caches unnecessarily.

**Solution**: A4 should invalidate ONLY payment caches, not project or corporate caches.

### 4. **Organizations vs NGOs Terminology**

The codebase uses both terms:
- `src/lib/api/ngos.ts` (API module)
- `organizations` (database table)
- Type: `NGO` interface

**Gotcha**: Confusion over naming in hooks.

**Solution**: Use consistent naming in hooks:
- **External API**: `useOrganizations` (user-facing)
- **Internal**: Uses `ngos` API module

---

## Post-Merge Integration Testing

After all three tasks are merged:

### 1. **Smoke Test All Hooks**

```typescript
// Create integration test
import { renderHook } from '@testing-library/react-hooks';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

// Test A2
const { result: projects } = renderHook(() => useProjects(), { wrapper });
// Test A3
const { result: applications } = renderHook(() => useApplications(), { wrapper });
const { result: volunteers } = renderHook(() => useVolunteers(), { wrapper });
// Test A4
const { result: payments } = renderHook(() => usePayments(), { wrapper });
const { result: organizations } = renderHook(() => useOrganizations(), { wrapper });
// Test A5
const { result: adminStats } = renderHook(() => useAdminStats(), { wrapper });
```

### 2. **Cache Invalidation Test**

Verify that mutations properly invalidate related queries:

```typescript
// Create application → invalidates applications list
const { mutate: createApp } = useApplicationMutations();
createApp(newApp);
// Should trigger refetch of useApplications

// Approve payment → invalidates payments list
const { mutate: approvePayment } = usePaymentMutations();
approvePayment(paymentId);
// Should trigger refetch of usePayments
```

### 3. **No Query Key Conflicts**

```typescript
// Ensure no cache key collisions
const cache = queryClient.getQueryCache();
const keys = cache.getAll().map(q => q.queryKey);

// Should have distinct top-level keys:
// ['projects', ...]
// ['applications', ...]
// ['volunteers', ...]
// ['payments', ...]
// ['organizations', ...]
// ['admin', ...]
```

---

## Conclusion

### ✅ Recommendation: Execute A3, A4, and A5 in PARALLEL

**Confidence Level**: HIGH (85%)

**Rationale**:
1. ✅ Separate code files - no file conflicts
2. ✅ Separate API modules - no import conflicts  
3. ✅ Separate database tables - no data conflicts
4. ✅ Independent cache keys - no cache conflicts
5. ⚠️ Shared index.ts and README.md - manageable with coordination
6. ✅ Time savings: ~4 weeks (57% reduction)

**Prerequisites for Success**:
1. Create `queryKeys.ts` factory BEFORE starting any task
2. Daily sync meetings between teams (15 min)
3. Clear merge order: A3 → A4 → A5 (or coordinate simultaneous merge)
4. Lock shared config files (no modifications)
5. Assign README.md sections upfront

**Risk Level**: LOW to MEDIUM

With proper coordination, the benefits of parallel execution (faster delivery, independent teams) far outweigh the manageable risks (merge conflicts in index.ts and README.md).

---

## Quick Reference

### Communication Protocol

**Daily Standup Questions**:
1. What files are you modifying today?
2. Any planned changes to shared files?
3. When do you expect to complete your task?
4. Any blockers from other teams?

**Merge Coordination**:
- Use GitHub PR labels: `task-A3`, `task-A4`, `task-A5`
- Merge order: Smallest PR first (typically A3 or A4)
- Rebase window: 24 hours after first merge

### Emergency Contact

If major conflicts arise:
1. Stop merging
2. Call emergency meeting with all teams
3. Review this document's conflict resolution section
4. Agree on resolution strategy
5. Resume merging

---

**Document Version**: 1.0  
**Created**: 2026-01-31  
**Status**: Ready for Review  
**Recommended Action**: Share with all teams, schedule kickoff meeting

---

## Appendix: File Modification Matrix

| File | A3 | A4 | A5 | Conflict Risk |
|------|----|----|----|--------------| 
| `queryKeys.ts` (new) | ✏️ Add | ✏️ Add | ✏️ Add | ⚠️ Medium - all teams add sections |
| `index.ts` | ✏️ Add exports | ✏️ Add exports | ✏️ Add exports | ⚠️ Medium - append only |
| `README.md` | ✏️ Add docs | ✏️ Add docs | ✏️ Add docs | ⚠️ Medium - sections assigned |
| `queryClient.ts` | 👁️ Read only | 👁️ Read only | 👁️ Read only | ✅ None - locked |
| `base.ts` | 👁️ Read only | 👁️ Read only | 👁️ Read only | ✅ None - locked |
| New hook files | ✏️ Create | ✏️ Create | ✏️ Create | ✅ None - separate files |
| API modules | ✏️ May enhance | ✏️ May enhance | ✏️ May enhance | ✅ None - separate modules |
| Type files | ✏️ May add types | ✏️ May add types | ✏️ May add types | ✅ Low - separate files |

**Legend**:
- ✏️ Write/Modify
- 👁️ Read only
- ✅ Low conflict risk
- ⚠️ Medium conflict risk (manageable)

