-- =====================================================
-- WASILAH ERROR LOGS TABLE - DATABASE SCHEMA
-- =====================================================
-- Purpose: Store application error logs for monitoring
-- Created: 2026-01-09
-- Version: 1.0

-- =====================================================
-- ERROR LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Error details
  error_name TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  
  -- Classification
  category TEXT NOT NULL CHECK (category IN (
    'auth', 'api', 'validation', 'network', 'database',
    'permission', 'notfound', 'form', 'file', 'payment', 'unknown'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- User context
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_role TEXT,
  
  -- Request context
  url TEXT,
  user_agent TEXT,
  
  -- Additional context
  context JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_error_logs_created ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_category ON error_logs(category);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_user ON error_logs(user_id);
CREATE INDEX idx_error_logs_category_severity ON error_logs(category, severity);

-- Index for recent critical errors
CREATE INDEX idx_error_logs_critical ON error_logs(created_at DESC) 
  WHERE severity = 'critical';

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Admin can view all errors
CREATE POLICY "Admins can view all error logs"
  ON error_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can view own errors
CREATE POLICY "Users can view own error logs"
  ON error_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert errors
CREATE POLICY "System can insert error logs"
  ON error_logs FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Get error statistics
CREATE OR REPLACE FUNCTION get_error_stats(
  time_period INTERVAL DEFAULT INTERVAL '24 hours'
)
RETURNS TABLE (
  total_errors BIGINT,
  critical_errors BIGINT,
  high_errors BIGINT,
  medium_errors BIGINT,
  low_errors BIGINT,
  errors_by_category JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE severity = 'critical') as critical,
      COUNT(*) FILTER (WHERE severity = 'high') as high,
      COUNT(*) FILTER (WHERE severity = 'medium') as medium,
      COUNT(*) FILTER (WHERE severity = 'low') as low,
      jsonb_object_agg(
        category,
        count
      ) as by_category
    FROM (
      SELECT
        category,
        COUNT(*) as count
      FROM error_logs
      WHERE created_at > NOW() - time_period
      GROUP BY category
    ) cat_counts
    CROSS JOIN (
      SELECT COUNT(*) as total_count
      FROM error_logs
      WHERE created_at > NOW() - time_period
    ) total_count
  )
  SELECT
    total,
    critical,
    high,
    medium,
    low,
    by_category
  FROM stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get recent errors by severity
CREATE OR REPLACE FUNCTION get_recent_errors_by_severity(
  p_severity TEXT,
  p_limit INTEGER DEFAULT 50
)
RETURNS SETOF error_logs AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM error_logs
  WHERE severity = p_severity
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get errors by user
CREATE OR REPLACE FUNCTION get_user_errors(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50
)
RETURNS SETOF error_logs AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM error_logs
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup old error logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM error_logs
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND severity IN ('low', 'medium');
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get error trends
CREATE OR REPLACE FUNCTION get_error_trends(
  time_period INTERVAL DEFAULT INTERVAL '7 days',
  bucket_size INTERVAL DEFAULT INTERVAL '1 hour'
)
RETURNS TABLE (
  time_bucket TIMESTAMP WITH TIME ZONE,
  error_count BIGINT,
  critical_count BIGINT,
  categories JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    date_trunc('hour', created_at) as time_bucket,
    COUNT(*) as error_count,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_count,
    jsonb_object_agg(category, count) as categories
  FROM (
    SELECT
      created_at,
      severity,
      category,
      COUNT(*) OVER (PARTITION BY category) as count
    FROM error_logs
    WHERE created_at > NOW() - time_period
  ) sub
  GROUP BY time_bucket
  ORDER BY time_bucket DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Notify on critical errors
CREATE OR REPLACE FUNCTION notify_critical_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity = 'critical' THEN
    -- This could send a notification or alert
    PERFORM pg_notify('critical_error', json_build_object(
      'error_id', NEW.id,
      'error_name', NEW.error_name,
      'error_message', NEW.error_message,
      'category', NEW.category,
      'user_id', NEW.user_id
    )::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_critical_error
  AFTER INSERT ON error_logs
  FOR EACH ROW
  EXECUTE FUNCTION notify_critical_error();

-- =====================================================
-- SCHEDULED CLEANUP (if pg_cron is available)
-- =====================================================

-- This would require pg_cron extension
-- SELECT cron.schedule(
--   'cleanup-old-errors',
--   '0 2 * * *', -- Run daily at 2 AM
--   'SELECT cleanup_old_error_logs();'
-- );

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Get error statistics for last 24 hours
-- SELECT * FROM get_error_stats(INTERVAL '24 hours');

-- Get recent critical errors
-- SELECT * FROM get_recent_errors_by_severity('critical', 10);

-- Get errors for specific user
-- SELECT * FROM get_user_errors('user-uuid-here', 20);

-- Get error trends
-- SELECT * FROM get_error_trends(INTERVAL '7 days', INTERVAL '1 hour');

-- Manual cleanup
-- SELECT cleanup_old_error_logs();

-- =====================================================
-- END OF MIGRATION
-- =====================================================
