/**
 * Tests for Lazy Loading Functionality
 * 
 * Validates that code splitting and lazy loading work correctly
 * for split routes and components.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Suspense, lazy } from 'react';
import { LazyLoadingFallback } from '@/components/lazy/LazyLoadingFallback';

describe('Lazy Loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('LazyLoadingFallback', () => {
    it('should render page skeleton by default', () => {
      render(<LazyLoadingFallback />);
      
      // Check for loading message in accessibility text
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('should render dashboard skeleton when type is dashboard', () => {
      const { container } = render(<LazyLoadingFallback type="dashboard" />);
      
      // Dashboard skeleton has specific layout with stats grid
      const statsGrid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
      expect(statsGrid).toBeInTheDocument();
    });

    it('should render modal skeleton when type is modal', () => {
      const { container } = render(<LazyLoadingFallback type="modal" />);
      
      // Modal skeleton is smaller and has button placeholders
      expect(container.querySelector('.p-6')).toBeInTheDocument();
    });

    it('should display custom message when provided', () => {
      render(<LazyLoadingFallback message="Loading dashboard..." />);
      
      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<LazyLoadingFallback />);
      
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveClass('sr-only'); // Screen reader only
    });
  });

  describe('Lazy Component Loading', () => {
    it('should show loading fallback while lazy component loads', async () => {
      // Create a mock lazy component with delay
      const MockComponent = () => <div>Lazy Component Loaded</div>;
      
      const LazyMockComponent = lazy(() => 
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => {
            resolve({ default: MockComponent });
          }, 100);
        })
      );

      render(
        <Suspense fallback={<LazyLoadingFallback />}>
          <LazyMockComponent />
        </Suspense>
      );

      // Initially should show loading state
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Lazy Component Loaded')).toBeInTheDocument();
      });

      // Loading state should be gone
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should handle multiple concurrent lazy loads', async () => {
      const Component1 = () => <div>Component 1</div>;
      const Component2 = () => <div>Component 2</div>;

      const LazyComponent1 = lazy(() => 
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => resolve({ default: Component1 }), 50);
        })
      );

      const LazyComponent2 = lazy(() => 
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => resolve({ default: Component2 }), 100);
        })
      );

      render(
        <div>
          <Suspense fallback={<div>Loading 1...</div>}>
            <LazyComponent1 />
          </Suspense>
          <Suspense fallback={<div>Loading 2...</div>}>
            <LazyComponent2 />
          </Suspense>
        </div>
      );

      // Both should initially show loading
      expect(screen.getByText('Loading 1...')).toBeInTheDocument();
      expect(screen.getByText('Loading 2...')).toBeInTheDocument();

      // Wait for both to load
      await waitFor(() => {
        expect(screen.getByText('Component 1')).toBeInTheDocument();
        expect(screen.getByText('Component 2')).toBeInTheDocument();
      });
    });

    it('should only load component when rendered, not before', async () => {
      let loadCallCount = 0;

      const MockComponent = () => <div>Component</div>;
      
      const LazyMockComponent = lazy(() => {
        loadCallCount++;
        return Promise.resolve({ default: MockComponent });
      });

      // Create but don't render yet
      const ComponentWrapper = ({ shouldRender }: { shouldRender: boolean }) => (
        shouldRender ? (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyMockComponent />
          </Suspense>
        ) : (
          <div>Not rendered</div>
        )
      );

      const { rerender } = render(<ComponentWrapper shouldRender={false} />);

      // Component should not have loaded yet
      expect(loadCallCount).toBe(0);
      expect(screen.getByText('Not rendered')).toBeInTheDocument();

      // Now render the lazy component
      rerender(<ComponentWrapper shouldRender={true} />);

      // Component should now load
      await waitFor(() => {
        expect(screen.getByText('Component')).toBeInTheDocument();
      });

      expect(loadCallCount).toBe(1);
    });
  });

  describe('Suspense Boundaries', () => {
    it('should isolate loading states with separate Suspense boundaries', async () => {
      const FastComponent = () => <div>Fast Component</div>;
      const SlowComponent = () => <div>Slow Component</div>;

      const LazyFastComponent = lazy(() => 
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => resolve({ default: FastComponent }), 10);
        })
      );

      const LazySlowComponent = lazy(() => 
        new Promise<{ default: React.ComponentType }>((resolve) => {
          setTimeout(() => resolve({ default: SlowComponent }), 200);
        })
      );

      render(
        <div>
          {/* Separate Suspense boundaries */}
          <Suspense fallback={<div>Loading Fast...</div>}>
            <LazyFastComponent />
          </Suspense>
          <Suspense fallback={<div>Loading Slow...</div>}>
            <LazySlowComponent />
          </Suspense>
        </div>
      );

      // Both loading initially
      expect(screen.getByText('Loading Fast...')).toBeInTheDocument();
      expect(screen.getByText('Loading Slow...')).toBeInTheDocument();

      // Fast component loads first
      await waitFor(() => {
        expect(screen.getByText('Fast Component')).toBeInTheDocument();
      });

      // Slow component still loading
      expect(screen.getByText('Loading Slow...')).toBeInTheDocument();

      // Eventually slow component loads
      await waitFor(() => {
        expect(screen.getByText('Slow Component')).toBeInTheDocument();
      }, { timeout: 300 });
    });
  });
});
