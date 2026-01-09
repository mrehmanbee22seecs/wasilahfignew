# 🏗️ WASILAH - COMPREHENSIVE BACKEND, DATABASE & SECURITY ANALYSIS

**Generated:** January 8, 2026  
**Platform Status:** Frontend 100% Complete | Backend 5% Complete  
**Critical Priority:** Production deployment requires immediate backend implementation

---

## 📋 EXECUTIVE SUMMARY

### Current State
- ✅ **Frontend:** 100% complete across all 4 dashboards (250+ components)
- ✅ **UI/UX:** Production-ready, WCAG AA compliant, fully responsive
- ⚠️ **Backend:** Only auth schema exists, 95% of backend is missing
- 🔴 **Security:** Critical vulnerabilities - NOT production-ready
- 🔴 **Database:** Only 4 tables exist, need 25+ more tables
- 🔴 **APIs:** Zero API endpoints implemented

### What This Document Covers
1. **Complete database schema** (all 29 required tables)
2. **All API endpoints needed** (80+ endpoints across 12 categories)
3. **Security implementation roadmap** (authentication, authorization, encryption)
4. **What can be done in Figma Make** vs **what needs backend IDE**
5. **Implementation priority matrix** (P0, P1, P2)
6. **Estimated timeline** (8-12 weeks for full implementation)

---

## 🗄️ PART 1: COMPLETE DATABASE SCHEMA

### Currently Exists (4 tables)
✅ `profiles` - User profiles  
✅ `organizations` - Corporate/NGO organizations  
✅ `auth_metadata` - Authentication events  
✅ `rate_limits` - Rate limiting tracking  

### MUST CREATE (25 tables)

#### **Category 1: Core Entities (6 tables)**

```sql
-- 1. PROJECTS TABLE
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  
  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Categorization
  type TEXT NOT NULL CHECK (type IN ('environment', 'education', 'health', 'poverty', 'infrastructure', 'other')),
  sdgs INTEGER[] DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  
  -- Location
  country TEXT DEFAULT 'Pakistan',
  city TEXT NOT NULL,
  address TEXT,
  coordinates JSONB, -- {lat, lng}
  
  -- Timeline
  start_date DATE NOT NULL,
  end_date DATE,
  duration_months INTEGER,
  
  -- Resources
  budget NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  budget_breakdown JSONB, -- [{category, amount, notes}]
  volunteer_target INTEGER DEFAULT 0,
  volunteer_count INTEGER DEFAULT 0,
  
  -- Delivery
  delivery_mode TEXT CHECK (delivery_mode IN ('on-ground', 'virtual', 'hybrid')),
  
  -- Status & Workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'active', 'completed', 'cancelled', 'suspended')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'organization', 'public')),
  
  -- Approval Workflow
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  
  -- NGO Assignment
  assigned_ngo_id UUID REFERENCES organizations(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  ngo_status TEXT CHECK (ngo_status IN ('pending', 'accepted', 'rejected', 'completed')),
  
  -- Impact Tracking
  beneficiaries_target INTEGER DEFAULT 0,
  beneficiaries_reached INTEGER DEFAULT 0,
  impact_metrics JSONB, -- Custom metrics per project
  
  -- Media & Documents
  cover_image_url TEXT,
  media_urls TEXT[] DEFAULT '{}',
  document_ids UUID[] DEFAULT '{}',
  
  -- Completion
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_projects_ngo ON projects(assigned_ngo_id);
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_city ON projects(city);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);


-- 2. APPLICATIONS TABLE
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  opportunity_id UUID REFERENCES volunteer_opportunities(id),
  
  -- Application Data
  motivation TEXT NOT NULL, -- Why do you want to join?
  relevant_experience TEXT,
  availability JSONB, -- Days/times available
  skills TEXT[] DEFAULT '{}',
  
  -- Attachments
  resume_url TEXT,
  portfolio_url TEXT,
  attachments JSONB, -- [{name, url, type}]
  
  -- Status & Workflow
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'draft', 'submitted', 'under_review', 'shortlisted', 
    'interview_scheduled', 'accepted', 'rejected', 'withdrawn', 'waitlist'
  )),
  
  -- Review Process
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  rejection_reason TEXT,
  
  -- Interview (if applicable)
  interview_scheduled_at TIMESTAMP WITH TIME ZONE,
  interview_completed_at TIMESTAMP WITH TIME ZONE,
  interview_notes TEXT,
  interview_score INTEGER CHECK (interview_score >= 0 AND interview_score <= 100),
  
  -- Acceptance
  accepted_at TIMESTAMP WITH TIME ZONE,
  accepted_by UUID REFERENCES auth.users(id),
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Withdrawal
  withdrawn_at TIMESTAMP WITH TIME ZONE,
  withdrawal_reason TEXT,
  
  -- Metadata
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint: one application per user per project
  UNIQUE(user_id, project_id)
);

CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_project ON applications(project_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date ON applications(applied_at DESC);


-- 3. VOLUNTEER_OPPORTUNITIES TABLE
CREATE TABLE volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  project_id UUID REFERENCES projects(id),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  
  -- Requirements
  skills_required TEXT[] DEFAULT '{}',
  age_min INTEGER CHECK (age_min >= 16),
  age_max INTEGER CHECK (age_max <= 100),
  education_level TEXT, -- 'high_school', 'undergraduate', 'graduate', 'any'
  experience_required TEXT, -- 'none', 'some', 'extensive'
  
  -- Logistics
  location TEXT NOT NULL,
  remote_possible BOOLEAN DEFAULT false,
  time_commitment TEXT, -- '2 hours/week', '1 day', 'ongoing', etc.
  schedule JSONB, -- {days: ['Monday', 'Friday'], times: ['9am-12pm']}
  
  -- Capacity
  spots_total INTEGER NOT NULL,
  spots_filled INTEGER DEFAULT 0,
  waitlist_enabled BOOLEAN DEFAULT false,
  
  -- Timeline
  application_deadline DATE,
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Categorization
  category TEXT NOT NULL CHECK (category IN (
    'tutoring', 'mentoring', 'healthcare', 'environment',
    'community_service', 'disaster_relief', 'advocacy',
    'fundraising', 'administration', 'event_support', 'other'
  )),
  sdgs INTEGER[] DEFAULT '{}',
  
  -- Benefits
  certificate_provided BOOLEAN DEFAULT true,
  meals_provided BOOLEAN DEFAULT false,
  transport_provided BOOLEAN DEFAULT false,
  stipend_amount NUMERIC(10,2) DEFAULT 0,
  
  -- Visibility & Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed', 'cancelled', 'completed')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('private', 'public')),
  featured BOOLEAN DEFAULT false,
  
  -- Application Settings
  requires_background_check BOOLEAN DEFAULT false,
  requires_interview BOOLEAN DEFAULT false,
  auto_accept BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_opportunities_status ON volunteer_opportunities(status);
CREATE INDEX idx_opportunities_org ON volunteer_opportunities(organization_id);
CREATE INDEX idx_opportunities_project ON volunteer_opportunities(project_id);
CREATE INDEX idx_opportunities_deadline ON volunteer_opportunities(application_deadline);
CREATE INDEX idx_opportunities_featured ON volunteer_opportunities(featured);


-- 4. PAYMENTS TABLE
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  project_id UUID NOT NULL REFERENCES projects(id),
  from_organization_id UUID NOT NULL REFERENCES organizations(id), -- Corporate
  to_organization_id UUID NOT NULL REFERENCES organizations(id), -- NGO
  invoice_id UUID REFERENCES invoices(id),
  milestone_id UUID REFERENCES project_milestones(id),
  
  -- Payment Details
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'PKR',
  description TEXT NOT NULL,
  category TEXT, -- 'milestone', 'reimbursement', 'advance', 'final'
  
  -- Supporting Documents
  invoice_number TEXT,
  invoice_url TEXT,
  supporting_docs JSONB, -- [{name, url, type, uploaded_at}]
  receipt_url TEXT,
  
  -- Dual Approval Workflow
  status TEXT DEFAULT 'pending_corporate' CHECK (status IN (
    'draft',
    'pending_corporate',    -- Awaiting corporate approval
    'pending_admin',        -- Corporate approved, awaiting admin
    'approved',             -- Both approved, ready to disburse
    'processing',           -- Payment in progress
    'paid',                 -- Successfully paid
    'failed',               -- Payment failed
    'rejected',             -- Rejected by corporate or admin
    'cancelled'             -- Cancelled by requester
  )),
  
  -- Corporate Approval (First Approval)
  corporate_reviewed_by UUID REFERENCES auth.users(id),
  corporate_reviewed_at TIMESTAMP WITH TIME ZONE,
  corporate_approved BOOLEAN,
  corporate_notes TEXT,
  corporate_rejection_reason TEXT,
  
  -- Admin Approval (Second Approval - Must be different person)
  admin_reviewed_by UUID REFERENCES auth.users(id),
  admin_reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_approved BOOLEAN,
  admin_notes TEXT,
  admin_rejection_reason TEXT,
  
  -- Disbursement
  disbursed_at TIMESTAMP WITH TIME ZONE,
  disbursed_by UUID REFERENCES auth.users(id),
  transaction_id TEXT, -- From payment gateway
  payment_method TEXT, -- 'bank_transfer', 'cheque', 'jazzcash', 'easypaisa'
  bank_details JSONB, -- Encrypted bank account info
  
  -- Reconciliation
  reconciled BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMP WITH TIME ZONE,
  reconciled_by UUID REFERENCES auth.users(id),
  
  -- Due Date & Reminders
  due_date DATE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT different_approvers CHECK (
    corporate_reviewed_by IS NULL OR 
    admin_reviewed_by IS NULL OR 
    corporate_reviewed_by != admin_reviewed_by
  )
);

CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_project ON payments(project_id);
CREATE INDEX idx_payments_from_org ON payments(from_organization_id);
CREATE INDEX idx_payments_to_org ON payments(to_organization_id);
CREATE INDEX idx_payments_requested ON payments(requested_at DESC);
CREATE INDEX idx_payments_due_date ON payments(due_date);


-- 5. DOCUMENTS TABLE
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  organization_id UUID REFERENCES organizations(id),
  project_id UUID REFERENCES projects(id),
  
  -- Document Info
  name TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL, -- MIME type
  file_size INTEGER NOT NULL, -- bytes
  file_url TEXT NOT NULL, -- Supabase Storage URL
  thumbnail_url TEXT,
  
  -- Categorization
  document_type TEXT NOT NULL CHECK (document_type IN (
    -- Organization Docs
    'registration_certificate', 'tax_exemption', 'board_resolution',
    'financial_statement', 'audit_report', 'ncp_certificate',
    -- Project Docs
    'project_proposal', 'budget_breakdown', 'impact_report',
    'milestone_report', 'media_coverage', 'testimonial',
    -- Payment Docs
    'invoice', 'receipt', 'bank_statement', 'supporting_doc',
    -- Volunteer Docs
    'resume', 'cover_letter', 'id_card', 'background_check',
    -- Other
    'contract', 'agreement', 'mou', 'other'
  )),
  
  -- Verification
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN (
    'pending', 'verified', 'rejected', 'expired', 'revoked'
  )),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  
  -- Expiry (for certificates, registrations, etc.)
  expires_at DATE,
  expiry_reminder_sent BOOLEAN DEFAULT false,
  
  -- Security & Access
  is_sensitive BOOLEAN DEFAULT false,
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'organization', 'admin_only', 'public')),
  encrypted BOOLEAN DEFAULT false,
  virus_scanned BOOLEAN DEFAULT false,
  virus_scan_result TEXT,
  
  -- Metadata
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  replaced_by UUID REFERENCES documents(id), -- If document is updated
  
  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_documents_org ON documents(organization_id);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_verification ON documents(verification_status);
CREATE INDEX idx_documents_uploaded ON documents(uploaded_at DESC);
CREATE INDEX idx_documents_expires ON documents(expires_at);


-- 6. AUDIT_LOGS TABLE (Critical for Compliance)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_role TEXT,
  impersonating_user_id UUID REFERENCES auth.users(id), -- If admin impersonating
  
  -- Action
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', 'disburse', etc.
  resource_type TEXT NOT NULL, -- 'payment', 'project', 'organization', 'user', etc.
  resource_id UUID,
  resource_name TEXT,
  
  -- Changes
  old_values JSONB, -- Before state
  new_values JSONB, -- After state
  changes_summary TEXT, -- Human-readable summary
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  request_id TEXT, -- For tracing
  
  -- Metadata
  metadata JSONB, -- Additional context
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- This table is append-only (no updates/deletes)
  CONSTRAINT audit_logs_immutable CHECK (created_at <= NOW())
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);

-- Make audit_logs insert-only (no updates or deletes)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Audit logs are append-only" ON audit_logs
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('super_admin', 'admin')
    )
  );
```

