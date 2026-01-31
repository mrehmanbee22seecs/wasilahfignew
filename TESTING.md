# Test Infrastructure

## Overview

This project uses **Vitest** as the testing framework, providing fast, modern testing with native ESM support and seamless Vite integration.

## 🚀 Quick Start

```bash
# Run all tests in watch mode
npm test

# Run tests once (for CI)
npm run test:run

# Open test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📁 Structure

```
src/
├── test/
│   ├── setup.ts           # Global test configuration
│   └── queryUtils.tsx     # React Query test utilities
├── hooks/queries/
│   └── __tests__/         # Hook tests
│       ├── useProjects.test.ts
│       ├── useProject.test.ts
│       └── useProjectMutations.test.ts
└── [other modules]/
    └── __tests__/         # Tests for other modules
```

## 🛠️ Stack

### Core Testing
- **vitest@^1.6.1** - Test runner with Vite integration
- **@vitest/ui@^1.6.1** - Visual test UI

### React Testing
- **@testing-library/react@^14.3.1** - React component testing
- **@testing-library/jest-dom@^6.9.1** - Custom matchers
- **@testing-library/user-event@^14.6.1** - User interaction simulation

### Environment
- **happy-dom@^12.10.3** - Lightweight DOM implementation

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createQueryWrapper } from '../../../test/queryUtils';

describe('MyHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should do something', async () => {
    // Arrange
    const mockData = { id: '1', name: 'Test' };

    // Act
    const { result } = renderHook(() => useMyHook(), {
      wrapper: createQueryWrapper(),
    });

    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
});
```

### Testing React Query Hooks

Use the `createQueryWrapper` helper from `src/test/queryUtils.tsx`:

```typescript
import { createQueryWrapper } from '../../../test/queryUtils';

const { result } = renderHook(() => useProjects(), {
  wrapper: createQueryWrapper(),
});
```

### Mocking APIs

```typescript
import { vi } from 'vitest';
import { projectsApi } from '../../../lib/api/projects';

// Mock the entire module
vi.mock('../../../lib/api/projects', () => ({
  projectsApi: {
    list: vi.fn(),
    getById: vi.fn(),
  },
}));

// Set up mock responses
vi.mocked(projectsApi.list).mockResolvedValue({
  success: true,
  data: mockData,
});
```

### Async Testing

Always use `waitFor` for async operations:

```typescript
// ✅ Good
await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});

// ❌ Bad - might fail due to timing
expect(result.current.isSuccess).toBe(true);
```

For operations with retries, increase timeout:

```typescript
await waitFor(
  () => {
    expect(result.current.isError).toBe(true);
  },
  { timeout: 3000 } // Allow time for retries
);
```

## 🎯 Test Organization

### File Naming

- Test files: `*.test.ts` or `*.test.tsx`
- Place tests in `__tests__` directory next to the code
- Name pattern: `[module].test.ts`

### Test Structure

```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle success case', () => {});
    it('should handle error case', () => {});
    it('should handle edge case', () => {});
  });
});
```

## 📊 Coverage

Generate coverage report:

```bash
npm run test:coverage
```

Coverage reports are saved in `coverage/` directory:
- `coverage/index.html` - HTML report
- `coverage/lcov.info` - LCOV format for CI tools

### Coverage Thresholds

Currently set to 0% for all metrics (no minimum required). Adjust in `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

## 🔧 Configuration

### vitest.config.ts

```typescript
export default defineConfig({
  test: {
    environment: 'happy-dom',  // DOM environment
    globals: true,             // Global test APIs
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
});
```

### Setup File (src/test/setup.ts)

Runs before each test file:
- Imports `@testing-library/jest-dom` matchers
- Automatic cleanup after each test
- Mocks for window APIs:
  - `window.matchMedia`
  - `window.scrollTo`
  - `IntersectionObserver`
  - `ResizeObserver`
- Console filtering for cleaner output

## 🧪 Testing Patterns

### Query Hooks

```typescript
it('should fetch data', async () => {
  vi.mocked(api.fetch).mockResolvedValue({
    success: true,
    data: mockData,
  });

  const { result } = renderHook(() => useData(), {
    wrapper: createQueryWrapper(),
  });

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockData);
});
```

### Mutation Hooks

```typescript
it('should create item', async () => {
  const mockItem = { id: '1', name: 'New Item' };
  vi.mocked(api.create).mockResolvedValue({
    success: true,
    data: mockItem,
  });

  const { result } = renderHook(() => useCreate(), {
    wrapper: createQueryWrapper(),
  });

  result.current.mutate(input);

  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });

  expect(result.current.data).toEqual(mockItem);
});
```

### Callbacks

```typescript
it('should call onSuccess', async () => {
  const onSuccess = vi.fn();
  
  const { result } = renderHook(() => useCreate({ onSuccess }), {
    wrapper: createQueryWrapper(),
  });

  result.current.mutate(input);

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalledWith(mockData);
  });
});
```

## 🐛 Debugging

### Run Single Test

```bash
npm test -- useProjects.test.ts
```

### Run Single Test Case

```bash
npm test -- -t "should fetch projects"
```

### Open Test UI

```bash
npm run test:ui
```

### Enable Verbose Logging

In your test:

```typescript
console.log(result.current); // Will be visible in test output
```

Or remove console filtering in `src/test/setup.ts`.

## 🎨 Best Practices

### 1. Use AAA Pattern

```typescript
it('should do something', () => {
  // Arrange - Set up test data and mocks
  const mockData = { ... };
  vi.mocked(api.fetch).mockResolvedValue(mockData);

  // Act - Execute the code under test
  const { result } = renderHook(...);

  // Assert - Verify the results
  expect(result.current.data).toEqual(mockData);
});
```

### 2. Clear Mocks Between Tests

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

### 3. Test Both Success and Error Cases

```typescript
describe('useData', () => {
  it('should handle success', () => { ... });
  it('should handle error', () => { ... });
});
```

### 4. Use Descriptive Test Names

```typescript
// ✅ Good
it('should refetch when projectId changes', () => {});

// ❌ Bad
it('should work', () => {});
```

### 5. Avoid Test Interdependence

Each test should be independent and not rely on state from other tests.

## 🔍 Common Issues

### Tests Timeout

Increase timeout in `waitFor`:

```typescript
await waitFor(
  () => { ... },
  { timeout: 5000 }
);
```

### Mock Not Working

Ensure mock is set up before the hook runs:

```typescript
// ✅ Good - Mock before render
vi.mocked(api.fetch).mockResolvedValue(...);
const { result } = renderHook(...);

// ❌ Bad - Mock after render
const { result } = renderHook(...);
vi.mocked(api.fetch).mockResolvedValue(...);
```

### State Not Updating

Use `waitFor` for async state changes:

```typescript
await waitFor(() => {
  expect(result.current.isSuccess).toBe(true);
});
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)

## 🎯 CI Integration

### GitHub Actions

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## 📝 Maintenance

### Adding New Tests

1. Create test file in `__tests__` directory
2. Import necessary utilities from `src/test/`
3. Follow existing test patterns
4. Run tests to verify: `npm test`

### Updating Test Infrastructure

1. Update dependencies: `npm install -D [package]`
2. Update configuration in `vitest.config.ts` if needed
3. Update `src/test/setup.ts` for global changes
4. Document changes in this README

---

**Last Updated**: 2026-01-31  
**Vitest Version**: 1.6.1  
**Status**: ✅ Fully Implemented and Tested
