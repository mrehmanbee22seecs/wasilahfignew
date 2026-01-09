# Admin Dashboard & Vetting Operations - Developer Handoff

**Project:** Wasilah CSR Platform  
**Module:** Admin Dashboard & Vetting Operations  
**Version:** 1.0  
**Last Updated:** December 15, 2024

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Component Library](#component-library)
4. [Pages](#pages)
5. [Supabase Schema](#supabase-schema)
6. [API Endpoints](#api-endpoints)
7. [Audit Log Specifications](#audit-log-specifications)
8. [Accessibility & UX](#accessibility--ux)
9. [Testing Checklist](#testing-checklist)
10. [Analytics Events](#analytics-events)

---

## Overview

The Admin Dashboard is a production-ready interface for Wasilah internal operators and client-admins to vet NGOs, moderate projects, and handle incidents. It prioritizes scanability, fast decisioning, and complete auditability.

### Key Features
- **KPI Monitoring** - Real-time metrics with sparkline trends
- **Moderation Queue** - Search, filter, bulk actions
- **Vetting Detail Drawer** - Document viewer, scorecard, checklist
- **Action Workflows** - Approve, Conditional, Reject with validation
- **Audit Logging** - Complete traceability with required fields
- **Keyboard Shortcuts** - Power-user navigation
- **Accessibility** - WCAG 2.1 AA compliant

---

## Architecture

### File Structure

```
/pages
  AdminDashboard.tsx          # Main dashboard page

/components/admin
  AdminKPICard.tsx            # KPI cards with sparklines
  QueueRow.tsx                # Vetting queue row component
  DocViewer.tsx               # Tabbed document viewer with lightbox
  FileRow.tsx                 # Individual file display
  Scorecard.tsx               # Vetting scorecard with sections
  VerificationChecklist.tsx   # Editable checklist component
  VettingDetailDrawer.tsx     # Slide-over drawer with full details
  ActionModals.tsx            # Approve, Conditional, Reject modals
  AuditLogEntry.tsx           # Audit log display component

/docs
  ADMIN_DASHBOARD_HANDOFF.md  # This file
```

### Data Flow

```
AdminDashboard
  ├─ Fetch KPIs (GET /admin/kpis)
  ├─ Fetch Queue (GET /admin/vetting?filters...)
  ├─ Fetch Activity (GET /admin/activity)
  │
  └─ User clicks Preview
      ├─ Opens VettingDetailDrawer
      ├─ Fetch Details (GET /admin/vetting/:id)
      │   ├─ Documents (vetting_files table)
      │   ├─ Scorecard (computed from sections)
      │   └─ Checklist (vetting_requests.checklist_data)
      │
      └─ User clicks Action (Approve/Conditional/Reject)
          ├─ Opens ActionModal
          ├─ Validates input
          ├─ Submit (POST /admin/vetting/:id/action)
          ├─ Updates vetting_requests status
          ├─ Inserts audit_logs entry
          └─ Sends notification (email via Resend)
```

---

## Component Library

### 1. AdminKPICard

**Purpose:** Display KPI metrics with trend indicators and sparkline tooltips.

**Props:**
```typescript
type AdminKPICardProps = {
  id: string;
  title: string;
  value: string | number;
  trend?: string;                    // e.g., "+3 in 7d"
  trendDirection?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];          // Array for 7-day sparkline
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
};
```

**Usage:**
```tsx
<AdminKPICard
  id="kpi-pending-vettings"
  title="Pending Vettings"
  value={24}
  trend="+3 in 7d"
  trendDirection="up"
  icon={FileText}
  sparklineData={[18, 20, 19, 22, 21, 23, 24]}
/>
```

**Accessibility:**
- `aria-label` with full context
- Keyboard accessible if `onClick` provided
- Color-blind safe (uses icons + text)

---

### 2. QueueRow

**Purpose:** Display vetting request in moderation queue.

**Props:**
```typescript
type QueueRowProps = {
  vettingId: string;
  ngoName: string;
  regNumber?: string;
  submittedAt: string;
  score: number;                     // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'conditional' | 'approved' | 'rejected';
  assignedTo?: string;
  notesPreview?: string;
  isSelected?: boolean;
  onPreview: (vettingId: string) => void;
  onAssign: (vettingId: string) => void;
  onMarkUrgent: (vettingId: string) => void;
  onSelect?: (vettingId: string, selected: boolean) => void;
};
```

**Supabase Mapping:**
- Source: `vetting_requests` table
- Fields: `id, ngo_id, submitted_by, status, score, risk_level, assigned_to`

**Accessibility:**
- Checkbox for bulk selection
- Hover actions visible on focus
- `aria-label` describes full row context

---

### 3. DocViewer

**Purpose:** Tabbed interface for viewing vetting documents with lightbox preview.

**Props:**
```typescript
type DocViewerProps = {
  files: FileRowData[];
  activeFileId?: string;
  onDownload: (fileId: string) => void;
  onOpenLightbox: (fileId: string) => void;
  onDownloadAll?: () => void;
};

type FileRowData = {
  id: string;
  name: string;
  url: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  uploadedBy: string;
  uploadedAt: string;
  sizeBytes: number;
  geoTag?: { lat: number; lng: number } | null;
};
```

**File Categories:**
- Registration Docs
- Financials
- Policies
- Photos & Media
- References

**Accessibility:**
- Tab navigation with `role="tablist"`
- ESC to close lightbox
- Focus trap in lightbox modal

---

### 4. Scorecard

**Purpose:** Display vetting scorecard with weighted sections and risk flags.

**Props:**
```typescript
type ScoreSection = {
  id: string;
  label: string;
  weight: number;                    // percentage, e.g., 20
  score: number;                     // 0-5
  notes?: string;
  helpText?: string;
};

type ScorecardProps = {
  totalScore: number;                // 0-100 (computed)
  sections: ScoreSection[];
  riskFlags?: string[];
  className?: string;
};
```

**Score Computation:**
```javascript
// Each section
weightedPoints = (score / 5) * weight

// Total score
totalScore = sum(all weightedPoints)

// Risk flags reduce score (applied server-side)
```

**Score Sections (Default):**
1. Legal & Registration (20%)
2. Financial Transparency (20%)
3. Past Delivery (15%)
4. Safeguarding & Policies (15%)
5. Staff Capacity (10%)
6. Digital Presence & References (10%)
7. Risk Flags (negative modifier)

**Accessibility:**
- Help tooltips on keyboard focus
- Progress bars with `aria-valuenow`
- Color + text labels for scores

---

### 5. VerificationChecklist

**Purpose:** Editable checklist for admin verification steps.

**Props:**
```typescript
type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
  required: boolean;
  notes?: string;
};

type VerificationChecklistProps = {
  items: ChecklistItem[];
  onChange: (itemId: string, checked: boolean) => void;
  onAddNote?: (itemId: string, note: string) => void;
  editable?: boolean;
  className?: string;
};
```

**Default Checklist Items:**
- Registration certificate verified with SECP
- Bank account number matches registration
- Financial audit present (last 2 years)
- References checked and verified
- Site visit completed

**Validation Logic:**
- Required items must be checked before Approve
- Can Force Approve with override (requires typing "FORCE")
- Checklist saved to `vetting_requests.checklist_data` (JSONB)

---

### 6. VettingDetailDrawer

**Purpose:** Slide-over drawer with complete vetting details, documents, and actions.

**Props:**
```typescript
type VettingDetailDrawerProps = {
  vettingId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (vettingId: string) => void;
  onConditional: (vettingId: string) => void;
  onReject: (vettingId: string) => void;
  onAddNote: (vettingId: string) => void;
  onAssign: (vettingId: string) => void;
};
```

**Layout:**
- **Desktop:** 2-column (60% docs, 40% scorecard/checklist)
- **Mobile:** Full-screen, vertical scroll

**Accessibility:**
- ESC to close
- Focus trap when open
- Returns focus to trigger element on close

**API:** `GET /admin/vetting/:id`

---

### 7. ActionModals (ApproveModal, ConditionalModal, RejectModal)

**Purpose:** Confirmation modals for vetting decisions.

#### ApproveModal
```typescript
type ApproveModalProps = {
  isOpen: boolean;
  vettingId: string;
  ngoName: string;
  onClose: () => void;
  onSubmit: (payload: {
    vettingId: string;
    note?: string;
    force?: boolean;
  }) => Promise<void>;
  hasRequiredItemsUnchecked?: boolean;
};
```

**Force Approve Flow:**
1. If required items unchecked, show warning
2. User clicks "Force approve anyway"
3. Must type "FORCE" to confirm
4. Submit with `force: true` flag

#### ConditionalModal
```typescript
type ConditionalModalProps = {
  isOpen: boolean;
  vettingId: string;
  ngoName: string;
  onClose: () => void;
  onSubmit: (payload: {
    vettingId: string;
    reason: string;             // min 10 chars
    conditions: string[];        // at least 1
    deadline: string;           // ISO date
  }) => Promise<void>;
};
```

**Validation:**
- Reason: required, min 10 characters
- Conditions: at least 1 non-empty
- Deadline: required, future date

#### RejectModal
```typescript
type RejectModalProps = {
  isOpen: boolean;
  vettingId: string;
  ngoName: string;
  onClose: () => void;
  onSubmit: (payload: {
    vettingId: string;
    reason: string;             // min 10 chars
    isPrivate: boolean;
  }) => Promise<void>;
};
```

**Validation:**
- Reason: required, min 10 characters
- isPrivate: determines if shared with NGO

**Accessibility (All Modals):**
- Focus trap
- ESC to close (with unsaved changes warning)
- Loading states with disabled buttons
- Success/error toasts

---

## Pages

### AdminDashboard (/admin-dashboard)

**Route:** `/admin-dashboard`

**Features:**
- KPI summary (4 cards)
- Search & filter moderation queue
- Bulk actions (select multiple, approve/conditional/reject)
- Activity feed (recent audit logs)
- Keyboard shortcuts
- Opens VettingDetailDrawer on row click

**State Management:**
```typescript
const [vettingRequests, setVettingRequests] = useState<VettingRequest[]>([]);
const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
const [filters, setFilters] = useState<FilterState>({});
const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedVettingId, setSelectedVettingId] = useState<string | null>(null);
const [approveModalOpen, setApproveModalOpen] = useState(false);
const [conditionalModalOpen, setConditionalModalOpen] = useState(false);
const [rejectModalOpen, setRejectModalOpen] = useState(false);
```

**Keyboard Shortcuts:**
- `↑` / `↓` - Navigate queue
- `Enter` - Open preview drawer
- `A` - Assign modal
- `R` - Reject modal
- `ESC` - Close modal/drawer

**Filter Options:**
- Search: NGO name, registration number
- Status: Pending, Conditional, Approved, Rejected
- Risk Level: Low, Medium, High
- Assigned To: Me, Any
- Date Range: Submitted date

---

## Supabase Schema

### vetting_requests

```sql
CREATE TABLE vetting_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ngo_id UUID REFERENCES ngos(id) ON DELETE CASCADE,
  submitted_by UUID,
  status TEXT NOT NULL CHECK (status IN ('pending', 'conditional', 'approved', 'rejected')),
  score INT CHECK (score >= 0 AND score <= 100),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  assigned_to UUID NULL,
  checklist_data JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vetting_requests_status ON vetting_requests(status);
CREATE INDEX idx_vetting_requests_assigned_to ON vetting_requests(assigned_to);
CREATE INDEX idx_vetting_requests_ngo_id ON vetting_requests(ngo_id);
```

**checklist_data Format:**
```json
[
  {
    "id": "check-001",
    "label": "Registration certificate verified",
    "checked": true,
    "required": true,
    "notes": "Verified with SECP on 2024-12-15"
  }
]
```

### vetting_files

```sql
CREATE TABLE vetting_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vetting_id UUID REFERENCES vetting_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT CHECK (category IN ('registration', 'financials', 'policies', 'media', 'references')),
  uploaded_by UUID,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  size_bytes INT,
  meta JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_vetting_files_vetting_id ON vetting_files(vetting_id);
```

**meta Format (optional):**
```json
{
  "pages": 3,
  "geoTag": { "lat": 24.8607, "lng": 67.0011 }
}
```

### audit_logs

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  action TEXT NOT NULL,
  actor_id UUID NOT NULL,
  actor_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  details JSONB NOT NULL
);

CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
```

**Required Audit Details:**
```json
{
  "previousStatus": "pending",
  "newStatus": "approved",
  "reason": "All documents verified",
  "conditions": [],
  "deadline": null,
  "filesChecked": ["file-001", "file-002"],
  "force": false,
  "notifyClients": true
}
```

### ngos (Existing Table Reference)

```sql
-- Minimal required fields
CREATE TABLE ngos (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  reg_number TEXT UNIQUE,
  contact_email TEXT,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## API Endpoints

All admin endpoints require authentication with `role: admin` claim.

### GET /admin/kpis

**Purpose:** Fetch dashboard KPI metrics.

**Auth:** Required (admin)

**Response:**
```json
{
  "pendingVettings": 24,
  "pendingProjects": 12,
  "openIncidents": 3,
  "avgVettingTime": 4.2,
  "sparklines": {
    "pendingVettings": [18, 20, 19, 22, 21, 23, 24],
    "pendingProjects": [14, 15, 14, 13, 12, 12, 12],
    "openIncidents": [3, 4, 3, 3, 3, 3, 3],
    "avgVettingTime": [5.2, 5.0, 4.8, 4.6, 4.5, 4.3, 4.2]
  }
}
```

**Implementation:**
```typescript
// Supabase Edge Function
export async function getKPIs(supabase, actorId) {
  const { data: pending } = await supabase
    .from('vetting_requests')
    .select('*', { count: 'exact' })
    .eq('status', 'pending');
  
  // ... compute other metrics
  
  return {
    pendingVettings: pending.length,
    // ...
  };
}
```

---

### GET /admin/vetting

**Purpose:** Fetch vetting requests with filters and pagination.

**Auth:** Required (admin)

**Query Params:**
- `limit` (default: 20)
- `cursor` (for pagination)
- `search` (NGO name or reg number)
- `status` (pending|conditional|approved|rejected)
- `riskLevel` (low|medium|high)
- `assignedTo` (UUID or "me")
- `dateFrom`, `dateTo` (ISO dates)

**Response:**
```json
{
  "items": [
    {
      "id": "vet-001",
      "ngo": {
        "id": "ngo-001",
        "name": "Pakistan Education Foundation",
        "regNumber": "NGO-2024-001"
      },
      "submittedAt": "2025-12-10T10:00:00Z",
      "score": 78,
      "riskLevel": "low",
      "status": "pending",
      "assignedTo": "admin-002",
      "assignedToName": "Sarah Ahmed",
      "notesPreview": "All documents submitted..."
    }
  ],
  "nextCursor": "cursor-value",
  "total": 245
}
```

**Implementation:**
```typescript
export async function getVettingRequests(supabase, filters) {
  let query = supabase
    .from('vetting_requests')
    .select(`
      *,
      ngo:ngos(id, name, reg_number),
      assignedUser:users!assigned_to(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(filters.limit || 20);
  
  if (filters.search) {
    query = query.or(`ngo.name.ilike.%${filters.search}%,ngo.reg_number.ilike.%${filters.search}%`);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  // ... apply other filters
  
  const { data, error } = await query;
  return { data, error };
}
```

---

### GET /admin/vetting/:id

**Purpose:** Fetch detailed vetting information.

**Auth:** Required (admin)

**Response:**
```json
{
  "id": "vet-001",
  "ngo": {
    "id": "ngo-001",
    "name": "Pakistan Education Foundation",
    "regNumber": "NGO-2024-001",
    "contactEmail": "contact@pef.org.pk"
  },
  "score": 78,
  "sections": [
    {
      "id": "legal",
      "label": "Legal & Registration",
      "weight": 20,
      "score": 4.5,
      "notes": "Valid registration certificate",
      "helpText": "Verifies legal status"
    }
  ],
  "files": [
    {
      "id": "file-001",
      "name": "Registration_Certificate.pdf",
      "url": "https://storage.supabase.co/...",
      "type": "pdf",
      "category": "registration",
      "uploadedBy": "NGO Admin",
      "uploadedAt": "2025-12-01T10:00:00Z",
      "sizeBytes": 245000
    }
  ],
  "checklist": [
    {
      "id": "check-001",
      "label": "Registration certificate verified",
      "checked": true,
      "required": true
    }
  ],
  "status": "pending",
  "assignedTo": "admin-002",
  "assignedToName": "Sarah Ahmed",
  "riskFlags": ["Missing 2023 financial audit"],
  "auditLogs": [
    {
      "id": "log-001",
      "action": "assign",
      "actorName": "Ahmed Khan",
      "timestamp": "2025-12-10T14:30:00Z",
      "details": {}
    }
  ]
}
```

---

### POST /admin/vetting/:id/action

**Purpose:** Execute vetting decision (approve, conditional, reject).

**Auth:** Required (admin)

**Request Body Examples:**

**Approve:**
```json
{
  "action": "approve",
  "actorId": "admin-001",
  "note": "All documents verified, site visit done.",
  "force": false,
  "notify": true
}
```

**Conditional:**
```json
{
  "action": "conditional",
  "actorId": "admin-001",
  "reason": "Needs audited financials for 2023.",
  "conditions": [
    "Submit audited financials",
    "Provide bank statement"
  ],
  "deadline": "2026-01-15T00:00:00Z",
  "notify": true
}
```

**Reject:**
```json
{
  "action": "reject",
  "actorId": "admin-001",
  "reason": "Registration number invalid; no response to calls.",
  "isPrivate": false,
  "notify": true
}
```

**Response:**
```json
{
  "success": true,
  "vettingId": "vet-001",
  "newStatus": "approved",
  "auditLogId": "log-123",
  "notificationSent": true
}
```

**Implementation:**
```typescript
export async function executeVettingAction(supabase, vettingId, payload) {
  // 1. Validate payload
  if (payload.action === 'conditional' && !payload.conditions?.length) {
    throw new Error('Conditions required for conditional approval');
  }
  
  // 2. Get current vetting
  const { data: vetting } = await supabase
    .from('vetting_requests')
    .select('*, ngo:ngos(*)')
    .eq('id', vettingId)
    .single();
  
  // 3. Update status
  const newStatus = payload.action === 'conditional' ? 'conditional' : payload.action;
  await supabase
    .from('vetting_requests')
    .update({ status: newStatus, updated_at: new Date() })
    .eq('id', vettingId);
  
  // 4. Insert audit log
  const auditDetails = {
    previousStatus: vetting.status,
    newStatus,
    reason: payload.reason || payload.note,
    conditions: payload.conditions || [],
    deadline: payload.deadline || null,
    force: payload.force || false,
    notifyClients: payload.notify,
  };
  
  const { data: auditLog } = await supabase
    .from('audit_logs')
    .insert({
      resource_type: 'vetting',
      resource_id: vettingId,
      action: payload.action,
      actor_id: payload.actorId,
      actor_name: payload.actorName,
      details: auditDetails,
    })
    .select()
    .single();
  
  // 5. Send notification (if enabled)
  if (payload.notify) {
    await sendVettingDecisionEmail(vetting.ngo, payload.action, auditDetails);
  }
  
  return {
    success: true,
    vettingId,
    newStatus,
    auditLogId: auditLog.id,
    notificationSent: payload.notify,
  };
}
```

---

### POST /admin/vetting/:id/assign

**Purpose:** Assign vetting to a reviewer.

**Auth:** Required (admin)

**Request:**
```json
{
  "assignedTo": "admin-002",
  "actorId": "admin-001"
}
```

**Response:**
```json
{
  "success": true,
  "vettingId": "vet-001",
  "assignedTo": "admin-002",
  "auditLogId": "log-124"
}
```

---

## Audit Log Specifications

### Required Fields (Strict)

Every audit log entry **MUST** include:

```typescript
{
  resource_type: 'vetting' | 'project' | 'ngo',
  resource_id: UUID,
  action: string,
  actor_id: UUID,
  actor_name: string,
  timestamp: ISO8601,
  details: {
    previousStatus: string,
    newStatus: string,
    reason: string,
    conditions?: string[],
    deadline?: ISO8601 | null,
    filesChecked?: string[],
    force?: boolean,
    notifyClients?: boolean
  }
}
```

### Why Strict?

- **Legal Protection:** Provides audit trail for disputes
- **Compliance:** Required for NGO regulations
- **Debugging:** Track down issues in decision flow
- **Analytics:** Measure average vetting time, rejection reasons

### Retention Policy

- Audit logs **NEVER** deleted
- Archived after 2 years to cold storage
- Accessible via admin interface indefinitely

---

## Accessibility & UX

### WCAG 2.1 AA Compliance

✅ **Color Contrast:** All text meets 4.5:1 ratio  
✅ **Keyboard Navigation:** All actions accessible via keyboard  
✅ **Focus Indicators:** Visible focus states on all interactive elements  
✅ **Screen Readers:** Proper ARIA labels and roles  
✅ **Focus Management:** Modals trap focus, return focus on close  

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate queue rows |
| `Enter` | Open vetting preview |
| `A` | Open assign modal |
| `R` | Open reject modal |
| `ESC` | Close modal/drawer |
| `Tab` | Navigate interactive elements |
| `Space` | Toggle checkboxes |

**Accessibility Note:** Shortcuts only active when not in input/textarea.

### Focus Trap Implementation

```typescript
// VettingDetailDrawer example
useEffect(() => {
  if (isOpen) {
    const focusableElements = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement?.focus();
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }
}, [isOpen]);
```

### Loading States

- **Queue List:** Skeleton rows with pulse animation
- **Drawer:** Separate skeletons for docs and scorecard
- **Action Buttons:** Spinner + disabled state
- **Network Errors:** Inline alert with retry button

### Empty States

- **No Vetting Requests:** Guide to check filters
- **No Files:** Prompt to upload documents
- **No Activity:** Empty state illustration

---

## Testing Checklist

### Unit Tests

- [ ] KPICard renders with sparkline data
- [ ] QueueRow displays all fields correctly
- [ ] Scorecard computes total score accurately
- [ ] Checklist validates required items
- [ ] ActionModals validate input (min chars, required fields)
- [ ] AuditLogEntry formats timestamps correctly

### Integration Tests

- [ ] Search returns filtered results
- [ ] Filters can be combined (status + risk + date)
- [ ] Bulk selection works with multiple rows
- [ ] Drawer opens with correct vetting data
- [ ] Approve flow updates status and creates audit log
- [ ] Conditional flow requires conditions + deadline
- [ ] Reject flow requires reason (min 10 chars)
- [ ] Force approve requires typing "FORCE"

### Accessibility Tests

- [ ] Keyboard navigation works (↑↓, Enter, Tab, ESC)
- [ ] Focus trap in modals and drawer
- [ ] Screen reader announces all actions
- [ ] Color contrast passes WCAG 2.1 AA
- [ ] Focus returns to trigger after modal close

### Edge Cases

- [ ] Approve with missing mandatory doc: blocks or forces confirmation
- [ ] Offline action: graceful error with retry UI
- [ ] Concurrent edits: optimistic UI with rollback on error
- [ ] Empty checklist data: defaults to standard items
- [ ] Malformed audit details: validation error before insert

---

## Analytics Events

Track these events via Segment/Mixpanel:

```typescript
// Dashboard Events
track('admin_dashboard_view', {
  userId: string,
  timestamp: Date
});

track('admin_queue_search', {
  query: string,
  resultsCount: number
});

track('admin_queue_filter_apply', {
  filters: {
    status?: string,
    riskLevel?: string,
    assignedTo?: string
  },
  resultsCount: number
});

// Vetting Events
track('vetting_preview_open', {
  vettingId: string,
  ngoName: string,
  actorId: string
});

track('vetting_action_attempt', {
  action: 'approve' | 'conditional' | 'reject',
  vettingId: string,
  actorId: string
});

track('vetting_action_success', {
  action: 'approve' | 'conditional' | 'reject',
  vettingId: string,
  actorId: string,
  duration: number
});

track('vetting_action_failure', {
  action: 'approve' | 'conditional' | 'reject',
  vettingId: string,
  actorId: string,
  errorCode: string,
  errorMessage: string
});

// Audit Logs
track('audit_log_view', {
  resourceType: 'vetting' | 'project' | 'ngo',
  resourceId: string,
  actorId: string
});
```

---

## Implementation Notes

### Best Practices

1. **Optimistic UI:** Show audit log entries immediately, rollback on error
2. **Server-Side Logging:** Use transactional DB + background email queue
3. **Role-Based Middleware:** All admin endpoints check `role=admin` claim
4. **Secure Storage:** Vetting files in Supabase Storage with restricted buckets
5. **Idempotency:** Re-POST should not duplicate audit logs (use unique constraint)
6. **Rate Limiting:** Bulk actions limited to prevent accidental mass approvals

### Error Handling

```typescript
try {
  await executeVettingAction(vettingId, payload);
  toast.success('Action recorded successfully');
  // Optimistic update
  setVettingRequests(prev => 
    prev.map(req => 
      req.id === vettingId ? { ...req, status: newStatus } : req
    )
  );
} catch (error) {
  toast.error(`Failed to ${payload.action}: ${error.message}`);
  // Rollback optimistic update
  refetchVettingRequests();
  
  // Log error for debugging
  Sentry.captureException(error, {
    tags: { feature: 'admin-vetting' },
    extra: { vettingId, action: payload.action }
  });
}
```

### Performance Optimizations

- **Cursor-based pagination** for large queues (not offset/limit)
- **Debounced search** (300ms) to reduce API calls
- **Lazy-load drawer content** (only fetch when opened)
- **Cache KPI data** (5-minute TTL)
- **Index vetting_requests** on status, assigned_to, created_at

---

## Deployment Checklist

- [ ] Environment variables set (Supabase URL, Resend API key)
- [ ] Database migrations run (vetting_requests, vetting_files, audit_logs)
- [ ] Row-Level Security (RLS) policies applied
- [ ] Admin role created in Supabase
- [ ] Email templates configured in Resend
- [ ] Analytics tracking initialized
- [ ] Error monitoring (Sentry) configured
- [ ] Load testing completed (100 concurrent admins)
- [ ] Accessibility audit passed
- [ ] Security audit passed (OWASP Top 10)

---

## Support & Contact

**Technical Lead:** [Your Name]  
**Email:** dev@wasilah.pk  
**Slack:** #admin-dashboard  
**Docs:** https://docs.wasilah.pk/admin

---

**End of Handoff Document**
