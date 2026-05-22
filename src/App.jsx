import { useState, lazy, Suspense } from 'react';
import RoutineList from './components/RoutineList';
import { AnimatePresence } from 'framer-motion';

// ⚡ Bolt Optimization: Lazy load TimerScreen component
// Why: The TimerScreen is not needed on the initial render (users only see the RoutineList first).
//      By code-splitting it with React.lazy, we reduce the initial bundle size, which means
//      faster initial page loads. The browser only downloads TimerScreen when the user actually
//      clicks a routine to start it.
const TimerScreen = lazy(() => import('./components/TimerScreen'));

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          <Suspense key="timer" fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading timer...</div>}>
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