#### **Category 2: Verification & Vetting (4 tables)**

```sql
-- 7. ORGANIZATION_VERIFICATION TABLE
CREATE TABLE organization_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  organization_id UUID NOT NULL REFERENCES organizations(id) UNIQUE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Verification Status
  status TEXT DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'incomplete', 'submitted', 'under_review',
    'pending_documents', 'verified', 'rejected', 'suspended', 'expired'
  )),
  
  -- Documents Required
  required_documents JSONB, -- List of required document types
  submitted_documents UUID[] DEFAULT '{}', -- References documents.id
  missing_documents TEXT[] DEFAULT '{}',
  
  -- Verification Checklist
  checklist JSONB, -- [{item, completed, verified_by, verified_at, notes}]
  
  -- Review Process
  review_started_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  internal_notes TEXT, -- Admin-only notes
  rejection_reasons TEXT[],
  
  -- Site Visit (for NGOs)
  site_visit_required BOOLEAN DEFAULT false,
  site_visit_scheduled_at TIMESTAMP WITH TIME ZONE,
  site_visit_completed_at TIMESTAMP WITH TIME ZONE,
  site_visit_report TEXT,
  site_visit_photos TEXT[],
  
  -- Background Checks
  background_check_completed BOOLEAN DEFAULT false,
  background_check_status TEXT CHECK (background_check_status IN ('pending', 'clear', 'flagged', 'failed')),
  background_check_notes TEXT,
  
  -- References
  references JSONB, -- [{name, organization, contact, relationship, verified}]
  
  -- Scoring
  verification_score INTEGER CHECK (verification_score >= 0 AND verification_score <= 100),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  
  -- Approval
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  approval_notes TEXT,
  
  -- Expiry & Renewal
  valid_until DATE,
  renewal_reminder_sent BOOLEAN DEFAULT false,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_org_verification_org ON organization_verification(organization_id);
CREATE INDEX idx_org_verification_status ON organization_verification(status);
CREATE INDEX idx_org_verification_reviewer ON organization_verification(reviewed_by);


-- 8. VETTING_CASES TABLE (Admin Dashboard)
CREATE TABLE vetting_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  organization_id UUID NOT NULL REFERENCES organizations(id),
  verification_id UUID NOT NULL REFERENCES organization_verification(id),
  assigned_to UUID REFERENCES auth.users(id), -- Admin vetter
  
  -- Case Info
  case_number TEXT UNIQUE NOT NULL, -- VET-2026-001
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Status
  status TEXT DEFAULT 'open' CHECK (status IN (
    'open', 'in_progress', 'pending_info', 'pending_documents',
    'pending_site_visit', 'under_review', 'escalated', 'resolved', 'closed'
  )),
  
  -- SLA Tracking
  sla_deadline TIMESTAMP WITH TIME ZONE,
  sla_breached BOOLEAN DEFAULT false,
  sla_breach_reason TEXT,
  
  -- Progress
  checklist_completion_pct INTEGER DEFAULT 0 CHECK (checklist_completion_pct >= 0 AND checklist_completion_pct <= 100),
  documents_completion_pct INTEGER DEFAULT 0,
  
  -- Communication
  last_contact_at TIMESTAMP WITH TIME ZONE,
  next_follow_up_at TIMESTAMP WITH TIME ZONE,
  follow_up_reason TEXT,
  
  -- Notes & Activity
  notes TEXT,
  activity_log JSONB, -- [{timestamp, action, user, details}]
  
  -- Resolution
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT,
  resolution_outcome TEXT CHECK (resolution_outcome IN ('approved', 'rejected', 'withdrawn', 'cancelled')),
  
  -- Timestamps
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_vetting_cases_org ON vetting_cases(organization_id);
CREATE INDEX idx_vetting_cases_assigned ON vetting_cases(assigned_to);
CREATE INDEX idx_vetting_cases_status ON vetting_cases(status);
CREATE INDEX idx_vetting_cases_sla ON vetting_cases(sla_deadline);
CREATE INDEX idx_vetting_cases_priority ON vetting_cases(priority);


-- 9. VOLUNTEER_BACKGROUND_CHECKS TABLE
CREATE TABLE volunteer_background_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES auth.users(id) UNIQUE,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Personal Info (for verification)
  full_name TEXT NOT NULL,
  cnic TEXT NOT NULL, -- National ID
  date_of_birth DATE NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  
  -- Documents
  cnic_front_url TEXT,
  cnic_back_url TEXT,
  photo_url TEXT,
  character_certificate_url TEXT,
  
  -- Checks Performed
  identity_verified BOOLEAN DEFAULT false,
  criminal_record_check BOOLEAN DEFAULT false,
  criminal_record_clear BOOLEAN,
  education_verified BOOLEAN DEFAULT false,
  employment_verified BOOLEAN DEFAULT false,
  
  -- References
  references JSONB, -- [{name, contact, relationship, verified, notes}]
  
  -- Results
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_progress', 'clear', 'flagged', 'rejected', 'expired'
  )),
  flags TEXT[], -- Any issues found
  notes TEXT,
  internal_notes TEXT, -- Admin only
  
  -- Approval
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  
  -- Expiry
  valid_until DATE,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bg_checks_user ON volunteer_background_checks(user_id);
CREATE INDEX idx_bg_checks_status ON volunteer_background_checks(status);
CREATE INDEX idx_bg_checks_reviewer ON volunteer_background_checks(reviewed_by);


-- 10. SCORECARDS TABLE (NGO Performance)
CREATE TABLE scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  organization_id UUID NOT NULL REFERENCES organizations(id),
  project_id UUID REFERENCES projects(id), -- If project-specific
  
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  fiscal_year INTEGER,
  quarter INTEGER CHECK (quarter >= 1 AND quarter <= 4),
  
  -- Scores (0-100)
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- Category Scores
  governance_score INTEGER CHECK (governance_score >= 0 AND governance_score <= 100),
  financial_transparency_score INTEGER CHECK (financial_transparency_score >= 0 AND financial_transparency_score <= 100),
  impact_delivery_score INTEGER CHECK (impact_delivery_score >= 0 AND impact_delivery_score <= 100),
  communication_score INTEGER CHECK (communication_score >= 0 AND communication_score <= 100),
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  
  -- Metrics
  metrics JSONB, -- Detailed breakdown of each category
  
  -- Strengths & Weaknesses
  strengths TEXT[],
  areas_for_improvement TEXT[],
  recommendations TEXT[],
  
  -- Comparison
  previous_score INTEGER,
  score_change INTEGER, -- Difference from previous
  trend TEXT CHECK (trend IN ('improving', 'stable', 'declining')),
  
  -- Review
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  
  -- Published
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_scorecards_org ON scorecards(organization_id);
CREATE INDEX idx_scorecards_project ON scorecards(project_id);
CREATE INDEX idx_scorecards_period ON scorecards(period_start, period_end);
CREATE INDEX idx_scorecards_score ON scorecards(overall_score DESC);
```

