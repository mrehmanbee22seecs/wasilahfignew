#!/bin/bash

# This script determines if Vercel should build based on what files changed
# Returns 0 (build) or 1 (don't build)

echo "Checking if build is needed..."

# Get the list of changed files
if [ -z "$VERCEL_GIT_COMMIT_REF" ]; then
  # If no commit ref (first deploy), always build
  echo "First deployment detected - building"
  exit 1
fi

# Get changed files between current and previous commit
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null || git diff --name-only HEAD~1 HEAD 2>/dev/null || echo "")

if [ -z "$CHANGED_FILES" ]; then
  echo "No changed files detected - building to be safe"
  exit 1
fi

echo "Changed files:"
echo "$CHANGED_FILES"

# Patterns to ignore (don't trigger build)
IGNORE_PATTERNS=(
  "^.*\.md$"
  "^docs/"
  "^TASK_.*\.md$"
  "^.*_SUMMARY\.md$"
  "^.*_REPORT\.md$"
  "^.*_COMPLETE\.md$"
  "^.*_VERIFICATION.*\.md$"
  "^.*\.test\.(ts|tsx|js|jsx)$"
  "^.*\.spec\.(ts|tsx|js|jsx)$"
  "^src/tests/"
  "^.*/__tests__/"
  "^\.vscode/"
  "^\.idea/"
  "^.*\.log$"
  "^\.gitignore$"
  "^vitest\.config\.ts$"
)

# Check if ALL changed files match ignore patterns
ALL_IGNORED=true
while IFS= read -r file; do
  if [ -z "$file" ]; then
    continue
  fi
  
  FILE_IGNORED=false
  for pattern in "${IGNORE_PATTERNS[@]}"; do
    if echo "$file" | grep -qE "$pattern"; then
      echo "  ✓ Ignoring: $file (matches $pattern)"
      FILE_IGNORED=true
      break
    fi
  done
  
  if [ "$FILE_IGNORED" = false ]; then
    echo "  ✗ Important change: $file"
    ALL_IGNORED=false
  fi
done <<< "$CHANGED_FILES"

if [ "$ALL_IGNORED" = true ]; then
  echo ""
  echo "All changes are documentation/tests only - skipping build ⏭️"
  exit 0
else
  echo ""
  echo "Found important changes - proceeding with build ✓"
  exit 1
fi
