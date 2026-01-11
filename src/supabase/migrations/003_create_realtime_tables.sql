-- =====================================================
-- WASILAH REALTIME TABLES - DATABASE SCHEMA
-- =====================================================
-- Purpose: Create tables for real-time notifications and activity
-- Created: 2026-01-09
-- Version: 1.0

-- =====================================================
-- 1. NOTIFICATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- =====================================================
-- 2. ACTIVITY FEED TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  title TEXT NOT NULL,
  description TEXT,
  
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'team')),
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON activity_feed(user_id);
CREATE INDEX idx_activity_actor ON activity_feed(actor_id);
CREATE INDEX idx_activity_entity ON activity_feed(entity_type, entity_id);
CREATE INDEX idx_activity_created ON activity_feed(created_at DESC);
CREATE INDEX idx_activity_visibility ON activity_feed(visibility);

-- =====================================================
-- 3. USER SESSIONS TABLE (for presence)
-- =====================================================

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  session_token TEXT UNIQUE NOT NULL,
  device_info JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, session_token)
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(last_active_at);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);

-- =====================================================
-- 4. REALTIME EVENTS TABLE (for broadcast)
-- =====================================================

CREATE TABLE IF NOT EXISTS realtime_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  channel TEXT NOT NULL,
  event_type TEXT NOT NULL,
  
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  payload JSONB NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_realtime_events_channel ON realtime_events(channel);
CREATE INDEX idx_realtime_events_sender ON realtime_events(sender_id);
CREATE INDEX idx_realtime_events_created ON realtime_events(created_at DESC);

-- Automatically delete events older than 7 days
CREATE INDEX idx_realtime_events_cleanup ON realtime_events(created_at) WHERE created_at < NOW() - INTERVAL '7 days';

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_events ENABLE ROW LEVEL SECURITY;

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- ACTIVITY FEED POLICIES
CREATE POLICY "Users can view own activity"
  ON activity_feed FOR SELECT
  USING (auth.uid() = user_id OR visibility = 'public');

CREATE POLICY "System can create activity"
  ON activity_feed FOR INSERT
  WITH CHECK (true);

-- USER SESSIONS POLICIES
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions"
  ON user_sessions FOR ALL
  USING (auth.uid() = user_id);

-- REALTIME EVENTS POLICIES
CREATE POLICY "Users can view events in their channels"
  ON realtime_events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create events"
  ON realtime_events FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- =====================================================
-- 6. TRIGGERS
-- =====================================================

-- Update notifications updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Set read_at when notification is marked as read
CREATE OR REPLACE FUNCTION set_notification_read_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.read = true AND OLD.read = false THEN
    NEW.read_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notification_read_timestamp
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION set_notification_read_at();

-- Update user session last_active_at
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_active_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_session_activity
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Create notification for user
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_link TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link, metadata)
  VALUES (p_user_id, p_type, p_title, p_message, p_link, p_metadata)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create activity feed entry
CREATE OR REPLACE FUNCTION create_activity(
  p_user_id UUID,
  p_actor_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_visibility TEXT DEFAULT 'private',
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO activity_feed (user_id, actor_id, action, entity_type, entity_id, title, description, visibility, metadata)
  VALUES (p_user_id, p_actor_id, p_action, p_entity_type, p_entity_id, p_title, p_description, p_visibility, p_metadata)
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get online users (active in last 5 minutes)
CREATE OR REPLACE FUNCTION get_online_users()
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  profile_photo_url TEXT,
  last_active_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    s.user_id,
    p.display_name,
    p.profile_photo_url,
    MAX(s.last_active_at) as last_active_at
  FROM user_sessions s
  JOIN profiles p ON p.id = s.user_id
  WHERE s.last_active_at > NOW() - INTERVAL '5 minutes'
  GROUP BY s.user_id, p.display_name, p.profile_photo_url
  ORDER BY last_active_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup old realtime events (called by cron)
CREATE OR REPLACE FUNCTION cleanup_old_realtime_events()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM realtime_events
  WHERE created_at < NOW() - INTERVAL '7 days';
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. REALTIME PUBLICATION
-- =====================================================

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE realtime_events;

-- Also enable realtime for existing tables
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE volunteer_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE volunteer_hours;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE vetting_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE ngo_documents;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
