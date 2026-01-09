# 🚀 FIGMA MAKE - BACKEND IMPLEMENTATION TASKS

**Generated:** January 8, 2026  
**Scope:** All backend tasks that CAN be completed in Figma Make  
**Priority:** P0 (Critical) → P1 (High) → P2 (Medium)  
**Estimated Total Time:** 120-150 hours  

---

## 📊 OVERVIEW

### What We CAN Do in Figma Make:
✅ Frontend auth integration with Supabase  
✅ API service layer (TypeScript clients)  
✅ Form validation (Zod schemas)  
✅ Real-time subscriptions  
✅ Protected routes & RBAC  
✅ Error handling & boundaries  
✅ Loading states & skeletons  
✅ Optimistic UI updates  
✅ Client-side caching  
✅ Toast notifications  

### What We CANNOT Do (Needs Backend IDE):
❌ Database schema creation (25 tables)  
❌ Row Level Security (RLS) policies  
❌ Supabase Edge Functions  
❌ Database triggers & functions  
❌ Third-party integrations  
❌ Scheduled jobs & cron tasks  
❌ Server-side security config  
❌ Data migrations & seeding  

---

## 🔴 PHASE 1: CRITICAL FOUNDATION (P0) - 40 hours

### **TASK 1: Authentication System** ⚡ BLOCKING
**Priority:** P0 | **Time:** 8 hours | **Dependencies:** None

#### 1.1 Create Auth Context
**File:** `/contexts/AuthContext.tsx`
```typescript
- Set up Supabase auth state listener
- Fetch user profile with role
- Provide user, role, loading, organization_id
- Handle sign in, sign out, sign up
- Session management
```

#### 1.2 Create Protected Route Component
**File:** `/components/auth/ProtectedRoute.tsx`
```typescript
- Check if user is authenticated
- Verify user has required role
- Redirect to /auth if not logged in
- Redirect to /unauthorized if wrong role
- Show loading spinner during check
```

#### 1.3 Create Role-Based Redirect
**File:** `/components/auth/RoleBasedRedirect.tsx`
```typescript
- After login, redirect based on role:
  - admin → /admin
  - corporate → /corporate-dashboard
  - ngo → /ngo-dashboard
  - volunteer → /volunteer-dashboard
```

#### 1.4 Update App.tsx with Routes
**File:** `/App.tsx`
```typescript
- Wrap app with AuthProvider
- Add protected route wrappers
- Role-based navigation
```

#### 1.5 Create Unauthorized Page
**File:** `/pages/UnauthorizedPage.tsx`
```typescript
- Show "Access Denied" message
- Link back to appropriate dashboard
- Show current role
```

---

### **TASK 2: API Service Layer** ⚡ BLOCKING
**Priority:** P0 | **Time:** 12 hours | **Dependencies:** Task 1

#### 2.1 Create Supabase Client
**File:** `/lib/supabase.ts`
```typescript
- Initialize Supabase client
- Export configured client
- Add error handling helpers
```

#### 2.2 Projects API
**File:** `/lib/api/projects.ts`
```typescript
Methods:
- list(filters) - Get all projects
- getById(id) - Get single project
- create(data) - Create project
- update(id, data) - Update project
- delete(id) - Delete project
- submit(id) - Submit for review
- approve(id) - Admin approve
- reject(id, reason) - Admin reject
- assignNGO(projectId, ngoId) - Assign to NGO
```

#### 2.3 Applications API
**File:** `/lib/api/applications.ts`
```typescript
Methods:
- list(filters) - Get applications
- getById(id) - Get single application
- create(data) - Create application
- update(id, data) - Update application
- approve(id) - Approve application
- reject(id, reason) - Reject application
- withdraw(id) - Withdraw application
```

#### 2.4 Payments API
**File:** `/lib/api/payments.ts`
```typescript
Methods:
- list(filters) - Get payments
- getById(id) - Get payment
- create(data) - Create payment request
- approve(id, approverId) - First approval
- secondApproval(id, approverId) - Second approval
- process(id) - Mark as processed
- reject(id, reason) - Reject payment
```

#### 2.5 Organizations API
**File:** `/lib/api/organizations.ts`
```typescript
Methods:
- list(filters) - Get organizations
- getById(id) - Get organization
- update(id, data) - Update profile
- submitVerification(id, documents) - Submit for verification
- approve(id) - Admin approve
- reject(id, reason) - Admin reject
```

