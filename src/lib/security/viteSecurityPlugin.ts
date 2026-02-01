/**
 * Vite Plugin: Security Headers
 * 
 * @fileoverview
 * Vite plugin to add security headers to development server responses.
 * Ensures consistent security posture between dev and production.
 * 
 * ## Usage:
 * 
 * In vite.config.ts:
 * ```tsx
 * import { securityHeadersPlugin } from './src/lib/security/viteSecurityPlugin';
 * 
 * export default defineConfig({
 *   plugins: [react(), securityHeadersPlugin()],
 * });
 * ```
 * 
 * @module lib/security/viteSecurityPlugin
 * @since 2026-02-01
 */

import type { Plugin } from 'vite';
import { getSecurityHeaders } from './headers';

/**
 * Creates a Vite plugin that adds security headers to all responses
 * 
 * @returns {Plugin} Vite plugin
 */
export function securityHeadersPlugin(): Plugin {
  return {
    name: 'security-headers',
    
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Get security headers for development environment
        const headers = getSecurityHeaders({
          environment: 'development',
          enableHSTS: false, // Don't enable HSTS in dev
          reportCSPViolations: false,
        });
        
        // Apply headers to response
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        
        next();
      });
    },
    
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        // Get security headers for production preview
        const headers = getSecurityHeaders({
          environment: 'production',
          enableHSTS: false, // Still in preview, not production
          reportCSPViolations: false,
        });
        
        // Apply headers to response
        Object.entries(headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        
        next();
      });
    },
  };
}

/**
 * Export for use in vite.config.ts
 */
export default securityHeadersPlugin;
