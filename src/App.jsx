import { useState } from 'react';
import RoutineList from './components/RoutineList';
import TimerScreen from './components/TimerScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [activeRoutine, setActiveRoutine] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans sm:max-w-md sm:mx-auto sm:shadow-2xl sm:relative sm:overflow-hidden">
      <AnimatePresence mode="wait">
        {activeRoutine ? (
          <TimerScreen
            key="timer"
            routine={activeRoutine}
            onBack={() => setActiveRoutine(null)}
            onComplete={() => setActiveRoutine(null)}
          />
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
