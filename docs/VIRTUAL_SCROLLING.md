# Virtual Scrolling Implementation Guide

## Overview

This application uses **react-window** v2.2.6 for efficient virtual scrolling to handle large datasets (10,000+ items) with smooth performance. Virtual scrolling only renders the visible items in the viewport, dramatically reducing DOM nodes and improving performance.

## Components

### VirtualList

Renders large lists efficiently with fixed or dynamic item heights.

**Location:** `src/components/virtual/VirtualList.tsx`

**Props:**
- `items`: Array of data items to render
- `height`: Height of the scrollable container (in pixels)
- `itemHeight`: Height of each item (number or function)
- `renderItem`: Function to render each item `(item, index, style) => ReactNode`
- `width`: Width of container (default: '100%')
- `className`: Additional CSS classes
- `overscanCount`: Number of items to render outside viewport (default: 5)

**Example:**
```tsx
import { VirtualList } from '@/components/virtual';

function AuditLogList({ logs }) {
  return (
    <VirtualList
      items={logs}
      height={600}
      itemHeight={120}
      renderItem={(log, index, style) => (
        <div key={log.id} style={style}>
          <AuditLogEntry entry={log} />
        </div>
      )}
    />
  );
}
```

### VirtualGrid

Renders large grids with responsive column counts.

**Location:** `src/components/virtual/VirtualGrid.tsx`

**Props:**
- `items`: Array of data items to render
- `height`: Height of the grid container
- `width`: Width of the grid container
- `columnCount`: Number of columns
- `rowHeight`: Height of each row
- `columnWidth`: Width of each column
- `renderItem`: Function to render each cell
- `overscanRowCount`: Rows to render outside viewport (default: 2)

**Example:**
```tsx
import { VirtualGrid } from '@/components/virtual';

function VolunteerGrid({ volunteers }) {
  const [columnCount, setColumnCount] = useState(3);

  return (
    <VirtualGrid
      items={volunteers}
      height={800}
      width="100%"
      columnCount={columnCount}
      rowHeight={420}
      columnWidth={400}
      renderItem={(volunteer, index, style) => (
        <div key={volunteer.id} style={style}>
          <VolunteerCard volunteer={volunteer} />
        </div>
      )}
    />
  );
}
```

### VirtualTable

Renders large tables with fixed headers.

**Location:** `src/components/virtual/VirtualTable.tsx`

**Props:**
- `items`: Array of data items
- `height`: Height of scrollable body
- `itemHeight`: Height of each row
- `renderHeader`: Function to render table header
- `renderRow`: Function to render each row
- `emptyState`: Optional empty state component

**Example:**
```tsx
import { VirtualTable } from '@/components/virtual';

function UserTable({ users }) {
  return (
    <VirtualTable
      items={users}
      height={600}
      itemHeight={72}
      renderHeader={() => (
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
      )}
      renderRow={(user, index, style) => (
        <tr key={user.id} style={style}>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
        </tr>
      )}
    />
  );
}
```

## Implementation Examples

### Current Implementations

1. **AuditLogPage** - Virtual list for audit log entries
   - File: `src/pages/AuditLogPage.tsx`
   - Handles: 10,000+ audit log entries
   - Item height: 120px

2. **VolunteerDirectoryPage** - Virtual grid for volunteer cards
   - File: `src/pages/VolunteerDirectoryPage.tsx`
   - Component: `src/components/volunteer-directory/VolunteerGridVirtualized.tsx`
   - Handles: 10,000+ volunteer profiles
   - Responsive columns: 1 (mobile), 2 (tablet), 3 (desktop)
   - Item height: 420px

## Adding Virtual Scrolling to New Components

### Step 1: Identify the List

Find components that render arrays using `.map()`:

```tsx
// Before - renders all items
<div>
  {items.map((item) => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

### Step 2: Choose the Right Component

- **VirtualList**: For simple vertical lists
- **VirtualGrid**: For responsive grid layouts
- **VirtualTable**: For table structures

### Step 3: Replace with Virtual Component

```tsx
// After - renders only visible items
import { VirtualList } from '@/components/virtual';

<VirtualList
  items={items}
  height={600}
  itemHeight={100}
  renderItem={(item, index, style) => (
    <div key={item.id} style={style}>
      <ItemCard item={item} />
    </div>
  )}
/>
```

### Step 4: Adjust Styling

**Important:** Apply the `style` prop to maintain positioning:

```tsx
renderItem={(item, index, style) => (
  <div style={style}>  {/* Always apply style */}
    <YourComponent item={item} />
  </div>
)}
```

## Performance Considerations

### Item Heights

**Fixed Heights (Recommended):**
```tsx
itemHeight={120}  // Fixed 120px per item
```

**Dynamic Heights (Advanced):**
```tsx
itemHeight={(index) => {
  // Calculate height based on content
  return items[index].hasImage ? 200 : 100;
}}
```

Fixed heights provide better performance.

### Overscan Count

Controls how many items to render outside the viewport:

```tsx
overscanCount={5}  // Render 5 extra items above/below
```

- Lower values: Less memory, more blank space during fast scrolling
- Higher values: Smoother scrolling, more memory usage
- Default: 5 (good balance)

### Container Dimensions

Always provide explicit height:

```tsx
// Good
<VirtualList height={600} ... />

