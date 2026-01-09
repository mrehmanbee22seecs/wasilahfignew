// Utility for handling prefers-reduced-motion
export function useReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

// CSS class helper
export function getMotionClass(normalClass: string, reducedClass: string = ''): string {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedClass : normalClass;
}

// Animation duration helper
export function getAnimationDuration(normalMs: number, reducedMs: number = 0): number {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? reducedMs : normalMs;
}

// Apply reduced motion styles globally
export function applyReducedMotionStyles() {
  if (typeof document === 'undefined') return;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const updateStyles = () => {
    if (mediaQuery.matches) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };
  
  updateStyles();
  mediaQuery.addEventListener('change', updateStyles);
  
  return () => mediaQuery.removeEventListener('change', updateStyles);
}
