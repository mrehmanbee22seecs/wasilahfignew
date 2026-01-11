-- =====================================================
-- WASILAH APPLICATION TABLES - DATABASE SCHEMA
-- =====================================================
-- Purpose: Create tables for projects, applications, payments, etc.
-- Created: 2026-01-09
-- Version: 1.0

-- =====================================================
-- 1. PROJECTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'on_hold', 'cancelled')),
  
  -- Relationships
  corporate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ngo_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Budget
  budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
  budget_allocated NUMERIC(12, 2) DEFAULT 0,
  budget_spent NUMERIC(12, 2) DEFAULT 0,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Location
  location TEXT,
  city TEXT,
  province TEXT,
  
  -- Classifications
  sdg_goals INTEGER[] DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  
  -- Capacity
  volunteer_count INTEGER DEFAULT 0,
  volunteer_capacity INTEGER DEFAULT 0,
  beneficiaries_count INTEGER DEFAULT 0,
  
  -- Media & Milestones
  media_urls TEXT[] DEFAULT '{}',
  milestones JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_corporate ON projects(corporate_id);
CREATE INDEX idx_projects_ngo ON projects(ngo_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_city ON projects(city);
CREATE INDEX idx_projects_sdg ON projects USING GIN(sdg_goals);

-- =====================================================
-- 2. VOLUNTEER APPLICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  opportunity_id UUID,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'withdrawn')),
  
  -- Application Details
  application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_date TIMESTAMP WITH TIME ZONE,
  rejected_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  cover_letter TEXT,
  availability_notes TEXT,
  skills_offered TEXT[] DEFAULT '{}',
  hours_committed INTEGER,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_volunteer_applications_volunteer ON volunteer_applications(volunteer_id);
CREATE INDEX idx_volunteer_applications_project ON volunteer_applications(project_id);
CREATE INDEX idx_volunteer_applications_status ON volunteer_applications(status);

-- =====================================================
-- 3. VOLUNTEER HOURS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS volunteer_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  hours NUMERIC(4, 2) NOT NULL,
  activity_description TEXT,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES profiles(id),
  approved_date TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_volunteer_hours_volunteer ON volunteer_hours(volunteer_id);
CREATE INDEX idx_volunteer_hours_project ON volunteer_hours(project_id);
CREATE INDEX idx_volunteer_hours_status ON volunteer_hours(status);
CREATE INDEX idx_volunteer_hours_date ON volunteer_hours(date);

-- =====================================================
-- 4. CERTIFICATES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  volunteer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  certificate_number TEXT UNIQUE NOT NULL,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_certificates_volunteer ON certificates(volunteer_id);
CREATE INDEX idx_certificates_project ON certificates(project_id);

-- =====================================================
-- 5. NGO DOCUMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS ngo_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  ngo_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  document_type TEXT NOT NULL CHECK (document_type IN ('registration', 'tax_exemption', 'financial_statement', 'annual_report', 'other')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ngo_documents_ngo ON ngo_documents(ngo_id);
CREATE INDEX idx_ngo_documents_type ON ngo_documents(document_type);
CREATE INDEX idx_ngo_documents_verified ON ngo_documents(verified);

-- =====================================================
-- 6. CSR BUDGETS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS csr_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  corporate_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fiscal_year TEXT NOT NULL,
  
  total_budget NUMERIC(15, 2) NOT NULL DEFAULT 0,
  allocated NUMERIC(15, 2) DEFAULT 0,
  spent NUMERIC(15, 2) DEFAULT 0,
  remaining NUMERIC(15, 2) DEFAULT 0,
  
  breakdown JSONB DEFAULT '[]'::jsonb,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(corporate_id, fiscal_year)
);

CREATE INDEX idx_csr_budgets_corporate ON csr_budgets(corporate_id);
CREATE INDEX idx_csr_budgets_year ON csr_budgets(fiscal_year);

-- =====================================================
-- 7. PAYMENT APPROVALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  
  requested_by UUID NOT NULL REFERENCES profiles(id),
  requested_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  approved_by UUID REFERENCES profiles(id),
  approved_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  
  invoice_url TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payment_approvals_project ON payment_approvals(project_id);
