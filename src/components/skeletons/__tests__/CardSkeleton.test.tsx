/**
 * Tests for CardSkeleton Component
 * 
 * Validates rendering, props, composition, and accessibility
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CardSkeleton } from '../CardSkeleton';

describe('CardSkeleton', () => {
  it('should render with default props', () => {
    const { container } = render(<CardSkeleton />);
    
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('bg-card');
    expect(container.firstChild).toHaveClass('border');
    expect(container.firstChild).toHaveClass('rounded-lg');
  });

  it('should render with image when showImage is true', () => {
    render(<CardSkeleton showImage={true} />);
    
    // Image skeleton should be present (it's the first BaseSkeleton)
    const card = screen.getByRole('status', { name: 'Loading card' });
    expect(card).toBeInTheDocument();
    expect(card.querySelector('div[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('should not render image when showImage is false', () => {
    const { container } = render(<CardSkeleton showImage={false} />);
    const card = container.firstChild as HTMLElement;
    
    // Should have content but no rounded-t-lg class (which is only on image)
    const imageElement = card.querySelector('.rounded-t-lg');
    expect(imageElement).toBeNull();
  });

  it('should render correct number of text lines', () => {
    const { container } = render(<CardSkeleton lines={5} />);
    
    // Should have 5 lines in TextSkeleton component
    // Plus 1 for title skeleton
    const skeletons = container.querySelectorAll('div[aria-hidden="true"]');
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it('should render footer when showFooter is true', () => {
    const { container } = render(<CardSkeleton showFooter={true} />);
    
    // Footer should contain button skeletons
    const footerButtons = container.querySelectorAll('.pb-4');
    expect(footerButtons.length).toBeGreaterThan(0);
  });

  it('should not render footer when showFooter is false', () => {
    const { container } = render(<CardSkeleton showFooter={false} />);
    
    // Check that pb-4 class (footer padding) is not in the structure
    const elements = container.querySelectorAll('.pb-4');
    // Should only have content padding (p-4), not footer padding (pb-4)
    expect(elements.length).toBe(0);
  });

  it('should apply custom imageHeight', () => {
    const customHeight = 300;
    const { container } = render(
      <CardSkeleton showImage={true} imageHeight={customHeight} />
    );
    
    // Find the image skeleton with the custom height
    const imageSkeleton = container.querySelector('div[aria-hidden="true"]') as HTMLElement;
    expect(imageSkeleton?.style.height).toBe(`${customHeight}px`);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <CardSkeleton className="custom-card" />
    );
    
    expect(container.firstChild).toHaveClass('custom-card');
  });

  it('should have proper accessibility attributes', () => {
    render(<CardSkeleton />);
    
    const card = screen.getByRole('status', { name: 'Loading card' });
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('aria-label', 'Loading card');
  });

  it('should compose child components correctly', () => {
    const { container } = render(
      <CardSkeleton showImage={true} lines={3} showFooter={true} />
    );
    
    // Should have:
    // - Image skeleton
    // - Title skeleton
    // - Text skeletons (lines)
    // - Button skeletons in footer
    const allSkeletons = container.querySelectorAll('div[aria-hidden="true"]');
    expect(allSkeletons.length).toBeGreaterThan(5);
  });

  it('should maintain card structure with border and rounded corners', () => {
    const { container } = render(<CardSkeleton />);
    const card = container.firstChild as HTMLElement;
    
    expect(card).toHaveClass('border-border');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('overflow-hidden');
  });
});
