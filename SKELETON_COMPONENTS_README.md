# Skeleton Components Library

A comprehensive, production-ready collection of skeleton loaders for all major UI patterns in the Wasilah application.

## 📦 Installation

The components are already installed in the project. Import them from:

```typescript
import { BaseSkeleton, CardSkeleton, DashboardSkeleton } from '@/components/skeletons';
```

## 🎨 Components Overview

### BaseSkeleton
Foundation component with shimmer animation. Use for custom layouts.

```tsx
import { BaseSkeleton } from '@/components/skeletons';

<BaseSkeleton width="200px" height="20px" rounded="md" />
<BaseSkeleton animation="pulse" className="w-full h-40" />
```

**Props:**
- `width?: string` - CSS width value
- `height?: string` - CSS height value
- `rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'` - Border radius
- `animation?: 'shimmer' | 'pulse' | 'none'` - Animation type
- `className?: string` - Additional CSS classes

### TextSkeleton
Text lines with natural width variation. Perfect for paragraphs and descriptions.

```tsx
import { TextSkeleton } from '@/components/skeletons';

<TextSkeleton lines={3} />
<TextSkeleton lines={1} width="50%" />
```

**Props:**
- `lines?: number` - Number of lines (default: 3)
- `width?: string` - Width for single line
- `lineHeight?: number` - Line height in pixels (default: 16)
- `spacing?: number` - Gap between lines (default: 8)

### ButtonSkeleton
Button placeholders with size variants.

```tsx
import { ButtonSkeleton } from '@/components/skeletons';

<ButtonSkeleton size="md" />
<ButtonSkeleton size="lg" fullWidth />
```

**Props:**
- `size?: 'sm' | 'md' | 'lg'` - Button size (default: 'md')
- `width?: string` - Custom width
- `fullWidth?: boolean` - Full width button

### CardSkeleton
Generic card layouts with image, content, and footer.

```tsx
import { CardSkeleton } from '@/components/skeletons';

<CardSkeleton showImage={true} lines={3} />
<CardSkeleton showImage={true} showFooter={true} imageHeight={250} />
```

**Props:**
- `showImage?: boolean` - Show image placeholder (default: true)
- `lines?: number` - Number of content lines (default: 3)
- `showFooter?: boolean` - Show footer with buttons
- `imageHeight?: number` - Image height in px (default: 200)

### ListSkeleton
List views with simple, detailed, or avatar variants.

```tsx
import { ListSkeleton } from '@/components/skeletons';

<ListSkeleton variant="simple" items={5} />
<ListSkeleton variant="avatar" items={3} showDivider />
<ListSkeleton variant="detailed" items={4} showDivider />
```

**Props:**
- `items?: number` - Number of items (default: 5)
- `variant?: 'simple' | 'detailed' | 'avatar'` - List style
- `showDivider?: boolean` - Show dividers between items

### ProfileSkeleton
User or organization profile pages with avatar, stats, and content.

```tsx
import { ProfileSkeleton } from '@/components/skeletons';

<ProfileSkeleton showStats={true} />
<ProfileSkeleton variant="organization" showStats={true} />
```

**Props:**
- `showStats?: boolean` - Show stats section (default: true)
- `variant?: 'user' | 'organization'` - Profile type

### FormSkeleton
Form layouts with various field types.

```tsx
import { FormSkeleton } from '@/components/skeletons';

<FormSkeleton fields={4} />
<FormSkeleton fields={6} columns={2} />
```

**Props:**
- `fields?: number` - Number of fields (default: 4)
- `columns?: 1 | 2` - Layout columns (default: 1)
- `showSubmit?: boolean` - Show submit button (default: true)

### TableRowSkeleton
Table rows with configurable columns.

```tsx
import { TableRowSkeleton } from '@/components/skeletons';

<TableRowSkeleton columns={5} rows={8} />
<TableRowSkeleton columns={4} showCheckbox showActions />
```

**Props:**
- `columns?: number` - Number of data columns (default: 4)
- `showCheckbox?: boolean` - Show checkbox column
- `showActions?: boolean` - Show actions column
- `rows?: number` - Number of rows (default: 1)

### ProjectCardSkeleton
Specialized cards for project listings with image, tags, stats.

```tsx
import { ProjectCardSkeleton } from '@/components/skeletons';

<ProjectCardSkeleton showStats={true} />
<ProjectCardSkeleton variant="compact" />
```

**Props:**
- `variant?: 'default' | 'compact'` - Card size
- `showStats?: boolean` - Show project stats (default: true)

### HeaderSkeleton
Page headers with title, subtitle, breadcrumb, and actions.

```tsx
import { HeaderSkeleton } from '@/components/skeletons';

<HeaderSkeleton showActions={true} />
<HeaderSkeleton showBreadcrumb={true} showActions={true} />
```

**Props:**
- `showActions?: boolean` - Show action buttons
- `showBreadcrumb?: boolean` - Show breadcrumb navigation

### SidebarSkeleton
Navigation sidebars with menu sections and items.

```tsx
import { SidebarSkeleton } from '@/components/skeletons';

<SidebarSkeleton sections={2} itemsPerSection={6} />
<SidebarSkeleton compact={true} showProfile={true} />
```

**Props:**
- `sections?: number` - Number of menu sections (default: 2)
- `itemsPerSection?: number` - Items per section (default: 6)
- `compact?: boolean` - Narrow sidebar mode
- `showProfile?: boolean` - Show user profile (default: true)

