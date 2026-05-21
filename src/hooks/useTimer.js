import React, { useState, useEffect, useCallback } from 'react';
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

  const prevTimeRef = React.useRef(timeLeft);
  const prevIsPlayingRef = React.useRef(isPlaying);

  // ⚡ Bolt: Prevent interval churn
  // Why: The original implementation placed `timeLeft` in the dependency array of the setInterval effect.
  //      This caused the interval to be cleared and recreated every single second, adding unnecessary overhead.
  //      By separating the ticking logic from the state and side effects, the interval remains stable.
  useEffect(() => {
    let interval = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle side-effects (beeps and transitions) separate from the tick interval
  useEffect(() => {
    const prevTime = prevTimeRef.current;
    const prevIsPlaying = prevIsPlayingRef.current;

    // Update refs for next render
    prevTimeRef.current = timeLeft;
    prevIsPlayingRef.current = isPlaying;

    if (!isPlaying) return;

    // Detect edge transition: a "tick" down occurred while playing
    const didTickDown = prevTime !== timeLeft && isPlaying === prevIsPlaying;

    if (didTickDown && timeLeft > 0) {
      if (timeLeft === 3 || timeLeft === 2 || timeLeft === 1) {
        // Play short beep at 3, 2, 1 seconds left
        playBeep(800, 0.1);
      } else if (timeLeft === 0) {
        // Play longer beep when transitioning (handled in transition block below,
        // though logic here caught previous state transitions)
      }
    }

    // Edge case for the transition beep which should happen when it hits 0
    if (didTickDown && timeLeft === 0) {
      playBeep(1200, 0.4);
    }

    if (timeLeft === 0) {
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
