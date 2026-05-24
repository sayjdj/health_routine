import { useState, lazy, Suspense } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt: Code-splitting large route components
// Why: TimerScreen is a large component (includes YouTubePlayer iframe, ProgressBar, etc)
//      that is only needed AFTER a user selects a routine. By lazy loading it,
//      we reduce the initial bundle size, allowing the initial list to render faster.
const TimerScreen = lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>} key="timer">
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
