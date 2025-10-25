import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export const useHistoryState = <T>(initialPresent: T | (() => T)) => {
  // FIX: Support lazy initialization for initialPresent, similar to useState.
  // This allows passing a function to compute the initial state only once, fixing errors in consumers.
  const [state, setState] = useState<HistoryState<T>>(() => {
    const present =
      typeof initialPresent === 'function'
        ? (initialPresent as () => T)()
        : initialPresent;
    return {
      past: [],
      present,
      future: [],
    };
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;
    setState(currentState => {
      const { past, present, future } = currentState;
      const newPast = past.slice(0, past.length - 1);
      const newPresent = past[past.length - 1];
      const newFuture = [present, ...future];
      return { past: newPast, present: newPresent, future: newFuture };
    });
  }, [canUndo]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    setState(currentState => {
      const { past, present, future } = currentState;
      const newPresent = future[0];
      const newFuture = future.slice(1);
      const newPast = [...past, present];
      return { past: newPast, present: newPresent, future: newFuture };
    });
  }, [canRedo]);

  const set = useCallback((newPresent: T | ((prevState: T) => T)) => {
    setState(currentState => {
      const resolvedNewPresent = typeof newPresent === 'function' 
        ? (newPresent as (prevState: T) => T)(currentState.present)
        : newPresent;

      if (resolvedNewPresent === currentState.present) {
        return currentState;
      }
      return {
        past: [...currentState.past, currentState.present],
        present: resolvedNewPresent,
        future: [],
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
     setState({
        past: [],
        present: newPresent,
        future: [],
     });
  }, []);

  return {
    state: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
  };
};
