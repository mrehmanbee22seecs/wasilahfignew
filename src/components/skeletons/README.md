# Skeleton Components Library

A comprehensive collection of skeleton loaders for all major UI patterns in the Wasilah application. All components support dark mode, are fully responsive, and follow accessibility best practices.

## Overview

Skeleton loaders provide visual placeholders while content is loading, improving perceived performance and user experience. They create a smooth transition from loading to loaded state by matching the shape and layout of the actual content.

## Available Components

### Base Components

#### `BaseSkeleton`
Foundation component with shimmer animation. Used as building block for other skeletons.

```tsx
import { BaseSkeleton } from '@/components/skeletons';

<BaseSkeleton width="200px" height="20px" rounded="md" />
<BaseSkeleton width="100%" height="40px" animation="pulse" />
```

**Props:**
- `width?: string` - Width (default: "100%")
- `height?: string` - Height (default: "16px")
- `rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'` - Border radius
- `animation?: 'shimmer' | 'pulse' | 'none'` - Animation type
- `className?: string` - Additional CSS classes

#### `TextSkeleton`
Text line placeholders with varying widths for natural appearance.

```tsx
import { TextSkeleton } from '@/components/skeletons';

<TextSkeleton lines={3} />
<TextSkeleton lines={2} lineHeight={18} lastLineWidth="60%" />
```

**Props:**
- `lines?: number` - Number of text lines (default: 1)
- `lineHeight?: number` - Height per line in pixels (default: 16)
- `lastLineWidth?: string` - Width of last line (default: "75%")

#### `ButtonSkeleton`
Button placeholders.

```tsx
import { ButtonSkeleton } from '@/components/skeletons';

<ButtonSkeleton size="md" />
<ButtonSkeleton size="lg" width="200px" />
```

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `width?: string` - Custom width
- `variant?: 'default' | 'outline' | 'ghost'` - Button variant

### Layout Components

#### `HeaderSkeleton`
Page header placeholders with title and optional actions.

```tsx
import { HeaderSkeleton } from '@/components/skeletons';

<HeaderSkeleton />
<HeaderSkeleton showActions={true} showBreadcrumb={true} />
```

**Props:**
- `showActions?: boolean` - Show action buttons (default: false)
- `showBreadcrumb?: boolean` - Show breadcrumb navigation (default: false)

#### `SidebarSkeleton`
Navigation sidebar placeholders.

```tsx
import { SidebarSkeleton } from '@/components/skeletons';

<SidebarSkeleton />
<SidebarSkeleton menuItems={8} />
```

**Props:**
- `menuItems?: number` - Number of menu items (default: 6)
- `showHeader?: boolean` - Show sidebar header (default: true)

### Content Components

#### `CardSkeleton`
Generic card layout placeholders.

```tsx
import { CardSkeleton } from '@/components/skeletons';

<CardSkeleton />
<CardSkeleton showImage={true} lines={3} imageHeight={200} />
```

**Props:**
- `showImage?: boolean` - Show image placeholder (default: false)
- `imageHeight?: number` - Image height in pixels (default: 160)
- `lines?: number` - Text lines in card (default: 2)

#### `ProjectCardSkeleton`
Specialized skeleton for project cards with image, stats, and tags.

```tsx
import { ProjectCardSkeleton } from '@/components/skeletons';

<ProjectCardSkeleton />
<ProjectCardSkeleton variant="compact" showStats={false} />
```

**Props:**
- `variant?: 'default' | 'compact'` - Card size variant
- `showStats?: boolean` - Show project statistics (default: true)

#### `ListSkeleton`
List view placeholders.

```tsx
import { ListSkeleton } from '@/components/skeletons';

<ListSkeleton items={5} />
<ListSkeleton items={3} showAvatar={true} />
```

**Props:**
- `items?: number` - Number of list items (default: 3)
- `showAvatar?: boolean` - Show avatar in list items (default: false)

#### `ProfileSkeleton`
User/organization profile placeholders.

```tsx
import { ProfileSkeleton } from '@/components/skeletons';

<ProfileSkeleton />
<ProfileSkeleton variant="compact" />
```

**Props:**
- `variant?: 'default' | 'compact'` - Profile layout variant
- `showStats?: boolean` - Show profile statistics (default: true)

### Data Components

#### `TableRowSkeleton`
Table row placeholders for data tables.

```tsx
import { TableRowSkeleton } from '@/components/skeletons';

<TableRowSkeleton columns={5} rows={8} />
<TableRowSkeleton columns={4} showCheckbox={true} showActions={true} />
```

**Props:**
- `columns?: number` - Number of data columns (default: 4)
- `rows?: number` - Number of rows to render (default: 1)
- `showCheckbox?: boolean` - Show checkbox column (default: false)
- `showActions?: boolean` - Show actions column (default: false)

#### `ChartSkeleton`
Chart and graph placeholders.

```tsx
import { ChartSkeleton } from '@/components/skeletons';

<ChartSkeleton type="bar" />
<ChartSkeleton type="line" height={300} showTitle={true} />
```

**Props:**
- `type?: 'bar' | 'line' | 'pie' | 'area'` - Chart type
- `height?: number` - Chart height in pixels (default: 240)
- `showTitle?: boolean` - Show chart title (default: false)
- `showLegend?: boolean` - Show chart legend (default: false)

### Complex Layouts

#### `FormSkeleton`
Form layout placeholders.

```tsx
import { FormSkeleton } from '@/components/skeletons';

<FormSkeleton fields={5} />
<FormSkeleton fields={3} showSubmitButton={true} />
```

