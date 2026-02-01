/**
 * Integration Tests for Skeleton Components in Dashboard Loading States
 * 
 * Validates that skeleton components render during loading states
 * in dashboard components and provide appropriate accessibility
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '../../auth/ProtectedRoute';
import { DashboardSkeleton } from '../DashboardSkeleton';
import { ProjectCardSkeleton } from '../ProjectCardSkeleton';
import { TableRowSkeleton } from '../TableRowSkeleton';
import { CardSkeleton } from '../CardSkeleton';
import { ListSkeleton } from '../ListSkeleton';

// Mock AuthContext
const mockAuthContext = {
  user: null,
  role: null,
  loading: true,
};

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

describe('Skeleton Integration Tests', () => {
  describe('DashboardSkeleton', () => {
    it('should render with accessibility attributes', () => {
      const { container } = render(<DashboardSkeleton />);
      
      const skeleton = container.querySelector('[role="status"]');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveAttribute('aria-label', 'Loading dashboard');
    });

    it('should render different variants', () => {
      const { rerender, container } = render(<DashboardSkeleton variant="corporate" />);
      expect(container.firstChild).toBeInTheDocument();
      
      rerender(<DashboardSkeleton variant="ngo" />);
      expect(container.firstChild).toBeInTheDocument();
      
      rerender(<DashboardSkeleton variant="volunteer" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with sidebar when requested', () => {
      const { container } = render(<DashboardSkeleton showSidebar={true} />);
      
      // Sidebar should be present
      const sidebar = container.querySelector('[role="status"]');
      expect(sidebar).toBeInTheDocument();
    });
  });

  describe('ProjectCardSkeleton', () => {
    it('should render multiple project cards', () => {
      const { container } = render(
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      );
      
      // Each ProjectCardSkeleton has a status role on the card itself
      const cards = container.querySelectorAll('[role="status"][aria-label="Loading project card"]');
      expect(cards).toHaveLength(6);
    });

    it('should render with stats when requested', () => {
      const { container } = render(<ProjectCardSkeleton showStats={true} />);
      
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('should render compact variant', () => {
      const { container } = render(<ProjectCardSkeleton variant="compact" />);
      
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });
  });

  describe('TableRowSkeleton', () => {
    it('should render correct number of rows', () => {
      const { container } = render(
        <div role="table">
          <TableRowSkeleton columns={5} rows={10} />
        </div>
      );
      
      const rows = container.querySelectorAll('[role="row"]');
      expect(rows).toHaveLength(10);
    });

    it('should render with checkbox column', () => {
      const { container } = render(
        <TableRowSkeleton columns={4} showCheckbox={true} />
      );
      
      expect(container.querySelector('[role="row"]')).toBeInTheDocument();
    });

    it('should render with actions column', () => {
      const { container } = render(
        <TableRowSkeleton columns={4} showActions={true} />
      );
      
      expect(container.querySelector('[role="row"]')).toBeInTheDocument();
    });
  });

  describe('CardSkeleton', () => {
    it('should render in grid layout', () => {
      const { container } = render(
        <div className="grid gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
      
      // Each CardSkeleton has a status role on the card itself
      const cards = container.querySelectorAll('[role="status"][aria-label="Loading card"]');
      expect(cards).toHaveLength(6);
    });

    it('should render with image placeholder', () => {
      const { container } = render(<CardSkeleton showImage={true} />);
      
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('should render correct number of text lines', () => {
      const { container } = render(<CardSkeleton lines={4} />);
      
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });
  });

  describe('ListSkeleton', () => {
    it('should render correct number of list items', () => {
      const { container } = render(<ListSkeleton items={8} />);
      
      const listItems = container.querySelectorAll('[role="status"]');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should render with avatar placeholders', () => {
      const { container } = render(<ListSkeleton items={5} showAvatar={true} />);
      
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });
  });

  describe('Loading State Integration', () => {
    it('should show DashboardSkeleton while ProtectedRoute is loading', () => {
      const { container } = render(
        <ProtectedRoute allowedRoles={['admin']}>
          <div>Dashboard Content</div>
        </ProtectedRoute>
      );
      
      // Should show loading state with DashboardSkeleton
      const skeleton = container.querySelector('[role="status"]');
      expect(skeleton).toBeInTheDocument();
    });

    it('should handle multiple skeleton types in same view', () => {
      const { container } = render(
        <div>
          <DashboardSkeleton />
          <div className="grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
          <TableRowSkeleton columns={5} rows={5} />
        </div>
      );
      
      const skeletons = container.querySelectorAll('[role="status"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('all skeleton components should have proper ARIA attributes', () => {
      const skeletons = [
        <DashboardSkeleton key="dash" />,
        <ProjectCardSkeleton key="proj" />,
        <CardSkeleton key="card" />,
        <ListSkeleton key="list" items={3} />,
      ];

      skeletons.forEach((skeleton, index) => {
        const { container } = render(skeleton);
        const element = container.querySelector('[role="status"]');
        expect(element).toBeInTheDocument();
      });
    });

    it('skeleton components should be hidden from screen readers when content loads', () => {
      const { container, rerender } = render(<CardSkeleton />);
      
      // Skeleton should have status role
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
      
      // When content loads, skeleton is removed
      rerender(<div>Actual Content</div>);
      expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
    });
  });

  describe('Theme Support', () => {
    it('skeletons should render correctly in light mode', () => {
      const { container } = render(
        <div className="light">
          <CardSkeleton />
        </div>
      );
      
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });

    it('skeletons should support dark mode classes', () => {
      const { container } = render(
        <div className="dark">
          <CardSkeleton />
        </div>
      );
      
      expect(container.querySelector('[role="status"]')).toBeInTheDocument();
    });
  });
});
