# Code Splitting & Lazy Loading Documentation

## Overview

This document describes the code splitting and lazy loading implementation in the Wasilah application. These optimizations have reduced the initial JavaScript bundle size by over 92%, significantly improving Time to Interactive (TTI) and perceived performance.

## Bundle Size Improvements

### Before Code Splitting
- **Main bundle**: 3,328 kB (after initial vendor splitting)
- **Total initial load**: ~3,500 kB
- All pages loaded upfront, even if never visited

### After Code Splitting
- **Main bundle**: 252 kB (includes core app shell and HomePage)
- **Vendor chunks**: Split by category (React, Radix UI, TanStack Query, etc.)
- **Page chunks**: 11-431 kB each (loaded on demand)
- **Total reduction**: **92.4%**

## Implementation Details

### 1. Core Components

#### ChunkErrorBoundary
Located at: `src/components/lazy/ChunkErrorBoundary.tsx`

Handles chunk loading failures gracefully with:
- Automatic error detection for chunk load errors
- User-friendly error messages
- Retry mechanism (up to 3 attempts)
- Fallback to homepage option
- Development mode error details

```tsx
import { ChunkErrorBoundary } from '@/components/lazy/ChunkErrorBoundary';

<ChunkErrorBoundary>
  <App />
</ChunkErrorBoundary>
```

#### LazyLoadingFallback
Located at: `src/components/lazy/LazyLoadingFallback.tsx`

Provides loading skeletons for different content types:
- **Page skeleton**: For regular pages
- **Dashboard skeleton**: For dashboard layouts with stats and charts
- **Modal skeleton**: For modal dialogs

```tsx
import { LazyLoadingFallback } from '@/components/lazy/LazyLoadingFallback';

<Suspense fallback={<LazyLoadingFallback type="dashboard" />}>
  <DashboardComponent />
</Suspense>
```

### 2. Lazy Loading Pattern

All pages (except HomePage) use React.lazy with dynamic imports:

```tsx
// ✅ Correct: Named export with module wrapper
const DashboardPage = lazy(() => 
  import("./pages/Dashboard").then(m => ({ default: m.Dashboard }))
);

// ✅ Correct: Default export (direct)
const SettingsPage = lazy(() => import("./pages/Settings"));

// Always wrap in Suspense
<Suspense fallback={<LazyLoadingFallback type="page" />}>
  <DashboardPage />
</Suspense>
```

### 3. Route-Based Code Splitting

The main routing logic in `AppContent.tsx` uses Suspense boundaries for each route:

```tsx
case "ngo-dashboard":
  return (
    <Suspense fallback={<LazyLoadingFallback type="dashboard" />}>
      <ProtectedRoute allowedRoles={['ngo']} {...handlers}>
        <NGODashboard onNavigateHome={...} />
      </ProtectedRoute>
    </Suspense>
  );
```

### 4. Vendor Code Splitting

Configured in `vite.config.ts` using `manualChunks`:

```typescript
rollupOptions: {
  output: {
    manualChunks: {
      'vendor-react': ['react', 'react-dom'],
      'vendor-radix': ['@radix-ui/...'],
      'vendor-query': ['@tanstack/react-query'],
      'vendor-supabase': ['@supabase/supabase-js'],
      'vendor-charts': ['recharts'],
      'vendor-utils': ['clsx', 'tailwind-merge', ...],
    },
  },
}
```

Benefits:
- Better browser caching (vendor code changes less frequently)
- Parallel chunk loading
- Smaller individual chunk sizes

## Adding New Split Points

### When to Add a New Split Point

Consider code splitting when:
- Component/page is > 50 kB
- Component is only used in specific routes/roles
- Component has heavy dependencies (charts, PDF generation, etc.)
- Component is below the fold or in a modal

### How to Add a New Split Point

