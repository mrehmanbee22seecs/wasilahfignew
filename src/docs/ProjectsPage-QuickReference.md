# Projects Page — Quick Reference Guide

## 🎯 Quick Access

**How to view**: Click the **floating teal button** (bottom-right) → Select **"Projects Manager"**

---

## 📋 Page Overview

### Main Features at a Glance

| Feature | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| **Table View** | ✅ Full table | ✅ Condensed | ❌ Cards only |
| **Filters** | ✅ Inline | ✅ 2-row layout | ✅ Bottom sheet |
| **Create Modal** | ✅ Dialog (800px) | ✅ Dialog (90vw) | ✅ Full-screen |
| **Detail Drawer** | ✅ Slide-over (420px) | ✅ Overlay | ✅ Full-screen |
| **Bulk Actions** | ✅ Checkbox | ✅ Checkbox | ⚠️ Limited |

---

## 🔢 Data Flow Diagram

```
User Action → Component State → Validation → API Call → React Query Cache → UI Update
                     ↓                                           ↓
              Optimistic Update ←─────────────────── Rollback on Error
```

---

## 🎨 Component Hierarchy

```
ProjectsPage
├── Header
│   ├── Title & Description
│   ├── Create Button
│   └── Stats Cards (Total/Active/Pending/Completed)
│
├── FiltersRow (sticky)
│   ├── Search Input (debounced 300ms)
│   ├── Filter Toggle
│   ├── Bulk Actions (if selected)
│   └── Export Button
│   │
│   └── Filter Options (collapsible)
│       ├── Status Checkboxes
│       └── SDG Checkboxes
│
├── Content Area
│   ├── Desktop: ProjectsTable
│   │   ├── Table Header (with checkboxes)
│   │   └── Table Rows
│   │       ├── Checkbox
│   │       ├── Title & Location
│   │       ├── SDG Badges
│   │       ├── Status Badge
│   │       ├── Dates
│   │       ├── Budget
│   │       └── Actions Menu
│   │
│   └── Mobile: ProjectCards
│       └── Card (title, status, SDGs, dates, budget)
│
├── Pagination
│   └── Load More Button
│
├── CreateProjectModal (conditional)
│   ├── Header (progress stepper)
│   ├── Content (5 steps)
│   │   ├── Step 1: Basic Info
│   │   ├── Step 2: Logistics
│   │   ├── Step 3: Budget & Approvals
│   │   ├── Step 4: Media & Uploads
│   │   └── Step 5: Review & Create
│   └── Footer (Back/Next/Save Draft/Create)
│
└── ProjectDetailDrawer (conditional)
    ├── Header (title, slug, status)
    ├── Tabs (Overview/Budget/Volunteers/Activity)
    ├── Tab Content
    └── Footer Actions (Edit/View Full)
```

---

## 🔄 State Management

### Local Component State

```typescript
const [projects, setProjects] = useState<Project[]>([]);
const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [statusFilter, setStatusFilter] = useState<ProjectStatus[]>([]);
const [sdgFilter, setSDGFilter] = useState<string[]>([]);
const [selectedRows, setSelectedRows] = useState<string[]>([]);
const [showCreateModal, setShowCreateModal] = useState(false);
const [showDetailDrawer, setShowDetailDrawer] = useState(false);
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
```

### React Query (Production)

```typescript
// In production, replace with:
const { data: projects, isLoading } = useProjects(companyId, filters);
const createMutation = useCreateProject();
const updateMutation = useUpdateProject();
const archiveMutation = useArchiveProject();
```

---

## 🎬 User Flows

### Create New Project

```
1. Click "Create Project" button
2. Modal opens → Step 1 (Basic Info)
   - Fill title (min 6 chars)
   - Fill description (max 400 chars)
   - Select 1-5 SDGs ✅
   - Select project type
3. Click "Next" → Step 2 (Logistics)
   - Select city ✅
   - Pick start date ✅
   - Pick end date ✅
   - Set volunteer target
   - Choose delivery mode
4. Click "Next" → Step 3 (Budget)
   - Enter total budget ✅
   - Add budget breakdown rows
   - Sum must equal total ✅
   - Add approvers (optional)
5. Click "Next" → Step 4 (Media)
   - Drag & drop images (max 10)
   - Upload documents (max 5)
6. Click "Next" → Step 5 (Review)
   - Review all entered data
   - Click "Preview" (optional)
   - Click "Create Project" ✅
7. Success toast → Project appears at top of list
```

