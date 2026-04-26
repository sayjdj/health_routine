import { useEffect } from 'react';
import { motion } from 'framer-motion';
import YouTubePlayer from './YouTubePlayer';
import CapabilityCard from './CapabilityCard';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import { useTimer } from '../hooks/useTimer';

export default function TimerScreen({ routine, onComplete, onBack }) {
  const {
    isPlaying,
    phase,
    currentSet,
    timeLeft,
    progress,
    togglePlay,
    resetTimer,
    skipNext
  } = useTimer(routine, onComplete);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isWork = phase === 'work';
  const bgColor = isWork ? 'bg-blue-50' : 'bg-orange-50';
  const textColor = isWork ? 'text-blue-600' : 'text-orange-600';
  const progressColor = isWork ? 'bg-blue-500' : 'bg-orange-500';

  useEffect(() => {
    if (isPlaying && "Notification" in window && Notification.permission === "granted") {
        if (timeLeft === 0 && currentSet === routine.sets && phase === 'work') {
            new Notification("운동 완료!", {
                body: `${routine.title} 운동이 끝났습니다.`
            });
        }
    }
  }, [timeLeft, isPlaying, phase, currentSet, routine]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`min-h-screen flex flex-col transition-colors duration-500 ${bgColor}`}
    >
      {/* Top section: Video */}
      <div className="w-full">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <button onClick={onBack} className="text-gray-600 font-medium">← 뒤로</button>
          <h1 className="font-bold text-gray-800 truncate">{routine.title}</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        <YouTubePlayer youtubeId={routine.youtubeId} />
        <CapabilityCard capability={routine.capability} />
      </div>

      {/* Middle section: Timer */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 mt-4">
        <h2 className={`text-2xl font-bold mb-2 uppercase tracking-widest ${textColor}`}>
          {isWork ? 'WORK' : 'REST'}
        </h2>
        <div className="text-gray-500 mb-8 font-medium">
          Set {currentSet} / {routine.sets}
        </div>

        <div className={`text-8xl font-black tabular-nums tracking-tighter ${textColor} drop-shadow-sm`}>
          {formatTime(timeLeft)}
        </div>

        <div className="w-full max-w-sm mt-8">
          <ProgressBar progress={progress} color={progressColor} />
        </div>

        <Controls
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          skipNext={skipNext}
          resetTimer={resetTimer}
        />
      </div>

      {/* Bottom section: Description */}
      <div className="bg-white p-6 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] mt-auto">
        <h3 className="font-bold text-gray-800 mb-2">운동 설명</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {routine.description}
        </p>
      </div>
    </motion.div>
  );
}
