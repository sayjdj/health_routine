import { useState, useEffect, useCallback } from 'react';
import { useBeep } from './useBeep';

export function useTimer(routine, onComplete) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('work'); // 'work' | 'rest'
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(routine?.workTime || 0);
  const { playBeep } = useBeep();

  // Reset when routine changes
  useEffect(() => {
    if (routine) {
      setIsPlaying(false);
      setPhase('work');
      setCurrentSet(1);
      setTimeLeft(routine.workTime);
    }
  }, [routine]);

  // ⚡ Bolt: Extracted continuous interval logic to prevent interval churn.
  // By using the functional state updater and removing timeLeft from the
  // dependency array, we avoid clearing and resetting the interval every second.
  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : prev);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // ⚡ Bolt: Separated side effects (audio and phase transitions) from the state updater.
  // State updaters must be pure. Moving side effects here ensures predictable behavior
  // and allows the interval effect to remain clean and stable.
  useEffect(() => {
    if (!isPlaying) return;

    if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
      // Play short beep at 3, 2, 1 seconds left
      playBeep(800, 0.1);
    } else if (timeLeft === 0) {
      // Play longer beep when transitioning
      playBeep(1200, 0.4);

      if (phase === 'work') {
        if (currentSet >= routine.sets) {
          // Completed all sets
          setIsPlaying(false);
          if (onComplete) onComplete();
        } else {
          // Move to rest phase
          setPhase('rest');
          setTimeLeft(routine.restTime);
        }
      } else {
        // Move to next work phase
        setPhase('work');
        setCurrentSet(prev => prev + 1);
        setTimeLeft(routine.workTime);
      }
    }
  }, [timeLeft, isPlaying, phase, currentSet, routine, onComplete, playBeep]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsPlaying(false);
    setPhase('work');
    setCurrentSet(1);
    setTimeLeft(routine?.workTime || 0);
  }, [routine]);

  const skipNext = useCallback(() => {
    if (phase === 'work') {
      if (currentSet >= routine.sets) {
        setIsPlaying(false);
        if (onComplete) onComplete();
      } else {
        setPhase('rest');
        setTimeLeft(routine.restTime);
      }
    } else {
      setPhase('work');
      setCurrentSet(prev => prev + 1);
      setTimeLeft(routine.workTime);
    }
  }, [phase, currentSet, routine, onComplete]);

  // Calculate progress percentage
  const totalPhaseTime = phase === 'work' ? routine?.workTime : routine?.restTime;
  const progress = totalPhaseTime ? ((totalPhaseTime - timeLeft) / totalPhaseTime) * 100 : 0;

  return {
    isPlaying,
    phase,
    currentSet,
    timeLeft,
    progress,
    togglePlay,
    resetTimer,
    skipNext
  };
}