#### 2.6 Volunteers API
**File:** `/lib/api/volunteers.ts`
```typescript
Methods:
- getProfile(id) - Get volunteer profile
- updateProfile(id, data) - Update profile
- submitBackgroundCheck(data) - Submit background check
- checkIn(projectId, location) - Check in to project
- checkOut(sessionId, location) - Check out of project
- getHours(volunteerId) - Get hours summary
```

#### 2.7 Documents API
**File:** `/lib/api/documents.ts`
```typescript
Methods:
- upload(file, metadata) - Upload to Supabase Storage
- list(filters) - Get documents
- getById(id) - Get document
- delete(id) - Delete document
- verify(id, status) - Admin verify
```

#### 2.8 Notifications API
**File:** `/lib/api/notifications.ts`
```typescript
Methods:
- list(userId) - Get notifications
- markAsRead(id) - Mark as read
- markAllAsRead(userId) - Mark all as read
- delete(id) - Delete notification
```

---

### **TASK 3: Form Validation Schemas** ⚡ BLOCKING
**Priority:** P0 | **Time:** 6 hours | **Dependencies:** None

#### 3.1 Install Zod
```bash
import { z } from 'zod'
```

#### 3.2 Create Validation Schemas
**File:** `/lib/validation/schemas.ts`

```typescript
// Project Schema
export const projectSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(50),
  type: z.enum(['environment', 'education', 'health', 'poverty', 'infrastructure', 'other']),
  city: z.string().min(2),
  budget: z.number().positive(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  // ... more fields
})

// Application Schema
export const applicationSchema = z.object({
  project_id: z.string().uuid(),
  cover_letter: z.string().min(100),
  availability: z.array(z.string()),
  // ... more fields
})

// Payment Schema
export const paymentSchema = z.object({
  project_id: z.string().uuid(),
  amount: z.number().positive(),
  payment_method: z.enum(['bank_transfer', 'jazzcash', 'easypaisa']),
  // ... more fields
})

// Organization Schema
export const organizationUpdateSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(50),
  website: z.string().url().optional(),
  // ... more fields
})

// Volunteer Background Check Schema
export const backgroundCheckSchema = z.object({
  check_type: z.enum(['basic', 'standard', 'enhanced']),
  documents: z.array(z.instanceof(File)).min(1),
  // ... more fields
})
```

---

### **TASK 4: Real-time Subscriptions** ⚡ CRITICAL
**Priority:** P0 | **Time:** 8 hours | **Dependencies:** Task 2

#### 4.1 Create Real-time Hooks
**File:** `/hooks/useRealtimeProjects.ts`
```typescript
- Subscribe to projects table
- Handle INSERT, UPDATE, DELETE events
- Update local state automatically
- Filter by user's organization
```

**File:** `/hooks/useRealtimeApplications.ts`
```typescript
- Subscribe to applications table
- Real-time status updates
- Filter by volunteer/organization
```

**File:** `/hooks/useRealtimePayments.ts`
```typescript
- Subscribe to payments table
- Real-time approval updates
- Filter by organization
```

**File:** `/hooks/useRealtimeNotifications.ts`
```typescript
- Subscribe to notifications table
- Show toast on new notification
- Update notification count badge
```

---

### **TASK 5: Error Handling System** ⚡ CRITICAL
**Priority:** P0 | **Time:** 6 hours | **Dependencies:** None

#### 5.1 Create Error Boundary
**File:** `/components/ErrorBoundary.tsx`
```typescript
- Catch React errors
- Display error fallback UI
- Log errors to Supabase (if DB exists)
- Provide "Reset" button
```

#### 5.2 Create Error Handling Utilities
**File:** `/lib/errors.ts`
```typescript
- handleSupabaseError(error) - Format Supabase errors
- handleValidationError(error) - Format Zod errors
- logError(error, context) - Log to console/service
- showErrorToast(error) - User-friendly error messages
```

#### 5.3 Create API Error Handler
**File:** `/lib/api/errorHandler.ts`
```typescript
- Wrap all API calls
- Handle network errors
- Handle 401 (redirect to login)
- Handle 403 (show unauthorized)
- Handle 500 (show error message)
```

---

## 🟡 PHASE 2: HIGH PRIORITY (P1) - 50 hours

### **TASK 6: Connect Corporate Dashboard to Real Data** 🔥 HIGH
**Priority:** P1 | **Time:** 10 hours | **Dependencies:** Tasks 1-5

#### 6.1 Update CorporateDashboard.tsx
```typescript
Files to update:
- /pages/CorporateDashboard.tsx
- /components/corporate/ProjectsTab.tsx
- /components/corporate/ApplicationsTab.tsx
- /components/corporate/PaymentsTab.tsx
- /components/corporate/AnalyticsTab.tsx

Changes:
- Replace MOCK_* data with API calls
- Add loading states
- Add error handling
- Implement real-time updates
- Add form submissions
```