**Props:**
- `fields?: number` - Number of form fields (default: 4)
- `showSubmitButton?: boolean` - Show submit button (default: true)

#### `DashboardSkeleton`
Complete dashboard layout placeholder combining multiple skeleton types.

```tsx
import { DashboardSkeleton } from '@/components/skeletons';

<DashboardSkeleton />
<DashboardSkeleton variant="ngo" showSidebar={true} />
<DashboardSkeleton variant="corporate" statCards={4} />
```

**Props:**
- `variant?: 'default' | 'ngo' | 'volunteer' | 'corporate'` - Dashboard type
- `showSidebar?: boolean` - Show sidebar skeleton (default: false)
- `statCards?: number` - Number of stat cards (default: 4)

## Usage Patterns

### Basic Loading State

Replace simple loading indicators with appropriate skeletons:

```tsx
// Before
{loading && <div>Loading...</div>}
{loading && <LoadingSpinner />}

// After
{loading && <CardSkeleton />}
{loading && <ProjectCardSkeleton />}
```

### With React Suspense

Use with Suspense boundaries for automatic loading states:

```tsx
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/skeletons';

<Suspense fallback={<DashboardSkeleton variant="corporate" />}>
  <CorporateDashboard />
</Suspense>
```

### Conditional Rendering

Render skeletons while data is loading:

```tsx
import { ProjectCardSkeleton } from '@/components/skeletons';

function ProjectList({ projects, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### Dashboard Loading States

Use specialized dashboard skeletons for complete layouts:

```tsx
import { DashboardSkeleton } from '@/components/skeletons';

function Dashboard() {
  const { data, loading } = useDashboardData();
  
  if (loading) {
    return <DashboardSkeleton variant="corporate" showSidebar={true} />;
  }
  
  return <DashboardContent data={data} />;
}
```

### Table Loading

Use TableRowSkeleton for data tables:

```tsx
import { TableRowSkeleton } from '@/components/skeletons';

function DataTable({ data, loading }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <TableRowSkeleton columns={4} rows={10} showActions={true} />
        ) : (
          data.map(row => <TableRow key={row.id} data={row} />)
        )}
      </tbody>
    </table>
  );
}
```

## Best Practices

### 1. Match Content Shape
Choose skeletons that match the shape and layout of your actual content for smooth transitions.

```tsx
// Good - matches project card layout
{loading ? <ProjectCardSkeleton /> : <ProjectCard project={project} />}

// Bad - doesn't match
{loading ? <TextSkeleton lines={2} /> : <ProjectCard project={project} />}
```

### 2. Use Appropriate Counts
Render the same number of skeleton items as you expect to show:

```tsx
// If showing 6 projects
{loading && Array.from({ length: 6 }).map((_, i) => (
  <ProjectCardSkeleton key={i} />
))}
```

### 3. Consider Layout
Wrap skeletons in the same layout containers as your content:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {loading ? (
    Array.from({ length: 6 }).map((_, i) => (
      <ProjectCardSkeleton key={i} />
    ))
  ) : (
    projects.map(p => <ProjectCard key={p.id} project={p} />)
  )}
</div>
```

### 4. Combine Skeletons
Build complex layouts by combining multiple skeleton components:

```tsx
<div className="space-y-6">
  <HeaderSkeleton showActions={true} />
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
  <ChartSkeleton type="bar" height={300} showTitle={true} />
</div>
```

### 5. Accessibility
All skeleton components include proper ARIA attributes for screen readers:
- `role="status"` on containers
- `aria-label="Loading..."` for context
- `aria-hidden="true"` on decorative elements

No additional accessibility work is needed when using these components.

## Theme Support

All skeleton components automatically adapt to light/dark themes using Tailwind's dark mode classes. No configuration needed.

## Performance Considerations

- Skeletons are lightweight and render quickly
- Use appropriate counts to avoid rendering too many elements
- For long lists, consider rendering fewer skeleton items than actual items
- Skeletons don't trigger layout shifts when content loads if properly matched

## Migration Guide

### From LoadingSpinner

```tsx
// Before
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

{loading && <LoadingSpinner />}

// After - choose appropriate skeleton
import { DashboardSkeleton } from '@/components/skeletons';

{loading && <DashboardSkeleton variant="corporate" />}
```

### From Custom Loading States

```tsx
// Before
{loading && <div className="animate-pulse">Loading...</div>}

// After
import { CardSkeleton } from '@/components/skeletons';

{loading && <CardSkeleton />}
```

## Testing

All skeleton components are tested for:
- Rendering with default props
- Custom prop handling
- Accessibility attributes
- Dark mode support
- Animation behavior

See `__tests__` directory for test examples.

## Examples

### Dashboard Integration Example

```tsx
import { Suspense } from 'react';
import { DashboardSkeleton, ProjectCardSkeleton } from '@/components/skeletons';

function CorporateDashboard() {
  const { stats, loading: statsLoading } = useStats();
  const { projects, loading: projectsLoading } = useProjects();
  
  return (
    <div className="p-6 space-y-6">
      {/* Stats section */}
      {statsLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <StatsGrid stats={stats} />
      )}
      
      {/* Projects section */}
      {projectsLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <ProjectGrid projects={projects} />
      )}
    </div>
  );
}
```

## Contributing

When creating new skeleton components:

1. Extend from `BaseSkeleton` for consistency
2. Include TypeScript types
3. Support dark mode with Tailwind's `dark:` prefix
4. Add accessibility attributes
5. Write tests
6. Document in this README
7. Export from `index.ts`

## Questions?

For issues or questions about skeleton components, please refer to the component source files which include detailed JSDoc comments.
