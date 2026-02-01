# Vercel Deployment Optimization Guide

## Problem

The Vercel free tier has a limit of **100 deployments per day**. When this limit is exceeded, deployments fail with:

```
Resource is limited - try again in 1 hour (more than 100, code: "api-deployments-free-per-day")
```

## Solution

This project now includes optimized Vercel configuration to significantly reduce the number of deployments triggered, helping you stay within the free tier limits.

---

## What Was Changed

### 1. Enhanced `vercel.json` Configuration

**Deployment Branch Control:**
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "master": true
    }
  }
}
```
- **Production deployments** only happen on `main` or `master` branches
- Feature branches won't trigger production deployments (only preview deployments)

**Auto-Cancellation:**
```json
{
  "github": {
    "silent": true,
    "autoJobCancelation": true
  }
}
```
- Automatically cancels outdated builds when new commits are pushed
- Reduces wasted deployments

**Smart Build Detection:**
```json
{
  "ignoreCommand": "bash .vercel-ignore.sh"
}
```
- Skips builds when only documentation or tests change
- Saves deployments for actual code changes

### 2. `.vercelignore` File

Excludes files that don't affect the production build:

- **Documentation files**: `*.md`, `docs/`, task summaries, reports
- **Test files**: `*.test.ts`, `*.spec.tsx`, `src/tests/`
- **Development files**: `.vscode/`, `.idea/`, log files
- **Configuration files**: Test configs, editor settings

### 3. `.vercel-ignore.sh` Smart Build Script

Intelligently determines if a build is needed:

- ✅ **Builds** when source code, components, or dependencies change
- ⏭️ **Skips** when only documentation or tests change
- 📊 Shows which files triggered the decision

---

## Expected Impact

### Deployment Reduction

| Scenario | Before | After |
|----------|--------|-------|
| Documentation updates | Builds | **Skips** |
| Test file changes | Builds | **Skips** |
| Feature branch pushes | Full deploy | Preview only |
| Multiple rapid commits | All build | Last only |
| **Est. Daily Deployments** | **100+** | **~20-30** |

**Result:** ~70-80% reduction in deployment count 🎉

---

## Best Practices to Stay Under Limits

### 1. Batch Your Changes
Instead of pushing after every small change:
```bash
# ❌ Bad: Many small commits
git commit -m "fix typo"
git push
git commit -m "update docs"
git push
git commit -m "fix another typo"
git push

# ✅ Good: Batch related changes
git commit -m "fix typo"
git commit -m "update docs"
git commit -m "fix another typo"
git push  # Push once
```

### 2. Test Locally First
Always test your changes locally before pushing:
```bash
# Run dev server
npm run dev

# Run tests
npm run test

# Build locally to catch errors
npm run build
```

### 3. Use Feature Branches
Work on feature branches for development:
```bash
# Create feature branch
git checkout -b feature/my-feature

# Work and commit
git add .
git commit -m "Implement feature"
git push origin feature/my-feature

# Only merge to main when ready
```

### 4. Documentation-Only Changes
For documentation-only updates, the build will automatically skip:
```bash
# These changes won't trigger a build:
- Updating README.md
- Editing files in docs/
- Modifying test files
- Changing *.md files
```

### 5. Use Preview Deployments Wisely
- Main/master branch → Production deployment
- Feature branches → Preview deployment (doesn't count toward production limit as much)
- Draft PRs → Can skip CI checks

---

## Monitoring Your Usage

### Check Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Check **Settings** → **Usage** to see deployment count

### Signs You're Approaching Limit
- 80+ deployments in a day
- Multiple team members pushing frequently
- CI/CD running on every commit

### What to Do if You Hit the Limit

**Option 1: Wait (Free)**
- Wait 1 hour for the rate limit to reset
- Batch your changes and push once

**Option 2: Optimize Further (Free)**
- Review `.vercel-ignore.sh` and add more patterns
- Use local development more
- Push less frequently

**Option 3: Upgrade to Pro (Paid)**
- Unlimited deployments
- Better for teams or active development
- [Upgrade here](https://vercel.com/pricing)

---

## Configuration Reference

### vercel.json Options

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,      // Enable production builds for main
      "master": true     // Enable production builds for master
    }
  },
  "github": {
    "silent": true,                // Less verbose GitHub checks
    "autoJobCancelation": true     // Cancel outdated builds
  },
  "ignoreCommand": "bash .vercel-ignore.sh"  // Custom build decision script
}
```

### Customizing .vercel-ignore.sh

To add more patterns to ignore, edit the `IGNORE_PATTERNS` array:

```bash
IGNORE_PATTERNS=(
  "^.*\.md$"           # All markdown files
  "^docs/"             # Documentation folder
  "^.*\.test\.ts$"     # Test files
  "^your-pattern$"     # Your custom pattern
)
```

### Testing the Ignore Script Locally

```bash
# Make the script executable
chmod +x .vercel-ignore.sh

# Test it (returns 0 to skip, 1 to build)
./.vercel-ignore.sh
echo $?  # 0 = skip build, 1 = build
```

---

## Troubleshooting

### "Still Hitting Rate Limit"

**Check what's triggering deployments:**
1. Look at Vercel deployment logs
2. Check if `.vercel-ignore.sh` is being executed
3. Verify file permissions: `ls -la .vercel-ignore.sh` (should show `x`)

**Additional optimizations:**
- Disable automatic deployments for preview branches
- Use `[skip ci]` in commit messages when appropriate
- Consider using Git hooks to prevent accidental pushes

### "Build Not Triggering When It Should"

**Verify important files aren't ignored:**
1. Check `.vercelignore` doesn't include your source files
2. Review `.vercel-ignore.sh` patterns
3. Test locally: `git diff --name-only HEAD^ HEAD`

**Force a build:**
- Push a change to a non-ignored file (e.g., `package.json`)
- Or redeploy from Vercel dashboard

### "Script Errors"

**If `.vercel-ignore.sh` fails:**
1. Check it's executable: `chmod +x .vercel-ignore.sh`
2. Verify bash is available (it should be on Vercel)
3. Check for syntax errors: `bash -n .vercel-ignore.sh`

**Fallback:**
If the script has issues, Vercel will build by default (fail-safe).

---

## Alternative Solutions

### 1. GitHub Actions for Selective Deployment
Create `.github/workflows/deploy.yml` to control when Vercel is triggered:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

### 2. Manual Deployments Only
Disable automatic deployments in Vercel dashboard:
1. Go to Project Settings
2. Git → Disable automatic deployments
3. Deploy manually when ready

### 3. Vercel CLI for Local Control
Use Vercel CLI to deploy only when you're ready:
```bash
npm install -g vercel
vercel --prod  # Deploy to production manually
```

---

## Summary

✅ **Configured** smart deployment filtering
✅ **Added** `.vercelignore` for unnecessary files
✅ **Created** `.vercel-ignore.sh` for intelligent build decisions
✅ **Enabled** auto-cancellation of outdated builds
✅ **Limited** production deployments to main/master branches

**Expected Result:** ~70-80% reduction in deployments, keeping you well within the 100/day free tier limit.

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs/concepts/deployments/overview
- **Rate Limits**: https://vercel.com/docs/platform/limits#deployments
- **Vercel Support**: https://vercel.com/support

---

**Last Updated:** February 2026
