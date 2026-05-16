import { useState, useEffect, useCallback, useRef } from 'react';
import { useBeep } from './useBeep';

export function useTimer(routine, onComplete) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('work'); // 'work' | 'rest'
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(routine?.workTime || 0);
  const { playBeep } = useBeep();

  const prevTimeRef = useRef(timeLeft);
  const prevIsPlayingRef = useRef(isPlaying);

  // Reset when routine changes
  useEffect(() => {
    if (routine) {
      setIsPlaying(false);
      setPhase('work');
      setCurrentSet(1);
      setTimeLeft(routine.workTime);
    }
  }, [routine]);

  // ⚡ Bolt: Extracted setInterval into its own useEffect that only depends on `isPlaying`.
  // Why: Previously, the interval depended on `timeLeft`, meaning it was cleared and recreated
  //      every single second (interval churn). This separates the continuous ticking logic.
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // ⚡ Bolt: Moved side-effects (beeping and phase transitions) out of the state updater function.
  // Why: React state updaters must remain pure functions. Side effects inside updaters can execute multiple times
  //      in strict/concurrent mode, causing redundant audio playbacks and unpredictable state.
  useEffect(() => {
    // Determine if we just ticked down
    const justTicked = isPlaying && prevIsPlayingRef.current && prevTimeRef.current !== timeLeft && prevTimeRef.current - 1 === timeLeft;

    if (justTicked) {
      if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
        playBeep(800, 0.1);
      } else if (timeLeft === 0) {
        playBeep(1200, 0.4);
      }
    }

    // Original state machine logic: trigger transition when timeLeft is 0 AND we are playing
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

    prevTimeRef.current = timeLeft;
    prevIsPlayingRef.current = isPlaying;
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
