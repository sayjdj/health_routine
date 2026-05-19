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
      prevTimeRef.current = routine.workTime;
    }
  }, [routine]);

  // ⚡ Bolt Optimization: Isolate interval ticking from state dependencies to prevent interval churn.
  // By using the updater function form `setTimeLeft(prev => prev - 1)`, the interval callback doesn't need to depend on `timeLeft`.
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle phase transitions
  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      if (phase === 'work') {
        if (currentSet >= routine.sets) {
          setIsPlaying(false);
          if (onComplete) onComplete();
        } else {
          // Move to rest phase if rest time > 0, else skip rest phase immediately?
          // Since 0-duration phases can lock up the interval, we just transition directly
          if (routine.restTime > 0) {
            setPhase('rest');
            setTimeLeft(routine.restTime);
          } else {
            // Edge case: Rest time is 0. Go directly to next work set.
            setPhase('work');
            setCurrentSet(prev => prev + 1);
            setTimeLeft(routine.workTime);
          }
        }
      } else {
        // From rest to work
        setPhase('work');
        setCurrentSet(prev => prev + 1);
        setTimeLeft(routine.workTime);
      }
    }
  }, [isPlaying, timeLeft, phase, currentSet, routine, onComplete]);

  // ⚡ Bolt Optimization: Handle audio side effects outside of the React state updater function
  // State updaters must remain pure. This useEffect detects down-ticks and plays audio.
  useEffect(() => {
    const prevTime = prevTimeRef.current;
    const prevIsPlaying = prevIsPlayingRef.current;

    if (isPlaying && prevIsPlaying && prevTime > timeLeft && timeLeft > 0) {
      if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
        playBeep(800, 0.1);
      }
    } else if (isPlaying && prevIsPlaying && prevTime > timeLeft && timeLeft === 0) {
      playBeep(1200, 0.4);
    }

    prevTimeRef.current = timeLeft;
    prevIsPlayingRef.current = isPlaying;
  }, [timeLeft, isPlaying, playBeep]);


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
