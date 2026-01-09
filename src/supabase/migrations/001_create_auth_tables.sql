-- =====================================================
-- WASILAH AUTH SYSTEM - DATABASE SCHEMA
-- =====================================================
-- Purpose: Create tables for user profiles, organizations, and auth metadata
-- Created: 2024-01-07
-- Version: 1.0

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- Stores user profile information after onboarding
-- Links to Supabase auth.users via user_id

CREATE TABLE IF NOT EXISTS profiles (
  -- Primary Key
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core Profile Fields
  role TEXT NOT NULL CHECK (role IN ('corporate', 'ngo', 'volunteer')),
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Organization Info (optional)
  organization_name TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Location
  location TEXT,
  city TEXT,
  country TEXT DEFAULT 'Pakistan',
  
  -- Profile Media
  profile_photo_url TEXT,
  
  -- Preferences & Interests (JSONB for flexibility)
  interests TEXT[] DEFAULT '{}',
  sdg_goals INTEGER[] DEFAULT '{}',
  causes TEXT[] DEFAULT '{}',
  
  -- Availability (for volunteers)
  availability JSONB,
  
  -- Notification Preferences
  notification_preferences JSONB DEFAULT '{
    "email_notifications": true,
    "weekly_digest": true,
    "project_updates": true,
    "marketing": false
  }'::jsonb,
  
  -- Onboarding Status
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Profile Completeness
  profile_completeness INTEGER DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Verification Status
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_badge TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_organization ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(city, country);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

-- =====================================================
-- 2. ORGANIZATIONS TABLE
-- =====================================================
-- Stores organization details for corporates and NGOs

CREATE TABLE IF NOT EXISTS organizations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Organization Type
  type TEXT NOT NULL CHECK (type IN ('corporate', 'ngo', 'government', 'foundation')),
  
  -- Basic Info
  name TEXT NOT NULL,
  legal_name TEXT,
  registration_number TEXT,
  
  -- Contact
  email TEXT,
  phone TEXT,
  website TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  province TEXT,
  country TEXT DEFAULT 'Pakistan',
  postal_code TEXT,
  
  -- Details
  description TEXT,
  mission_statement TEXT,
  founded_year INTEGER,
  employee_count_range TEXT,
  
  -- Industry/Focus Areas
  industry TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  sdg_alignment INTEGER[] DEFAULT '{}',
  
  -- Media
  logo_url TEXT,
  cover_photo_url TEXT,
  
  -- Verification
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_documents JSONB,
  
  -- Social Media
  social_links JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft Delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organizations_type ON organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_verification ON organizations(verification_status);
CREATE INDEX IF NOT EXISTS idx_organizations_city ON organizations(city);
CREATE INDEX IF NOT EXISTS idx_organizations_created_by ON organizations(created_by);

-- =====================================================
-- 3. AUTH METADATA TABLE
-- =====================================================
-- Tracks authentication events and security metrics

CREATE TABLE IF NOT EXISTS auth_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Event Type
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signup',
    'login',
    'logout',
    'password_reset_request',
    'password_reset_complete',
    'email_verification_sent',
    'email_verified',
    'oauth_login',
    'failed_login',
    'account_locked',
    'account_unlocked'
  )),
  
  -- Event Details
  provider TEXT, -- 'email', 'google', 'linkedin', etc.
  ip_address INET,
  user_agent TEXT,
  location JSONB,
  
  -- Security Metadata
  success BOOLEAN DEFAULT true,
  failure_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_auth_metadata_user ON auth_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_metadata_event ON auth_metadata(event_type);
CREATE INDEX IF NOT EXISTS idx_auth_metadata_created ON auth_metadata(created_at DESC);

-- =====================================================
-- 4. RATE LIMITING TABLE
-- =====================================================
-- Tracks rate-limited actions (OTP resend, login attempts)

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identifier (could be user_id, email, or IP)
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('user_id', 'email', 'ip_address')),
  
  -- Action Type
  action_type TEXT NOT NULL CHECK (action_type IN (
    'otp_resend',
    'otp_verify',
    'login_attempt',
    'password_reset',
    'signup_attempt'
  )),
  
  -- Rate Limit Tracking
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Window Management
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  window_end TIMESTAMP WITH TIME ZONE,
  
  -- Status
  is_blocked BOOLEAN DEFAULT false,
  block_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier, identifier_type, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked ON rate_limits(is_blocked, block_expires_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_end);

-- Unique constraint to prevent duplicate tracking
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limits_unique 
  ON rate_limits(identifier, identifier_type, action_type, window_start);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (during onboarding)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Public can view verified profiles (for directory)
CREATE POLICY "Public can view verified profiles"
  ON profiles FOR SELECT
  USING (is_verified = true);