#### **Category 3: Project Management (5 tables)**

```sql
-- 11. PROJECT_MILESTONES TABLE
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  project_id UUID NOT NULL REFERENCES projects(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Milestone Info
  title TEXT NOT NULL,
  description TEXT,
  sequence_number INTEGER NOT NULL, -- Order in project timeline
  
  -- Deliverables
  deliverables TEXT[] DEFAULT '{}',
  deliverables_completed TEXT[] DEFAULT '{}',
  
  -- Budget
  budget_allocated NUMERIC(12,2),
  budget_spent NUMERIC(12,2) DEFAULT 0,
  
  -- Timeline
  target_date DATE NOT NULL,
  actual_date DATE,
  
  -- Status
  status TEXT DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'in_progress', 'completed', 'delayed', 'blocked', 'cancelled'
  )),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  
  -- Evidence & Reporting
  evidence_urls TEXT[] DEFAULT '{}',
  report_url TEXT,
  media_urls TEXT[] DEFAULT '{}',
  
  -- Review
  requires_review BOOLEAN DEFAULT true,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  approved BOOLEAN,
  review_notes TEXT,
  
  -- Blocking Issues
  blocked_reason TEXT,
  dependencies UUID[], -- Other milestone IDs that must complete first
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_milestones_project ON project_milestones(project_id);
CREATE INDEX idx_milestones_status ON project_milestones(status);
CREATE INDEX idx_milestones_target_date ON project_milestones(target_date);


-- 12. PROJECT_UPDATES TABLE
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  project_id UUID NOT NULL REFERENCES projects(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  milestone_id UUID REFERENCES project_milestones(id),
  
  -- Update Content
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  
  -- Type
  update_type TEXT NOT NULL CHECK (update_type IN (
    'progress', 'milestone', 'challenge', 'achievement', 'media', 'announcement'
  )),
  
  -- Progress Indicators
  completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  beneficiaries_reached INTEGER,
  volunteers_engaged INTEGER,
  
  -- Media
  media_urls TEXT[] DEFAULT '{}',
  video_urls TEXT[] DEFAULT '{}',
  document_ids UUID[] DEFAULT '{}',
  
  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('private', 'organization', 'public')),
  featured BOOLEAN DEFAULT false,
  
  -- Engagement
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  
  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_updates_project ON project_updates(project_id);
CREATE INDEX idx_updates_type ON project_updates(update_type);
CREATE INDEX idx_updates_published ON project_updates(published_at DESC);
CREATE INDEX idx_updates_featured ON project_updates(featured);


-- 13. VOLUNTEER_HOURS TABLE
CREATE TABLE volunteer_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id UUID NOT NULL REFERENCES projects(id),
  application_id UUID REFERENCES applications(id),
  
  -- Time Tracking
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  duration_hours NUMERIC(4,2) NOT NULL CHECK (duration_hours > 0),
  
  -- Activity
  activity_type TEXT, -- 'on-site', 'remote', 'event', 'training', etc.
  description TEXT,
  tasks_completed TEXT[],
  
  -- Location
  location TEXT,
  check_in_time TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  geo_location JSONB, -- {lat, lng}
  
  -- Verification
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'disputed'
  )),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  rejection_reason TEXT,
  
  -- Supporting Evidence
  photo_urls TEXT[] DEFAULT '{}',
  supervisor_signature TEXT,
  
  -- Points & Gamification
  points_earned INTEGER DEFAULT 0,
  
  -- Timestamps
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_volunteer_hours_user ON volunteer_hours(user_id);
CREATE INDEX idx_volunteer_hours_project ON volunteer_hours(project_id);
CREATE INDEX idx_volunteer_hours_date ON volunteer_hours(date DESC);
CREATE INDEX idx_volunteer_hours_status ON volunteer_hours(status);


-- 14. CERTIFICATES TABLE
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id UUID REFERENCES projects(id),
  organization_id UUID REFERENCES organizations(id),
  
  -- Certificate Info
  certificate_number TEXT UNIQUE NOT NULL, -- CERT-2026-001
  certificate_type TEXT NOT NULL CHECK (certificate_type IN (
    'volunteer_completion', 'participation', 'excellence',
    'training', 'achievement', 'appreciation', 'verification'
  )),
  
  -- Details
  title TEXT NOT NULL,
  description TEXT,
  issued_for TEXT, -- What was the achievement
  
  -- Metrics (for volunteer certificates)
  hours_completed NUMERIC(6,2),
  projects_completed INTEGER,
  impact_created TEXT,
  
  -- Design & Generation
  template_id TEXT, -- Which certificate template to use
  certificate_url TEXT NOT NULL, -- Generated PDF URL
  thumbnail_url TEXT,
  
  -- Verification
  verification_code TEXT UNIQUE NOT NULL, -- For public verification
  qr_code_url TEXT,
  
  -- Signatures
  signed_by TEXT[], -- Names of signatories
  signature_urls TEXT[], -- Digital signature images
  
  -- Validity
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until DATE, -- Some certificates expire
  
  -- Sharing
  is_public BOOLEAN DEFAULT true,
  shared_count INTEGER DEFAULT 0,
  
  -- Revocation (if needed)
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES auth.users(id),
  revocation_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_project ON certificates(project_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
CREATE INDEX idx_certificates_issued ON certificates(issued_at DESC);


-- 15. CONTRACTS TABLE
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  project_id UUID NOT NULL REFERENCES projects(id),
  corporate_id UUID NOT NULL REFERENCES organizations(id),
  ngo_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Contract Info
  contract_number TEXT UNIQUE NOT NULL, -- CON-2026-001
  title TEXT NOT NULL,
  description TEXT,
  
  -- Terms
  total_amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  payment_schedule JSONB, -- [{milestone, amount, due_date, status}]
  
  -- Duration
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_months INTEGER,
  
  -- Documents
  contract_document_url TEXT,
  signed_contract_url TEXT,
  attachments JSONB, -- [{name, url, type}]
  
  -- Terms & Conditions
  terms_and_conditions TEXT,
  special_clauses TEXT[],
  deliverables TEXT[],
  kpis JSONB, -- Key Performance Indicators
  
  -- Signatures
  corporate_signed BOOLEAN DEFAULT false,
  corporate_signed_by UUID REFERENCES auth.users(id),
  corporate_signed_at TIMESTAMP WITH TIME ZONE,
  
  ngo_signed BOOLEAN DEFAULT false,
  ngo_signed_by UUID REFERENCES auth.users(id),
  ngo_signed_at TIMESTAMP WITH TIME ZONE,
  
  witness_name TEXT,
  witness_signature_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_corporate_signature', 'pending_ngo_signature',
    'active', 'completed', 'terminated', 'expired', 'renewed'
  )),
  
  -- Compliance
  compliance_checks JSONB, -- [{check, status, date, notes}]
  compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
  
  -- Amendments
  amended BOOLEAN DEFAULT false,
  amendment_history JSONB, -- [{date, changes, reason, approved_by}]
  
  -- Termination
  terminated_at TIMESTAMP WITH TIME ZONE,
  terminated_by UUID REFERENCES auth.users(id),
  termination_reason TEXT,
  termination_notice_period INTEGER, -- days
  
  -- Renewal
  renewable BOOLEAN DEFAULT false,
  renewed_contract_id UUID REFERENCES contracts(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  executed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_corporate ON contracts(corporate_id);
CREATE INDEX idx_contracts_ngo ON contracts(ngo_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
```

#### **Category 4: Communication & Notifications (4 tables)**