### ChartSkeleton
Chart placeholders for bar, line, pie, area, and donut charts.

```tsx
import { ChartSkeleton } from '@/components/skeletons';

<ChartSkeleton type="bar" height={300} />
<ChartSkeleton type="pie" showLegend={true} />
```

**Props:**
- `type?: 'bar' | 'line' | 'pie' | 'area' | 'donut'` - Chart type
- `height?: number` - Chart height in px (default: 300)
- `showLegend?: boolean` - Show legend (default: true)
- `showTitle?: boolean` - Show title area (default: true)

### DashboardSkeleton
Complete dashboard layouts with stats cards, charts, and data sections.

```tsx
import { DashboardSkeleton } from '@/components/skeletons';

<DashboardSkeleton variant="ngo" />
<DashboardSkeleton variant="corporate" showSidebar={true} />
```

**Props:**
- `variant?: 'default' | 'ngo' | 'volunteer' | 'corporate'` - Dashboard type
- `showSidebar?: boolean` - Show sidebar (default: false)
- `statCards?: number` - Number of stat cards (default: 4)

## 🎯 Usage Examples

### Loading a Project List
```tsx
function ProjectsList() {
  const { data, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} showStats={true} />
        ))}
      </div>
    );
  }

  return <div>{/* Render projects */}</div>;
}
```

### Loading a Profile Page
```tsx
function ProfilePage() {
  const { data, isLoading } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton showStats={true} />;
  }

  return <div>{/* Render profile */}</div>;
}
```

### Loading a Dashboard
```tsx
function NGODashboard() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeleton variant="ngo" showSidebar={true} />;
  }

  return <div>{/* Render dashboard */}</div>;
}
```

### Loading a Data Table
```tsx
function DataTable() {
  const { data, isLoading } = useTableData();

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <TableRowSkeleton 
          columns={5} 
          rows={10} 
          showCheckbox 
          showActions 
        />
      </div>
    );
  }

  return <table>{/* Render table */}</table>;
}
```

### Composing Custom Skeletons
```tsx
function CustomLoadingState() {
  return (
    <div className="space-y-4">
      <HeaderSkeleton showActions={true} />
      
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border rounded-lg">
            <BaseSkeleton width="60px" height="24px" className="mb-2" />
            <BaseSkeleton width="80px" height="14px" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ChartSkeleton type="bar" />
        <ChartSkeleton type="line" />
      </div>
    </div>
  );
}
```

## 🎨 Animation Options

All skeletons support three animation modes:

```tsx
// Shimmer (default) - smooth left-to-right shine
<BaseSkeleton animation="shimmer" />

// Pulse - gentle opacity fade
<BaseSkeleton animation="pulse" />

// None - static (no animation)
<BaseSkeleton animation="none" />
```

The animation is controlled at the BaseSkeleton level, so you can customize it for complex components.

## 🌙 Dark Mode Support

All components automatically adapt to dark mode using Tailwind's `dark:` prefix:

```css
/* Light mode: gray-200 to gray-300 */
/* Dark mode: gray-700 to gray-600 */
```

No additional configuration needed - dark mode works out of the box.

## ♿ Accessibility

All skeleton components include proper accessibility attributes:

- `role="status"` - Indicates loading state
- `aria-label` - Descriptive labels for screen readers
- `aria-hidden="true"` - Decorative elements hidden from assistive tech
- Respects `prefers-reduced-motion` - Animations disabled when requested

## 📱 Responsive Design

All components are mobile-first and responsive:

```tsx
// Auto-responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <CardSkeleton />
  <CardSkeleton />
  <CardSkeleton />
</div>
```

Components use Tailwind breakpoints and adapt to container sizes automatically.

## 🧪 Testing

Each component includes comprehensive tests. Run tests with:

```bash
npm test src/components/skeletons/__tests__/
```

## 🎮 Interactive Demo

View all components in action at the demo page:
1. Use the PageSwitcher (floating button bottom-right)
2. Select "Skeletons Demo"
3. Browse all 13 components with live previews
4. Adjust animation settings
5. Copy code examples

## 💡 Best Practices

1. **Match Layouts**: Skeleton should match final content layout
2. **Use Composition**: Combine simple skeletons for complex layouts
3. **Consistent Timing**: Keep loading states consistent across app
4. **Avoid Over-Skeletonizing**: Don't show skeletons for very fast loads (<200ms)
5. **Test Loading States**: Always test with network throttling
6. **Accessibility First**: Ensure screen reader experience is good

## 🔧 Customization

All components accept `className` prop for additional styling:

```tsx
<CardSkeleton 
  className="shadow-xl border-2" 
  showImage={true} 
/>
```

## 📚 TypeScript Support

Full TypeScript support with exported interfaces:

```typescript
import type { 
  BaseSkeletonProps,
  CardSkeletonProps,
  DashboardSkeletonProps 
} from '@/components/skeletons';
```

## 🤝 Contributing

When adding new skeleton components:

1. Extend from BaseSkeleton when possible
2. Add JSDoc documentation
3. Include usage examples
4. Write comprehensive tests
5. Ensure accessibility
6. Support dark mode
7. Make it responsive

## 📝 License

Part of the Wasilah application. Same license applies.
