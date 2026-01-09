# Projects Page — Developer Handoff Documentation

## 📋 Overview

**Route**: `/corporate/projects` (accessed via "Projects Manager" in Quick Access menu)  
**Purpose**: Corporate CSR project management interface with full CRUD operations  
**Tech Stack**: React + TypeScript + Tailwind CSS + Supabase (ready)  
**State Management**: React Query (TanStack Query) recommended

---

## 🎯 Features Implemented

### ✅ Core Features
- [x] Projects list table (desktop) with sortable columns
- [x] Project cards (mobile/tablet responsive)
- [x] Advanced filters (search, status, SDG, location)
- [x] Debounced search (300ms)
- [x] Multi-step Create Project Modal (5 steps)
- [x] Project Detail Drawer (slide-over)
- [x] File uploader with drag & drop
- [x] Inline validation with user-friendly errors
- [x] Row actions (View, Edit, Duplicate, Archive)
- [x] Bulk selection with checkboxes
- [x] Auto-save draft functionality (2s debounce)
- [x] Responsive design (desktop/tablet/mobile)
- [x] Full accessibility (keyboard nav, ARIA labels, screen readers)

---

## 📁 File Structure

```
/types/
  projects.ts                    # TypeScript types & data contracts

/data/
  mockProjects.ts               # Mock data for development

/components/projects/
  FileUploader.tsx              # Reusable file upload component
  CreateProjectModal.tsx        # 5-step project creation wizard
  ProjectDetailDrawer.tsx       # Slide-over project details

/pages/
  ProjectsPage.tsx              # Main projects manager page

/docs/
  ProjectsPage-DeveloperHandoff.md  # This file
```

---

## 🗂 Data Contracts & Supabase Schema

### TypeScript Types

```typescript
export type ProjectStatus = 'draft' | 'pending' | 'active' | 'completed' | 'archived';
export type DeliveryMode = 'on-ground' | 'remote' | 'hybrid';
export type ProjectType = 'education' | 'health' | 'environment' | 'other';

export interface Project {
  id: string;
  company_id: string;
  title: string;
  slug: string;
  short_description: string;
  sdgs: string[];              // e.g., ['4', '6', '11']
  type: ProjectType;
  location: Location;
  start_date: string;          // ISO date string
  end_date: string;
  volunteer_target: number;
  delivery_mode: DeliveryMode;
  budget: number;
  budget_breakdown: BudgetBreakdown[];
  approvers?: Approver[];
  media_ids: string[];
  documents_ids: string[];
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}
```

