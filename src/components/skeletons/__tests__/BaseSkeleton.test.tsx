/**
 * Tests for BaseSkeleton Component
 * 
 * Validates rendering, props, accessibility, and animation behavior
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BaseSkeleton } from '../BaseSkeleton';

describe('BaseSkeleton', () => {
  it('should render with default props', () => {
    const { container } = render(<BaseSkeleton />);
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('role', 'presentation');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('should apply custom width and height', () => {
    const { container } = render(
      <BaseSkeleton width="200px" height="50px" />
    );
    const skeleton = container.firstChild as HTMLElement;
    
    expect(skeleton.style.width).toBe('200px');
    expect(skeleton.style.height).toBe('50px');
  });

  it('should apply different rounded variants', () => {
    const { container: container1 } = render(<BaseSkeleton rounded="none" />);
    expect(container1.firstChild).toHaveClass('rounded-none');

    const { container: container2 } = render(<BaseSkeleton rounded="full" />);
    expect(container2.firstChild).toHaveClass('rounded-full');

    const { container: container3 } = render(<BaseSkeleton rounded="lg" />);
    expect(container3.firstChild).toHaveClass('rounded-lg');
  });

  it('should apply different animation types', () => {
    const { container: container1 } = render(<BaseSkeleton animation="shimmer" />);
    expect(container1.firstChild).toHaveClass('animate-shimmer');

    const { container: container2 } = render(<BaseSkeleton animation="pulse" />);
    expect(container2.firstChild).toHaveClass('animate-pulse');

    const { container: container3 } = render(<BaseSkeleton animation="none" />);
    expect(container3.firstChild).not.toHaveClass('animate-shimmer');
    expect(container3.firstChild).not.toHaveClass('animate-pulse');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <BaseSkeleton className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should have proper accessibility attributes', () => {
    const { container } = render(<BaseSkeleton />);
    const skeleton = container.firstChild as HTMLElement;
    
    // Should be hidden from screen readers
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    
    // Should have presentation role
    expect(skeleton).toHaveAttribute('role', 'presentation');
  });

  it('should apply gradient background classes', () => {
    const { container } = render(<BaseSkeleton />);
    const skeleton = container.firstChild as HTMLElement;
    
    // Should have gradient classes for light mode
    expect(skeleton).toHaveClass('bg-gradient-to-r');
    expect(skeleton).toHaveClass('from-gray-200');
  });

  it('should support dark mode classes', () => {
    const { container } = render(<BaseSkeleton />);
    const skeleton = container.firstChild as HTMLElement;
    
    // Check for dark mode classes
    const classNames = skeleton.className;
    expect(classNames).toContain('dark:from-gray-700');
    expect(classNames).toContain('dark:via-gray-600');
    expect(classNames).toContain('dark:to-gray-700');
  });
});