```sql
-- 16. NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Notification Content
  type TEXT NOT NULL CHECK (type IN (
    'application_update', 'project_invite', 'payment_update',
    'document_uploaded', 'document_expiring', 'verification_update',
    'milestone_completed', 'message_received', 'certificate_issued',
    'system_announcement', 'reminder', 'alert', 'achievement'
  )),
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  summary TEXT,
  
  -- Action
  action_type TEXT, -- 'view', 'approve', 'review', 'respond', etc.
  action_url TEXT, -- Where to go when clicked
  action_label TEXT, -- Button text
  
  -- References
  resource_type TEXT, -- 'project', 'payment', 'application', etc.
  resource_id UUID,
  
  -- Metadata
  data JSONB, -- Additional context
  
  -- Priority
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  archived BOOLEAN DEFAULT false,
  
  -- Delivery
  delivered_via TEXT[] DEFAULT '{}', -- ['in_app', 'email', 'sms']
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  sms_sent BOOLEAN DEFAULT false,
  sms_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_priority ON notifications(priority);


-- 17. MESSAGES TABLE
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Conversation
  conversation_id UUID NOT NULL, -- Group messages by conversation
  
  -- Participants
  from_user_id UUID NOT NULL REFERENCES auth.users(id),
  to_user_id UUID REFERENCES auth.users(id), -- Null for group messages
  to_organization_id UUID REFERENCES organizations(id),
  
  -- Content
  subject TEXT,
  body TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'announcement')),
  
  -- Attachments
  attachments JSONB, -- [{name, url, size, type}]
  
  -- Context (what is this message about?)
  related_to_type TEXT, -- 'project', 'application', 'payment', 'verification'
  related_to_id UUID,
  
  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  archived BOOLEAN DEFAULT false,
  
  -- Reply Threading
  reply_to_message_id UUID REFERENCES messages(id),
  
  -- Moderation
  flagged BOOLEAN DEFAULT false,
  flagged_reason TEXT,
  moderated BOOLEAN DEFAULT false,
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, sent_at DESC);
CREATE INDEX idx_messages_from ON messages(from_user_id);
CREATE INDEX idx_messages_to ON messages(to_user_id);
CREATE INDEX idx_messages_read ON messages(read);


-- 18. EMAIL_QUEUE TABLE
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Recipient
  to_email TEXT NOT NULL,
  to_user_id UUID REFERENCES auth.users(id),
  
  -- Email Content
  from_email TEXT DEFAULT 'hello@wasilah.org',
  from_name TEXT DEFAULT 'Wasilah',
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,
  
  -- Template
  template_id TEXT,
  template_variables JSONB,
  
  -- Attachments
  attachments JSONB, -- [{filename, url, contentType}]
  
  -- Priority
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'sending', 'sent', 'failed', 'bounced', 'rejected'
  )),
  
  -- Delivery
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Provider Response
  provider TEXT, -- 'resend', 'sendgrid', etc.
  provider_message_id TEXT,
  provider_response JSONB,
  
  -- Error Handling
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_to ON email_queue(to_email);
CREATE INDEX idx_email_queue_priority ON email_queue(priority);
CREATE INDEX idx_email_queue_created ON email_queue(created_at);


-- 19. SYSTEM_ANNOUNCEMENTS TABLE
CREATE TABLE system_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon TEXT, -- Icon name or emoji
  
  -- Type
  type TEXT NOT NULL CHECK (type IN (
    'info', 'warning', 'error', 'success', 'maintenance', 'feature', 'update'
  )),
  
  -- Targeting
  target_roles TEXT[] DEFAULT '{}', -- Which roles should see this
  target_organizations UUID[], -- Specific organizations
  
  -- Action
  action_url TEXT,
  action_label TEXT,
  dismissible BOOLEAN DEFAULT true,
  
  -- Visibility
  active BOOLEAN DEFAULT true,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  
  -- Priority
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  -- Created By
  created_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_announcements_active ON system_announcements(active, start_time, end_time);
CREATE INDEX idx_announcements_priority ON system_announcements(priority);
```

#### **Category 5: Admin & Configuration (6 tables)**

```sql
-- 20. USER_ROLES TABLE
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Role
  role TEXT NOT NULL CHECK (role IN (
    -- System Roles
    'super_admin', 'platform_admin',
    -- Admin Roles
    'admin_vetter', 'admin_finance', 'admin_support', 'admin_content',
    -- Corporate Roles
    'corporate_admin', 'corporate_manager', 'corporate_viewer',
    -- NGO Roles
    'ngo_admin', 'ngo_manager', 'ngo_staff', 'ngo_volunteer_coordinator',
    -- Volunteer Roles
    'volunteer', 'volunteer_lead'
  )),
  
  -- Scope (where does this role apply?)
  organization_id UUID REFERENCES organizations(id), -- NULL for system-wide roles
  project_id UUID REFERENCES projects(id), -- NULL for organization-wide roles
  
  -- Permissions Override
  permissions JSONB, -- Custom permissions for this user
  
  -- Status
  active BOOLEAN DEFAULT true,
  suspended BOOLEAN DEFAULT false,
  suspension_reason TEXT,
  
  -- Granted By
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES auth.users(id),
  
  -- Unique constraint: one role per user per scope
  UNIQUE(user_id, role, organization_id, project_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_roles_org ON user_roles(organization_id);
CREATE INDEX idx_user_roles_active ON user_roles(active);


-- 21. PERMISSIONS TABLE
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Permission Info
  permission_key TEXT UNIQUE NOT NULL, -- 'projects.create', 'payments.approve'
  category TEXT NOT NULL, -- 'projects', 'payments', 'users', etc.
  action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'approve', etc.
  
  -- Description
  name TEXT NOT NULL,
  description TEXT,
  
  -- Role Assignment
  default_roles TEXT[] DEFAULT '{}', -- Which roles have this by default
  
  -- Risk Level
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_permissions_key ON permissions(permission_key);
CREATE INDEX idx_permissions_category ON permissions(category);


-- 22. SYSTEM_SETTINGS TABLE
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Setting
  setting_key TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'general', 'security', 'email', 'payments', etc.
  
  -- Value
  value JSONB NOT NULL,
  default_value JSONB,
  
  -- Metadata
  name TEXT NOT NULL,
  description TEXT,
  data_type TEXT NOT NULL CHECK (data_type IN ('string', 'number', 'boolean', 'json', 'array')),
  
  -- Validation
  validation_rules JSONB, -- {min, max, required, pattern, etc.}
  
  -- Access Control
  editable_by TEXT[] DEFAULT '{}', -- Which roles can edit
  visible_to TEXT[] DEFAULT '{}', -- Which roles can view
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Modified By
  updated_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON system_settings(setting_key);
CREATE INDEX idx_settings_category ON system_settings(category);


-- 23. ACTIVITY_FEED TABLE
CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Actor
  actor_user_id UUID REFERENCES auth.users(id),
  actor_name TEXT,
  actor_role TEXT,
  
  -- Action
  action_type TEXT NOT NULL, -- 'created', 'updated', 'approved', 'commented', etc.
  action_description TEXT NOT NULL,
  
  -- Target
  target_type TEXT NOT NULL, -- 'project', 'payment', 'application', etc.
  target_id UUID NOT NULL,
  target_name TEXT,
  
  -- Context
  project_id UUID REFERENCES projects(id),
  organization_id UUID REFERENCES organizations(id),
  
  -- Visibility
  visibility TEXT DEFAULT 'organization' CHECK (visibility IN ('private', 'organization', 'public')),
  
  -- Metadata
  data JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_feed_actor ON activity_feed(actor_user_id);
CREATE INDEX idx_activity_feed_target ON activity_feed(target_type, target_id);
CREATE INDEX idx_activity_feed_project ON activity_feed(project_id);
CREATE INDEX idx_activity_feed_org ON activity_feed(organization_id);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);


-- 24. FILE_UPLOADS TABLE
CREATE TABLE file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Uploader
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  
  -- File Info
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in Supabase Storage
  file_url TEXT NOT NULL,
  
  -- File Details
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL, -- bytes
  file_extension TEXT,
  
  -- Thumbnail (for images/videos)
  thumbnail_url TEXT,
  
  -- Context
  uploaded_for_type TEXT, -- 'profile', 'document', 'project', etc.
  uploaded_for_id UUID,
  
  -- Security
  virus_scanned BOOLEAN DEFAULT false,
  virus_scan_result TEXT,
  virus_scan_at TIMESTAMP WITH TIME ZONE,
  
  -- EXIF Stripping (for privacy)
  exif_stripped BOOLEAN DEFAULT false,
  
  -- Access Control
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'organization', 'public')),
  download_count INTEGER DEFAULT 0,
  
  -- Expiry
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_delete BOOLEAN DEFAULT false,
  
  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_file_uploads_uploader ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_type ON file_uploads(uploaded_for_type, uploaded_for_id);
CREATE INDEX idx_file_uploads_uploaded ON file_uploads(uploaded_at DESC);


-- 25. ERROR_LOGS TABLE
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Error Info
  error_type TEXT NOT NULL, -- 'client_error', 'server_error', 'database_error', etc.
  error_message TEXT NOT NULL,
  error_stack TEXT,
  
  -- Context
  user_id UUID REFERENCES auth.users(id),
  endpoint TEXT,
  method TEXT, -- 'GET', 'POST', etc.
  request_body JSONB,
  
  -- Browser/Device
  user_agent TEXT,
  browser TEXT,
  os TEXT,
  device TEXT,
  
  -- Location
  ip_address INET,
  
  -- Severity
  severity TEXT DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  
  -- Status
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  
  -- Metadata
  metadata JSONB,
  
  -- Timestamps
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX idx_error_logs_occurred ON error_logs(occurred_at DESC);
```

---

## 🔐 PART 2: ROW LEVEL SECURITY (RLS) POLICIES

**CRITICAL:** Every table must have RLS enabled and proper policies. Here's the comprehensive policy set:

