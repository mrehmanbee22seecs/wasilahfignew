# Task A1: Manual Implementation Steps

## ✅ Status: FULLY IMPLEMENTED

All code changes are complete and pushed to branch: `copilot/install-configure-react-query`

---

## 🎯 What You Need To Do Manually

### Step 1: Pull the Changes (if not already in your workspace)

```bash
git fetch origin
git checkout copilot/install-configure-react-query
```

### Step 2: Install Dependencies (REQUIRED - New packages added)

```bash
npm install
```

This installs:
- `@tanstack/react-query@5.90.20`
- `@tanstack/react-query-devtools@5.91.3`

### Step 3: Restart Your Development Server

```bash
# Stop current server (Ctrl+C if running)
npm run dev
```

**That's all!** 🎉

---

## 📦 What Was Automatically Configured

### ✅ Package Installation
- Added `@tanstack/react-query` to dependencies
- Added `@tanstack/react-query-devtools` to dependencies

### ✅ QueryClient Configuration (`src/lib/queryClient.ts`)
Created with optimal settings:
- **staleTime**: 5 minutes (data freshness)
- **gcTime**: 10 minutes (garbage collection)
- **refetchOnWindowFocus**: false (prevents unnecessary refetches)
- **retry**: 1 attempt (for failed requests)
- **throwOnError**: false (component-level error handling)

### ✅ QueryProvider Context (`src/contexts/QueryProvider.tsx`)
- Wraps app with `QueryClientProvider`
- Includes `ReactQueryDevtools` (development only)
- DevTools positioned at bottom with `initialIsOpen={false}`

### ✅ App Integration (`src/App.tsx`)
Provider hierarchy:
```
ErrorBoundary
  └─ QueryProvider
      └─ AuthProvider
          └─ RealtimeProvider
              └─ AppContent
```

---

## 🔍 How to Verify It's Working

### In Your Browser (Development Mode):

1. **Open your app**: http://localhost:3000 (or your dev URL)

2. **Look for React Query DevTools icon**:
   - Located at **bottom-left** or **bottom-right** corner
   - Small circular icon (looks like a flower/asterisk)
   - Color indicates cache status

3. **Click the icon** to open DevTools:
   - Shows active queries
   - Cache status
   - Query details
   - Fresh/Stale/Inactive states

### In Your Code:

Test React Query is working by adding to any component:

```tsx
import { useQuery } from '@tanstack/react-query';

function TestComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ['test'],
    queryFn: async () => ({ message: 'React Query works!' })
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data?.message}</div>;
}
```

---

## 📁 Changed Files Summary

### New Files (2):
1. `src/lib/queryClient.ts` - QueryClient configuration
2. `src/contexts/QueryProvider.tsx` - Provider wrapper component

### Modified Files (3):
1. `src/App.tsx` - Added QueryProvider to component tree
2. `package.json` - Added React Query dependencies
3. `package-lock.json` - Updated package lock

---

## 💡 Usage Examples

### Basic Query (GET request):
```tsx
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json())
  });

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error.message;
  return <div>{data.name}</div>;
}
```

### Mutation (POST/PUT/DELETE):
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreatePost() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newPost) => fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify(newPost)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    }
  });

  return <button onClick={() => mutation.mutate({ title: 'New Post' })}>
    Create Post
  </button>;
}
```

---

## ❓ FAQ

**Q: Do I need to modify my existing API calls?**  
**A:** No! React Query is opt-in. Existing fetch/axios calls continue working. Migrate them gradually.

**Q: Will this affect my production build?**  
**A:** The DevTools are automatically excluded in production (`NODE_ENV === "production"`). Only the core library (~45KB gzipped) is included.

**Q: Can I change the configuration?**  
**A:** Yes! Edit `src/lib/queryClient.ts` to adjust:
- Cache times
- Retry behavior
- Error handling
- Refetch settings

**Q: Do I need to wrap individual components?**  
**A:** No! `QueryProvider` is already at the root in `App.tsx`. All child components can use React Query hooks directly.

**Q: What if I already have my own caching solution?**  
**A:** React Query can coexist with other solutions. Use it for new features or migrate gradually.

---

## 🎊 Summary

### Manual Steps Required:
1. ✅ Run `npm install` (installs new packages)
2. ✅ Restart dev server (`npm run dev`)

### Everything Else:
✅ **Already configured and ready to use!**

No additional setup, configuration files, or code changes needed. Start using React Query hooks in your components immediately!

---

## 🔗 Resources

- [React Query Documentation](https://tanstack.com/query/latest/docs/react/overview)
- [DevTools Guide](https://tanstack.com/query/latest/docs/react/devtools)
- [Query Client Config](https://tanstack.com/query/latest/docs/react/reference/QueryClient)

---

**Last Updated**: 2026-01-31  
**Branch**: `copilot/install-configure-react-query`  
**Status**: ✅ Complete & Tested