CREATE INDEX idx_payment_approvals_status ON payment_approvals(status);
CREATE INDEX idx_payment_approvals_requested_by ON payment_approvals(requested_by);

-- =====================================================
-- 8. VETTING QUEUE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS vetting_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  entity_type TEXT NOT NULL CHECK (entity_type IN ('ngo', 'volunteer', 'project', 'document')),
  entity_id UUID NOT NULL,
  
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  assigned_to UUID REFERENCES profiles(id),
  
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_date TIMESTAMP WITH TIME ZONE,
  sla_deadline TIMESTAMP WITH TIME ZONE,
  sla_status TEXT DEFAULT 'on_time' CHECK (sla_status IN ('on_time', 'approaching', 'overdue')),
  
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vetting_queue_entity ON vetting_queue(entity_type, entity_id);
CREATE INDEX idx_vetting_queue_status ON vetting_queue(status);
CREATE INDEX idx_vetting_queue_priority ON vetting_queue(priority);
CREATE INDEX idx_vetting_queue_assigned ON vetting_queue(assigned_to);

-- =====================================================
-- 9. AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  changes JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngo_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE csr_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- PROJECTS POLICIES
CREATE POLICY "Corporates can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = corporate_id);

CREATE POLICY "Corporates can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = corporate_id);

CREATE POLICY "NGOs can view assigned projects"
  ON projects FOR SELECT
  USING (ngo_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Public can view active projects"
  ON projects FOR SELECT
  USING (status = 'active');

CREATE POLICY "Corporates can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = corporate_id);

-- VOLUNTEER APPLICATIONS POLICIES
CREATE POLICY "Volunteers can create applications"
  ON volunteer_applications FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Volunteers can view own applications"
  ON volunteer_applications FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Corporates can view applications for their projects"
  ON volunteer_applications FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE corporate_id = auth.uid()));

CREATE POLICY "Volunteers can withdraw applications"
  ON volunteer_applications FOR UPDATE
  USING (auth.uid() = volunteer_id AND status = 'pending');

-- VOLUNTEER HOURS POLICIES
CREATE POLICY "Volunteers can log own hours"
  ON volunteer_hours FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Volunteers can view own hours"
  ON volunteer_hours FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Project managers can view volunteer hours"
  ON volunteer_hours FOR SELECT
  USING (project_id IN (SELECT id FROM projects WHERE corporate_id = auth.uid()));

CREATE POLICY "Project managers can approve hours"
  ON volunteer_hours FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE corporate_id = auth.uid()));

-- CERTIFICATES POLICIES
CREATE POLICY "Volunteers can view own certificates"
  ON certificates FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Public can verify certificates"
  ON certificates FOR SELECT
  USING (true);

-- NGO DOCUMENTS POLICIES
CREATE POLICY "NGOs can upload own documents"
  ON ngo_documents FOR INSERT
  WITH CHECK (ngo_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "NGOs can view own documents"
  ON ngo_documents FOR SELECT
  USING (ngo_id IN (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- CSR BUDGETS POLICIES
CREATE POLICY "Corporates can manage own budget"
  ON csr_budgets FOR ALL
  USING (auth.uid() = corporate_id);

-- PAYMENT APPROVALS POLICIES
CREATE POLICY "Users can create payment approvals"
  ON payment_approvals FOR INSERT
  WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "Users can view payment approvals"
  ON payment_approvals FOR SELECT
  USING (
    auth.uid() = requested_by OR
    project_id IN (SELECT id FROM projects WHERE corporate_id = auth.uid())
  );

CREATE POLICY "Corporates can approve payments"
  ON payment_approvals FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE corporate_id = auth.uid()));

-- VETTING QUEUE POLICIES (Admin only)
CREATE POLICY "Service role can manage vetting queue"
  ON vetting_queue FOR ALL
  USING (true);

-- AUDIT LOGS POLICIES (Read-only for users)
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- =====================================================
-- 11. TRIGGERS
-- =====================================================

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteer_applications_updated_at
  BEFORE UPDATE ON volunteer_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_csr_budgets_updated_at
  BEFORE UPDATE ON csr_budgets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vetting_queue_updated_at
  BEFORE UPDATE ON vetting_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- END OF MIGRATION
-- =====================================================
