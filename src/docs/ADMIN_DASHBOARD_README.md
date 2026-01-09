# Admin Dashboard & Vetting Operations - Quick Start

## Overview

Production-ready admin console for Wasilah CSR platform. Enables internal operators to vet NGOs, moderate projects, and maintain complete audit trails.

## Features ✨

### 📊 Dashboard
- **Real-time KPIs** - Pending vettings, projects, incidents, avg processing time
- **Sparkline Trends** - 7-day micro-charts on hover
- **Activity Feed** - Recent actions and audit logs
- **Global Search** - Quick access across all resources

### 🔍 Moderation Queue
- **Advanced Filters** - Status, risk level, assignee, date range
- **Bulk Actions** - Select multiple, approve/conditional/reject in one go
- **Smart Search** - By NGO name or registration number
- **Keyboard Shortcuts** - Power-user navigation (↑↓, Enter, A, R)

### 📂 Vetting Detail Drawer
- **Document Viewer** - Tabbed interface (Registration, Financials, Policies, Media, References)
- **PDF Preview** - In-browser viewer with download
- **Image Lightbox** - Full-screen photo viewer
- **Scorecard** - Weighted sections (Legal 20%, Financial 20%, Delivery 15%, etc.)
- **Verification Checklist** - Editable admin checklist with required items
- **Audit Timeline** - Complete history of all actions

### ⚡ Action Flows
- **Approve** - Simple confirmation with optional note
- **Conditional** - Requires conditions list + deadline
- **Reject** - Requires detailed reason (min 10 chars)
- **Force Approve** - Override for special cases (requires typing "FORCE")

### 📝 Audit System
- **Complete Traceability** - Every action logged with actor, timestamp, reason
- **Immutable Logs** - Never deleted, retained indefinitely
- **Legal Protection** - Full audit trail for disputes
- **Real-time Updates** - Optimistic UI with server sync

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Auth:** Supabase Auth with role-based access
- **Storage:** Supabase Storage (documents)
- **Email:** Resend (notifications)
- **Icons:** Lucide React
- **Toast:** Sonner

## Quick Start

### 1. Access Admin Dashboard

Navigate to `/admin-dashboard` or use the PageSwitcher (bottom-right floating button).

### 2. Review KPIs

Check the 4 KPI cards at the top:
- **Pending Vettings** - NGOs awaiting review
- **Pending Projects** - Projects needing approval
- **Open Incidents** - Active support tickets
- **Avg Vetting Time** - Processing speed metric

Hover over any KPI to see 7-day sparkline trend.

### 3. Use Moderation Queue

**Search:**
```
Type: "Pakistan Education" or "NGO-2024-001"
```

**Filter:**
- Status: Pending, Conditional, Approved, Rejected
- Risk Level: Low, Medium, High
- Assigned To: Me, Any

**Bulk Actions:**
1. Select checkboxes on multiple rows
2. Click Approve/Conditional/Reject at top
3. Confirm action in modal

### 4. Review Vetting Details

Click any row or press `Enter` to open detail drawer:

**Left Panel (60%)** - Documents
- Switch between tabs (Registration, Financials, etc.)
- Click file to open in lightbox
- Download individual or all files

**Right Panel (40%)** - Scorecard & Checklist
- Review computed score (0-100)
- Check each scoring section
- Review risk flags
- Complete verification checklist
- View recent audit logs

### 5. Take Action

**Approve:**
1. Ensure all required checklist items checked
2. Click "Approve"
3. Add optional note
4. Confirm

**Conditional:**
1. Click "Conditional Approval"
2. Enter reason (min 10 chars)
3. Add conditions (at least 1)
4. Set deadline
5. Submit

**Reject:**
1. Click "Reject"
2. Enter detailed reason (min 10 chars)
3. Choose private/public
4. Confirm

### 6. Monitor Activity

Check the **Recent Activity** panel on the right:
- Who did what and when
- Click "View All Activity" for complete audit log

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate queue rows |
| `Enter` | Open vetting preview |
| `A` | Open assign modal |
| `R` | Open reject modal |
| `ESC` | Close modal/drawer |