#### 6.2 Create Project Creation Flow
```typescript
- Use react-hook-form with Zod validation
- Multi-step form (5 steps)
- File uploads for images/documents
- Auto-save drafts
- Submit for approval
```

#### 6.3 Create Application Review Flow
```typescript
- List applications for my projects
- Filter by status
- Approve/Reject with reasons
- View volunteer profiles
- Send notifications
```

---

### **TASK 7: Connect NGO Dashboard to Real Data** 🔥 HIGH
**Priority:** P1 | **Time:** 10 hours | **Dependencies:** Tasks 1-5

#### 7.1 Update NGODashboard.tsx
```typescript
Files to update:
- /pages/NGODashboard.tsx
- /components/ngo/ActiveProjectsTab.tsx
- /components/ngo/ProjectProposalsTab.tsx
- /components/ngo/TeamManagementTab.tsx
- /components/ngo/FinancialTab.tsx

Changes:
- Replace mock data with API calls
- Add real-time project updates
- Implement payment requests
- Add invoice uploads
- Track budget vs actual
```

#### 7.2 Create Project Acceptance Flow
```typescript
- View assigned projects
- Accept/Reject assignments
- Upload project plans
- Set milestones
- Assign team members
```

#### 7.3 Create Payment Request Flow
```typescript
- Create payment request
- Attach invoices/receipts
- Submit for dual approval
- Track approval status
- View payment history
```

---

### **TASK 8: Connect Volunteer Dashboard to Real Data** 🔥 HIGH
**Priority:** P1 | **Time:** 8 hours | **Dependencies:** Tasks 1-5

#### 8.1 Update VolunteerDashboard.tsx
```typescript
Files to update:
- /pages/VolunteerDashboard.tsx
- /components/volunteer/BackgroundCheckTab.tsx
- /components/volunteer/HoursTrackingTab.tsx

Changes:
- Replace mock data with API calls
- Implement background check submission
- Real check-in/check-out
- Hours verification workflow
- Certificate viewing
```

#### 8.2 Create Background Check Flow
```typescript
- Upload CNIC/documents
- Select check type (basic/standard/enhanced)
- Submit for admin review
- Track verification status
- View approval/rejection
```

#### 8.3 Create Hours Tracking Flow
```typescript
- Check in to project (with geolocation)
- Check out of project (with geolocation)
- Submit hours for approval
- View hours summary
- Download certificates
```

---

### **TASK 9: Connect Admin Dashboard to Real Data** 🔥 HIGH
**Priority:** P1 | **Time:** 12 hours | **Dependencies:** Tasks 1-5

#### 9.1 Update Admin Dashboard Pages
```typescript
Files to update:
- /pages/AdminDashboard.tsx
- /components/admin/AdminOverviewTab.tsx
- /pages/CaseManagementPage.tsx
- /pages/PaymentsFinancePage.tsx
- /pages/AuditLogPage.tsx
- /pages/RoleManagementPage.tsx

Changes:
- Replace mock data with real queries
- Implement vetting queue
- Add bulk actions
- Real-time updates
- Advanced filters
```

#### 9.2 Create Vetting Queue System
```typescript
- List pending organizations
- List pending projects
- List pending volunteers
- Quick approve/reject
- Bulk approve
- Add notes/flags
```

#### 9.3 Create Case Management System
```typescript
- Create investigation cases
- Assign to investigators
- Track case timeline
- Upload evidence
- Mark as resolved
```

#### 9.4 Create Dual-Approval Payment System
```typescript
- View pending payments
- First approver approval
- Second approver approval
- Track approval chain
- Audit trail
```

---

### **TASK 10: Client-Side Caching with React Query** 🔥 HIGH
**Priority:** P1 | **Time:** 6 hours | **Dependencies:** Task 2

#### 10.1 Install React Query
```bash
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
```

#### 10.2 Create Query Hooks
**File:** `/hooks/queries/useProjects.ts`
```typescript
export function useProjects(filters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectsApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProject(id) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created!')
    },
  })
}
```

Similar hooks for:
- `/hooks/queries/useApplications.ts`
- `/hooks/queries/usePayments.ts`
- `/hooks/queries/useOrganizations.ts`
- `/hooks/queries/useVolunteers.ts`

---

### **TASK 11: Optimistic UI Updates** 🔥 HIGH
**Priority:** P1 | **Time:** 4 hours | **Dependencies:** Task 10

