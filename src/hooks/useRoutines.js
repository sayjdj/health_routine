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

  // ⚡ Bolt: Wrapped returned functions in useCallback with functional state updates
  // Why: This ensures that the references to these functions remain stable across renders.
  //      This prevents unnecessary re-renders in child components (like RoutineItem)
  //      that receive these functions as props when other states (like modal open) change.
  const addRoutine = useCallback((routine) => {
    setRoutines(prev => [...prev, { ...routine, id: `custom-${Date.now()}` }]);
  }, []);

  const updateRoutine = useCallback((id, updatedRoutine) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updatedRoutine } : r));
  }, []);

  const deleteRoutine = useCallback((id) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  }, []);

  const resetToDefault = useCallback(() => {
    setRoutines(defaultRoutines);
  }, []);

  return { routines, addRoutine, updateRoutine, deleteRoutine, resetToDefault };
}
