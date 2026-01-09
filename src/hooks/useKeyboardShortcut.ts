import { useEffect } from 'react';

type KeyboardShortcutConfig = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  enabled?: boolean;
};

/**
 * Custom hook for keyboard shortcuts
 * Handles Cmd/Ctrl key combinations
 */
export function useKeyboardShortcut({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  callback,
  enabled = true,
}: KeyboardShortcutConfig) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      // Check if the key matches
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      
      // Check modifiers
      const ctrlMatches = ctrlKey ? event.ctrlKey : true;
      const metaMatches = metaKey ? (isMac ? event.metaKey : event.ctrlKey) : true;
      const shiftMatches = shiftKey ? event.shiftKey : !event.shiftKey;
      const altMatches = altKey ? event.altKey : !event.altKey;

      // Special handling for Cmd+K / Ctrl+K
      if (key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        callback();
        return;
      }

      // General key matching
      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrlKey, metaKey, shiftKey, altKey, callback, enabled]);
}
