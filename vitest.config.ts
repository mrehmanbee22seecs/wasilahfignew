import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

/**
 * Vitest Configuration
 * 
 * Test infrastructure for the Wasilah application using Vitest.
 * Vitest is chosen for its seamless integration with Vite and native ESM support.
 * 
 * Features:
 * - Fast test execution with native ESM
 * - Watch mode with HMR
 * - TypeScript support out of the box
 * - Jest-compatible API
 * - Coverage reporting with v8
 * - UI mode for visual test debugging
 * 
 * @see https://vitest.dev/config/
 */
export default defineConfig({
  plugins: [react()],
  
  // Test configuration
  test: {
    // Use happy-dom for fast DOM environment
    // Alternative: 'jsdom' (more complete but slower)
    environment: 'happy-dom',
    
    // Global test utilities available in all test files
    globals: true,
    
    // Setup files run before each test file
    setupFiles: ['./src/test/setup.ts'],
    
    // CSS handling - mock CSS imports to avoid parsing issues
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/types',
        'dist/',
        '.vscode/',
        'coverage/',
      ],
      // Coverage thresholds (can be adjusted)
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
    
    // Test file patterns
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    
    // Files to exclude from testing
    exclude: [
      'node_modules',
      'dist',
      '.vscode',
      '.git',
      'coverage',
    ],
    
    // Test timeout (30 seconds for slow operations)
    testTimeout: 30000,
    
    // Hook timeout
    hookTimeout: 30000,
    
    // Avoid false positives from tests that fail to clean up
    // Set to false if experiencing issues with cleanup
    isolate: true,
    
    // Reporter configuration
    reporters: ['verbose'],
    
    // Mock reset behavior
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
  
  // Resolve configuration (same as vite.config.ts)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
