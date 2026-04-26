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

  useEffect(() => {
    let interval = null;

    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 4 || prev === 3 || prev === 2) {
             // Play short beep at 3, 2, 1 seconds left
             playBeep(800, 0.1);
          } else if (prev === 1) {
             // Play longer beep when transitioning
             playBeep(1200, 0.4);
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
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

    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, phase, currentSet, routine, playBeep, onComplete]);

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