### Edit Existing Project

```
1. Click row action menu (⋮)
2. Select "Edit"
3. Modal opens with pre-filled data
4. Navigate steps and make changes
5. Auto-save triggers every 2s (shows timestamp)
6. Click "Save Draft" or "Create" to finalize
7. Optimistic update → Row reflects changes immediately
```

### Duplicate Project

```
1. Click row action menu (⋮)
2. Select "Duplicate"
3. Confirm dialog appears
4. Click "OK"
5. New project created with "(Copy)" suffix
6. Opens edit modal with duplicated data
7. Make changes and save
```

### Archive Project

```
1. Click row action menu (⋮)
2. Select "Archive"
3. Confirm dialog explains consequences
4. Click "OK"
5. Project status → "archived"
6. Row removed from active list
7. Apply "archived" filter to view
```

### View Project Details

```
1. Click anywhere on table row (or card on mobile)
2. Drawer slides in from right
3. Default tab: Overview
4. Can switch tabs:
   - Overview: Description, SDGs, location, dates
   - Budget: Total + breakdown + approvers
   - Volunteers: Applications (empty in V1)
   - Activity: Timeline of changes
5. Click "Edit Project" → Opens edit modal
6. Click "View Full Page" → Navigate to detailed view (future)
7. Click X or outside → Drawer closes
```

---

## 🎯 Keyboard Shortcuts (Accessibility)

| Key | Action |
|-----|--------|
| `Tab` | Navigate between elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` | Activate button/link |
| `Space` | Toggle checkbox/select |
| `Escape` | Close modal/drawer |
| `Arrow Keys` | Navigate within menus |
| `/` | Focus search (future) |

---

## 🎨 Color & Status Mapping

### Project Status Colors

```typescript
'draft':     'bg-slate-100  text-slate-700  border-slate-200'
'pending':   'bg-yellow-100 text-yellow-700 border-yellow-200'
'active':    'bg-green-100  text-green-700  border-green-200'
'completed': 'bg-blue-100   text-blue-700   border-blue-200'
'archived':  'bg-red-100    text-red-700    border-red-200'
```

### SDG Colors (from UN standards)

Refer to `types/projects.ts` → `SDG_LIST` for all 17 SDG colors

---

## 📊 Validation Rules

### Step 1: Basic Info

| Field | Rule | Error Message |
|-------|------|---------------|
| Title | 6-150 chars, required | "Title must be at least 6 characters" |
| Description | 1-400 chars, required | "Description is required" |
| SDGs | 1-5 selections, required | "Select at least one SDG" |

### Step 2: Logistics

| Field | Rule | Error Message |
|-------|------|---------------|
| City | Required | "City is required" |
| Start Date | Required | "Start date is required" |
| End Date | Required, >= start date | "End date must be after start date" |

### Step 3: Budget

| Field | Rule | Error Message |
|-------|------|---------------|
| Total Budget | > 0, required | "Budget must be greater than 0" |
| Breakdown Sum | Must equal total budget | "Breakdown total must equal budget" |

### File Upload Limits

| Type | Max Files | Max Size per File | Formats |
|------|-----------|-------------------|---------|
| Images | 10 | 10 MB | JPG, PNG, WEBP |
| Documents | 5 | 10 MB | PDF, DOC, DOCX |

---

## 🔍 Filter Combinations

Filters are **additive** (AND logic):

```
Search: "education"
Status: ["active", "pending"]
SDG: ["4", "10"]

Result: Projects matching ALL conditions:
  - Contains "education" in title OR description OR city
  - AND status is "active" OR "pending"
  - AND includes SDG 4 OR SDG 10
