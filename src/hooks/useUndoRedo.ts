import { useState, useCallback, useRef } from 'react';

/**
 * useUndoRedo - Undo/Redo state management hook
 * 
 * Features:
 * - Maintains history stack
 * - Undo/Redo operations
 * - Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
 * - Max history limit
 * 
 * @param initialState - Initial state value
 * @param maxHistory - Maximum history length (default: 50)
 * @returns State, setState, undo, redo, canUndo, canRedo
 */

export function useUndoRedo<T>(initialState: T, maxHistory = 50) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<T[]>([initialState]);

  const setState = useCallback(
    (newState: T | ((prev: T) => T)) => {
      setHistory((currentHistory) => {
        const currentState = currentHistory[index];
        const nextState = typeof newState === 'function' 
          ? (newState as (prev: T) => T)(currentState)
          : newState;

        // Don't add to history if state hasn't changed
        if (JSON.stringify(nextState) === JSON.stringify(currentState)) {
          return currentHistory;
        }

        // Remove any future history when making a new change
        const newHistory = currentHistory.slice(0, index + 1);
        
        // Add new state
        newHistory.push(nextState);

        // Limit history size
        if (newHistory.length > maxHistory) {
          newHistory.shift();
          setIndex(newHistory.length - 1);
        } else {
          setIndex(newHistory.length - 1);
        }

        return newHistory;
      });
    },
    [index, maxHistory]
  );

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
    }
  }, [index, history.length]);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;
  const state = history[index];

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    historyLength: history.length,
    currentIndex: index,
  };
}

/**
 * useUndoRedoKeyboard - Keyboard shortcut handler for undo/redo
 * 
 * @param undo - Undo callback
 * @param redo - Redo callback
 * @param canUndo - Whether undo is available
 * @param canRedo - Whether redo is available
 */
export function useUndoRedoKeyboard(
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (canUndo) {
          e.preventDefault();
          undo();
        }
      }

      // Ctrl/Cmd + Shift + Z for redo (or Ctrl/Cmd + Y)
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')
      ) {
        if (canRedo) {
          e.preventDefault();
          redo();
        }
      }
    },
    [undo, redo, canUndo, canRedo]
  );

  return handleKeyDown;
}