```sql
-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_background_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

-- Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (
    created_by = auth.uid() OR
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()) OR
    assigned_ngo_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Users can view public projects
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  USING (status = 'active' AND visibility = 'public');

-- Users can create projects for their organization
CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  WITH CHECK (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Users can update their own organization's projects
CREATE POLICY "Users can update own org projects"
  ON projects FOR UPDATE
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Admins can view all projects
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role LIKE 'admin%'
      AND active = true
    )
  );

-- Admins can approve/reject projects
CREATE POLICY "Admins can approve projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'platform_admin')
      AND active = true
    )
  );

-- =====================================================
-- PAYMENTS POLICIES (Most Critical - Dual Approval)
-- =====================================================

-- Users can view payments related to their organization
CREATE POLICY "Orgs can view own payments"
  ON payments FOR SELECT
  USING (
    from_organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()) OR
    to_organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- NGOs can create payment requests
CREATE POLICY "NGOs can request payments"
  ON payments FOR INSERT
  WITH CHECK (
    to_organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND requested_by = auth.uid()
  );

-- Corporates can approve payments (first approval)
CREATE POLICY "Corporates can approve payments"
  ON payments FOR UPDATE
  USING (
    from_organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    AND status = 'pending_corporate'
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('corporate_admin', 'corporate_manager')
      AND active = true
    )
  );

-- Admins can approve payments (second approval) - Must be different person
CREATE POLICY "Admins can approve payments"
  ON payments FOR UPDATE
  USING (
    status = 'pending_admin'
    AND corporate_reviewed_by IS NOT NULL
    AND corporate_reviewed_by != auth.uid() -- CRITICAL: Different person
    AND EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin_finance')
      AND active = true
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role LIKE 'admin%'
      AND active = true
    )
  );

-- =====================================================
-- APPLICATIONS POLICIES
-- =====================================================

-- Volunteers can view their own applications
CREATE POLICY "Volunteers can view own applications"
  ON applications FOR SELECT
  USING (user_id = auth.uid());

-- Volunteers can create applications
CREATE POLICY "Volunteers can apply"
  ON applications FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Volunteers can withdraw their applications
CREATE POLICY "Volunteers can withdraw"
  ON applications FOR UPDATE
  USING (user_id = auth.uid() AND status IN ('submitted', 'under_review'));

-- Project owners can view applications
CREATE POLICY "Project owners can view applications"
  ON applications FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
  );

-- Project owners can update application status
CREATE POLICY "Project owners can review applications"
  ON applications FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
  );

-- =====================================================
-- DOCUMENTS POLICIES
-- =====================================================

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (uploaded_by = auth.uid());

-- Users can view their organization's documents
CREATE POLICY "Orgs can view own documents"
  ON documents FOR SELECT
  USING (
    organization_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Users can upload documents
CREATE POLICY "Users can upload documents"
  ON documents FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role LIKE 'admin%'
      AND active = true
    )
  );

-- Admins can verify documents
CREATE POLICY "Admins can verify documents"
  ON documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin_vetter')
      AND active = true
    )
  );

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

-- Users can only view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- System can create notifications (service role)
CREATE POLICY "Service role can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- CERTIFICATES POLICIES
-- =====================================================

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (user_id = auth.uid());

-- Public can verify certificates
CREATE POLICY "Public can verify certificates"
  ON certificates FOR SELECT
  USING (is_public = true);

-- Admins can create certificates
CREATE POLICY "Admins can issue certificates"
  ON certificates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role LIKE 'admin%'
      AND active = true
    )
  );

-- Add similar policies for ALL other tables...
-- (This is just a sample - you need policies for every table)
```

---

## 🔌 PART 3: API ENDPOINTS REQUIRED (80+ endpoints)

### Category 1: Authentication (8 endpoints)
```
POST   /api/auth/signup              - Create account
POST   /api/auth/login               - Login with email/password
POST   /api/auth/logout              - Logout
POST   /api/auth/verify-otp          - Verify email OTP
POST   /api/auth/resend-otp          - Resend verification code
POST   /api/auth/reset-password      - Request password reset
POST   /api/auth/update-password     - Update password
POST   /api/auth/oauth/{provider}    - OAuth login (Google, LinkedIn, etc.)
```

### Category 2: Profiles (10 endpoints)
```
GET    /api/profiles/me              - Get current user profile
PUT    /api/profiles/me              - Update current user profile
POST   /api/profiles/onboarding      - Complete onboarding
GET    /api/profiles/{id}            - Get user profile by ID
GET    /api/profiles/search          - Search profiles
POST   /api/profiles/photo           - Upload profile photo
DELETE /api/profiles/photo           - Delete profile photo
GET    /api/profiles/completeness    - Get profile completeness score
PUT    /api/profiles/preferences     - Update notification preferences
GET    /api/profiles/activity        - Get user activity feed
```

### Category 3: Organizations (12 endpoints)
```
GET    /api/organizations            - List organizations
POST   /api/organizations            - Create organization
GET    /api/organizations/{id}       - Get organization details
PUT    /api/organizations/{id}       - Update organization
DELETE /api/organizations/{id}       - Delete organization
POST   /api/organizations/{id}/logo  - Upload logo
GET    /api/organizations/{id}/members - Get organization members
POST   /api/organizations/{id}/members - Add member
DELETE /api/organizations/{id}/members/{userId} - Remove member
GET    /api/organizations/{id}/projects - Get organization projects
GET    /api/organizations/{id}/stats - Get organization statistics
POST   /api/organizations/{id}/verify - Submit for verification
```

### Category 4: Projects (15 endpoints)
```
GET    /api/projects                 - List projects (with filters)
POST   /api/projects                 - Create project
GET    /api/projects/{id}            - Get project details
PUT    /api/projects/{id}            - Update project
DELETE /api/projects/{id}            - Delete project
POST   /api/projects/{id}/submit     - Submit for approval
POST   /api/projects/{id}/approve    - Approve project (admin)
POST   /api/projects/{id}/reject     - Reject project (admin)
POST   /api/projects/{id}/assign-ngo - Assign NGO to project
GET    /api/projects/{id}/milestones - Get project milestones
POST   /api/projects/{id}/milestones - Create milestone
PUT    /api/projects/{id}/milestones/{milestoneId} - Update milestone
GET    /api/projects/{id}/updates    - Get project updates
POST   /api/projects/{id}/updates    - Post project update
POST   /api/projects/{id}/complete   - Mark project complete
```

### Category 5: Applications (10 endpoints)
```
GET    /api/applications             - List applications (user's own or org's)
POST   /api/applications             - Submit application
GET    /api/applications/{id}        - Get application details
PUT    /api/applications/{id}        - Update application
DELETE /api/applications/{id}        - Withdraw application
POST   /api/applications/{id}/shortlist - Shortlist candidate
POST   /api/applications/{id}/interview - Schedule interview
POST   /api/applications/{id}/accept - Accept application
POST   /api/applications/{id}/reject - Reject application
GET    /api/applications/stats       - Get application statistics
```

### Category 6: Payments (12 endpoints)
```
GET    /api/payments                 - List payments
POST   /api/payments                 - Create payment request
GET    /api/payments/{id}            - Get payment details
PUT    /api/payments/{id}            - Update payment
POST   /api/payments/{id}/approve-corporate - Corporate approval
POST   /api/payments/{id}/approve-admin - Admin approval
POST   /api/payments/{id}/reject     - Reject payment
POST   /api/payments/{id}/disburse   - Disburse payment
POST   /api/payments/{id}/reconcile  - Reconcile payment
GET    /api/payments/pending         - Get pending payments
GET    /api/payments/history         - Get payment history
POST   /api/payments/bulk-approve    - Bulk approve payments (admin)
```

### Category 7: Documents (10 endpoints)
```
GET    /api/documents                - List documents
POST   /api/documents                - Upload document
GET    /api/documents/{id}           - Get document details
PUT    /api/documents/{id}           - Update document metadata
DELETE /api/documents/{id}           - Delete document
GET    /api/documents/{id}/download  - Download document
POST   /api/documents/{id}/verify    - Verify document (admin)
POST   /api/documents/{id}/reject    - Reject document (admin)
GET    /api/documents/expiring       - Get expiring documents
POST   /api/documents/bulk-upload    - Bulk upload documents
```

### Category 8: Verification (8 endpoints)
```
GET    /api/verification/organizations - List verification requests
POST   /api/verification/submit      - Submit organization for verification
GET    /api/verification/{id}        - Get verification details
PUT    /api/verification/{id}        - Update verification
POST   /api/verification/{id}/approve - Approve verification
POST   /api/verification/{id}/reject - Reject verification
POST   /api/verification/{id}/site-visit - Schedule site visit
GET    /api/verification/scorecard/{orgId} - Get organization scorecard
```

### Category 9: Volunteer Hours (6 endpoints)
```
GET    /api/volunteer-hours          - List volunteer hours
POST   /api/volunteer-hours          - Log volunteer hours
GET    /api/volunteer-hours/{id}     - Get hours details
PUT    /api/volunteer-hours/{id}     - Update hours
POST   /api/volunteer-hours/{id}/approve - Approve hours
GET    /api/volunteer-hours/summary  - Get volunteer hours summary
```

### Category 10: Certificates (6 endpoints)
```
GET    /api/certificates             - List certificates
POST   /api/certificates             - Issue certificate
GET    /api/certificates/{id}        - Get certificate details
GET    /api/certificates/verify/{code} - Verify certificate
GET    /api/certificates/{id}/download - Download certificate PDF
POST   /api/certificates/{id}/share  - Share certificate
```

### Category 11: Notifications (5 endpoints)
```
GET    /api/notifications            - List notifications
GET    /api/notifications/unread-count - Get unread count
PUT    /api/notifications/{id}/read  - Mark as read
PUT    /api/notifications/read-all   - Mark all as read
DELETE /api/notifications/{id}       - Delete notification
```

### Category 12: Reports & Analytics (8 endpoints)
```
GET    /api/reports/impact           - Get impact report
GET    /api/reports/financial        - Get financial report
GET    /api/reports/volunteer        - Get volunteer report
POST   /api/reports/generate         - Generate custom report
GET    /api/analytics/dashboard      - Get dashboard analytics
GET    /api/analytics/projects       - Get project analytics
GET    /api/analytics/users          - Get user analytics
GET    /api/exports/{type}           - Export data (CSV/PDF/Excel)
```

---

## ⚡ PART 4: REAL-TIME FEATURES (Supabase Realtime)

