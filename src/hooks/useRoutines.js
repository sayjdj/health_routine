import { useState, useEffect, useCallback } from 'react';
import { defaultRoutines } from '../data/mockRoutines';

const STORAGE_KEY = 'leg-routine-timer-data';

export function useRoutines() {
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved routines", e);
      }
    }
    return defaultRoutines;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
  }, [routines]);

  // ⚡ Bolt Optimization: Memoize useRoutines callbacks
  // Why: These callbacks are returned by the hook and potentially passed down as props to child components.
  //      Using useCallback with functional state updates prevents them from being recreated on every render
  //      and removes the dependency on the 'routines' array, preventing unnecessary re-renders in children.
  const addRoutine = useCallback((routine) => {
    setRoutines((prev) => [...prev, { ...routine, id: `custom-${Date.now()}` }]);
  }, []);

  const updateRoutine = useCallback((id, updatedRoutine) => {
    setRoutines((prev) => prev.map(r => r.id === id ? { ...r, ...updatedRoutine } : r));
  }, []);

  const deleteRoutine = useCallback((id) => {
    setRoutines((prev) => prev.filter(r => r.id !== id));
  }, []);

  const resetToDefault = useCallback(() => {
    setRoutines(defaultRoutines);
  }, []);

  return { routines, addRoutine, updateRoutine, deleteRoutine, resetToDefault };
}