#### 11.1 Implement Optimistic Updates
```typescript
Example for approving application:

export function useApproveApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => applicationsApi.approve(id),
    
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['applications'] })
      
      const previous = queryClient.getQueryData(['applications'])
      
      queryClient.setQueryData(['applications'], (old) =>
        old.map(app => 
          app.id === id 
            ? { ...app, status: 'approved' }
            : app
        )
      )
      
      return { previous }
    },
    
    // Rollback on error
    onError: (err, id, context) => {
      queryClient.setQueryData(['applications'], context.previous)
      toast.error('Failed to approve application')
    },
    
    // Refetch on success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
```

---

## 🟢 PHASE 3: MEDIUM PRIORITY (P2) - 30 hours

### **TASK 12: Advanced Loading States** 📊 MEDIUM
**Priority:** P2 | **Time:** 6 hours | **Dependencies:** None

#### 12.1 Create Skeleton Components
```typescript
Files to create:
- /components/skeletons/ProjectCardSkeleton.tsx
- /components/skeletons/TableSkeleton.tsx
- /components/skeletons/DashboardSkeleton.tsx
- /components/skeletons/FormSkeleton.tsx
```

#### 12.2 Create Loading States
```typescript
- Inline loading spinners
- Full-page loading screens
- Button loading states
- Skeleton screens for data tables
- Progressive loading for images
```

---

### **TASK 13: File Upload System** 📁 MEDIUM
**Priority:** P2 | **Time:** 8 hours | **Dependencies:** Task 2

#### 13.1 Create Upload Component
**File:** `/components/FileUpload.tsx`
```typescript
Features:
- Drag & drop interface
- Multiple file support
- File type validation
- Size limit validation
- Upload progress indicator
- Preview images before upload
- Upload to Supabase Storage
- Error handling
```

#### 13.2 Create File Manager
**File:** `/components/FileManager.tsx`
```typescript
Features:
- List uploaded files
- Preview files (images, PDFs)
- Download files
- Delete files
- Rename files
- Organize in folders
```

---

### **TASK 14: Search & Filters** 🔍 MEDIUM
**Priority:** P2 | **Time:** 6 hours | **Dependencies:** Task 2

#### 14.1 Create Search Component
**File:** `/components/Search.tsx`
```typescript
Features:
- Debounced search input
- Search across multiple fields
- Clear button
- Search history
- Keyboard shortcuts
```

#### 14.2 Create Advanced Filters
**File:** `/components/AdvancedFilters.tsx`
```typescript
Filters for:
- Date range picker
- Status multi-select
- Location filter
- Budget range slider
- SDG selector
- Sort options
```

---

### **TASK 15: Export & Download Features** 📥 MEDIUM
**Priority:** P2 | **Time:** 6 hours | **Dependencies:** Task 2

#### 15.1 Create Export Functions
**File:** `/lib/export.ts`
```typescript
Functions:
- exportToCSV(data, filename)
- exportToExcel(data, filename)
- exportToPDF(data, template)
- downloadReport(reportId)
```

#### 15.2 Add Export Buttons
```typescript
- Export projects to CSV
- Export applications to Excel
- Export payment history to PDF
- Download volunteer certificates
- Download audit logs
```

---

### **TASK 16: Notifications System** 🔔 MEDIUM
**Priority:** P2 | **Time:** 4 hours | **Dependencies:** Task 4

#### 16.1 Create Notification Panel
**File:** `/components/NotificationPanel.tsx`
```typescript
Features:
- List all notifications
- Filter by type
- Mark as read
- Mark all as read
- Delete notifications
- Real-time updates
- Notification count badge
```

#### 16.2 Create Notification Toast
```typescript
- Show toast on new notification
- Different types (success, error, info, warning)
- Action buttons in toast
- Auto-dismiss
- Sound/vibration (optional)
```

---

## 🎯 IMPLEMENTATION ORDER (Recommended)

### **WEEK 1: Foundation** (40 hours)
1. ✅ Task 1: Authentication System (8h)
2. ✅ Task 2: API Service Layer (12h)
3. ✅ Task 3: Form Validation Schemas (6h)
4. ✅ Task 4: Real-time Subscriptions (8h)
5. ✅ Task 5: Error Handling System (6h)

**Deliverable:** Auth working, API layer ready, real-time updates functional

---

### **WEEK 2: Connect Dashboards** (40 hours)
6. ✅ Task 6: Corporate Dashboard (10h)
7. ✅ Task 7: NGO Dashboard (10h)
8. ✅ Task 8: Volunteer Dashboard (8h)
9. ✅ Task 9: Admin Dashboard (12h)