```javascript
// 1. Payment Status Updates
supabase
  .channel('payment-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'payments',
    filter: `to_organization_id=eq.${organizationId}`
  }, payload => {
    // Update UI when payment status changes
    updatePaymentStatus(payload.new);
  })
  .subscribe();

// 2. Application Updates
supabase
  .channel('application-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'applications',
    filter: `user_id=eq.${userId}`
  }, payload => {
    // Notify volunteer of application status change
    notifyUser(payload);
  })
  .subscribe();

// 3. New Notifications
supabase
  .channel('user-notifications')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, payload => {
    // Show toast notification
    showNotification(payload.new);
  })
  .subscribe();

// 4. Project Updates
supabase
  .channel(`project-${projectId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'projects',
    filter: `id=eq.${projectId}`
  }, payload => {
    // Live update project details
    refreshProjectData(payload.new);
  })
  .subscribe();

// 5. Vetting Queue (Admin Dashboard)
supabase
  .channel('vetting-queue')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'vetting_cases'
  }, payload => {
    // Add new case to queue
    addToVettingQueue(payload.new);
  })
  .subscribe();
```

---

## 🗂️ PART 5: SUPABASE STORAGE BUCKETS

```sql
-- Create storage buckets with policies

-- 1. Profile Photos
CREATE STORAGE BUCKET profile_photos
  PUBLIC false
  FILE_SIZE_LIMIT 5MB
  ALLOWED_MIME_TYPES ['image/jpeg', 'image/png', 'image/webp'];

-- Policy: Users can upload their own photos
CREATE POLICY "Users can upload own profile photo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile_photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- 2. Documents
CREATE STORAGE BUCKET documents
  PUBLIC false
  FILE_SIZE_LIMIT 10MB
  ALLOWED_MIME_TYPES ['application/pdf', 'image/jpeg', 'image/png'];

-- Policy: Users can upload to their org folder
CREATE POLICY "Users can upload org documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    (storage.foldername(name))[1] IN (
      SELECT organization_id::text FROM profiles WHERE id = auth.uid()
    )
  );

-- 3. Project Media
CREATE STORAGE BUCKET project_media
  PUBLIC true
  FILE_SIZE_LIMIT 50MB
  ALLOWED_MIME_TYPES ['image/*', 'video/mp4', 'video/webm'];

-- 4. Invoices
CREATE STORAGE BUCKET invoices
  PUBLIC false
  FILE_SIZE_LIMIT 10MB
  ALLOWED_MIME_TYPES ['application/pdf'];

-- 5. Certificates
CREATE STORAGE BUCKET certificates
  PUBLIC true
  FILE_SIZE_LIMIT 5MB
  ALLOWED_MIME_TYPES ['application/pdf'];

-- 6. Contracts
CREATE STORAGE BUCKET contracts
  PUBLIC false
  FILE_SIZE_LIMIT 10MB
  ALLOWED_MIME_TYPES ['application/pdf'];
```

---

## 🔒 PART 6: SECURITY IMPLEMENTATION

### A. Input Validation & Sanitization (Can do in Figma Make)

```typescript
// /lib/validation/schemas.ts
import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(50).max(5000),
  budget: z.number().positive().max(100000000), // 100M PKR max
  start_date: z.date().min(new Date()),
  end_date: z.date(),
  sdgs: z.array(z.number().min(1).max(17)).max(5),
  city: z.string().min(2),
  volunteer_target: z.number().min(0).max(10000),
}).refine(data => data.end_date > data.start_date, {
  message: "End date must be after start date"
});

export const paymentSchema = z.object({
  amount: z.number().positive().max(10000000),
  description: z.string().min(10).max(500),
  invoice_number: z.string().regex(/^INV-\d{4}-\d{3}$/),
  project_id: z.string().uuid(),
  milestone_id: z.string().uuid().optional(),
});

export const applicationSchema = z.object({
  motivation: z.string().min(50).max(1000),
  availability: z.array(z.string()),
  resume_url: z.string().url().optional(),
});

// Sanitization
import DOMPurify from 'isomorphic-dompurify';

export const sanitize = {
  html: (dirty: string) => DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href']
  }),
  
  filename: (filename: string) => {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255);
  },
  
  search: (query: string) => {
    return query.replace(/[^\w\s-]/g, '').trim().slice(0, 100);
  }
};
```

### B. Rate Limiting (Needs Backend IDE)

```typescript
// Supabase Edge Function: /functions/rate-limit/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const rateLimits = {
  login: { max: 10, window: 900 }, // 10 attempts per 15 minutes
  apply: { max: 20, window: 3600 }, // 20 applications per hour
  upload: { max: 30, window: 3600 }, // 30 uploads per hour
  payment_request: { max: 10, window: 3600 }, // 10 payment requests per hour
};

serve(async (req) => {
  const { action, identifier } = await req.json();
  const limit = rateLimits[action];
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_identifier: identifier,
    p_identifier_type: 'user_id',
    p_action_type: action,
    p_max_attempts: limit.max,
    p_window_minutes: limit.window / 60
  });
  
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### C. Audit Logging (Needs Backend IDE)

```typescript
// Database Trigger: Auto-log all payment changes
CREATE OR REPLACE FUNCTION log_payment_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    severity
  ) VALUES (
    auth.uid(),
    TG_OP,
    'payment',
    NEW.id,
    row_to_json(OLD),
    row_to_json(NEW),
    CASE 
      WHEN NEW.status = 'paid' THEN 'high'
      WHEN NEW.status = 'rejected' THEN 'medium'
      ELSE 'low'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER payment_audit_trigger
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION log_payment_changes();

-- Repeat for: projects, organizations, documents, applications, etc.
```

### D. File Upload Security (Needs Backend IDE)

