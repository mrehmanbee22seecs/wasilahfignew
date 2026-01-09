# 🎯 CRITICAL MISSING FEATURES - IMPLEMENTATION GUIDE

## OVERVIEW

This document outlines the **critical missing features** for each dashboard that are essential for platform functionality. These are features that, without implementation, prevent core workflows from functioning.

---

## 🏢 CORPORATE DASHBOARD - CRITICAL GAPS

### 1. **PAYMENT APPROVAL WORKFLOW** ⚠️ BLOCKING
**Why Critical**: Corporate cannot release payments to NGOs without this

**Current State**: Only has activity feed showing payments
**Required**:
```typescript
// /components/corporate/PaymentApprovalTab.tsx

interface PendingPayment {
  id: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  amount: number;
  currency: 'PKR';
  requestedBy: string;
  requestedAt: string;
  invoiceUrl?: string;
  milestone?: string;
  description: string;
  status: 'pending_approval' | 'approved' | 'rejected';
}

export function PaymentApprovalTab() {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);

  const handleApprove = async (paymentId: string, approverNotes: string) => {
    // MUST call Admin payment API for dual approval
    // Corporate approves → Admin Finance must also approve
    await supabase.from('payments').update({
      corporate_approved_at: new Date().toISOString(),
      corporate_approved_by: userId,
      corporate_notes: approverNotes,
      status: 'pending_admin_approval' // Dual approval!
    }).eq('id', paymentId);

    // Audit log
    await auditLog.payment('corporate_approve', paymentId);
    
    toast.success('Payment approved. Pending admin approval.');
  };

  const handleReject = async (paymentId: string, reason: string) => {
    await supabase.from('payments').update({
      status: 'rejected',
      rejected_by: userId,
      rejection_reason: reason
    }).eq('id', paymentId);

    toast.error('Payment rejected');
  };

  return (
    <div>
      {/* List of pending payments with invoice preview */}
      {/* Approve/Reject buttons */}
      {/* Payment history */}
    </div>
  );
}
```

**Implementation Priority**: 🔴 **P0 - CRITICAL**

---

### 2. **BUDGET TRACKING & ALERTS** ⚠️ BLOCKING
**Why Critical**: Corporate needs to monitor spend vs budget

**Required**:
```typescript
// /components/corporate/BudgetTracker.tsx

interface BudgetAlert {
  type: 'warning' | 'danger';
  message: string;
  threshold: number; // percentage
  projectId?: string;
}

export function BudgetTracker() {
  const totalBudget = 1500000; // PKR
  const totalSpent = 725000;
  const percentUsed = (totalSpent / totalBudget) * 100;

  // Alert thresholds
  const alerts: BudgetAlert[] = [];
  
  if (percentUsed >= 90) {
    alerts.push({
      type: 'danger',
      message: '90% of annual budget consumed',
      threshold: 90
    });
  } else if (percentUsed >= 75) {
    alerts.push({
      type: 'warning',
      message: '75% of annual budget consumed',
      threshold: 75
    });
  }

  // Per-project alerts
  projects.forEach(project => {
    const projectPercent = (project.spent / project.budget) * 100;
    if (projectPercent >= 100) {
      alerts.push({
        type: 'danger',
        message: `${project.title} is over budget`,
        threshold: 100,
        projectId: project.id
      });
    }
  });

  return (
    <div>
      {/* Budget overview chart */}
      {/* Alert banners */}
      {/* Forecast (burn rate) */}
      {/* Budget allocation by category */}
    </div>
  );
}
```

**Implementation Priority**: 🔴 **P0 - CRITICAL**

---

### 3. **CONTRACT MANAGEMENT** ⚠️ BLOCKING
**Why Critical**: Legal agreements with NGOs must be tracked

