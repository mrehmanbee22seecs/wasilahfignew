# Wasilah Navigation Hierarchy & UX Flow

## ✅ Updated Navigation Structure

### **Corporate Dashboard** (`/corporate-dashboard`)
Comprehensive corporate portal with sidebar navigation and 5 integrated tabs:

1. **Overview Tab** - KPIs, active projects, activity feed
2. **Projects Tab** ⭐ - Full Projects Manager (previously standalone)
3. **CSR Plan Tab** - Strategic planning and SDG alignment
4. **Volunteering Tab** - Employee volunteer management
5. **Calendar Tab** - Events and scheduling

**Navigation Features:**
- ✅ Persistent sidebar with all tabs
- ✅ Collapsible sidebar (desktop)
- ✅ Mobile-responsive with overlay menu
- ✅ Mobile floating menu button
- ✅ Fully visible and functional menu
- ✅ Settings and Help in footer

**Projects Manager Integration:**
- Table & card views
- Multi-step Create Project Modal (5 steps)
- Project Detail Drawer (6 tabs)
- Full CRUD operations
- Search, filter, sort
- All features accessible from Projects tab

---

### **NGO Dashboard** (`/ngo-dashboard`)
Complete NGO management portal with sidebar navigation and 5 integrated tabs:

1. **Overview Tab** - Quick stats, verification status, recent activity
2. **Projects Tab** ⭐ - Assigned projects & update submission (previously standalone)
3. **Profile & Verification Tab** - Organization details and vetting
4. **Documents Tab** - Document upload and management
5. **Scorecard Tab** - Performance metrics and ratings

**Navigation Features:**
- ✅ Persistent sidebar with NGO branding
- ✅ Quick stats in sidebar header
- ✅ Mobile-responsive with overlay menu
- ✅ Verification timeline stepper
- ✅ Context-aware action buttons
- ✅ Support and help in footer

**Projects Tab Integration:**
- Projects list (card/table view)
- Submit Update Modal (4 steps):
  - Step 1: Task Checklist with evidence validation
  - Step 2: Media Upload with geo-tagging
  - Step 3: Report Writing with structured fields
  - Step 4: Review & Confirmation
- Reports list with download
- Search and filters
- All features accessible from Projects tab

---

## 🎯 Access Points

### Quick Access Menu (Floating Button)
Located: Bottom-right corner on all pages

**Options:**
1. **Auth System** - Authentication flows
2. **Corporate Dashboard** - With "Includes Projects Manager" label
3. **NGO Dashboard** - With "Includes Projects Tab" label

### User Flow Examples

#### Corporate User Journey
```
1. Login → Auth Page
2. Dashboard → Corporate Dashboard (Overview Tab)
3. Navigate to Projects tab via sidebar
4. View/manage all projects
5. Click "Create Project" → Multi-step modal
6. Submit → Project appears in list
7. Click project → Detail drawer opens
8. Navigate between tabs in sidebar
```

#### NGO User Journey
```
1. Login → Auth Page
2. Dashboard → NGO Dashboard (Overview Tab)
3. Navigate to Projects tab via sidebar
4. View assigned projects
5. Click "Submit Update" → 4-step modal
6. Complete tasks → Upload media → Write report → Review
7. Submit → Project progress updates
8. Navigate to Documents tab to upload compliance docs
9. Navigate to Scorecard to view performance
```

---

## 🧭 Navigation Best Practices

### Desktop Experience
- **Sidebar always visible** for easy tab switching
- Hover states on all navigation items
- Active tab highlighted with gradient
- Collapse button for more workspace
- Keyboard navigation support (Arrow keys)

### Mobile Experience
- Hamburger menu in header
- Full-screen sidebar overlay
- Touch-optimized targets (44px min)
- Bottom floating menu button
- Swipe to close sidebar
- Native file pickers for uploads

### Accessibility
- ARIA labels on all navigation
- `aria-current="page"` on active tabs
- Keyboard focus visible
- Screen reader announcements
- Semantic HTML structure

---

## 📊 Component Hierarchy

### Corporate Dashboard
```
CorporateDashboard.tsx
├── DashboardNav (sidebar)
│   ├── Overview
│   ├── Projects ← CorporateProjectsPage integrated
│   ├── CSR Plan
│   ├── Volunteering
│   └── Calendar
└── Tab Content Area
    └── Renders active tab component
```

### NGO Dashboard
```
NGODashboard.tsx
├── Sidebar (custom NGO nav)
│   ├── Overview
│   ├── Projects ← ProjectsTab + SubmitUpdateModal
│   ├── Profile & Verification
│   ├── Documents
│   └── Scorecard
└── Tab Content Area
    └── Renders active tab component
```

---

## 🔄 State Management

### Corporate Dashboard State
```typescript
- activeTab: 'overview' | 'projects' | 'csr-plan' | 'volunteering' | 'calendar'
- isNavCollapsed: boolean
- isMobileNavOpen: boolean
- selectedProject: Project | null (for detail drawer)
- showCreateModal: boolean
```

### NGO Dashboard State
```typescript
- activeTab: 'overview' | 'projects' | 'profile' | 'documents' | 'scorecard'
- sidebarOpen: boolean (mobile)
- projectsData: NGOAssignedProject[]
- selectedProject: NGOAssignedProject | null
- showSubmitUpdateModal: boolean
- showVerificationModal: boolean
```

---

## 🚀 Future Enhancements

### Potential Additions
1. **Breadcrumbs** - Show navigation path
2. **Recent Items** - Quick access to recently viewed projects
3. **Notifications** - In-app notification center
4. **Search** - Global search across dashboard
5. **Customizable Tabs** - User can reorder tabs
6. **Shortcuts** - Keyboard shortcuts overlay (Cmd+K)

### Analytics Integration
- Track tab navigation
- Monitor most-used features
- A/B test tab ordering
- Measure time-to-task completion

---

## 🎨 Design Tokens

### Sidebar
- Width: 256px (w-64) collapsed: 80px (w-20)
- Background: white
- Border: 2px slate-200
- Active Tab: gradient teal-600 to blue-600
- Hover: slate-100

### Mobile
- Overlay: black/40
- Transition: 300ms
- z-index: 40 (overlay), 50 (sidebar)

### Icons
- Size: 20px (w-5 h-5)
- Color: slate-700 (inactive), white (active)

---

## ✅ Testing Checklist

### Desktop
- [ ] All tabs accessible via sidebar
- [ ] Collapse/expand sidebar works
- [ ] Active tab highlighted correctly
- [ ] Hover states working
- [ ] Keyboard navigation (Arrow keys)
- [ ] Projects tab shows full functionality
- [ ] Modals open/close correctly

### Mobile
- [ ] Hamburger menu shows/hides sidebar
- [ ] Sidebar overlay covers content
- [ ] Tap outside closes sidebar
- [ ] Tab navigation works
- [ ] Bottom menu button visible
- [ ] All features accessible on small screens
- [ ] File uploads use native picker

### Navigation Flows
- [ ] Can switch between all tabs
- [ ] Back button behavior correct
- [ ] Deep linking works (if implemented)
- [ ] State persists during tab switches
- [ ] Unsaved changes prompts work

---

**Last Updated:** December 15, 2025  
**Version:** 2.0.0  
**Status:** ✅ Navigation Hierarchy Refactored & Complete
