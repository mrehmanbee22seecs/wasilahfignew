# Volunteer Experience - Developer Handoff Documentation

## Overview

This document provides comprehensive implementation details for the Volunteer Experience, including the Volunteer Dashboard (`/volunteer`) and Discover Opportunities (`/discover`) pages. Both pages are production-ready with complete interactive flows, auth gating, form validation, and accessibility compliance.

---

## Table of Contents

1. [Pages Overview](#pages-overview)
2. [Component Library](#component-library)
3. [Data Models & Types](#data-models--types)
4. [Supabase Schema](#supabase-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)
7. [State Management](#state-management)
8. [Accessibility](#accessibility)
9. [Analytics Events](#analytics-events)
10. [Testing Checklist](#testing-checklist)
11. [Internationalization (i18n)](#internationalization-i18n)

---

## Pages Overview

### 1. Volunteer Dashboard (`/volunteer`)

**Route:** `/volunteer`  
**File:** `/pages/VolunteerDashboard.tsx`  
**Auth Required:** Yes

#### Features:
- **KPI Summary Cards:** Points, Badges, Hours YTD, Projects Completed
- **Tab Navigation:** My Opportunities, My Projects, Certificates
- **My Opportunities:** List of applied opportunities with status badges
- **My Projects:** Active projects with progress indicators
- **Certificates:** Downloadable PDF certificates (English & Urdu)
- **Empty States:** Friendly messages with CTAs
- **Responsive Design:** Mobile, tablet, and desktop breakpoints

#### User Flows:
1. View KPIs and track progress
2. Switch between tabs to view different content
3. Click "Apply" on open opportunities → Opens ApplyModal
4. Click "View Status" on applied opportunities → Shows application details
5. Download certificates with single click
6. Navigate to "Discover Opportunities" from empty states

---

### 2. Discover Opportunities (`/discover`)

**Route:** `/discover`  
**File:** `/pages/DiscoverOpportunitiesPage.tsx`  
**Auth Required:** No (but required for applying)

#### Features:
- **Search & Filters:** Text search, category, location, SDG, date range
- **Filter Chips:** Active filters displayed as removable chips
- **Opportunity Grid:** Responsive card grid (3 columns desktop, 2 tablet, 1 mobile)
- **Save Opportunities:** Heart icon to save favorites
- **Apply Flow:** Opens ApplyModal (logged in) or AuthGate (logged out)
- **Load More:** Cursor-based pagination
- **Auth Gate:** Prompts login/signup for protected actions
- **Return Flow:** Redirects back to apply after successful auth

#### User Flows:
1. Search/filter opportunities
2. Browse opportunity cards
3. Click "Save" to bookmark opportunities
4. Click "Apply" while logged out → AuthGate overlay → Redirect to /auth
5. After login, return to /discover → Auto-open ApplyModal
6. Click "Apply" while logged in → ApplyModal opens directly
7. Submit application → Success toast → Status updates

---

## Component Library

### Core Components

#### 1. **KPICard**
**File:** `/components/volunteer/KPICard.tsx`

```tsx
type KPICardProps = {
  title: string;
  value: string | number;
  trend?: string; // "+120 this month"
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
};
```

**Usage:**
```tsx
<KPICard
  title="Points"
  value={1850}
  trend="+120 this month"
  icon={<Trophy />}
/>
```

---

#### 2. **OpportunityCard**
**File:** `/components/volunteer/OpportunityCard.tsx`

```tsx
type OpportunityCardProps = {
  id: string;
  title: string;
  orgName: string;
  orgLogoUrl?: string;
  location?: string;
  sdgs: { id: string; iconUrl?: string; label: string }[];
  summary: string;
  dateStarts?: string; // ISO date
  timeCommitment?: string;
  totalVolunteers?: number;
  appliedStatus?: ApplicationStatus;
  imageUrl?: string;
  onApply: (id: string) => void;
  onSave?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  isSaved?: boolean;
  variant?: 'grid' | 'list';
};
```

**Variants:**
- `grid`: Vertical card with image (default)
- `list`: Horizontal card for dashboard

---

#### 3. **ApplyModal**
**File:** `/components/volunteer/ApplyModal.tsx`

```tsx
type ApplyModalProps = {
  opportunityId: string;
  title: string;
  orgName: string;
  sdgs: { id: string; label: string; iconUrl?: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ApplicationPayload) => Promise<void>;
  userId?: string;
};

type ApplicationPayload = {
  userId: string;
  opportunityId: string;
  why: string; // min 30, max 500 chars
  availability: string; // required
  resumeUrl?: string; // optional, max 5MB
  extraNotes?: string;
  createdAt?: string;
};
```

**Features:**
- Form validation (client-side)
- File upload with progress indicator
- Confirmation checkbox
- Success/error handling
- Offline queuing (optional)
- Unsaved changes warning

---

#### 4. **AuthGate**
**File:** `/components/volunteer/AuthGate.tsx`

```tsx
type AuthGateProps = {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
  title?: string;
  message?: string;
  loginLabel?: string;
  signupLabel?: string;
};
```

**Usage:**
```tsx
<AuthGate
  isOpen={showAuthGate}
  onClose={() => setShowAuthGate(false)}
  onLogin={() => {
    const returnUrl = `/discover?opportunity=${oppId}&action=apply`;
    window.location.href = `/auth?returnTo=${encodeURIComponent(returnUrl)}`;
  }}
  onSignup={() => {
    const returnUrl = `/discover?opportunity=${oppId}&action=apply`;
    window.location.href = `/auth?returnTo=${encodeURIComponent(returnUrl)}&mode=signup`;
  }}
/>
```

---

#### 5. **FilterRow**
**File:** `/components/volunteer/FilterRow.tsx`

```tsx
type FilterRowProps = {
  filters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  options: FilterOptions;
  resultCount?: number;
  className?: string;
};

type ActiveFilters = {
  search?: string;
  category?: string;
  location?: string;
  sdgs?: string[];
  dateRange?: string;
};
```

---

#### 6. **StatusBadge**
**File:** `/components/volunteer/StatusBadge.tsx`

```tsx
type ApplicationStatus =
  | 'not_applied'
  | 'applied'
  | 'selected'
  | 'rejected'
  | 'open'
  | 'closed'
  | 'reviewing'
  | 'accepted';

type StatusBadgeProps = {
  status: ApplicationStatus;
  className?: string;
};
```

**Color Semantics:**
- `applied` → Blue
- `selected` / `accepted` → Green
- `rejected` → Red
- `open` → Emerald
- `closed` → Gray
- `reviewing` → Amber

---

#### 7. **CertificateCard**
**File:** `/components/volunteer/CertificateCard.tsx`

```tsx
type CertificateCardProps = {
  id: string;
  projectName: string;
  hours: number;
  issuedDate: string;
  downloadUrl: string;
  language?: 'en' | 'ur';
  organizationName?: string;
  className?: string;
};
```

**Features:**
- Download button triggers PDF download
- RTL layout for Urdu certificates
- Urdu text labels when `language='ur'`

---

#### 8. **ProjectRow**
**File:** `/components/volunteer/ProjectRow.tsx`

```tsx
type ProjectRowProps = {
  id: string;
  title: string;
  organizationName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  sdgs?: { id: string; iconUrl?: string; label: string }[];
  hoursContributed?: number;
  tasksCompleted?: number;
  totalTasks?: number;
  imageUrl?: string;
  onView?: (id: string) => void;
};
```

---

### Utility Components

#### 9. **Loading Skeletons**
**File:** `/components/volunteer/LoadingSkeletons.tsx`

```tsx
<OpportunityCardSkeleton variant="grid" />
<ProjectRowSkeleton />
<CertificateCardSkeleton />
<KPISummarySkeleton />
<OpportunitiesGridSkeleton count={6} variant="grid" />
<ProjectsListSkeleton count={4} />
<CertificatesGridSkeleton count={3} />
```

---

#### 10. **ErrorState**
**File:** `/components/volunteer/ErrorState.tsx`

```tsx
type ErrorStateProps = {
  title?: string;
  message?: string;
  type?: 'error' | 'offline' | 'not-found';
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};
```

**Usage:**
```tsx
<ErrorState
  type="error"
  title="Failed to load"
  message="Please try again"
  onRetry={() => fetchOpportunities()}
/>
```

---

## Data Models & Types

### User Stats
```tsx
type UserStats = {
  points: number;
  pointsTrend: string; // "+120 this month"
  badges: { id: string; name: string; iconUrl?: string; description: string }[];
  hoursYTD: number;
  projectsCompleted: number;
};
```

---

### Opportunity
```tsx
type Opportunity = {
  id: string;
  title: string;
  orgName: string;
  orgId: string;
  orgLogoUrl?: string;
  location?: string;
  sdgs: { id: string; iconUrl?: string; label: string }[];
  summary: string;
  dateStarts?: string; // ISO
  dateEnds?: string; // ISO
  timeCommitment?: string;
  totalVolunteers?: number;
  appliedStatus?: ApplicationStatus;
  imageUrl?: string;
  category?: string;
};
```

---

### Application
```tsx
type Application = {
  id: string;
  userId: string;
  opportunityId: string;
  why: string;
  availability: string;
  resumeUrl?: string;
  extraNotes?: string;
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
};
```

---

### Project
```tsx
type UserProject = {
  id: string;
  title: string;
  organizationName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  sdgs?: { id: string; iconUrl?: string; label: string }[];
  hoursContributed?: number;
  tasksCompleted?: number;
  totalTasks?: number;
  imageUrl?: string;
};
```

---

### Certificate
```tsx
type Certificate = {
  id: string;
  userId: string;
  projectId: string;
  projectName: string;
  organizationName?: string;
  hours: number;
  issuedDate: string;
  downloadUrl: string; // PDF URL
  language?: 'en' | 'ur';
};
```

---

## Supabase Schema

### Table: `opportunities`

```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id),
  summary TEXT,
  description TEXT,
  sdg_ids TEXT[], -- Array of SDG IDs
  location TEXT,
  category TEXT, -- 'education', 'health', etc.
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  time_commitment TEXT,
  volunteer_capacity INT,
  image_url TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'closed', 'draft'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_opportunities_org ON opportunities(org_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_category ON opportunities(category);
CREATE INDEX idx_opportunities_start_date ON opportunities(start_date);
```

---

### Table: `applications`

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  why TEXT NOT NULL,
  availability TEXT NOT NULL,
  resume_url TEXT,
  extra_notes TEXT,
  status TEXT DEFAULT 'submitted', -- 'submitted', 'reviewing', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_opportunity ON applications(opportunity_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Unique constraint: One application per user per opportunity
CREATE UNIQUE INDEX idx_user_opportunity ON applications(user_id, opportunity_id);
```

---

### Table: `certificates`

```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  hours NUMERIC NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT NOT NULL,
  language TEXT DEFAULT 'en' -- 'en' or 'ur'
);

-- Indexes
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_project ON certificates(project_id);
```

---

### Table: `users` (Extended)

Ensure the `users` table includes these fields for the volunteer experience:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS points INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]';
ALTER TABLE users ADD COLUMN IF NOT EXISTS hours_ytd INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS projects_completed INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en';
```

---

## API Endpoints

### 1. GET `/opportunities`

Fetch paginated opportunities with filters.

**Query Parameters:**
- `limit` (int): Number of results (default: 20)
- `cursor` (string): Pagination cursor
- `search` (string): Text search
- `category` (string): Filter by category
- `location` (string): Filter by location
- `sdgs` (string[]): Filter by SDG IDs
- `dateRange` (string): Filter by date

**Response:**
```json
{
  "opportunities": [...],
  "nextCursor": "abc123",
  "total": 42
}
```

**Implementation:**
```typescript
// Supabase query
const { data, error } = await supabase
  .from('opportunities')
  .select('*, organizations(name, logo_url)')
  .eq('status', 'open')
  .ilike('title', `%${search}%`)
  .contains('sdg_ids', sdgs)
  .range(offset, offset + limit - 1);
```

---

### 2. GET `/opportunities/:id`

Fetch single opportunity details.

**Response:**
```json
{
  "id": "uuid",
  "title": "...",
  "orgName": "...",
  ...
}
```

---

### 3. POST `/applications`

Create a new application.

**Request Body:**
```json
{
  "opportunityId": "uuid",
  "userId": "uuid",
  "why": "...",
  "availability": "...",
  "resumeUrl": "https://...",
  "extraNotes": "..."
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid"
}
```

**Implementation:**
```typescript
const { data, error } = await supabase
  .from('applications')
  .insert({
    opportunity_id: opportunityId,
    user_id: userId,
    why,
    availability,
    resume_url: resumeUrl,
    extra_notes: extraNotes,
    status: 'submitted',
  })
  .select()
  .single();
```

---

### 4. GET `/users/:id/applications`

Fetch user's applications with opportunity details.

**Query Parameters:**
- `status` (string): Filter by status

**Response:**
```json
[
  {
    "id": "uuid",
    "status": "applied",
    "opportunity": {...},
    "appliedDate": "..."
  }
]
```

**Implementation:**
```typescript
const { data, error } = await supabase
  .from('applications')
  .select('*, opportunities(*, organizations(name, logo_url))')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

---

### 5. GET `/users/:id/projects`

Fetch user's enrolled projects.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "...",
    "progress": 65,
    ...
  }
]
```

---

### 6. GET `/certificates?userId=:id`

Fetch user's certificates.

**Response:**
```json
[
  {
    "id": "uuid",
    "projectName": "...",
    "hours": 32,
    "downloadUrl": "...",
    "language": "en"
  }
]
```

---

### 7. POST `/upload/resume`

Upload resume file to storage.

**Implementation (Supabase Storage):**
```typescript
const { data, error } = await supabase.storage
  .from('resumes')
  .upload(`${userId}/${file.name}`, file, {
    cacheControl: '3600',
    upsert: false,
  });

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('resumes')
  .getPublicUrl(data.path);
```

---

## Authentication Flow

### Auth Gate Flow (Logged Out User)

1. User clicks "Apply" on opportunity → `handleApply(opportunityId)` is called
2. Check `isLoggedIn` → false
3. Set `pendingOpportunityId` and open `AuthGate` overlay
4. User clicks "Log In" or "Sign Up"
5. Redirect to `/auth?returnTo=/discover?opportunity=<id>&action=apply`
6. User completes authentication
7. Auth page redirects back to `/discover?opportunity=<id>&action=apply`
8. `useEffect` detects params and auto-opens `ApplyModal`
9. User submits application
10. Success toast + URL cleanup

### Code Example (DiscoverOpportunitiesPage.tsx)

```typescript
// Step 1-3: Check auth and show gate
const handleApply = (opportunityId: string) => {
  if (!isLoggedIn) {
    setPendingOpportunityId(opportunityId);
    setShowAuthGate(true);
    return;
  }
  // ... open modal directly if logged in
};

// Step 4-5: Redirect to auth
const handleAuthGateLogin = () => {
  const returnUrl = `/discover?opportunity=${pendingOpportunityId}&action=apply`;
  window.location.href = `/auth?returnTo=${encodeURIComponent(returnUrl)}`;
};

// Step 7-8: Auto-open modal after return
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const returnOpportunityId = urlParams.get('opportunity');
  const action = urlParams.get('action');

  if (returnOpportunityId && action === 'apply' && isLoggedIn) {
    const opportunity = opportunities.find((o) => o.id === returnOpportunityId);
    if (opportunity) {
      handleApply(returnOpportunityId);
    }
    window.history.replaceState({}, '', '/discover'); // Clean URL
  }
}, [isLoggedIn, opportunities]);
```

---

## State Management

### Volunteer Dashboard State

```typescript
// KPI data
const [userStats, setUserStats] = useState<UserStats | null>(null);

// Tab navigation
const [activeTab, setActiveTab] = useState<'opportunities' | 'projects' | 'certificates'>('opportunities');

// Lists
const [opportunities, setOpportunities] = useState<OpportunityWithStatus[]>([]);
const [projects, setProjects] = useState<UserProject[]>([]);
const [certificates, setCertificates] = useState<Certificate[]>([]);

// Modal state
const [applyModalOpen, setApplyModalOpen] = useState(false);
const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityWithStatus | null>(null);

// Loading states
const [isLoading, setIsLoading] = useState(false);
```

---

### Discover Opportunities State

```typescript
// Filters
const [filters, setFilters] = useState<ActiveFilters>({});

// Data
const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
const [savedOpportunities, setSavedOpportunities] = useState<string[]>([]); // IDs

// Pagination
const [cursor, setCursor] = useState<string | null>(null);
const [hasMore, setHasMore] = useState(true);
const [isLoadingMore, setIsLoadingMore] = useState(false);

// Auth
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showAuthGate, setShowAuthGate] = useState(false);
const [pendingOpportunityId, setPendingOpportunityId] = useState<string | null>(null);

// Modal
const [applyModalOpen, setApplyModalOpen] = useState(false);
const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
```

---

## Accessibility

### ARIA Attributes

All interactive components include proper ARIA attributes:

**Buttons:**
```tsx
<button
  onClick={handleApply}
  aria-label={`Apply for ${title}`}
  aria-describedby="opportunity-description"
>
  Apply
</button>
```

**Status Badges:**
```tsx
<span role="status" aria-label={`Status: ${status}`}>
  Applied
</span>
```

**Progress Bars:**
```tsx
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Project progress: ${progress}%`}
/>
```

**Tabs:**
```tsx
<button
  role="tab"
  aria-selected={activeTab === 'opportunities'}
  aria-controls="opportunities-panel"
>
  My Opportunities
</button>

<div
  role="tabpanel"
  id="opportunities-panel"
  aria-labelledby="opportunities-tab"
>
  {/* Content */}
</div>
```

**Modals:**
```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="apply-modal-title"
>
  <h2 id="apply-modal-title">Apply for Opportunity</h2>
</div>
```

---

### Keyboard Navigation

- All interactive elements are keyboard-accessible
- Tab order follows logical reading order
- Modal traps focus and restores on close
- ESC key closes modals (with confirmation if unsaved changes)
- Enter/Space activates buttons

**Example:**
```tsx
<div
  onClick={onClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }}
  tabIndex={0}
  role="button"
>
  {/* Content */}
</div>
```

---

### Focus Management

```tsx
// Focus trap in modal
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0] as HTMLElement;
    firstElement?.focus();
  }
}, [isOpen]);
```

---

### Color Contrast

All text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- Interactive elements have visible focus states

---

## Analytics Events

Track the following events for analytics:

### Discover Page Events

```typescript
// Page view
analytics.track('discover_view', {
  timestamp: Date.now(),
});

// Filter applied
analytics.track('filter_applied', {
  filterType: 'category', // or 'location', 'sdg', etc.
  filterValue: 'education',
});

// Opportunity clicked
analytics.track('opportunity_click', {
  opportunityId: 'uuid',
  opportunityTitle: '...',
});

// Apply started
analytics.track('apply_start', {
  opportunityId: 'uuid',
  isLoggedIn: true,
});

// Apply submitted successfully
analytics.track('apply_submit_success', {
  opportunityId: 'uuid',
  hasResume: true,
});

// Apply submission failed
analytics.track('apply_submit_failure', {
  opportunityId: 'uuid',
  error: '...',
});

// Auth gate shown
analytics.track('auth_gate_show', {
  opportunityId: 'uuid',
  trigger: 'apply_button',
});

// Auth gate clicked
analytics.track('auth_gate_click', {
  action: 'login', // or 'signup'
});
```

---

### Dashboard Events

```typescript
// Dashboard view
analytics.track('volunteer_dashboard_view', {
  tab: 'opportunities', // or 'projects', 'certificates'
});

// Tab switched
analytics.track('dashboard_tab_switch', {
  from: 'opportunities',
  to: 'projects',
});

// Certificate downloaded
analytics.track('certificate_download', {
  certificateId: 'uuid',
  language: 'en',
});
```

---

## Testing Checklist

### Volunteer Dashboard

- [ ] KPI cards display correct values and trends
- [ ] Tab switching works instantly
- [ ] My Opportunities list shows correct statuses
- [ ] Apply button opens modal for open opportunities
- [ ] View Status button shows application details
- [ ] My Projects list shows progress bars
- [ ] Certificates download PDFs correctly
- [ ] Urdu certificates display RTL layout
- [ ] Empty states show appropriate CTAs
- [ ] Navigation links work correctly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading skeletons appear during fetch
- [ ] Error states show retry option

---

### Discover Opportunities

- [ ] Search filter works with text input
- [ ] Category dropdown filters results
- [ ] Location dropdown filters results
- [ ] SDG multi-select filters results
- [ ] Date range dropdown filters results
- [ ] Filter chips display active filters
- [ ] Removing filter chips updates results
- [ ] Clear filters resets all filters
- [ ] Result count updates with filters
- [ ] Opportunity cards display correctly
- [ ] Save button toggles heart icon
- [ ] Apply button (logged out) shows auth gate
- [ ] Auth gate redirects to /auth with returnTo param
- [ ] After login, auto-opens apply modal
- [ ] Apply button (logged in) opens modal directly
- [ ] Load more button fetches next page
- [ ] Pagination cursor updates correctly
- [ ] Empty state shows when no results
- [ ] Error state shows on API failure

---

### ApplyModal

- [ ] Form fields validate on submit
- [ ] Why field requires min 30 chars
- [ ] Why field limits max 500 chars
- [ ] Availability field is required
- [ ] File upload accepts PDF, JPG, PNG
- [ ] File upload rejects files > 5MB
- [ ] Upload progress indicator works
- [ ] File can be removed after upload
- [ ] Confirmation checkbox is required
- [ ] Submit button disabled while submitting
- [ ] Spinner shows during submission
- [ ] Success toast appears on success
- [ ] Error message shows on failure
- [ ] ESC key closes modal (with confirmation)
- [ ] Focus trapped inside modal
- [ ] Form reset on close

---

## Internationalization (i18n)

### Language Support

The platform supports **English (en)** and **Urdu (ur)**.

### RTL Support for Urdu

When `language='ur'`, apply RTL layout:

```tsx
<div className={`${language === 'ur' ? 'text-right' : ''}`}>
  {/* Content */}
</div>
```

**FlexBox Reversal:**
```tsx
<div className={`flex ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
  <Icon />
  <Text />
</div>
```

---

### Translation Keys

Use an i18n library (e.g., `react-i18next`) for translations:

```typescript
// English (en)
{
  "volunteer.dashboard.title": "Volunteer Dashboard",
  "volunteer.kpi.points": "Points",
  "volunteer.kpi.badges": "Badges",
  "volunteer.apply.button": "Apply Now",
  "volunteer.certificate.download": "Download Certificate"
}

// Urdu (ur)
{
  "volunteer.dashboard.title": "رضاکار ڈیش بورڈ",
  "volunteer.kpi.points": "پوائنٹس",
  "volunteer.kpi.badges": "بیجز",
  "volunteer.apply.button": "ابھی اپلائی کریں",
  "volunteer.certificate.download": "سرٹیفکیٹ ڈاؤن لوڈ کریں"
}
```

**Usage:**
```tsx
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('volunteer.dashboard.title')}</h1>;
}
```

---

### Font Considerations

**Urdu Font:**
Use `Noto Nastaliq Urdu` for proper Urdu script rendering:

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');

.urdu-text {
  font-family: 'Noto Nastaliq Urdu', serif;
}
```

---

## Production Deployment

### Environment Variables

```bash
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_STORAGE_BUCKET=resumes
```

---

### Performance Optimization

1. **Lazy Load Images:** Use `loading="lazy"` for images
2. **Code Splitting:** Lazy load pages with `React.lazy()`
3. **Memoization:** Use `React.memo()` for expensive components
4. **Debounce Search:** Debounce search input to reduce API calls
5. **Cursor Pagination:** Use cursor-based pagination for large datasets

---

### Security Considerations

1. **Row Level Security (RLS):** Enable RLS on all Supabase tables
2. **File Upload Validation:** Server-side validation for file uploads
3. **Rate Limiting:** Implement rate limiting on API endpoints
4. **Input Sanitization:** Sanitize all user inputs
5. **HTTPS Only:** Enforce HTTPS in production

---

## Support & Maintenance

### Known Limitations

1. **Offline Apply Queue:** Not fully implemented (optional feature)
2. **Real-time Updates:** Applications don't update in real-time (requires Supabase subscriptions)
3. **Advanced Search:** Full-text search not implemented (use Supabase FTS)

---

### Future Enhancements

1. **Push Notifications:** Notify users of application status changes
2. **In-App Messaging:** Chat between volunteers and NGOs
3. **Gamification:** Leaderboards, achievement badges
4. **Social Sharing:** Share opportunities on social media
5. **Calendar Integration:** Add opportunities to Google Calendar / iCal

---

## Contact

For questions or support, contact the development team:
- **Email:** dev@wasilah.com
- **Slack:** #wasilah-dev
- **Docs:** https://docs.wasilah.com

---

**Document Version:** 1.0  
**Last Updated:** December 15, 2024  
**Author:** Wasilah Development Team