**Required**:
```typescript
// /components/corporate/ContractManagement.tsx

interface Contract {
  id: string;
  ngoId: string;
  ngoName: string;
  projectId: string;
  projectName: string;
  contractType: 'mou' | 'service_agreement' | 'grant_agreement';
  signedAt?: string;
  expiresAt: string;
  totalValue: number;
  status: 'draft' | 'pending_signature' | 'active' | 'expired' | 'terminated';
  documentUrl?: string;
  clauses: {
    deliverables: string[];
    paymentTerms: string;
    terminationClause: string;
  };
}

export function ContractManagement() {
  const [contracts, setContracts] = useState<Contract[]>([]);

  const expiringContracts = contracts.filter(c => {
    const daysUntilExpiry = daysBetween(new Date(), new Date(c.expiresAt));
    return daysUntilExpiry <= 30 && c.status === 'active';
  });

  return (
    <div>
      {/* Expiring contracts alert */}
      {/* Contract list with filters */}
      {/* Upload/generate contract */}
      {/* Digital signature integration (future) */}
    </div>
  );
}
```

**Implementation Priority**: 🟡 **P1 - HIGH**

---

## 🏛️ NGO DASHBOARD - CRITICAL GAPS

### 1. **PAYMENT REQUEST SYSTEM** ⚠️ BLOCKING
**Why Critical**: NGOs cannot request funds without this!

**Current State**: NGOs can submit project updates but cannot request payments
**Required**:
```typescript
// /components/ngo-dashboard/tabs/PaymentRequestsTab.tsx

interface PaymentRequest {
  id: string;
  projectId: string;
  milestoneId?: string;
  amount: number;
  currency: 'PKR';
  description: string;
  invoiceNumber: string;
  invoiceUrl: string; // Required!
  supportingDocs: string[]; // Receipts, bills
  requestedAt: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'paid';
  corporateApprovedAt?: string;
  adminApprovedAt?: string;
  paidAt?: string;
  rejectionReason?: string;
}

export function PaymentRequestsTab() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleSubmitRequest = async (data: Partial<PaymentRequest>) => {
    // Validate invoice uploaded
    if (!data.invoiceUrl) {
      toast.error('Invoice is required');
      return;
    }

    // Create payment request
    const { data: request, error } = await supabase
      .from('payment_requests')
      .insert({
        ...data,
        ngo_id: currentNgoId,
        status: 'submitted',
        requested_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Notify corporate
    await sendNotification({
      type: 'payment_request',
      recipientId: project.corporate_id,
      message: `${ngoName} has requested payment for ${projectName}`,
      link: `/corporate/payments/${request.id}`
    });

    toast.success('Payment request submitted');
    setShowCreateModal(false);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <h2>Payment Requests</h2>
        <button onClick={() => setShowCreateModal(true)}>
          Request Payment
        </button>
      </div>

      {/* Pending requests */}
      {/* Payment history */}
      {/* Total received YTD */}
      
      {showCreateModal && (
        <CreatePaymentRequestModal
          onSubmit={handleSubmitRequest}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
```

**Implementation Priority**: 🔴 **P0 - CRITICAL**

---

### 2. **BUDGET vs ACTUAL TRACKING** ⚠️ BLOCKING
**Why Critical**: NGOs must show they're spending funds properly

**Required**:
```typescript
// /components/ngo-projects/BudgetTracker.tsx

interface BudgetLine {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  committed: number; // Approved but not yet paid
  remaining: number;
  variance: number; // spent - budgeted
  variancePercent: number;
}

export function BudgetTracker({ projectId }: { projectId: string }) {
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([
    {
      id: '1',
      category: 'Staff Salaries',
      budgeted: 200000,
      spent: 150000,
      committed: 0,
      remaining: 50000,
      variance: -50000,
      variancePercent: -25
    },
    {
      id: '2',
      category: 'Materials & Supplies',
      budgeted: 100000,
      spent: 110000,
      committed: 0,
      remaining: -10000,
      variance: 10000,
      variancePercent: 10
    }
  ]);

  const totalBudgeted = budgetLines.reduce((sum, line) => sum + line.budgeted, 0);
  const totalSpent = budgetLines.reduce((sum, line) => sum + line.spent, 0);

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600">Total Budget</p>
          <p className="text-2xl">PKR {totalBudgeted.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl">PKR {totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600">Remaining</p>
          <p className="text-2xl">PKR {(totalBudgeted - totalSpent).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <p className="text-sm text-gray-600">Utilization</p>
          <p className="text-2xl">{((totalSpent / totalBudgeted) * 100).toFixed(1)}%</p>
        </div>
      </div>

      {/* Budget lines table */}
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Budgeted</th>
            <th>Spent</th>
            <th>Remaining</th>
            <th>Variance</th>
          </tr>
        </thead>
        <tbody>
          {budgetLines.map(line => (
            <tr key={line.id}>
              <td>{line.category}</td>
              <td>PKR {line.budgeted.toLocaleString()}</td>
              <td>PKR {line.spent.toLocaleString()}</td>
              <td className={line.remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                PKR {line.remaining.toLocaleString()}
              </td>
              <td className={line.variance > 0 ? 'text-red-600' : 'text-green-600'}>
                {line.variancePercent > 0 ? '+' : ''}{line.variancePercent}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Upload receipt/expense */}
      <button>Add Expense</button>
    </div>
  );
}
```

