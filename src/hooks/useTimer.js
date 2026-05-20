import { useState, useEffect, useCallback, useRef } from 'react';
import { useBeep } from './useBeep';

export function useTimer(routine, onComplete) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('work'); // 'work' | 'rest'
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(routine?.workTime || 0);

  const { playBeep } = useBeep();

  // Refs for edge detection
  const prevTimeRef = useRef(timeLeft);
  const prevIsPlayingRef = useRef(isPlaying);

  // Reset when routine changes
  useEffect(() => {
    if (routine) {
      setIsPlaying(false);
      setPhase('work');
      setCurrentSet(1);
      setTimeLeft(routine.workTime);
      prevTimeRef.current = routine.workTime;
    }
  }, [routine]);

  // ⚡ Bolt Optimization: Isolate interval logic from rapidly changing state
  // Why: Depending on 'timeLeft' causes the interval to be cleared and recreated
  //      every second (interval churn), hurting performance and accuracy.
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev > 0) return prev - 1;
          return prev;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle side-effects (beeps) and phase transitions safely outside the state updater
  useEffect(() => {
    const isTickDown = isPlaying && prevIsPlayingRef.current && prevTimeRef.current > timeLeft;

    if (isTickDown) {
        if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
            playBeep(800, 0.1);
        } else if (timeLeft === 0) {
            playBeep(1200, 0.4);
        }
    }

    if (isPlaying && timeLeft === 0) {
      if (phase === 'work') {
        if (currentSet >= routine.sets) {
          // Completed all sets
          setIsPlaying(false);
          if (onComplete) onComplete();
        } else {
          // Move to rest phase, or skip directly to next work phase if restTime is 0
          if (routine.restTime > 0) {
              setPhase('rest');
              setTimeLeft(routine.restTime);
          } else {
              setPhase('work');
              setCurrentSet(prev => prev + 1);
              setTimeLeft(routine.workTime);
          }
        }
      } else {
        // Move to next work phase
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
        if (routine.restTime > 0) {
            setPhase('rest');
            setTimeLeft(routine.restTime);
        } else {
            setPhase('work');
            setCurrentSet(prev => prev + 1);
            setTimeLeft(routine.workTime);
        }
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