## Component Library

All components are reusable and documented:

```tsx
// KPI Card with sparkline
<AdminKPICard
  id="kpi-1"
  title="Pending Vettings"
  value={24}
  trend="+3 in 7d"
  trendDirection="up"
  icon={FileText}
  sparklineData={[18, 20, 19, 22, 21, 23, 24]}
/>

// Queue Row
<QueueRow
  vettingId="vet-001"
  ngoName="Pakistan Education Foundation"
  score={78}
  riskLevel="low"
  status="pending"
  onPreview={handlePreview}
  onAssign={handleAssign}
  onMarkUrgent={handleMarkUrgent}
/>

// Document Viewer
<DocViewer
  files={files}
  onDownload={handleDownload}
  onOpenLightbox={handleOpenLightbox}
  onDownloadAll={handleDownloadAll}
/>

// Scorecard
<Scorecard
  totalScore={78}
  sections={sections}
  riskFlags={["Missing 2023 audit"]}
/>

// Verification Checklist
<VerificationChecklist
  items={checklistItems}
  onChange={handleChecklistChange}
  editable={true}
/>

// Action Modals
<ApproveModal
  isOpen={true}
  vettingId="vet-001"
  ngoName="NGO Name"
  onClose={handleClose}
  onSubmit={handleSubmit}
/>
```

## API Integration

All endpoints require admin authentication:

```typescript
// Fetch queue
GET /admin/vetting?status=pending&riskLevel=medium

// Get details
GET /admin/vetting/:id

// Take action
POST /admin/vetting/:id/action
{
  "action": "approve",
  "actorId": "admin-001",
  "note": "All verified",
  "notify": true
}

// Assign reviewer
POST /admin/vetting/:id/assign
{
  "assignedTo": "admin-002",
  "actorId": "admin-001"
}
```

## Database Schema

### vetting_requests
```sql
id, ngo_id, status, score, risk_level, assigned_to, 
checklist_data (jsonb), created_at, updated_at
```

### vetting_files
```sql
id, vetting_id, file_name, file_url, file_type, 
category, uploaded_by, size_bytes, meta (jsonb)
```

### audit_logs
```sql
id, resource_type, resource_id, action, 
actor_id, actor_name, timestamp, details (jsonb)
```

## Accessibility

✅ **WCAG 2.1 AA Compliant**
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast (4.5:1)
- ARIA labels

## Best Practices

### 1. Always Check Required Items
Before approving, ensure all required checklist items are checked. If not possible, use Force Approve with caution.

### 2. Write Clear Reasons
For conditional and reject actions, write detailed reasons (min 10 chars). This helps NGOs improve and provides audit trail.

### 3. Use Bulk Actions Wisely
Bulk actions are powerful but permanent. Double-check selections before confirming.

### 4. Monitor Activity Feed
Check recent activity regularly to stay informed about team actions.

### 5. Assign Strategically
Assign vettings based on expertise (legal, financial, technical).

## Troubleshooting

### Approve button disabled?
✅ Check all required checklist items are completed  
✅ Or use Force Approve (type "FORCE" to confirm)

### Files not loading?
✅ Check network connection  
✅ Verify file URLs in Supabase Storage  
✅ Check browser console for errors

### Search not working?
✅ Clear filters and try again  
✅ Check spelling of NGO name or reg number  
✅ Try partial search (e.g., "Pakistan" not "Pakistan Education")

### Keyboard shortcuts not working?
✅ Ensure focus is not in input/textarea  
✅ Click outside input fields first  
✅ Check keyboard shortcut help (blue box below queue)

## Support

**Technical Issues:** dev@wasilah.pk  
**Feature Requests:** product@wasilah.pk  
**Documentation:** [Full Handoff Doc](/docs/ADMIN_DASHBOARD_HANDOFF.md)

---

**Last Updated:** December 15, 2024  
**Version:** 1.0  
**Status:** Production Ready ✅