**Implementation Priority**: 🔴 **P0 - CRITICAL**

---

### 3. **INVOICE SUBMISSION** ⚠️ BLOCKING
**Why Critical**: Required for payment requests

**Required**:
```typescript
// /components/ngo-dashboard/InvoiceUpload.tsx

export function InvoiceUpload({ onUpload }: { onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    // Validate
    if (file.type !== 'application/pdf') {
      toast.error('Invoice must be PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Invoice must be under 5MB');
      return;
    }

    setUploading(true);

    try {
      // Upload to Supabase Storage
      const fileName = `invoices/${currentNgoId}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save metadata
      await supabase.from('invoices').insert({
        ngo_id: currentNgoId,
        file_name: file.name,
        file_url: publicUrl,
        file_size: file.size,
        uploaded_at: new Date().toISOString()
      });

      onUpload(publicUrl);
      toast.success('Invoice uploaded');
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-6">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      {uploading && <Loader2 className="animate-spin" />}
    </div>
  );
}
```

**Implementation Priority**: 🔴 **P0 - CRITICAL**

---

## 👤 VOLUNTEER DASHBOARD - CRITICAL GAPS

### 1. **BACKGROUND CHECK SUBMISSION** ⚠️ SAFETY CRITICAL
**Why Critical**: Safety for all participants

**Required**:
```typescript
// /components/volunteer/BackgroundCheckTab.tsx

interface BackgroundCheck {
  id: string;
  volunteerId: string;
  status: 'not_started' | 'pending' | 'approved' | 'rejected';
  submittedAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  documents: {
    cnicFront?: string;
    cnicBack?: string;
    policeClearance?: string;
    characterReference?: string;
  };
  verifiedBy?: string;
}

export function BackgroundCheckTab() {
  const [check, setCheck] = useState<BackgroundCheck | null>(null);

  const handleSubmit = async (documents: BackgroundCheck['documents']) => {
    // Upload all documents
    const uploads = await Promise.all([
      uploadDocument(documents.cnicFront!, 'cnic_front'),
      uploadDocument(documents.cnicBack!, 'cnic_back'),
      uploadDocument(documents.policeClearance!, 'police_clearance'),
      uploadDocument(documents.characterReference!, 'character_reference')
    ]);

    // Create check record
    await supabase.from('background_checks').insert({
      volunteer_id: userId,
      status: 'pending',
      documents: {
        cnicFront: uploads[0],
        cnicBack: uploads[1],
        policeClearance: uploads[2],
        characterReference: uploads[3]
      },
      submitted_at: new Date().toISOString()
    });

    toast.success('Background check submitted for review');
  };

  return (
    <div>
      {check?.status === 'approved' ? (
        <div className="bg-green-50 p-4 rounded">
          <CheckCircle className="text-green-600" />
          <p>Background check approved</p>
          <p className="text-sm">Valid until: {check.expiresAt}</p>
        </div>
      ) : (
        <div>
          <h3>Background Check Required</h3>
          <p>Upload the following documents:</p>
          <ul>
            <li>CNIC (front & back)</li>
            <li>Police Clearance Certificate</li>
            <li>Character Reference Letter</li>
          </ul>
          {/* Upload form */}
        </div>
      )}
    </div>
  );
}
```

**Implementation Priority**: 🔴 **P0 - CRITICAL** (Safety)

---

### 2. **CHECK-IN/CHECK-OUT FOR HOURS** ⚠️ BLOCKING
**Why Critical**: Cannot verify volunteer hours without this

**Required**:
```typescript
// /components/volunteer/AttendanceTracker.tsx