### Supabase Database Schema

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  sdgs TEXT[] DEFAULT '{}',
  type TEXT CHECK (type IN ('education', 'health', 'environment', 'other')),
  location JSONB DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL CHECK (end_date >= start_date),
  volunteer_target INTEGER DEFAULT 0,
  delivery_mode TEXT CHECK (delivery_mode IN ('on-ground', 'remote', 'hybrid')),
  budget NUMERIC(12, 2) DEFAULT 0,
  budget_breakdown JSONB DEFAULT '[]',
  approvers JSONB DEFAULT '[]',
  media_ids UUID[] DEFAULT '{}',
  documents_ids UUID[] DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'pending', 'active', 'completed', 'archived')) DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table (for file uploads)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  type TEXT CHECK (type IN ('image', 'document', 'video')),
  storage_path TEXT NOT NULL,
  thumbnail TEXT,
  meta JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_company_id ON projects(company_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_media_project_id ON media(project_id);

-- Row-Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their company's projects
CREATE POLICY projects_company_isolation ON projects
  FOR ALL USING (
    company_id = (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY media_company_isolation ON media
  FOR ALL USING (
    company_id = (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔌 API Integration Examples

### React Query Setup

```typescript
// hooks/useProjects.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { projectKeys } from '../types/projects';

// Fetch projects list
export function useProjects(companyId: string, filters: ProjectFilters) {
  return useQuery({
    queryKey: projectKeys.list(companyId, filters),
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
      }
      
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }
      
      if (filters.sdgs && filters.sdgs.length > 0) {
        query = query.overlaps('sdgs', filters.sdgs);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
    staleTime: 60000, // 1 minute
    keepPreviousData: true
  });
}

// Create project mutation
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: CreateProjectRequest) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();
      
      if (error) throw error;
      return data as Project;
    },
    onSuccess: (newProject) => {
      // Optimistic update - prepend to list
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      
      // Show success toast
      toast.success('Project created successfully!');
    },
    onError: (error) => {
      console.error('Create project error:', error);
      toast.error('Failed to create project. Please try again.');
    }
  });
}

// Update project mutation
export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Project> }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Project;
    },
    onMutate: async ({ id, updates }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: projectKeys.lists() });
      
      const previousData = queryClient.getQueryData(projectKeys.lists());
      
      queryClient.setQueryData(projectKeys.lists(), (old: Project[] | undefined) => {
        return old?.map(p => p.id === id ? { ...p, ...updates } : p);
      });
      
      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(projectKeys.lists(), context.previousData);
      }
      toast.error('Failed to update project');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('Project updated successfully!');
    }
  });
}

// Archive project mutation
export function useArchiveProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      toast.success('Project archived successfully!');
    }
  });
}
```

### File Upload to Supabase Storage

```typescript
// utils/uploadFile.ts
export async function uploadProjectFile(
  file: File,
  projectId: string,
  companyId: string,
  type: 'image' | 'document'
): Promise<Media> {
  // 1. Upload to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const storagePath = `${companyId}/projects/${projectId}/${type}s/${fileName}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('projects_media')
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) throw uploadError;
  
  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('projects_media')
    .getPublicUrl(storagePath);
  
  // 3. Create media record in database
  const { data: mediaRecord, error: dbError } = await supabase
    .from('media')
    .insert([{
      project_id: projectId,
      company_id: companyId,
      type,
      storage_path: storagePath,
      thumbnail: type === 'image' ? publicUrl : undefined,
      meta: {
        filename: file.name,
        size: file.size,
        mime_type: file.type
      },
      uploaded_by: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single();
  
  if (dbError) throw dbError;
  
  return mediaRecord as Media;
}
```

---

## 🎨 Component Props & Events

### ProjectsPage

Main container - no props needed (uses internal state)

### CreateProjectModal

```typescript
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: CreateProjectRequest) => void;
  onSaveDraft?: (project: Partial<CreateProjectRequest>) => void;
  initialData?: Partial<CreateProjectRequest>;  // For editing
}
```

**Events:**
- `onCreate(projectData)` - Called when user clicks "Create Project"
- `onSaveDraft(draftData)` - Called on autosave (2s debounce) or manual save
- `onClose()` - Called when modal is dismissed

### ProjectDetailDrawer

```typescript
interface ProjectDetailDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}
```

### FileUploader

```typescript
interface FileUploaderProps {
  accept: string;              // e.g., "image/jpeg,image/png"
  maxFiles?: number;           // Default: 10
  maxSizeBytes?: number;       // Default: 10MB
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  label?: string;
  helpText?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnail?: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}
```

---

## 🔑 React Query Cache Keys

```typescript
export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (companyId: string, filters: ProjectFilters) => 
    [...projectKeys.lists(), companyId, filters] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
  kpis: (companyId: string) => [...projectKeys.all, 'kpis', companyId] as const,
};
```

**Stale Times:**
- Projects list: `60s` (1 minute)
- Project detail: `5m` (5 minutes)
- KPIs: `30s`
- SDG master list: `24h`

---

## 📤 Example API Request Bodies

### Create Project

```json
{
  "company_id": "comp_123",
  "title": "Clean Karachi Drive 2026",
  "slug": "clean-karachi-drive-2026",
  "short_description": "A community cleanup campaign in Clifton neighborhoods...",
  "sdgs": ["11", "6", "13"],
  "type": "environment",
  "location": {
    "country": "Pakistan",
    "city": "Karachi",
    "address": "Clifton, Karachi"
  },
  "start_date": "2026-02-15",
  "end_date": "2026-02-20",
  "volunteer_target": 120,
  "delivery_mode": "on-ground",
  "budget": 250000,
  "budget_breakdown": [
    {"category": "Logistics", "amount": 100000, "notes": "Transportation"},
    {"category": "Materials", "amount": 100000, "notes": "Cleaning supplies"},
    {"category": "Media", "amount": 50000, "notes": "Documentation"}
  ],
  "approvers": [
    {"name": "Ayesha Malik", "email": "ayesha@company.com"}
  ],
  "media_ids": ["media_1", "media_2"],
  "documents_ids": ["doc_1"]
}
```

### Update Project

```json
{
  "title": "Updated Project Title",
  "budget": 300000,
  "status": "active"
}
```

### Fetch Projects with Filters

```typescript
// Supabase query
const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('company_id', 'comp_123')
  .in('status', ['active', 'pending'])
  .overlaps('sdgs', ['4', '6'])
  .ilike('title', '%education%')
  .order('created_at', { ascending: false })
  .limit(20);
```

---

## ♿ Accessibility Features

### Implemented
- ✅ Semantic HTML (`<table>`, `<form>`, `<dialog>`)
- ✅ ARIA labels on all interactive elements
- ✅ `aria-modal="true"` on modal dialogs
- ✅ `role="dialog"` on modals and drawers
- ✅ `aria-describedby` for form field errors
- ✅ `aria-live="polite"` regions for toasts
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus trap in modals
- ✅ Focus management (first input on modal open)
- ✅ Screen reader announcements
- ✅ Progress indicators with `role="progressbar"`
- ✅ Visible focus indicators

### Testing with axe-core

```javascript
// Run in browser console
import axe from 'axe-core';

axe.run(document.querySelector('#root'), (err, results) => {
  if (err) throw err;
  console.log(results.violations);
});
```

**Acceptance**: Zero critical or serious violations

---

## 📱 Responsive Breakpoints

```css
/* Tailwind breakpoints used */
sm: 640px   - Mobile landscape
md: 768px   - Tablet
lg: 1024px  - Desktop (table view starts here)
xl: 1280px  - Large desktop
```

**Behavior:**
- `< 768px`: Card layout, bottom sheet filters, full-screen modal
- `768px - 1023px`: Hybrid table (some columns hidden), overlay drawer
- `≥ 1024px`: Full table, slide-over drawer (420px width)

---

## 🧪 Testing Scenarios

### Unit Tests
```typescript
describe('CreateProjectModal validation', () => {
  it('requires title min 6 chars', () => {
    expect(validateTitle('Test')).toContain('at least 6 characters');
  });
  
  it('requires at least one SDG', () => {
    expect(validateSDGs([])).toContain('Select at least one SDG');
  });
  
  it('validates budget breakdown sum equals total', () => {
    const breakdown = [
      { category: 'A', amount: 100 },
      { category: 'B', amount: 50 }
    ];
    expect(validateBudget(200, breakdown)).toBe(true);
    expect(validateBudget(100, breakdown)).toBe(false);
  });
});
```

### E2E Tests (Playwright)

```typescript
test('Create new project flow', async ({ page }) => {
  // Navigate to projects page
  await page.click('[aria-label="Quick Access"]');
  await page.click('text=Projects Manager');
  
  // Open create modal
  await page.click('text=Create Project');
  
  // Step 1: Basic Info
  await page.fill('#title', 'E2E Test Project');
  await page.fill('#description', 'This is a test project for E2E testing');
  await page.click('input[type="checkbox"][value="4"]'); // Select SDG 4
  await page.click('text=Next');
  
  // Step 2: Logistics
  await page.fill('#city', 'Karachi');
  await page.fill('#startDate', '2026-01-15');
  await page.fill('#endDate', '2026-01-20');
  await page.click('text=Next');
  
  // Step 3: Budget
  await page.fill('#budget', '100000');
  await page.fill('[placeholder="Category (e.g., Logistics)"]', 'Test Category');
  await page.fill('[placeholder="Amount"]', '100000');
  await page.click('text=Next');
  
  // Step 4: Skip media
  await page.click('text=Next');
  
  // Step 5: Review and create
  await page.click('text=Create Project');
  
  // Verify success
  await expect(page.locator('text=Project created successfully!')).toBeVisible();
  await expect(page.locator('text=E2E Test Project')).toBeVisible();
});

test('Filter projects by status', async ({ page }) => {
  await page.click('[aria-label="Quick Access"]');
  await page.click('text=Projects Manager');
  
  // Apply status filter
  await page.click('label:has-text("active")');
  
  // Wait for filtered results
  await page.waitForTimeout(500); // Debounce
  
  // Verify only active projects shown
  const statusBadges = await page.locator('[class*="capitalize"]').allTextContents();
  expect(statusBadges.every(status => status === 'active')).toBe(true);
});

test('Duplicate project', async ({ page }) => {
  await page.click('[aria-label="Quick Access"]');
  await page.click('text=Projects Manager');
  
  // Open action menu for first project
  await page.click('tbody tr:first-child button[aria-label*="Actions"]');
  await page.click('text=Duplicate');
  
  // Confirm duplication
  await page.click('button:has-text("OK")');
  
  // Verify duplicate created
  await expect(page.locator('text=(Copy)')).toBeVisible();
});
```

---

## 🐛 Error Handling

### Client-side Validation Errors

```typescript
// Inline field errors
{errors.title && (
  <p id="title-error" className="text-sm text-red-600 mt-1">
    {errors.title}
  </p>
)}
```

### Server Errors

```typescript
try {
  const { data, error } = await supabase.from('projects').insert([projectData]);
  if (error) throw error;
  
  toast.success('Project created!');
} catch (error) {
  console.error('Create project error:', error);
  
  // Map Supabase errors to user-friendly messages
  if (error.code === '23505') {
    toast.error('A project with this slug already exists');
  } else if (error.code === '23503') {
    toast.error('Invalid company or user reference');
  } else {
    toast.error(`Failed to create project: ${error.message}`);
  }
}
```

### Offline Mode

```typescript
// Detect offline
window.addEventListener('offline', () => {
  toast.info('You are offline. Changes will be saved locally.');
});

// Queue mutations when offline
if (!navigator.onLine) {
  // Save to localStorage
  localStorage.setItem('draft_projects', JSON.stringify(projectData));
  toast.info('Saved as draft locally. Will sync when online.');
}
```

---

## 🎬 Animation & Transitions

```css
/* Modal entrance */
.animate-in {
  animation: slideInFromBottom 0.2s ease-out;
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Drawer slide-over */
.slide-in-from-right {
  animation: slideInFromRight 0.3s ease-out;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📊 Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const CreateProjectModal = React.lazy(() => 
  import('./components/projects/CreateProjectModal')
);

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <CreateProjectModal {...props} />
</Suspense>
```

### Virtualization for Large Lists

```typescript
// Install react-window
npm install react-window

import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={filteredProjects.length}
  itemSize={72}
  width="100%"
>
  {({ index, style }) => (
    <ProjectRow 
      project={filteredProjects[index]} 
      style={style}
    />
  )}
</FixedSizeList>
```

### Memoization

```typescript
const filteredProjects = useMemo(() => {
  return projects.filter(p => {
    // Apply filters
  });
}, [projects, searchQuery, statusFilter, sdgFilter]);
```

---

## 🚀 Deployment Checklist

- [ ] Environment variables configured (Supabase URL, anon key)
- [ ] Supabase RLS policies enabled and tested
- [ ] Storage bucket `projects_media` created with public access
- [ ] Database migrations run
- [ ] React Query devtools disabled in production
- [ ] Error boundaries added for fault tolerance
- [ ] Analytics tracking implemented
- [ ] Toast notifications library installed (e.g., sonner, react-hot-toast)
- [ ] Sentry or error tracking configured
- [ ] Performance monitoring enabled
- [ ] Accessibility audit passed (axe-core)
- [ ] E2E tests passing
- [ ] Mobile responsive testing complete

---

## 📚 Additional Resources

### Libraries Used
- **React Query**: https://tanstack.com/query/latest
- **Supabase JS Client**: https://supabase.com/docs/reference/javascript
- **Lucide React**: https://lucide.dev (icons)
- **Tailwind CSS**: https://tailwindcss.com

### Supabase Docs
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Realtime](https://supabase.com/docs/guides/realtime) (for live updates)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

## 🤝 Support & Maintenance

### Known Limitations (V1)
- File uploads are simulated (need real Supabase Storage integration)
- No realtime collaboration (multiple users editing same project)
- No project version history
- No advanced project analytics dashboard
- No export to PDF feature

### Future Enhancements (V2 Roadmap)
- [ ] Real-time collaboration with conflict resolution
- [ ] Rich text editor for project descriptions
- [ ] Map integration for location selection
- [ ] Advanced analytics (impact metrics, volunteer engagement)
- [ ] Project templates library
- [ ] Gantt chart for project timeline visualization
- [ ] Integration with calendar for milestones
- [ ] Email notifications for approvals
- [ ] CSV/Excel bulk import
- [ ] API webhooks for third-party integrations

---

**Last Updated**: December 14, 2025  
**Version**: 1.0.0  
**Maintainer**: Wasilah Development Team
