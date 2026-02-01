#!/bin/bash
# Vercel ignore script
# Exit 0 = skip build (no changes in important files)
# Exit 1 = proceed with build (important files changed)

set -e

echo "=== Vercel Build Ignore Check ==="

# Check if we can get a diff
if git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  # Get files changed between current and previous commit
  # Exclude documentation, tests, and other non-essential files
  CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null | \
    grep -v '\.md$' | \
    grep -v '^docs/' | \
    grep -v '^src/tests/' | \
    grep -v '\.test\.ts$' | \
    grep -v '\.test\.tsx$' | \
    grep -v '\.spec\.ts$' | \
    grep -v '\.spec\.tsx$' | \
    grep -v '^TASK_' | \
    grep -v '_SUMMARY\.md$' | \
    grep -v '_REPORT\.md$' | \
    grep -v '_COMPLETE\.md$' | \
    grep -v '_VERIFICATION' | \
    grep -v 'vitest\.config\.ts$' | \
    grep -v '^\.vscode/' | \
    grep -v '^\.idea/' | \
    grep -v '\.log$' || true)
  
  if [ -z "$CHANGED_FILES" ]; then
    echo "✓ Only documentation/tests changed - SKIPPING BUILD"
    exit 0
  else
    echo "✓ Important files changed:"
    echo "$CHANGED_FILES"
    echo "✓ PROCEEDING WITH BUILD"
    exit 1
  fi
else
  # First deployment or can't get diff - always build
  echo "✓ First deployment or no previous commit - PROCEEDING WITH BUILD"
  exit 1
fi
