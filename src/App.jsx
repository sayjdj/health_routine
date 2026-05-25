import React, { useState, Suspense } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt: Lazy load TimerScreen to reduce initial bundle size.
// Why: TimerScreen includes heavy dependencies like YouTubePlayer and audio context hooks
//      which aren't needed until the user actually starts a routine.
// Impact: Reduces main bundle size and speeds up initial page load.
const TimerScreen = React.lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          // Note: key="timer" must be on the Suspense boundary so framer-motion tracks exit animations correctly
          <Suspense key="timer" fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
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
