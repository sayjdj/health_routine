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

  // Handle Beep Side Effects (pure state updater)
  useEffect(() => {
    if (isPlaying && prevIsPlayingRef.current) {
      if (prevTimeRef.current - timeLeft === 1) {
        if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
          playBeep(800, 0.1);
        } else if (timeLeft === 0) {
          playBeep(1200, 0.4);
        }
      }
    }
    prevTimeRef.current = timeLeft;
    prevIsPlayingRef.current = isPlaying;
  }, [timeLeft, isPlaying, playBeep]);

  // Interval timer (avoid interval churn by excluding timeLeft from deps)
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Phase transition logic (handles 0-duration phases safely)
  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
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
  }, [isPlaying, timeLeft, phase, currentSet, routine, onComplete]);

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
