/**
 * Tests for ChunkErrorBoundary
 * 
 * Validates chunk loading error handling and retry functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChunkErrorBoundary } from '../ChunkErrorBoundary';

// Mock component that throws an error
const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

describe('ChunkErrorBoundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for error boundary tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when no error occurs', () => {
    render(
      <ChunkErrorBoundary>
        <div>Normal Content</div>
      </ChunkErrorBoundary>
    );

    expect(screen.getByText('Normal Content')).toBeInTheDocument();
  });

  it('should catch and display chunk loading errors', () => {
    const chunkError = new Error('Failed to fetch dynamically imported module');
    
    render(
      <ChunkErrorBoundary>
        <ThrowError error={chunkError} />
      </ChunkErrorBoundary>
    );

    expect(screen.getByText('Failed to Load Content')).toBeInTheDocument();
    expect(screen.getByText(/having trouble loading/i)).toBeInTheDocument();
  });

  it('should detect ChunkLoadError by error name', () => {
    const chunkError = new Error('Some error message');
    chunkError.name = 'ChunkLoadError';
    
    render(
      <ChunkErrorBoundary>
        <ThrowError error={chunkError} />
      </ChunkErrorBoundary>
    );

    expect(screen.getByText('Failed to Load Content')).toBeInTheDocument();
  });

  it('should show retry button for chunk errors', () => {
    const chunkError = new Error('Failed to fetch dynamically imported module');
    
    render(
      <ChunkErrorBoundary>
        <ThrowError error={chunkError} />
      </ChunkErrorBoundary>
    );

    const retryButton = screen.getByText('Retry Loading');
    expect(retryButton).toBeInTheDocument();
  });

  it('should show go home button', () => {
    const chunkError = new Error('Failed to fetch dynamically imported module');
    
    render(
      <ChunkErrorBoundary>
        <ThrowError error={chunkError} />
      </ChunkErrorBoundary>
    );

    const homeButton = screen.getByText('Go to Home');
    expect(homeButton).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn();
    const chunkError = new Error('Failed to fetch dynamically imported module');
    
    render(
      <ChunkErrorBoundary onError={onError}>
        <ThrowError error={chunkError} />
      </ChunkErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      chunkError,
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom Error Message</div>;
    const chunkError = new Error('Failed to fetch dynamically imported module');
    
    render(
      <ChunkErrorBoundary fallback={customFallback}>
        <ThrowError error={chunkError} />
      </ChunkErrorBoundary>
    );

    expect(screen.getByText('Custom Error Message')).toBeInTheDocument();
    expect(screen.queryByText('Failed to Load Content')).not.toBeInTheDocument();
  });

  it('should have proper error UI structure', () => {
    const chunkError = new Error('Failed to fetch dynamically imported module');
    
    const { container } = render(
      <ChunkErrorBoundary>
        <ThrowError error={chunkError} />
      </ChunkErrorBoundary>
    );

    // Check for error icon
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-red-500');

    // Check for title
    expect(screen.getByText('Failed to Load Content')).toBeInTheDocument();

    // Check for description
    expect(screen.getByText(/having trouble loading/i)).toBeInTheDocument();
  });

  it('should let non-chunk errors bubble up', () => {
    const nonChunkError = new Error('Regular error');
    
    // This test validates that non-chunk errors are re-thrown
    // In a real scenario, they would be caught by a parent error boundary
    expect(() => {
      render(
        <ChunkErrorBoundary>
          <ThrowError error={nonChunkError} />
        </ChunkErrorBoundary>
      );
    }).toThrow('Regular error');
  });
});
