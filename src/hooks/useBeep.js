import { useCallback, useRef, useEffect } from 'react';

export function useBeep() {
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction if possible,
    // but we lazily initialize it in the play function
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playBeep = useCallback((frequency = 800, duration = 0.1, vol = 0.5) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, []);

  return { playBeep };
}
