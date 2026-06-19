import { useState, Suspense, lazy } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt: Lazily load TimerScreen to reduce initial bundle size.
// Why: TimerScreen and its dependencies (YouTubePlayer, Controls, ProgressBar, etc.)
//      are not needed on the initial render (RoutineList is shown first).
//      By code-splitting this component, we reduce the initial JavaScript payload.
const TimerScreen = lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          <Suspense key="timer" fallback={<div className="min-h-screen flex items-center justify-center">Loading timer...</div>}>
            <TimerScreen
              routine={activeRoutine}
              onBack={() => setActiveRoutine(null)}
              onComplete={() => setActiveRoutine(null)}
            />
          </Suspense>
        ) : (
          <RoutineList
            key="list"
            onSelectRoutine={setActiveRoutine}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
