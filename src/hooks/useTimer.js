import { useState, useEffect, useCallback, useRef } from 'react';
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

  const prevTimeRef = useRef(timeLeft);

  // ⚡ Bolt: Isolate timer interval from state updates to prevent churn
  // Why: Previously `timeLeft` was a dependency of the useEffect containing `setInterval`.
  //      This meant the interval was destroyed and re-created every second, which is inefficient
  //      and can lead to drift. Now the interval only depends on `isPlaying`.
  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // ⚡ Bolt: Handle side effects and phase transitions separately
  // Why: React state updaters should be pure functions. Side effects like playing audio
  //      inside `setTimeLeft` are an anti-pattern. This useEffect handles side effects
  //      safely and ensures 0-duration phases transition properly.
  useEffect(() => {
    // Only trigger effects if time actually ticked down
    if (isPlaying && timeLeft < prevTimeRef.current) {
      if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
        // Play short beep at 3, 2, 1 seconds left
        playBeep(800, 0.1);
      } else if (timeLeft === 0) {
        // Play longer beep when transitioning
        playBeep(1200, 0.4);
      }
    }
    prevTimeRef.current = timeLeft;

    // Handle phase transitions
    if (isPlaying && timeLeft === 0) {
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
    }
  }, [timeLeft, isPlaying, phase, currentSet, routine, playBeep, onComplete]);

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