**Deliverable:** All dashboards connected to real data (once DB is ready)

---

### **WEEK 3: Performance & UX** (24 hours)
10. ✅ Task 10: React Query (6h)
11. ✅ Task 11: Optimistic Updates (4h)
12. ✅ Task 12: Loading States (6h)
13. ✅ Task 13: File Uploads (8h)

**Deliverable:** Fast, responsive, production-grade UX

---

### **WEEK 4: Advanced Features** (16 hours)
14. ✅ Task 14: Search & Filters (6h)
15. ✅ Task 15: Export Features (6h)
16. ✅ Task 16: Notifications (4h)

**Deliverable:** Complete feature set ready for production

---

## 📋 TASK CHECKLIST (Copy to track progress)

### Phase 1: Critical Foundation (P0)
- [ ] Task 1.1: Create AuthContext
- [ ] Task 1.2: Create ProtectedRoute
- [ ] Task 1.3: Create RoleBasedRedirect
- [ ] Task 1.4: Update App.tsx routes
- [ ] Task 1.5: Create UnauthorizedPage
- [ ] Task 2.1: Supabase client setup
- [ ] Task 2.2: Projects API
- [ ] Task 2.3: Applications API
- [ ] Task 2.4: Payments API
- [ ] Task 2.5: Organizations API
- [ ] Task 2.6: Volunteers API
- [ ] Task 2.7: Documents API
- [ ] Task 2.8: Notifications API
- [ ] Task 3.1: Install Zod
- [ ] Task 3.2: Create validation schemas
- [ ] Task 4.1: Real-time hooks
- [ ] Task 5.1: Error Boundary
- [ ] Task 5.2: Error utilities
- [ ] Task 5.3: API error handler

### Phase 2: Dashboard Integration (P1)
- [ ] Task 6: Corporate Dashboard integration
- [ ] Task 7: NGO Dashboard integration
- [ ] Task 8: Volunteer Dashboard integration
- [ ] Task 9: Admin Dashboard integration
- [ ] Task 10: React Query setup
- [ ] Task 11: Optimistic updates

### Phase 3: Advanced Features (P2)
- [ ] Task 12: Loading states & skeletons
- [ ] Task 13: File upload system
- [ ] Task 14: Search & filters
- [ ] Task 15: Export features
- [ ] Task 16: Notifications system

---

## ⚠️ IMPORTANT NOTES

### What We Need from Backend IDE FIRST:
Before we can complete Tasks 6-16, we need:
1. ✅ Complete database schema (25 tables created)
2. ✅ Row Level Security (RLS) policies enabled
3. ✅ Supabase Storage buckets configured
4. ✅ Basic indexes created
5. ✅ Initial data seeded (at minimum: admin user, roles)

### Dependencies:
- All Phase 2 tasks (6-11) depend on database being ready
- All Phase 3 tasks (12-16) can be done independently but are lower priority

### Testing Strategy:
- Each task should be tested individually
- Use mock data until DB is ready
- Switch to real API calls once DB is deployed
- Integration testing after all tasks complete

---

## 🎯 SUCCESS CRITERIA

After completing all Figma Make tasks, you should have:

✅ **Authentication**
- Users can sign up, log in, log out
- Role-based access control working
- Protected routes enforcing permissions

✅ **Data Integration**
- All dashboards connected to Supabase
- Real-time updates working
- Forms submitting data correctly

✅ **Performance**
- Data caching with React Query
- Optimistic updates for better UX
- Loading states preventing blank screens

✅ **User Experience**
- Error messages are user-friendly
- File uploads working smoothly
- Search and filters functional
- Export features working

✅ **Code Quality**
- Type-safe with TypeScript
- Validated with Zod schemas
- Consistent error handling
- Reusable API services

---

## 📞 NEXT STEPS

1. **Review this document** - Ensure you understand all tasks
2. **Choose starting point** - Recommend starting with Phase 1, Task 1
3. **Set up environment** - Ensure Supabase project is connected
4. **Begin implementation** - Start with authentication system
5. **Test incrementally** - Test each task before moving to next
6. **Document progress** - Update checklist as you complete tasks
7. **Coordinate with backend** - Know when database will be ready
8. **Plan integration** - Schedule time to connect dashboards once DB is live

---

**Total Estimated Time:** 120-150 hours (3-4 weeks full-time)  
**Priority Focus:** Complete Phase 1 first, then Phase 2, then Phase 3  
**Critical Path:** Authentication → API Layer → Dashboard Integration

**Ready to begin? Let's start with Task 1: Authentication System! 🚀**
