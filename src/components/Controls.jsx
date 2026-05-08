
import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';

// ⚡ Bolt: Memoized Controls to prevent unnecessary re-renders.
// Why: TimerScreen updates state (timeLeft) every second, causing child re-renders.
//      Controls receives stable callbacks and isPlaying (which only changes occasionally).
//      Memoizing prevents ~44 unnecessary re-renders per 45s phase.
const Controls = React.memo(function Controls({ isPlaying, togglePlay, skipNext, resetTimer }) {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      <button
        onClick={resetTimer}
        className="w-12 h-12 flex items-center justify-center bg-gray-200/50 rounded-full text-gray-700 hover:bg-gray-300/50 transition-colors"
        aria-label="Reset"
      >
        <RotateCcw size={20} />
      </button>

      <button
        onClick={togglePlay}
        className="w-20 h-20 flex items-center justify-center bg-white rounded-full text-gray-900 shadow-lg hover:scale-105 transition-transform"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={36} className="fill-current" /> : <Play size={36} className="fill-current ml-2" />}
      </button>

      <button
        onClick={skipNext}
        className="w-12 h-12 flex items-center justify-center bg-gray-200/50 rounded-full text-gray-700 hover:bg-gray-300/50 transition-colors"
        aria-label="Skip"
      >
        <SkipForward size={20} />
      </button>
    </div>
  );
});

export default Controls;