interface Attendance {
  id: string;
  volunteerId: string;
  projectId: string;
  eventId?: string;
  checkInAt: string;
  checkInLocation?: { lat: number; lng: number };
  checkOutAt?: string;
  checkOutLocation?: { lat: number; lng: number };
  totalHours?: number;
  status: 'checked_in' | 'checked_out' | 'verified' | 'disputed';
  verifiedBy?: string;
  verifiedAt?: string;
}

export function AttendanceTracker() {
  const [currentAttendance, setCurrentAttendance] = useState<Attendance | null>(null);

  const handleCheckIn = async (projectId: string) => {
    // Get location
    const location = await getCurrentLocation();

    // Verify at correct location (within 100m of project site)
    const distance = calculateDistance(location, projectLocation);
    if (distance > 100) {
      toast.error('You must be at the project site to check in');
      return;
    }

    // Create attendance record
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        volunteer_id: userId,
        project_id: projectId,
        check_in_at: new Date().toISOString(),
        check_in_location: location,
        status: 'checked_in'
      })
      .select()
      .single();

    if (error) throw error;

    setCurrentAttendance(data);
    toast.success('Checked in successfully');

    // Track analytics
    trackEvent({
      event: 'volunteer_check_in',
      properties: { projectId, timestamp: new Date().toISOString() }
    });
  };

  const handleCheckOut = async () => {
    if (!currentAttendance) return;

    const location = await getCurrentLocation();

    // Calculate hours
    const checkInTime = new Date(currentAttendance.checkInAt);
    const checkOutTime = new Date();
    const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

    // Update attendance
    await supabase
      .from('attendance')
      .update({
        check_out_at: checkOutTime.toISOString(),
        check_out_location: location,
        total_hours: hours,
        status: 'checked_out'
      })
      .eq('id', currentAttendance.id);

    toast.success(`Checked out. Total hours: ${hours.toFixed(2)}`);
    setCurrentAttendance(null);
  };

  return (
    <div>
      {currentAttendance ? (
        <div className="bg-green-50 p-6 rounded">
          <p className="text-green-900">You are checked in</p>
          <p className="text-sm">
            Since: {formatTime(currentAttendance.checkInAt)}
          </p>
          <button onClick={handleCheckOut}>Check Out</button>
        </div>
      ) : (
        <div>
          <h3>Ready to volunteer?</h3>
          <button onClick={() => handleCheckIn(selectedProject.id)}>
            Check In
          </button>
        </div>
      )}

      {/* Hours history */}
      <div className="mt-8">
        <h4>Your Hours</h4>
        {/* List of past check-ins */}
      </div>
    </div>
  );
}

// Helper to get location
const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      reject
    );
  });
};
```

**Implementation Priority**: 🔴 **P0 - CRITICAL**

---

## 👨‍💼 ADMIN DASHBOARD - CRITICAL GAPS

### 1. **REAL-TIME NOTIFICATIONS** ⚠️ BLOCKING
**Why Critical**: Admins miss critical events without this

**Required**:
```typescript
// /components/admin/NotificationCenter.tsx

