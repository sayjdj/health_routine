import { useState, Suspense, lazy } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt Optimization: Lazy load TimerScreen to reduce initial bundle size.
// Why: The TimerScreen is not needed on the initial render (users see RoutineList first).
//      By code-splitting it out, we make the initial load faster.
const TimerScreen = lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          // ⚡ Bolt Optimization Note: When using Suspense inside AnimatePresence,
          // the 'key' must be on the Suspense wrapper to ensure proper exit animations and remount tracking.
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
