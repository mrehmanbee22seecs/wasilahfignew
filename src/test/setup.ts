/**
 * Test Setup File
 * 
 * This file runs before each test suite and sets up the testing environment.
 * It configures:
 * - Custom matchers from @testing-library/jest-dom
 * - Global test utilities
 * - Mock configurations
 * - Environment variables for testing
 * 
 * @see https://vitest.dev/config/#setupfiles
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Clean up after each test automatically
 * Removes all rendered components and clears any side effects
 */
afterEach(() => {
  cleanup();
});

/**
 * Mock window.matchMedia
 * Required for components that use media queries
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Mock window.scrollTo
 * Often used in navigation and smooth scrolling
 */
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

/**
 * Mock IntersectionObserver
 * Used by lazy loading and infinite scroll components
 */
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

/**
 * Mock ResizeObserver
 * Used by components that respond to size changes
 */
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
} as any;

/**
 * Suppress console errors and warnings during tests
 * Comment out if you need to debug console output
 */
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  console.error = (...args: any[]) => {
    // Filter out specific known warnings
    const message = args[0]?.toString() || '';
    
    // Ignore React 18 warnings that are expected in tests
    if (
      message.includes('Warning: ReactDOM.render') ||
      message.includes('Warning: useLayoutEffect') ||
      message.includes('Not implemented: HTMLFormElement.prototype.submit')
    ) {
      return;
    }
    
    originalError.call(console, ...args);
  };
  
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || '';
    
    // Ignore specific warnings
    if (message.includes('componentWillReceiveProps')) {
      return;
    }
    
    originalWarn.call(console, ...args);
  };
});

afterEach(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

/**
 * Mock environment variables for tests
 * Add any environment variables your app needs here
 */
process.env.NODE_ENV = 'test';

/**
 * Global test utilities
 * Add any custom utilities you want available in all tests
 */

/**
 * Helper to wait for async operations
 * @param ms - milliseconds to wait
 */
export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to create a mock promise that can be resolved/rejected manually
 */
export const createDeferredPromise = <T = any>() => {
  let resolve: (value: T) => void;
  let reject: (reason?: any) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
};
