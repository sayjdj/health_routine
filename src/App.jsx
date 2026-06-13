import { useState, lazy, Suspense } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt: Lazy load TimerScreen to reduce initial bundle size
// Why: TimerScreen includes the YouTube iframe logic and complex timer state/animations,
//      which aren't needed until the user explicitly selects a routine.
//      Lazy loading it splits the bundle, improving initial page load time.
const TimerScreen = lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          // ⚡ Bolt: key must be on Suspense so AnimatePresence tracks it for unmounting
          <Suspense key="timer" fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Loading timer...</div>}>
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
