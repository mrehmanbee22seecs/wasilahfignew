/**
 * URL Parameter Utilities
 * Handles reading and parsing URL query parameters
 */

/**
 * Get all URL parameters as an object
 */
export function getUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

/**
 * Get a specific URL parameter
 */
export function getUrlParam(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Check if URL has specific parameter
 */
export function hasUrlParam(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const params = new URLSearchParams(window.location.search);
  return params.has(key);
}

/**
 * Set URL parameters without page reload
 */
export function setUrlParams(params: Record<string, string | null>, replace: boolean = false): void {
  if (typeof window === 'undefined') return;
  
  const currentParams = new URLSearchParams(window.location.search);
  
  // Update params
  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      currentParams.delete(key);
    } else {
      currentParams.set(key, value);
    }
  });
  
  const newUrl = currentParams.toString()
    ? `${window.location.pathname}?${currentParams.toString()}`
    : window.location.pathname;
  
  if (replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}

/**
 * Remove URL parameter
 */
export function removeUrlParam(key: string, replace: boolean = true): void {
  setUrlParams({ [key]: null }, replace);
}

/**
 * Clear all URL parameters
 */
export function clearUrlParams(replace: boolean = true): void {
  if (typeof window === 'undefined') return;
  
  const newUrl = window.location.pathname;
  
  if (replace) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.history.pushState({}, '', newUrl);
  }
}

/**
 * Parse URL parameters for auto-open functionality
 * Returns opportunity ID and action if present
 */
export type AutoOpenParams = {
  opportunityId: string | null;
  action: 'apply' | 'view' | null;
};

export function getAutoOpenParams(): AutoOpenParams {
  return {
    opportunityId: getUrlParam('opportunity'),
    action: getUrlParam('action') as 'apply' | 'view' | null,
  };
}

/**
 * Clear auto-open parameters from URL
 */
export function clearAutoOpenParams(): void {
  if (typeof window === 'undefined') return;
  
  const params = new URLSearchParams(window.location.search);
  params.delete('opportunity');
  params.delete('action');
  
  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  
  window.history.replaceState({}, '', newUrl);
}