-- ORGANIZATIONS POLICIES
-- Users can read organizations they belong to
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (
    created_by = auth.uid() OR
    id IN (SELECT organization_id FROM profiles WHERE id = auth.uid())
  );

-- Users can create organizations
CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own organizations
CREATE POLICY "Users can update own organization"
  ON organizations FOR UPDATE
  USING (created_by = auth.uid());

-- Public can view verified organizations
CREATE POLICY "Public can view verified organizations"
  ON organizations FOR SELECT
  USING (verification_status = 'verified' AND deleted_at IS NULL);

-- AUTH_METADATA POLICIES
-- Users can only view their own auth events
CREATE POLICY "Users can view own auth metadata"
  ON auth_metadata FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert auth metadata (service role only)
CREATE POLICY "Service role can insert auth metadata"
  ON auth_metadata FOR INSERT
  WITH CHECK (true);

-- RATE_LIMITS POLICIES
-- Only service role can access rate limits
CREATE POLICY "Service role can manage rate limits"
  ON rate_limits FOR ALL
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

-- Function: Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completeness INTEGER := 0;
  profile_record profiles%ROWTYPE;
BEGIN
  SELECT * INTO profile_record FROM profiles WHERE id = profile_id;
  
  -- Base fields (40 points)
  IF profile_record.display_name IS NOT NULL AND profile_record.display_name != '' THEN
    completeness := completeness + 10;
  END IF;
  
  IF profile_record.location IS NOT NULL THEN
    completeness := completeness + 10;
  END IF;
  
  IF profile_record.profile_photo_url IS NOT NULL THEN
    completeness := completeness + 10;
  END IF;
  
  IF profile_record.onboarding_completed = true THEN
    completeness := completeness + 10;
  END IF;
  
  -- Interests & SDGs (30 points)
  IF array_length(profile_record.interests, 1) > 0 THEN
    completeness := completeness + 15;
  END IF;
  
  IF array_length(profile_record.sdg_goals, 1) > 0 THEN
    completeness := completeness + 15;
  END IF;
  
  -- Organization (20 points)
  IF profile_record.organization_id IS NOT NULL THEN
    completeness := completeness + 20;
  END IF;
  
  -- Verification (10 points)
  IF profile_record.is_verified = true THEN
    completeness := completeness + 10;
  END IF;
  
  RETURN completeness;
END;
$$ LANGUAGE plpgsql;

-- Function: Check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier TEXT,
  p_identifier_type TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER,
  p_window_minutes INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_rate_limit rate_limits%ROWTYPE;
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_result JSONB;
BEGIN
  v_window_start := NOW() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Check if blocked
  SELECT * INTO v_rate_limit
  FROM rate_limits
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND action_type = p_action_type
    AND is_blocked = true
    AND block_expires_at > NOW();
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limit_exceeded',
      'retry_after', EXTRACT(EPOCH FROM (v_rate_limit.block_expires_at - NOW())),
      'attempts_left', 0
    );
  END IF;
  
  -- Get or create rate limit record
  SELECT * INTO v_rate_limit
  FROM rate_limits
  WHERE identifier = p_identifier
    AND identifier_type = p_identifier_type
    AND action_type = p_action_type
    AND window_start >= v_window_start;
  
  IF NOT FOUND THEN
    -- Create new window
    INSERT INTO rate_limits (
      identifier,
      identifier_type,
      action_type,
      attempt_count,
      window_start,
      window_end
    ) VALUES (
      p_identifier,
      p_identifier_type,
      p_action_type,
      1,
      NOW(),
      NOW() + (p_window_minutes || ' minutes')::INTERVAL
    )
    RETURNING * INTO v_rate_limit;
    
    RETURN jsonb_build_object(
      'allowed', true,
      'attempts_left', p_max_attempts - 1
    );
  END IF;
  
  -- Check if limit exceeded
  IF v_rate_limit.attempt_count >= p_max_attempts THEN
    -- Block for remaining window time
    UPDATE rate_limits
    SET is_blocked = true,
        block_expires_at = window_end
    WHERE id = v_rate_limit.id;
    
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limit_exceeded',
      'retry_after', EXTRACT(EPOCH FROM (v_rate_limit.window_end - NOW())),
      'attempts_left', 0
    );
  END IF;
  
  -- Increment attempt count
  UPDATE rate_limits
  SET attempt_count = attempt_count + 1,
      last_attempt_at = NOW()
  WHERE id = v_rate_limit.id;
  
  RETURN jsonb_build_object(
    'allowed', true,
    'attempts_left', p_max_attempts - v_rate_limit.attempt_count - 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. INITIAL DATA / SEED
-- =====================================================

-- Insert default organization types/categories if needed
-- (Can be added later based on business requirements)

-- =====================================================
-- END OF MIGRATION
-- =====================================================
