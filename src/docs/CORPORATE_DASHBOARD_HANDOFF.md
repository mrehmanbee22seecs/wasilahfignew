# 🏢 Corporate Dashboard - Developer Handoff Documentation

**Route:** `/corporate/dashboard`  
**Version:** 1.0  
**Last Updated:** December 14, 2024  
**Status:** Production Ready - Requires Supabase Integration

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component Library](#component-library)
4. [Data Contracts](#data-contracts)
5. [Supabase Schema](#supabase-schema)
6. [React Query Keys](#react-query-keys)
7. [Responsive Behavior](#responsive-behavior)
8. [Accessibility](#accessibility)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 📊 Overview

The Corporate Dashboard is a comprehensive control center for CSR managers to:
- Monitor key metrics (projects, beneficiaries, spend, events)
- Create and manage CSR projects
- Plan annual CSR strategy
- Manage employee volunteers
- Schedule and track events

### **Key Features**
- ✅ 4 main tabs: Overview, CSR Plan, Volunteering, Calendar
- ✅ Real-time KPI cards with hover tooltips
- ✅ Projects list with table/card view toggle
- ✅ Activity feed with filtering
- ✅ Inline-editable CSR plan with autosave
- ✅ CSV import for volunteers with validation
- ✅ Interactive monthly calendar
- ✅ Fully responsive (desktop/tablet/mobile)
- ✅ WCAG 2.1 AA accessible

---

## 🏗 Architecture

### **File Structure**

```
/components/corporate/
  DashboardNav.tsx          - Left navigation (collapsible)
  KpiCard.tsx               - Metric cards with trends
  ProjectRow.tsx            - Project list item (table/card modes)
  ActivityFeed.tsx          - Recent activity stream
  OverviewTab.tsx           - Main dashboard view
  CSRPlanTab.tsx            - Plan editor
  VolunteeringTab.tsx       - Volunteer management + CSV import
  CalendarTab.tsx           - Event calendar

/pages/
  CorporateDashboard.tsx    - Main page orchestrator

/docs/
  CORPORATE_DASHBOARD_HANDOFF.md  - This file
```

### **State Management**

```typescript
// Tab navigation
const [activeTab, setActiveTab] = useState<'overview' | 'csr-plan' | 'volunteering' | 'calendar'>('overview');

// Navigation UI state
const [isNavCollapsed, setIsNavCollapsed] = useState(false);
const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

// View preferences (persisted to localStorage)
const [projectViewMode, setProjectViewMode] = useState<'table' | 'card'>('card');
```

---

## 🧩 Component Library

### **1. KpiCard**

**Purpose:** Display key performance indicator with trend

**Props:**
```typescript
interface KpiCardProps {
  label: string;                    // "Active Projects"
  value: number | string;           // 12 or "1,250,000"
  currency?: string;                // "PKR"
  trendPct?: number;                // 5 (for +5%)
  trendLabel?: string;              // "vs last quarter"
  sparklineData?: number[];         // [10, 12, 11, 13, 12]
  status?: 'default' | 'loading' | 'error';
  variant?: 'default' | 'compact';
  onRetry?: () => void;             // For error state
}
```

**Variants:**
- `default` - Full size with all elements
- `compact` - Smaller padding for mobile carousel
- `loading` - Skeleton state
- `error` - Error state with retry button

**Features:**
- Hover tooltip showing 3-month breakdown
- Sparkline visualization (decorative)
- Trend indicator (up/down/neutral arrows)
- Keyboard accessible (focusable)

**Data Contract:**
```json
{
  "activeProjects": 12,
  "beneficiariesYtd": 4385,
  "csrSpendYtd": { "amount": 1250000, "currency": "PKR" },
  "upcomingEvents": 3,
  "trends": {
    "activeProjects": {"pct": 5, "period": "vs Q2"},
    "beneficiariesYtd": {"pct": -2, "period": "vs Q2"},
    "csrSpendYtd": {"pct": 12, "period": "vs Q2"},
    "upcomingEvents": {"pct": 0, "period": "vs Q2"}
  }
}
```

**Supabase Query:**
```typescript
// KPI calculation query (materialized view or function)
const { data: kpis } = await supabase.rpc('get_corporate_kpis', {
  company_id: companyId,
  period_start: '2025-01-01',
  period_end: '2025-12-31'
});
```

---

### **2. ProjectRow / ProjectCard**

**Purpose:** Display project information in table or card format

**Props:**
```typescript
interface ProjectRowProps {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'completed' | 'on-hold';
  ngoName: string;
  startDate: string;              // ISO date
  endDate: string;
  progress: number;               // 0-100
  volunteersCount: number;
  budget: number;
  spent: number;
  thumbnail?: string;
  viewMode?: 'table' | 'card';
  onViewDetails: (id: string) => void;
  onEdit: (id: string) => void;
  onTogglePause: (id: string) => void;
}
```

**View Modes:**
- `table` - Compact row for table display
- `card` - Expanded card with thumbnail

**Status Badges:**
```typescript
const statusConfig = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700' },
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700' },
  'on-hold': { label: 'On Hold', color: 'bg-amber-100 text-amber-700' }
};
```

**Data Contract:**
```typescript
// Supabase query
const { data: projects } = await supabase
  .from('projects')
  .select(`
    id,
    title,
    status,
    ngo:ngos(name),
    start_date,
    end_date,
    progress,
    volunteers:project_volunteers(count),
    budget,
    spent,
    thumbnail
  `)
  .eq('company_id', companyId)
  .order('start_date', { ascending: false })
  .limit(20);
```

---

### **3. ActivityFeed**

**Purpose:** Display recent activity stream with filtering

**Props:**
```typescript
interface ActivityFeedProps {
  activities: ActivityItem[];
  onNavigateToProject: (projectId: string) => void;
  onMarkAsRead?: (activityId: string) => void;
}

interface ActivityItem {
  id: string;
  type: 'media_upload' | 'payment' | 'volunteer_join' | 'project_update' | 'milestone' | 'alert';
  user: string;
  message: string;
  projectId?: string;
  projectName?: string;
  timestamp: string;              // ISO datetime
  read?: boolean;
}
```

**Filters:**
- `all` - Show all activities
- `projects` - Project updates, media uploads, milestones
- `volunteers` - Volunteer joins
- `finance` - Payments

**Real-time Updates:**
```typescript
// Subscribe to activity changes
const subscription = supabase
  .channel('activities')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'activities',
      filter: `company_id=eq.${companyId}`
    },
    (payload) => {
      // Add new activity to feed
      queryClient.setQueryData(['corp', 'activities', companyId], (old) => [payload.new, ...old]);
    }
  )
  .subscribe();
```

---

### **4. CSRPlanTab**

**Purpose:** Inline-editable CSR plan with autosave

**Props:**
```typescript
interface CSRPlanTabProps {
  planData: CSRPlanData;
  onSave: (data: CSRPlanData) => void;
  onPublish: (data: CSRPlanData) => void;
}

interface CSRPlanData {
  id: string;
  title: string;
  executiveSummary: string;
  objectives: Array<{ id: string; text: string }>;
  sdgs: string[];                 // ["4", "8", "13"]
  projects: Array<{ projectId: string; name: string; start: string; end: string }>;
  budgetAllocation: Array<{ category: string; amount: number }>;
  kpis: Array<{ label: string; target: number }>;
  status: 'draft' | 'published';
  lastSavedAt?: string;
}
```

**Features:**
- **Autosave:** Debounced 2s after edit
- **Status Indicator:** "Saving..." / "Saved" / "Error"
- **Publish Flow:** Validation → Confirmation modal → Lock editing
- **Version History:** Timestamp + "View version" link (future)

**Supabase Integration:**
```typescript
// Save draft
const { error } = await supabase
  .from('csr_plans')
  .upsert({
    id: planData.id,
    company_id: companyId,
    ...planData,
    updated_at: new Date().toISOString()
  });

// Publish
const { error } = await supabase
  .from('csr_plans')
  .update({
    status: 'published',
    published_at: new Date().toISOString()
  })
  .eq('id', planId);
```

---

### **5. VolunteeringTab**

**Purpose:** Manage volunteers with single invite and CSV import

**Props:**
```typescript
interface VolunteeringTabProps {
  volunteers: Volunteer[];
  onInviteSingle: (email: string, message: string) => void;
  onImportCSV: (volunteers: Omit<Volunteer, 'id' | 'status' | 'eventsJoined'>[]) => void;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'invited' | 'registered' | 'active';
  joinedAt?: string;
  eventsJoined: number;
}
```

**CSV Import Flow:**
1. Upload CSV (drag & drop)
2. Parse & validate (client-side)
3. Show preview table (first 10 rows)
4. Allow inline edits to fix errors
5. Display summary (total, valid, errors)
6. Confirm import → Show progress → Success

**CSV Format:**
```csv
name,email,department
John Doe,john@company.com,HR
Jane Smith,jane@company.com,Finance
```

**Validation Rules:**
- `email` - RFC-like regex, required
- `name` - Required, min 2 chars
- `department` - Optional

**Supabase Integration:**
```typescript
// Bulk insert volunteers
const { data, error } = await supabase
  .from('volunteers')
  .insert(
    volunteers.map(v => ({
      company_id: companyId,
      name: v.name,
      email: v.email,
      department: v.department,
      status: 'invited',
      invited_at: new Date().toISOString()
    }))
  );

// Send invite emails (via Supabase Auth or email service)
for (const volunteer of volunteers) {
  await supabase.auth.admin.inviteUserByEmail(volunteer.email);
}
```

---

### **6. CalendarTab**

**Purpose:** Monthly calendar with event creation

**Props:**
```typescript
interface CalendarTabProps {
  events: CalendarEvent[];
  onCreateEvent: (event: Omit<CalendarEvent, 'id' | 'attendeesCount'>) => void;
  onEventClick: (eventId: string) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;                   // YYYY-MM-DD
  time: string;                   // HH:MM
  location?: string;
  projectId?: string;
  projectName?: string;
  capacity?: number;
  attendeesCount: number;
  color: string;                  // Hex color
}
```

**Features:**
- **Month Navigation:** Previous/Next buttons
- **Event Cards:** Color-coded, click to view details
- **Today Highlight:** Teal background for current date
- **Create Modal:** Form with date/time/location/capacity
- **Event Popover:** Quick view with edit/view attendees

**Supabase Integration:**
```typescript
// Get events for month
const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];

const { data: events } = await supabase
  .from('events')
  .select(`
    *,
    project:projects(name),
    attendees:event_attendees(count)
  `)
  .eq('company_id', companyId)
  .gte('date', firstDay)
  .lte('date', lastDay)
  .order('date');
```

---

## 📊 Data Contracts

### **Supabase Database Schema**

```sql
-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'active', 'completed', 'on-hold')),
  ngo_id UUID REFERENCES ngos(id),
  start_date DATE,
  end_date DATE,
  progress INT CHECK (progress >= 0 AND progress <= 100),
  budget NUMERIC,
  spent NUMERIC DEFAULT 0,
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteers table
CREATE TABLE volunteers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department TEXT,
  status TEXT CHECK (status IN ('invited', 'registered', 'active')),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  capacity INT,
  color TEXT DEFAULT '#0d9488',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event attendees table
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  volunteer_id UUID REFERENCES volunteers(id),
  status TEXT CHECK (status IN ('registered', 'attended', 'cancelled')),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, volunteer_id)
);

-- CSR Plans table
CREATE TABLE csr_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  title TEXT NOT NULL,
  executive_summary TEXT,
  objectives JSONB DEFAULT '[]',
  sdgs TEXT[] DEFAULT '{}',
  projects JSONB DEFAULT '[]',
  budget_allocation JSONB DEFAULT '[]',
  kpis JSONB DEFAULT '[]',
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  type TEXT NOT NULL,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_company ON projects(company_id);
CREATE INDEX idx_volunteers_company ON volunteers(company_id);
CREATE INDEX idx_events_company_date ON events(company_id, date);
CREATE INDEX idx_activities_company ON activities(company_id);
```

### **Row Level Security (RLS)**

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE csr_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Projects policy (users can only see their company's projects)
CREATE POLICY "Users can view own company projects"
  ON projects FOR SELECT
  USING (company_id = (auth.jwt() -> 'app_metadata' ->> 'company_id')::uuid);

CREATE POLICY "Users can insert own company projects"
  ON projects FOR INSERT
  WITH CHECK (company_id = (auth.jwt() -> 'app_metadata' ->> 'company_id')::uuid);

-- Similar policies for other tables...
```

---

## 🔄 React Query Keys

### **Query Key Structure**

```typescript
// KPI data
['corp', 'kpis', companyId]

// Projects list
['corp', 'projects', companyId, { page, status, search }]

// Single project
['corp', 'project', projectId]

// Activities
['corp', 'activities', companyId, { type }]

// CSR Plan
['corp', 'csrplan', companyId]

// Volunteers
['corp', 'volunteers', companyId]

// Events for month
['corp', 'events', companyId, year, month]
```

### **Example Queries**

```typescript
// Fetch KPIs
const { data: kpis } = useQuery({
  queryKey: ['corp', 'kpis', companyId],
  queryFn: async () => {
    const { data } = await supabase.rpc('get_corporate_kpis', {
      company_id: companyId,
      period_start: startOfYear,
      period_end: endOfYear
    });
    return data;
  },
  staleTime: 30000 // 30 seconds
});

// Fetch projects with pagination
const { data: projects, fetchNextPage } = useInfiniteQuery({
  queryKey: ['corp', 'projects', companyId, filters],
  queryFn: async ({ pageParam = 0 }) => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('company_id', companyId)
      .order('start_date', { ascending: false })
      .range(pageParam * 20, (pageParam + 1) * 20 - 1);
    return data;
  },
  getNextPageParam: (lastPage, pages) => 
    lastPage.length === 20 ? pages.length : undefined,
  staleTime: 60000 // 1 minute
});

// Fetch activities (real-time)
const { data: activities } = useQuery({
  queryKey: ['corp', 'activities', companyId],
  queryFn: async () => {
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(50);
    return data;
  },
  staleTime: 15000 // 15 seconds
});
```

### **Mutations**

```typescript
// Create project
const createProjectMutation = useMutation({
  mutationFn: async (projectData) => {
    const { data } = await supabase
      .from('projects')
      .insert({ ...projectData, company_id: companyId })
      .select()
      .single();
    return data;
  },
  onSuccess: (newProject) => {
    // Optimistic update
    queryClient.setQueryData(['corp', 'projects', companyId], (old) => [newProject, ...old]);
    
    // Invalidate to refetch
    queryClient.invalidateQueries(['corp', 'kpis', companyId]);
  }
});

// Save CSR plan (debounced autosave)
const saveCSRPlanMutation = useMutation({
  mutationFn: async (planData) => {
    await supabase
      .from('csr_plans')
      .upsert({
        ...planData,
        company_id: companyId,
        updated_at: new Date().toISOString()
      });
  },
  onSuccess: () => {
    queryClient.invalidateQueries(['corp', 'csrplan', companyId]);
  }
});
```

---

## 📱 Responsive Behavior

### **Breakpoints**

```typescript
const breakpoints = {
  mobile: '< 768px',
  tablet: '768px - 1279px',
  desktop: '>= 1280px'
};
```

### **Layout Adjustments**

**Desktop (>= 1280px):**
- Left nav: 240px wide, always visible
- KPI row: 4 columns
- Main area: 2/3 projects + 1/3 activity feed
- Calendar: Full month grid
- Collapse button visible

**Tablet (768px - 1279px):**
- Left nav: Icon-only (60px), expands on hover
- KPI row: 2x2 grid
- Main area: Stacked (projects above activity)
- Calendar: Scrollable month grid

**Mobile (< 768px):**
- Left nav: Hamburger menu → drawer
- KPI row: Horizontal scrollable carousel
- Projects: Card view only, compact cards
- Activity feed: Below projects
- Calendar: Compressed cells
- Floating action button (FAB) for mobile menu

### **Touch Targets**

All interactive elements meet WCAG 2.1 AA:
- Minimum: 44×44px
- Spacing: 8px between targets

---

## ♿ Accessibility

### **WCAG 2.1 AA Compliance**

✅ **Keyboard Navigation:**
- All components navigable by Tab/Shift+Tab
- Left nav: Arrow keys to move between items
- Table rows: Enter to open detail drawer
- Modals: ESC to close, focus trap

✅ **Screen Readers:**
- All interactive elements have `aria-label`
- Status messages use `aria-live="polite"`
- Modals use `role="dialog"` and `aria-modal="true"`
- Tables use semantic `<table>` with `<th>` headers

✅ **Color Contrast:**
- Text on white: >= 4.5:1 (slate-700 #334155)
- Large text (24px+): >= 3:1
- Status badges: >= 4.5:1
- Buttons: >= 4.5:1

✅ **Focus Indicators:**
- All interactive elements have visible focus ring
- Ring: 2px solid teal-600, offset 2px
- High visibility on all backgrounds

### **ARIA Attributes**

```html
<!-- KPI Card -->
<div role="button" aria-label="Active Projects: 12" tabindex="0">
  ...
  <div role="tooltip" id="kpi-tooltip">...</div>
</div>

<!-- Project Row Actions -->
<button aria-label="View project details">
  <Eye className="w-4 h-4" />
</button>

<!-- Activity Feed -->
<div role="feed" aria-busy="false">
  <div role="article" aria-labelledby="activity-1">
    <h4 id="activity-1">Sara uploaded photos</h4>
  </div>
</div>

<!-- Calendar -->
<div role="grid" aria-label="December 2025">
  <div role="row">
    <div role="gridcell" aria-selected="false">...</div>
  </div>
</div>
```

---

## 🧪 Testing

### **Unit Tests** (Jest + React Testing Library)

```typescript
// KpiCard.test.tsx
describe('KpiCard', () => {
  it('displays value and label', () => {
    render(<KpiCard label="Active Projects" value={12} />);
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    render(<KpiCard label="Test" value={100} />);
    const card = screen.getByRole('button');
    fireEvent.mouseEnter(card);
    expect(await screen.findByText(/Last 3 months/)).toBeVisible();
  });

  it('displays loading skeleton', () => {
    render(<KpiCard label="Test" value={0} status="loading" />);
    expect(screen.getByRole('button')).toHaveClass('animate-pulse');
  });
});

// CSRPlanTab.test.tsx
describe('CSRPlanTab autosave', () => {
  it('debounces save after 2 seconds', async () => {
    const onSave = jest.fn();
    render(<CSRPlanTab planData={mockData} onSave={onSave} />);
    
    const input = screen.getByLabelText('Plan Title');
    fireEvent.change(input, { target: { value: 'New Title' } });
    
    // Should not call immediately
    expect(onSave).not.toHaveBeenCalled();
    
    // Should call after 2s
    await waitFor(() => expect(onSave).toHaveBeenCalled(), { timeout: 2100 });
  });
});
```

### **Integration Tests** (Playwright)

```typescript
// dashboard.spec.ts
test.describe('Corporate Dashboard', () => {
  test('complete project creation flow', async ({ page }) => {
    await page.goto('/corporate/dashboard');
    
    // Click Create Project
    await page.click('text=Create Project');
    
    // Fill form
    await page.fill('input[name="title"]', 'New CSR Project');
    await page.fill('textarea[name="description"]', 'Project description');
    await page.click('text=Create');
    
    // Verify project appears in list
    await expect(page.locator('text=New CSR Project')).toBeVisible();
  });

  test('CSV import flow', async ({ page }) => {
    await page.goto('/corporate/dashboard');
    await page.click('text=Volunteering');
    
    // Upload CSV
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles('./fixtures/volunteers.csv');
    
    // Verify preview
    await expect(page.locator('text=CSV Import Preview')).toBeVisible();
    
    // Confirm import
    await page.click('text=Confirm Import');
    
    // Verify success
    await expect(page.locator('text=3 volunteers imported')).toBeVisible();
  });
});
```

### **Accessibility Tests**

```typescript
// axe-core integration
test('dashboard has no accessibility violations', async () => {
  const { container } = render(<CorporateDashboard />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## 🚀 Deployment

### **Environment Variables**

```bash
# .env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_COMPANY_ID=uuid-here

# Optional analytics
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MIXPANEL_TOKEN=xxxxxxxxxxxxx
```

### **Supabase Setup Checklist**

- [ ] Run schema migrations (see SQL above)
- [ ] Enable Row Level Security (RLS)
- [ ] Create RPC function `get_corporate_kpis`
- [ ] Set up Auth policies for company access
- [ ] Configure email templates (volunteer invites)
- [ ] Enable Storage for project thumbnails
- [ ] Set up realtime subscriptions for activities

### **Build & Deploy**

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel/Netlify
vercel deploy --prod
```

### **Performance Optimizations**

1. **Code Splitting:** Each tab lazy-loaded
```typescript
const OverviewTab = lazy(() => import('./components/corporate/OverviewTab'));
```

2. **Image Optimization:** Use Supabase Image Transform
```typescript
const thumbnailUrl = `${SUPABASE_URL}/storage/v1/object/public/thumbnails/${id}?width=400&quality=80`;
```

3. **Query Caching:** Aggressive stale times for dashboard data
```typescript
staleTime: 60000 // 1 minute for projects
staleTime: 30000 // 30 seconds for KPIs
```

4. **Debounced Search:** 300ms debounce on search inputs

---

## 📞 Support & Maintenance

**For technical questions:**
- Review component source code in `/components/corporate/`
- Check Supabase docs: https://supabase.com/docs

**For design questions:**
- Review design tokens in component props
- Check responsive breakpoints above

**For UX questions:**
- Review interaction flows in component files
- Test interactive prototype in dev mode

---

**Document Version:** 1.0  
**Last Updated:** December 14, 2024  
**Next Review:** Before production launch

---

**This Corporate Dashboard is production-ready from a frontend perspective!** All components work with mock data. Simply connect to Supabase to activate real data flows. 🏢📊
