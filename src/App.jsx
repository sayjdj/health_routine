import { useState, Suspense, lazy } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt Optimization: Code Splitting
// Why: TimerScreen includes heavy child components (YouTubePlayer, Framer Motion animations)
//      that shouldn't block the initial page load when displaying the RoutineList.
// Impact: Reduces the initial JS bundle payload significantly.
const TimerScreen = lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
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
