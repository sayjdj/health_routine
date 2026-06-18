import React, { useState, Suspense } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt: Lazy load TimerScreen to reduce initial bundle size.
// Why: TimerScreen is a heavy component containing video players and animations.
//      Users don't need it until they select a routine. Code splitting improves initial load time.
const TimerScreen = React.lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>} key="timer">
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