1. **Convert component import to lazy**:
   ```tsx
   // Before
   import { HeavyComponent } from './components/HeavyComponent';
   
   // After
   const HeavyComponent = lazy(() => 
     import('./components/HeavyComponent').then(m => ({ default: m.HeavyComponent }))
   );
   ```

2. **Wrap usage in Suspense**:
   ```tsx
   <Suspense fallback={<LazyLoadingFallback type="page" />}>
     <HeavyComponent />
   </Suspense>
   ```

3. **Test the loading behavior**:
   ```bash
   npm run build
   npm run preview
   # Open Network tab and navigate to the route
   # Verify chunk loads on demand
   ```

4. **Add to the appropriate error boundary**:
   ```tsx
   <ChunkErrorBoundary>
     <Suspense fallback={<LazyLoadingFallback />}>
       <HeavyComponent />
     </Suspense>
   </ChunkErrorBoundary>
   ```

### Example: Adding a New Dashboard

```tsx
// 1. Lazy load the dashboard
const NewDashboard = lazy(() => import('./pages/NewDashboard'));

// 2. Add route with Suspense and error boundary
case "new-dashboard":
  return (
    <Suspense fallback={<LazyLoadingFallback type="dashboard" />}>
      <ProtectedRoute allowedRoles={['user']}>
        <NewDashboard />
      </ProtectedRoute>
    </Suspense>
  );
```

## Best Practices

### ✅ DO

- Keep HomePage eager-loaded (first impression matters)
- Use appropriate skeleton types (page, dashboard, modal)
- Group related components in the same chunk
- Test lazy loading in production builds
- Monitor bundle sizes with visualizer
- Add loading skeletons that match the content layout
- Handle errors with ChunkErrorBoundary

### ❌ DON'T

- Lazy load critical above-the-fold content
- Create too many tiny chunks (< 20 kB)
- Lazy load components that are always needed
- Forget Suspense boundaries (will cause crashes)
- Ignore loading states (poor UX)
- Lazy load CSS-in-JS styled components without preloading

## Performance Monitoring

### Bundle Analysis

Generate a bundle visualization:
```bash
npm run build
# Opens dist/stats.html with interactive bundle map
```

### Measuring Impact

1. **Initial Load Time**: Measure FCP, LCP, TTI
2. **Chunk Load Time**: Monitor Network tab for async chunks
3. **Cache Hit Rate**: Verify vendor chunks are cached

### Key Metrics

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Bundle Size**: < 500 kB (gzipped)

## Troubleshooting

### Chunk Load Failures

If users see "Failed to Load Content":
1. Check network connection
2. Clear browser cache
3. Check CDN/hosting configuration
4. Verify chunk files exist in deployment

### Development Issues

**Problem**: "Loading chunk X failed"
**Solution**: Clear `node_modules/.vite` cache and rebuild

**Problem**: Infinite loading spinner
**Solution**: Check Suspense boundaries and error boundaries

**Problem**: Component not splitting
**Solution**: Verify dynamic import syntax and build output

## Testing

Test files:
- `src/tests/integration/lazy-loading.test.tsx`
- `src/components/lazy/__tests__/ChunkErrorBoundary.test.tsx`

Run tests:
```bash
npm run test:run -- lazy-loading
```

## Resources

- [React.lazy documentation](https://react.dev/reference/react/lazy)
- [Code Splitting in Vite](https://vitejs.dev/guide/build.html#chunking-strategy)
- [Web.dev: Reduce JavaScript Payloads](https://web.dev/reduce-javascript-payloads-with-code-splitting/)
- [Bundle Analysis Tool](https://github.com/btd/rollup-plugin-visualizer)

## Maintenance

Review bundle sizes monthly:
```bash
npm run build
# Check dist/stats.html
# Look for unexpectedly large chunks
# Consider further splitting if any chunk > 500 kB
```

Update this documentation when:
- Adding new split points
- Changing chunk configuration
- Modifying loading patterns
- Updating dependencies that affect bundle size
