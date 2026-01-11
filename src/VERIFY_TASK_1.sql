-- =====================================================
-- TASK 1 VERIFICATION SCRIPT
-- =====================================================
-- Run this in Supabase SQL Editor to verify everything is set up correctly
-- Expected result: All checks should return "✅ PASS"

-- =====================================================
-- CHECK 1: Tables Exist
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) = 4 THEN '✅ PASS: All 4 tables exist'
    ELSE '❌ FAIL: Only ' || COUNT(*) || ' tables found (expected 4)'
  END AS "Table Check"
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'organizations', 'auth_metadata', 'rate_limits');

-- =====================================================
-- CHECK 2: RLS Enabled on All Tables
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) = 4 THEN '✅ PASS: RLS enabled on all tables'
    ELSE '❌ FAIL: RLS not enabled on all tables'
  END AS "RLS Check"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'organizations', 'auth_metadata', 'rate_limits')
  AND rowsecurity = true;

-- =====================================================
-- CHECK 3: Policies Exist
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) >= 11 THEN '✅ PASS: ' || COUNT(*) || ' policies created'
    ELSE '❌ FAIL: Only ' || COUNT(*) || ' policies found (expected at least 11)'
  END AS "Policy Check"
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'organizations', 'auth_metadata', 'rate_limits');

-- =====================================================
-- CHECK 4: Helper Functions Exist
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS: All helper functions exist'
    ELSE '❌ FAIL: Only ' || COUNT(*) || ' functions found (expected 3)'
  END AS "Function Check"
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
  AND routine_name IN ('calculate_profile_completeness', 'check_rate_limit', 'update_updated_at_column');

-- =====================================================
-- CHECK 5: Triggers Exist
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ PASS: All triggers exist'
    ELSE '❌ FAIL: Only ' || COUNT(*) || ' triggers found (expected 2)'
  END AS "Trigger Check"
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND trigger_name IN ('update_profiles_updated_at', 'update_organizations_updated_at');

-- =====================================================
-- CHECK 6: Profiles Table Structure
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) >= 20 THEN '✅ PASS: Profiles table has ' || COUNT(*) || ' columns'
    ELSE '❌ FAIL: Profiles table only has ' || COUNT(*) || ' columns'
  END AS "Profiles Table Check"
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles';

-- =====================================================
-- CHECK 7: Indexes Exist
-- =====================================================
SELECT 
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ PASS: ' || COUNT(*) || ' indexes created'
    ELSE '⚠️ WARNING: Only ' || COUNT(*) || ' indexes found'
  END AS "Index Check"
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'organizations', 'auth_metadata', 'rate_limits')
  AND indexname LIKE 'idx_%';

-- =====================================================
-- DETAILED CHECKS (Show what exists)
-- =====================================================

-- Show all tables
SELECT '📋 Tables:' AS "=== TABLES ===";
SELECT 
  table_name as "Table Name",
  CASE 
    WHEN pg_tables.rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as "RLS Status"
FROM information_schema.tables
LEFT JOIN pg_tables ON pg_tables.tablename = information_schema.tables.table_name
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'organizations', 'auth_metadata', 'rate_limits')
ORDER BY table_name;

-- Show all policies
SELECT '🔒 Policies:' AS "=== POLICIES ===";
SELECT 
  tablename as "Table",
  policyname as "Policy Name",
  cmd as "Command"
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Show all functions
SELECT '⚙️ Functions:' AS "=== FUNCTIONS ===";
SELECT 
  routine_name as "Function Name",
  data_type as "Return Type"
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Show all triggers
SELECT '🔔 Triggers:' AS "=== TRIGGERS ===";
SELECT 
  trigger_name as "Trigger Name",
  event_object_table as "Table",
  action_timing as "Timing",
  event_manipulation as "Event"
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Show indexes
SELECT '📊 Indexes:' AS "=== INDEXES ===";
SELECT 
  tablename as "Table",
  indexname as "Index Name"
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'organizations', 'auth_metadata', 'rate_limits')
ORDER BY tablename, indexname;

-- =====================================================
-- SUMMARY
-- =====================================================
SELECT '🎯 Summary:' AS "=== SUMMARY ===";

SELECT 
  '📋 Tables' as "Category",
  COUNT(*)::text || ' / 4' as "Status"
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'organizations', 'auth_metadata', 'rate_limits')

UNION ALL

SELECT 
  '🔒 Policies' as "Category",
  COUNT(*)::text || ' (min 11)' as "Status"
FROM pg_policies 
WHERE schemaname = 'public'

UNION ALL

SELECT 
  '⚙️ Functions' as "Category",
  COUNT(*)::text || ' / 3' as "Status"
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_type = 'FUNCTION'
  AND routine_name IN ('calculate_profile_completeness', 'check_rate_limit', 'update_updated_at_column')

UNION ALL

SELECT 
  '🔔 Triggers' as "Category",
  COUNT(*)::text || ' / 2' as "Status"
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND trigger_name IN ('update_profiles_updated_at', 'update_organizations_updated_at')

UNION ALL

SELECT 
  '📊 Indexes' as "Category",
  COUNT(*)::text || ' (min 10)' as "Status"
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%';

-- =====================================================
-- TEST RLS (Run this after you're logged in)
-- =====================================================
-- Uncomment to test RLS:

-- This should work (returns your profile or empty if no profile yet)
-- SELECT '✅ Can read own profile' as test, * FROM profiles WHERE id = auth.uid();

-- This should return empty (RLS blocks other users' profiles)
-- SELECT '❌ Cannot read other profiles' as test, COUNT(*) FROM profiles WHERE id != auth.uid();

-- =====================================================
-- EXPECTED RESULTS
-- =====================================================
/*
If everything is set up correctly, you should see:

✅ PASS: All 4 tables exist
✅ PASS: RLS enabled on all tables  
✅ PASS: 11 policies created
✅ PASS: All helper functions exist
✅ PASS: All triggers exist
✅ PASS: Profiles table has 22+ columns
✅ PASS: 10+ indexes created

If any check shows ❌ FAIL, review the setup guide and re-run the migration.
*/