interface Notification {
  id: string;
  type: 'ngo_verification' | 'payment_approval' | 'case_update' | 'urgent';
  title: string;
  message: string;
  link?: string;
  createdAt: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Real-time subscription
    const subscription = supabase
      .channel('admin_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${userId}`
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(c => c + 1);

          // Show toast for urgent notifications
          if (newNotif.priority === 'urgent') {
            toast.error(newNotif.message, {
              duration: 10000,
              action: {
                label: 'View',
                onClick: () => window.location.href = newNotif.link || '#'
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="relative">
      <button className="relative">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification dropdown */}
      <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg">
        {notifications.map(notif => (
          <NotificationItem key={notif.id} notification={notif} />
        ))}
      </div>
    </div>
  );
}
```

**Implementation Priority**: 🟡 **P1 - HIGH**

---

### 2. **BULK OPERATIONS** ⚠️ EFFICIENCY
**Why Critical**: Admins waste time processing one-by-one

**Required**:
```typescript
// /components/admin/BulkActions.tsx

export function BulkActions({ items, onComplete }: { items: any[], onComplete: () => void }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleBulkApprove = async () => {
    setProcessing(true);
    
    try {
      // Process in batches of 10
      const batches = chunk(selectedIds, 10);
      
      for (const batch of batches) {
        await Promise.all(
          batch.map(id =>
            supabase
              .from('vetting_requests')
              .update({ status: 'approved', approved_at: new Date().toISOString() })
              .eq('id', id)
          )
        );

        // Audit log for each
        await Promise.all(
          batch.map(id =>
            auditLog.ngo('approve', id, 'Bulk approval')
          )
        );
      }

      toast.success(`${selectedIds.length} items approved`);
      onComplete();
    } catch (error) {
      toast.error('Bulk operation failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex gap-2">
      <span>{selectedIds.length} selected</span>
      <button onClick={handleBulkApprove} disabled={processing}>
        Approve All
      </button>
      <button onClick={() => handleBulkReject()} disabled={processing}>
        Reject All
      </button>
      <button onClick={() => setSelectedIds([])}>
        Clear Selection
      </button>
    </div>
  );
}
```

**Implementation Priority**: 🟡 **P1 - HIGH**

---

## 🔄 REAL-TIME DATA SYNC IMPLEMENTATION

**Problem**: Changes in one dashboard don't reflect in others

**Solution**: Supabase Real-time

```typescript
// /lib/realtime.ts

export function useRealtimeSync(table: string, onUpdate: (payload: any) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: table
        },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table]);
}

// Usage in NGO Dashboard
export function NGODashboard() {
  const [vettingStatus, setVettingStatus] = useState('pending');

  // Listen for status changes from Admin
  useRealtimeSync('organizations', (payload) => {
    if (payload.new.id === currentNgoId) {
      setVettingStatus(payload.new.verification_status);
      
      if (payload.new.verification_status === 'verified') {
        toast.success('Congratulations! Your NGO has been verified.');
      }
    }
  });

  return <div>...</div>;
}

// Usage in Corporate Dashboard
export function CorporateDashboard() {
  const [projects, setProjects] = useState([]);

  // Listen for payment approvals from Admin
  useRealtimeSync('payments', (payload) => {
    if (payload.new.status === 'paid') {
      toast.success(`Payment of PKR ${payload.new.amount} has been processed`);
    }
  });

  return <div>...</div>;
}
```

---

## 📋 IMPLEMENTATION PRIORITY SUMMARY

### **MUST IMPLEMENT BEFORE LAUNCH** (Blocking Core Workflows):

1. 🔴 **Corporate Payment Approval** - Without this, no money flows
2. 🔴 **NGO Payment Requests** - Without this, NGOs can't get paid
3. 🔴 **NGO Invoice Submission** - Required for payments
4. 🔴 **Volunteer Background Checks** - Safety requirement
5. 🔴 **Volunteer Check-In/Out** - Hour verification
6. 🔴 **Real-time Data Sync** - Dashboards must communicate
7. 🔴 **Budget Tracking (both dashboards)** - Financial accountability

### **SHOULD IMPLEMENT SOON** (Important but not blocking):

8. 🟡 **Admin Notifications** - Critical alerts
9. 🟡 **Admin Bulk Operations** - Efficiency
10. 🟡 **Contract Management** - Legal compliance
11. 🟡 **Budget Alerts** - Prevent overspending

### **NICE TO HAVE** (Can defer):

12. 🟢 All other features listed in main audit

---

## ⏱️ ESTIMATED TIMELINE

- **Critical Features (1-7)**: 3-4 weeks
- **High Priority (8-11)**: 2 weeks
- **Total**: 5-6 weeks of development

**Recommended**: Implement in 2-week sprints:
- Sprint 1: Payment flows (Corporate + NGO)
- Sprint 2: Volunteer safety features + check-in
- Sprint 3: Real-time sync + notifications

---

## 🎯 SUCCESS CRITERIA

Before launch, verify:
- [ ] Corporate can approve payments
- [ ] NGO can request and receive payments
- [ ] NGO can track budget vs actual
- [ ] Volunteers can check in/out
- [ ] Volunteers pass background checks
- [ ] Admin receives real-time notifications
- [ ] All dashboards sync in real-time
- [ ] All critical actions are audited

**Once these are complete, the platform will be functional for core workflows!** 🚀