// Bad - height: auto doesn't work
<VirtualList height="auto" ... />
```

## Responsive Design

### For Grids

Update column count based on viewport:

```tsx
const [columnCount, setColumnCount] = useState(3);

useEffect(() => {
  const updateColumns = () => {
    if (width >= 1280) setColumnCount(3);
    else if (width >= 768) setColumnCount(2);
    else setColumnCount(1);
  };
  
  updateColumns();
  window.addEventListener('resize', updateColumns);
  return () => window.removeEventListener('resize', updateColumns);
}, []);
```

## Accessibility

### Keyboard Navigation

Ensure items are focusable:

```tsx
renderItem={(item, index, style) => (
  <button
    style={style}
    onClick={() => handleClick(item)}
    aria-label={item.label}
  >
    {item.content}
  </button>
)}
```

### Screen Readers

Add ARIA attributes:

```tsx
<div role="list" aria-label="Volunteer list">
  <VirtualList ... />
</div>

// In renderItem:
<div
  style={style}
  role="listitem"
  aria-label={item.name}
>
  {item.content}
</div>
```

### Focus Management

Handle focus when filtering:

```tsx
const [items, setItems] = useState(allItems);

// When filtering changes
useEffect(() => {
  // Reset scroll to top
  listRef.current?.scrollTo(0);
}, [items]);
```

## Filtering and Search

Virtual scrolling works seamlessly with filtering:

```tsx
const filteredItems = items.filter(item => 
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);

<VirtualList
  items={filteredItems}  // Pass filtered array
  height={600}
  itemHeight={80}
  renderItem={...}
/>
```

## Testing

### Performance Testing

Run tests with large datasets:

```bash
npm run test -- VirtualScrolling.performance.test.tsx
```

Tests verify:
- Handles 10,000+ items
- Renders only visible items
- Updates efficiently
- Low memory footprint

### Accessibility Testing

Run accessibility tests:

```bash
npm run test -- VirtualScrolling.accessibility.test.tsx
```

Tests verify:
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes

## Troubleshooting

### Items Not Appearing

**Problem:** Items render but don't appear on screen

**Solution:** Ensure `style` prop is applied:
```tsx
// Correct
<div style={style}>...</div>

// Wrong
<div>...</div>
```

### Jumping During Scroll

**Problem:** List jumps or flickers when scrolling

**Solution:** Use fixed item heights instead of dynamic:
```tsx
// Use this
itemHeight={120}

// Not this
itemHeight={(index) => calculateHeight(index)}
```

### Empty Space on Screen

**Problem:** White space appears during scrolling

**Solution:** Increase overscan count:
```tsx
overscanCount={10}  // Increase from default 5
```

### Performance Issues

**Problem:** Still slow with virtual scrolling

**Causes:**
1. Complex item rendering
2. Too many re-renders
3. Large component tree in each item

**Solutions:**
1. Memoize item components:
```tsx
const MemoizedItem = React.memo(({ item }) => (
  <ItemCard item={item} />
));
```

2. Use React.memo for expensive renders:
```tsx
renderItem={(item, index, style) => (
  <div style={style}>
    <MemoizedItem item={item} />
  </div>
)}
```

## Migration Checklist

When converting existing lists to virtual scrolling:

- [ ] Identify all `.map()` rendering large arrays (100+ items)
- [ ] Measure current item heights
- [ ] Choose appropriate virtual component (List/Grid/Table)
- [ ] Replace rendering logic
- [ ] Apply `style` prop to items
- [ ] Test with large datasets (1000+ items)
- [ ] Verify keyboard navigation works
- [ ] Test screen reader compatibility
- [ ] Verify search/filtering still works
- [ ] Check responsive behavior
- [ ] Run performance tests
- [ ] Document any custom configurations

## Best Practices

1. **Always use fixed heights** when possible
2. **Apply style prop** to maintain positioning
3. **Memoize expensive items** with React.memo
4. **Test with realistic data** (10,000+ items)
5. **Maintain accessibility** (ARIA, keyboard nav)
6. **Handle empty states** gracefully
7. **Provide loading indicators** during data fetch
8. **Keep item complexity low** for best performance
9. **Use overscan wisely** (5-10 items)
10. **Monitor performance** with React DevTools Profiler

## Resources

- [react-window Documentation](https://react-window.vercel.app/)
- [Virtual Scrolling Performance Tests](src/components/virtual/__tests__/VirtualScrolling.performance.test.tsx)
- [Virtual Scrolling Accessibility Tests](src/components/virtual/__tests__/VirtualScrolling.accessibility.test.tsx)

## Support

For questions or issues:
1. Check this documentation
2. Review existing implementations (AuditLogPage, VolunteerDirectoryPage)
3. Run tests to verify behavior
4. Consult react-window documentation

## Future Enhancements

Potential improvements:
- [ ] Infinite scroll with data loading
- [ ] Sticky headers for VirtualTable
- [ ] Variable height caching
- [ ] Horizontal virtual scrolling
- [ ] Nested virtual lists
- [ ] Custom scroll indicators
- [ ] Touch gesture support