```

---

## 🚨 Common Issues & Solutions

### Issue: Modal won't close

**Cause**: Unsaved changes  
**Solution**: Click "Save Draft" first, or confirm "Discard changes?"

### Issue: Validation error on Step 3

**Cause**: Budget breakdown sum ≠ total budget  
**Solution**: Ensure all breakdown amounts add up exactly to total (use calculator)

### Issue: File upload stuck at "Uploading"

**Cause**: Simulated upload in demo mode  
**Solution**: This is expected behavior in demo. In production, files upload to Supabase Storage.

### Issue: Can't find archived projects

**Cause**: Archive filter not applied  
**Solution**: Click "Filters" → Select "archived" status checkbox

### Issue: Duplicate has same slug

**Cause**: Slug uniqueness constraint  
**Solution**: Edit slug field when creating duplicate (auto-appends "-copy")

---

## 💾 Data Persistence

### Auto-save Behavior

- **Trigger**: Any field change in Create/Edit modal
- **Debounce**: 2 seconds
- **Storage**: Local state → Supabase (production) or localStorage (offline)
- **Indicator**: Timestamp shown in modal header ("Saved 10:32 AM")

### Manual Save

- **Button**: "Save Draft" (always visible in modal footer)
- **Action**: Immediately saves current state as draft
- **Status**: Sets project status to "draft" if new

---

## 📱 Responsive Behavior Details

### Desktop (≥ 1024px)
- Full table with 7 columns
- Filters inline (2 rows)
- Modal: 800px width, centered
- Drawer: 420px slide-over

### Tablet (768-1023px)
- Table with 5 columns (SDG count collapsed)
- Filters: 2-row grid layout
- Modal: 90vw width
- Drawer: Full-width overlay with max-width

### Mobile (< 768px)
- Stacked card layout (no table)
- Filters: Bottom sheet
- Modal: Full-screen
- Drawer: Full-screen

---

## 🧩 Microcopy Reference

### Buttons
- Primary CTA: "Create Project"
- Secondary: "Save Draft", "Export", "Load More"
- Actions: "Edit", "Duplicate", "Archive", "View Details"

### Empty States
- No projects: "No projects yet — Create your first CSR project to get started"
- No results: "No matching projects — Try adjusting your filters or search query"

### Confirmations
- Archive: "Archive this project? It will be hidden from the active list."
- Duplicate: `Duplicate project "${title}"?`
- Discard changes: "You have unsaved changes. Do you want to discard them?"

### Success Messages
- Create: "Project created successfully!"
- Edit: "Project updated successfully!"
- Archive: "Project archived successfully!"
- Duplicate: "Project duplicated successfully!"

---

## 🔗 Integration Points

### From Corporate Dashboard
```typescript
// Navigate to Projects from Dashboard
onClick={() => navigate('/corporate/projects')}
```

### To Project Detail Page (future)
```typescript
// Full project page (not yet implemented)
onClick={() => navigate(`/corporate/projects/${project.slug}`)}
```

---

## 📈 Performance Metrics

### Target Benchmarks
- Time to Interactive: < 2s
- First Contentful Paint: < 1s
- Table render (100 rows): < 500ms
- Modal open animation: 200ms
- Drawer slide animation: 300ms
- Search debounce: 300ms
- Auto-save debounce: 2000ms

---

## 🎓 Developer Tips

### Adding a New Filter

1. Add filter state: `const [newFilter, setNewFilter] = useState(defaultValue);`
2. Update `applyFilters()` function with new condition
3. Add filter UI in FiltersRow component
4. Include in `clearFilters()` function
5. Add to React Query key (if using)

### Adding a New Project Field

1. Update `Project` type in `types/projects.ts`
2. Update Supabase schema (migration)
3. Add field to CreateProjectModal (appropriate step)
4. Add validation in `validateStep()`
5. Include in `handleCreate()` payload
6. Display in ProjectDetailDrawer
7. Update mock data

### Integrating Real File Upload

```typescript
// Replace simulated upload in FileUploader.tsx
const uploadFile = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('projects_media')
    .upload(path, file);
  
  if (error) throw error;
  return data;
};
```

---

**For full implementation details, see `ProjectsPage-DeveloperHandoff.md`**

---

*Last updated: December 14, 2025*
