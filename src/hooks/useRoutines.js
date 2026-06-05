import { useState, useEffect, useCallback } from 'react';
import { defaultRoutines } from '../data/mockRoutines';

export const STORAGE_KEY = 'leg-routine-timer-data';

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

  // ⚡ Bolt: Wrapped in useCallback and using functional state updates to maintain stable reference
  const addRoutine = useCallback((routine) => {
    setRoutines((prev) => [...prev, { ...routine, id: `custom-${Date.now()}` }]);
  }, []);

  // ⚡ Bolt: Wrapped in useCallback and using functional state updates to maintain stable reference
  const updateRoutine = useCallback((id, updatedRoutine) => {
    setRoutines((prev) => prev.map(r => r.id === id ? { ...r, ...updatedRoutine } : r));
  }, []);

  // ⚡ Bolt: Wrapped in useCallback and using functional state updates to maintain stable reference
  const deleteRoutine = useCallback((id) => {
    setRoutines((prev) => prev.filter(r => r.id !== id));
  }, []);

  // ⚡ Bolt: Wrapped in useCallback to maintain stable reference
  const resetToDefault = useCallback(() => {
    setRoutines(defaultRoutines);
  }, []);

  return { routines, addRoutine, updateRoutine, deleteRoutine, resetToDefault };
}
