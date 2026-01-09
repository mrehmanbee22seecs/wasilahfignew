# 📦 Package Dependencies for Auth System

## Required Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

## Installation

```bash
npm install @supabase/supabase-js
```

or

```bash
pnpm add @supabase/supabase-js
```

or

```bash
yarn add @supabase/supabase-js
```

---

## Existing Dependencies Used

The auth system also uses these packages (already in your project):

- `react` - UI components
- `lucide-react` - Icons
- `sonner@2.0.3` - Toast notifications (for error messages)

---

## Dev Dependencies (Optional)

For testing (recommended):

```bash
npm install -D @testing-library/react @testing-library/jest-dom jest
```

---

## Verify Installation

Run this to check if Supabase is installed:

```bash
npm list @supabase/supabase-js
```

Should output:
```
@supabase/supabase-js@2.39.0
```

---

## TypeScript Types

TypeScript types are included with `@supabase/supabase-js`, no additional `@types` package needed.

---

## Troubleshooting

### "Module not found: @supabase/supabase-js"

**Solution:**
```bash
npm install @supabase/supabase-js
npm run dev  # Restart dev server
```

### Import errors

Make sure you're importing correctly:
```typescript
import { createClient } from '@supabase/supabase-js';
```

NOT:
```typescript
import { createClient } from '@supabase/supabase';  // ❌ Wrong
```

---

**Ready to proceed?**  
After installing dependencies, follow [`/docs/PRODUCTION_SETUP.md`](/docs/PRODUCTION_SETUP.md)
