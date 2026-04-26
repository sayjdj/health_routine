import { useState, useEffect } from 'react';
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

  const addRoutine = (routine) => {
    setRoutines([...routines, { ...routine, id: `custom-${Date.now()}` }]);
  };

  const updateRoutine = (id, updatedRoutine) => {
    setRoutines(routines.map(r => r.id === id ? { ...r, ...updatedRoutine } : r));
  };

  const deleteRoutine = (id) => {
    setRoutines(routines.filter(r => r.id !== id));
  };

  const resetToDefault = () => {
    setRoutines(defaultRoutines);
  }

  return { routines, addRoutine, updateRoutine, deleteRoutine, resetToDefault };
}