```typescript
// Supabase Edge Function: /functions/upload-file/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  // 1. Validate file size
  if (file.size > 10 * 1024 * 1024) { // 10MB
    return new Response(JSON.stringify({ error: 'File too large' }), {
      status: 400
    });
  }
  
  // 2. Validate file type
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    return new Response(JSON.stringify({ error: 'Invalid file type' }), {
      status: 400
    });
  }
  
  // 3. Scan for viruses (integrate ClamAV or VirusTotal API)
  const virusScanResult = await scanForViruses(file);
  if (!virusScanResult.clean) {
    return new Response(JSON.stringify({ error: 'Virus detected' }), {
      status: 400
    });
  }
  
  // 4. Strip EXIF data from images
  if (file.type.startsWith('image/')) {
    file = await stripExifData(file);
  }
  
  // 5. Generate secure filename
  const extension = file.name.split('.').pop();
  const secureFilename = `${crypto.randomUUID()}.${extension}`;
  
  // 6. Upload to Supabase Storage
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(`${req.headers.get('user-id')}/${secureFilename}`, file);
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  }
  
  // 7. Log upload to database
  await supabase.from('file_uploads').insert({
    uploaded_by: req.headers.get('user-id'),
    original_filename: file.name,
    stored_filename: secureFilename,
    file_path: data.path,
    mime_type: file.type,
    file_size: file.size,
    virus_scanned: true,
    virus_scan_result: 'clean'
  });
  
  return new Response(JSON.stringify({ success: true, path: data.path }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### E. Payment Security (Needs Backend IDE + Third-party Integration)

```typescript
// Dual Approval Workflow - Database Function
CREATE OR REPLACE FUNCTION approve_payment(
  p_payment_id UUID,
  p_approval_type TEXT, -- 'corporate' or 'admin'
  p_notes TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_payment payments%ROWTYPE;
  v_user_role TEXT;
BEGIN
  -- Get payment
  SELECT * INTO v_payment FROM payments WHERE id = p_payment_id;
  
  IF v_payment IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Payment not found');
  END IF;
  
  -- Get user role
  SELECT role INTO v_user_role FROM user_roles
  WHERE user_id = auth.uid() AND active = true;
  
  -- Corporate Approval
  IF p_approval_type = 'corporate' THEN
    IF v_payment.status != 'pending_corporate' THEN
      RETURN jsonb_build_object('success', false, 'error', 'Invalid status');
    END IF;
    
    IF v_user_role NOT IN ('corporate_admin', 'corporate_manager') THEN
      RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
    END IF;
    
    UPDATE payments SET
      status = 'pending_admin',
      corporate_reviewed_by = auth.uid(),
      corporate_reviewed_at = NOW(),
      corporate_approved = true,
      corporate_notes = p_notes,
      updated_at = NOW()
    WHERE id = p_payment_id;
    
    -- Notify admin
    INSERT INTO notifications (user_id, type, title, message, action_url)
    SELECT user_id, 'payment_update', 'Payment Pending Approval',
           'A payment has been approved by corporate and needs your review.',
           '/admin/payments/' || p_payment_id
    FROM user_roles WHERE role = 'admin_finance' AND active = true;
    
  -- Admin Approval  
  ELSIF p_approval_type = 'admin' THEN
    IF v_payment.status != 'pending_admin' THEN
      RETURN jsonb_build_object('success', false, 'error', 'Invalid status');
    END IF;
    
    IF v_user_role NOT IN ('super_admin', 'admin_finance') THEN
      RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
    END IF;
    
    -- CRITICAL: Ensure different approver
    IF v_payment.corporate_reviewed_by = auth.uid() THEN
      RETURN jsonb_build_object('success', false, 'error', 'Cannot approve own approval');
    END IF;
    
    UPDATE payments SET
      status = 'approved',
      admin_reviewed_by = auth.uid(),
      admin_reviewed_at = NOW(),
      admin_approved = true,
      admin_notes = p_notes,
      updated_at = NOW()
    WHERE id = p_payment_id;
    
    -- Notify NGO
    INSERT INTO notifications (user_id, type, title, message)
    SELECT id, 'payment_update', 'Payment Approved',
           'Your payment request has been approved and will be disbursed soon.'
    FROM profiles WHERE organization_id = v_payment.to_organization_id;
    
    -- Trigger payment disbursement (integrate with JazzCash/EasyPaisa)
    -- This would call a payment gateway API
    
  END IF;
  
  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📦 PART 7: WHAT CAN BE DONE IN FIGMA MAKE

### ✅ CAN DO (Frontend Implementation)

1. **Auth Context & Protected Routes**
```typescript
// /contexts/AuthContext.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, organization_id')
            .eq('id', session.user.id)
            .single();
          
          setUser(session.user);
          setRole(profile?.role);
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// /components/auth/ProtectedRoute.tsx
export function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth?returnTo=' + window.location.pathname);
    }
    if (!loading && user && !allowedRoles.includes(role)) {
      navigate('/unauthorized');
    }
  }, [user, role, loading]);
  
  if (loading) return <LoadingSpinner />;
  if (!user || !allowedRoles.includes(role)) return null;
  
  return children;
}
```

2. **API Service Layer**
```typescript
// /lib/api/projects.ts
import { supabase } from '../supabase';
import { projectSchema } from '../validation/schemas';

export const projectsApi = {
  async list(filters = {}) {
    let query = supabase
      .from('projects')
      .select('*, organization:organizations(name, logo_url)');
    
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.city) query = query.eq('city', filters.city);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  
  async create(projectData) {
    // Validate
    const validated = projectSchema.parse(projectData);
    
    const { data, error } = await supabase
      .from('projects')
      .insert(validated)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async update(id, updates) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  // ... more methods
};
```

3. **Form Validation**
```typescript
// Using react-hook-form with Zod
import { useForm } from 'react-hook-form@7.55.0';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../lib/validation/schemas';

export function CreateProjectForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema)
  });
  
  const onSubmit = async (data) => {
    try {
      await projectsApi.create(data);
      toast.success('Project created!');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <span>{errors.title.message}</span>}
      {/* ... */}
    </form>
  );
}
```

4. **Real-time Subscriptions**
```typescript
// /hooks/useRealtimePayments.ts
export function useRealtimePayments(organizationId) {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    // Fetch initial data
    supabase
      .from('payments')
      .select('*')
      .eq('to_organization_id', organizationId)
      .then(({ data }) => setPayments(data || []));
    
    // Subscribe to changes
    const channel = supabase
      .channel('payment-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'payments',
        filter: `to_organization_id=eq.${organizationId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPayments(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setPayments(prev => prev.map(p => 
            p.id === payload.new.id ? payload.new : p
          ));
        }
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
    };
  }, [organizationId]);
  
  return payments;
}
```

5. **Error Boundaries**
```typescript
// /components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log to error logging service
    supabase.from('error_logs').insert({
      error_type: 'client_error',
      error_message: error.message,
      error_stack: error.stack,
      severity: 'error',
      metadata: errorInfo
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

6. **Loading States & Skeletons**
7. **Optimistic Updates**
8. **Toast Notifications**
9. **Client-side Caching (React Query)**
10. **Form State Management**

---

## ❌ PART 8: CANNOT DO IN FIGMA MAKE (Needs Backend IDE)

### 1. **Complete Database Schema Creation**
- Need to run 25+ table migrations
- Set up RLS policies for all tables
- Create database functions & triggers
- Set up indexes for performance

### 2. **Supabase Edge Functions** (20-30 functions)
```
/functions
  /send-email
  /generate-certificate
  /process-payment
  /verify-document
  /background-check
  /generate-report
  /bulk-approve
  /scheduled-reminders
  /data-export
  /virus-scan
  /image-processing
  /pdf-generation
  /webhook-handler
  /analytics-aggregation
  /backup-data
```

### 3. **Third-party Integrations**
- Payment Gateway (JazzCash, EasyPaisa, Stripe)
- Email Service (Resend, SendGrid)
- SMS Service (Twilio, MSG91)
- File Storage (Supabase Storage configuration)
- Analytics (Google Analytics, Mixpanel)
- Error Tracking (Sentry)
- Virus Scanning (ClamAV, VirusTotal)
- Background Check API
- Map Services (Google Maps API)

### 4. **Scheduled Jobs & Cron Tasks**
```sql
-- Examples:
- Send daily digest emails (cron: 0 9 * * *)
- Check for expiring documents (cron: 0 0 * * *)
- Send payment reminders (cron: 0 10 * * *)
- Generate weekly reports (cron: 0 8 * * 1)
- Clean up old audit logs (cron: 0 2 1 * *)
- Backup database (cron: 0 3 * * *)
- Update scorecard calculations (cron: 0 0 1 * *)
```

### 5. **Server-side Security**
- HTTPS enforcement
- CSP headers
- CORS configuration
- Rate limiting middleware
- IP whitelisting
- DDoS protection

### 6. **Data Migrations & Seeding**
- Initial admin user
- Default roles & permissions
- System settings
- Email templates
- Sample data for testing

### 7. **Monitoring & Logging**
- Application monitoring (Datadog, New Relic)
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Security alerts

### 8. **Backup & Recovery**
- Automated database backups
- Point-in-time recovery
- Disaster recovery plan
- Data export scripts

### 9. **Testing Infrastructure**
- Unit tests
- Integration tests
- E2E tests
- Load testing
- Security testing

### 10. **DevOps & CI/CD**
- Build pipelines
- Deployment automation
- Environment management
- Feature flags
- A/B testing infrastructure

---

## 🎯 PART 9: IMPLEMENTATION PRIORITY MATRIX

### **PHASE 1: CRITICAL - MUST HAVE** (Weeks 1-4)

#### Week 1: Authentication & Core Database
```
Priority: P0 (BLOCKING)
Estimated Time: 40 hours

Tasks:
1. Complete database schema (all 25 tables) - 8h
2. Set up RLS policies for all tables - 8h
3. Integrate auth service with all dashboards - 6h
4. Create AuthContext & ProtectedRoute components - 4h
5. Add role-based navigation - 4h
6. Set up Supabase Storage buckets - 3h
7. Create file upload function with security - 4h
8. Test authentication flows - 3h

Deliverables:
✅ Full database schema deployed
✅ RLS enabled on all tables
✅ Auth working across all dashboards
✅ Role-based access control
✅ File uploads secured
```

#### Week 2: Projects & Applications
```
Priority: P0 (BLOCKING)
Estimated Time: 40 hours

Tasks:
1. Implement Projects API (15 endpoints) - 10h
2. Implement Applications API (10 endpoints) - 8h
3. Connect Corporate Dashboard to real data - 6h
4. Connect Volunteer Dashboard to real data - 6h
5. Set up real-time subscriptions - 4h
6. Add form validation (Zod schemas) - 4h
7. Testing - 2h

Deliverables:
✅ Projects CRUD working
✅ Applications workflow complete
✅ Real-time updates working
✅ Form validation in place
```

#### Week 3: Payments & Verification
```
Priority: P0 (CRITICAL)
Estimated Time: 40 hours

Tasks:
1. Implement Payments API (12 endpoints) - 10h
2. Create dual-approval workflow function - 6h
3. Implement Organization Verification API - 8h
4. Connect NGO Dashboard to real data - 6h
5. Connect Admin Dashboard to real data - 6h
6. Set up audit logging triggers - 4h

Deliverables:
✅ Payment system working (dual approval)
✅ Verification workflow complete
✅ NGO & Admin dashboards connected
✅ Audit trails capturing all actions
```

#### Week 4: Documents & Security
```
Priority: P0 (CRITICAL)
Estimated Time: 40 hours

Tasks:
1. Implement Documents API (10 endpoints) - 8h
2. Set up virus scanning integration - 6h
3. Create document verification workflow - 6h
4. Implement rate limiting - 4h
5. Add input sanitization everywhere - 6h
6. Security testing & penetration testing - 8h
7. Fix critical vulnerabilities - 2h

Deliverables:
✅ Document management system working
✅ Virus scanning active
✅ Rate limiting in place
✅ Input sanitization complete
✅ Security vulnerabilities fixed
```

### **PHASE 2: HIGH PRIORITY** (Weeks 5-8)

#### Week 5: Notifications & Communication
```
Priority: P1 (HIGH)
Estimated Time: 40 hours

Tasks:
1. Set up email service integration (Resend) - 4h
2. Create email templates (10+ templates) - 8h
3. Implement notification system - 8h
4. Set up real-time notifications - 6h
5. Implement messaging system - 8h
6. Add SMS notifications (Twilio) - 4h
7. Testing - 2h

Deliverables:
✅ Email notifications working
✅ In-app notifications working
✅ Messaging system complete
✅ SMS alerts functional
```

#### Week 6: Certificates & Hours Tracking
```
Priority: P1 (HIGH)
Estimated Time: 32 hours

Tasks:
1. Implement Certificates API - 6h
2. Create PDF generation function - 8h
3. Design certificate templates - 6h
4. Implement volunteer hours tracking - 6h
5. Create hours verification workflow - 4h
6. Testing - 2h

Deliverables:
✅ Certificate generation working
✅ Volunteer hours tracking functional
✅ Verification workflows complete
```

#### Week 7: Reports & Analytics
```
Priority: P1 (HIGH)
Estimated Time: 32 hours

Tasks:
1. Implement Analytics API (8 endpoints) - 10h
2. Create dashboard analytics queries - 8h
3. Set up data export functions - 6h
4. Implement PDF report generation - 6h
5. Testing - 2h

Deliverables:
✅ Analytics dashboards populated
✅ Export functionality working
✅ Reports generation complete
```

#### Week 8: Payment Integration
```
Priority: P1 (HIGH)
Estimated Time: 40 hours

Tasks:
1. Integrate JazzCash/EasyPaisa API - 12h
2. Implement payment disbursement - 10h
3. Set up payment reconciliation - 8h
4. Add payment webhooks - 6h
5. Testing & security audit - 4h

Deliverables:
✅ Payment gateway integrated
✅ Disbursement working
✅ Reconciliation automated
```

### **PHASE 3: MEDIUM PRIORITY** (Weeks 9-12)

#### Week 9: Advanced Features
```
Priority: P2 (MEDIUM)
Estimated Time: 32 hours

Tasks:
1. Implement Milestones API - 6h
2. Create Project Updates system - 6h
3. Add Contracts management - 8h
4. Implement Scorecard calculations - 8h
5. Testing - 4h

Deliverables:
✅ Milestones tracking working
✅ Project updates posting
✅ Contract management functional
✅ Scorecards calculating automatically
```

#### Week 10: Background Checks & Vetting
```
Priority: P2 (MEDIUM)
Estimated Time: 32 hours

Tasks:
1. Integrate background check API - 10h
2. Implement vetting case management - 10h
3. Create SLA tracking system - 6h
4. Add bulk actions for admin - 4h
5. Testing - 2h

Deliverables:
✅ Background checks automated
✅ Vetting queue functional
✅ SLA tracking working
✅ Bulk actions available
```

#### Week 11: Scheduled Jobs & Automation
```
Priority: P2 (MEDIUM)
Estimated Time: 32 hours

Tasks:
1. Set up cron jobs (8 tasks) - 12h
2. Create email reminder system - 8h
3. Implement auto-expiry checks - 6h
4. Add data cleanup tasks - 4h
5. Testing - 2h

Deliverables:
✅ Scheduled jobs running
✅ Email reminders sending
✅ Data cleanup automated
```

#### Week 12: Testing & Optimization
```
Priority: P2 (MEDIUM)
Estimated Time: 40 hours

Tasks:
1. Performance optimization - 10h
2. Load testing - 8h
3. Security testing - 8h
4. Bug fixes - 10h
5. Documentation - 4h

Deliverables:
✅ Performance optimized
✅ Load testing passed
✅ Security vulnerabilities fixed
✅ Documentation complete
```

---

## ⏱️ PART 10: TIMELINE SUMMARY

### **Total Estimated Time: 452 hours (8-12 weeks)**

#### By Phase:
- **Phase 1 (Critical):** 160 hours (4 weeks) - MUST DO BEFORE LAUNCH
- **Phase 2 (High):** 144 hours (4 weeks) - SHOULD DO BEFORE LAUNCH
- **Phase 3 (Medium):** 148 hours (4 weeks) - NICE TO HAVE

#### By Task Type:
- **Database & Backend:** 180 hours (40%)
- **API Development:** 140 hours (31%)
- **Security Implementation:** 60 hours (13%)
- **Third-party Integrations:** 40 hours (9%)
- **Testing & QA:** 32 hours (7%)

#### Team Size Recommendations:
- **1 Backend Developer:** 12 weeks
- **2 Backend Developers:** 6-8 weeks
- **3 Backend Developers:** 4-6 weeks

---

## 🚨 PART 11: CRITICAL SECURITY CHECKLIST

### **Before Production Launch - MUST COMPLETE**

#### Authentication & Authorization
- [ ] Supabase Auth integrated across all dashboards
- [ ] RLS policies enabled on ALL tables
- [ ] Role-based access control implemented
- [ ] Protected routes wrapping all dashboards
- [ ] Session timeout (30 minutes) configured
- [ ] Password strength requirements enforced
- [ ] Email verification required
- [ ] Account lockout after failed attempts (10)

#### Data Protection
- [ ] All sensitive fields encrypted (bank accounts, IDs)
- [ ] XSS protection (DOMPurify) on all user inputs
- [ ] SQL injection prevented (Supabase RLS + parameterized queries)
- [ ] CSRF tokens on all state-changing operations
- [ ] Input validation (Zod) on all forms
- [ ] File upload validation (type, size, virus scan)
- [ ] EXIF data stripped from uploaded images

#### Network Security
- [ ] HTTPS enforced (redirects from HTTP)
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] CORS properly configured
- [ ] Rate limiting on all endpoints
- [ ] DDoS protection enabled

#### Audit & Compliance
- [ ] Audit logging on ALL critical actions
- [ ] Dual approval for payments (enforced at DB level)
- [ ] Data retention policies configured
- [ ] GDPR compliance (data export, deletion)
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan documented

#### Third-party Security
- [ ] Payment gateway integration secured (PCI DSS)
- [ ] Email service configured with DKIM/SPF
- [ ] File storage access controlled
- [ ] API keys stored in environment variables (never in code)
- [ ] Third-party APIs using TLS 1.3+

---

## 📦 PART 12: ENVIRONMENT VARIABLES REQUIRED

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # SERVER ONLY

# Database
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/wasilah

# Authentication
JWT_SECRET=your-super-secret-jwt-key
SESSION_TIMEOUT_MINUTES=30

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxx
EMAIL_FROM=hello@wasilah.org
ADMIN_EMAIL=admin@wasilah.org

# SMS (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Payment Gateway
JAZZCASH_MERCHANT_ID=MCxxxxxxxxx
JAZZCASH_PASSWORD=xxxxxxxxx
JAZZCASH_SALT=xxxxxxxxx
JAZZCASH_RETURN_URL=https://wasilah.org/payments/callback

# File Upload
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png

# Virus Scanning
VIRUSTOTAL_API_KEY=xxxxxxxxx

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=xxxxxxxxx

# Error Tracking
SENTRY_DSN=https://[key]@[project].ingest.sentry.io/[id]

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

# Rate Limiting
UPSTASH_REDIS_URL=https://[endpoint].upstash.io
UPSTASH_REDIS_TOKEN=xxxxxxxxx

# Monitoring
DATADOG_API_KEY=xxxxxxxxx

# Security
RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXX

# Admin
ADMIN_IP_WHITELIST=1.2.3.4,5.6.7.8
```

---

## 🎓 PART 13: DEVELOPER HANDOFF NOTES

### For Backend Developer:

1. **Start Here:**
   - Review this document thoroughly
   - Clone the repository
   - Review `/SECURITY_AUDIT.md`
   - Review `/supabase/migrations/001_create_auth_tables.sql`

2. **First Week Plan:**
   - Day 1-2: Set up Supabase project, create all 25 tables
   - Day 3-4: Set up RLS policies on all tables
   - Day 5: Test auth flows, create edge functions structure

3. **Database Migrations:**
   - All schema in this document should be run in order
   - Test RLS policies with different user roles
   - Seed database with test data

4. **Testing Strategy:**
   - Unit tests for all API functions
   - Integration tests for workflows
   - Load testing for performance
   - Security testing for vulnerabilities

5. **Documentation:**
   - API documentation (OpenAPI/Swagger)
   - Database schema documentation
   - Deployment guide
   - Security best practices

---

## ✅ FINAL RECOMMENDATION

### **What to Do in Figma Make (Can Start Immediately):**

1. ✅ Wrap all dashboards with `AuthProvider` context
2. ✅ Add `ProtectedRoute` wrapper to dashboard routes
3. ✅ Create API service layer (`/lib/api/*`)
4. ✅ Add Zod validation schemas to all forms
5. ✅ Implement real-time subscriptions hooks
6. ✅ Add error boundaries
7. ✅ Improve loading states
8. ✅ Add toast notifications for API responses
9. ✅ Implement client-side caching (React Query)
10. ✅ Add input sanitization (DOMPurify)

### **What REQUIRES Backend IDE:**

1. ❌ Complete database schema (25 tables)
2. ❌ RLS policies on all tables
3. ❌ Supabase Edge Functions (20-30 functions)
4. ❌ Payment gateway integration
5. ❌ Email/SMS service integration
6. ❌ File upload with virus scanning
7. ❌ Background check API integration
8. ❌ Scheduled jobs/cron tasks
9. ❌ Security headers configuration
10. ❌ Monitoring & logging setup

### **Recommended Next Steps:**

1. **Immediate (You can do now):**
   - Implement all "Can Do in Figma Make" items above
   - This will prepare the frontend for backend integration
   - Estimated time: 2-3 days

2. **Short-term (Week 1-2):**
   - Hire/assign a backend developer
   - Set up Supabase project
   - Create all database tables
   - Enable RLS policies

3. **Medium-term (Week 3-8):**
   - Implement all critical APIs
   - Integrate payment gateway
   - Set up email/SMS services
   - Complete security implementation

4. **Long-term (Week 9-12):**
   - Advanced features
   - Performance optimization
   - Comprehensive testing
   - Production deployment

---

## 🚀 CONCLUSION

**Current Status:**
- Frontend: ✅ 100% Complete
- Backend: ⚠️ 5% Complete (only auth schema exists)
- Security: 🔴 NOT production-ready

**Path to Production:**
- **Minimum:** 4 weeks (Phase 1 only - critical features)
- **Recommended:** 8 weeks (Phase 1 + Phase 2 - full features)
- **Ideal:** 12 weeks (All phases - polished & tested)

**What You Have:**
- Beautiful, functional UI across all 4 dashboards
- Complete component library
- Well-structured frontend code

**What You Need:**
- Complete backend implementation
- Database with proper security
- Third-party integrations
- Comprehensive testing

**This platform has MASSIVE potential. The frontend is excellent. Now it needs a solid backend foundation to make it production-ready and secure for real users.**

---

**Document Version:** 1.0  
**Last Updated:** January 8, 2026  
**Prepared for:** Wasilah Development Team
