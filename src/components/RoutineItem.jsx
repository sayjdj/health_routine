import React from 'react';
import { Play, Trash2, Edit } from 'lucide-react';

// ⚡ Bolt: Memoized RoutineItem to prevent unnecessary list re-renders.
// Why: When the parent state (like isModalOpen) changes, the entire list re-renders.
//      Memoizing individual items prevents this, reducing re-renders from O(N) to O(1) for untouched items.
const RoutineItem = React.memo(({ routine, onPlay, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{routine.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {routine.sets}세트 • Work {routine.workTime}s / Rest {routine.restTime}s
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(routine)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
            <Edit size={18} />
          </button>
          <button onClick={() => onDelete(routine.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2 text-xs">
          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md">{routine.capability?.level}</span>
          <span className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md">{routine.capability?.target}</span>
        </div>
        <button
          onClick={() => onPlay(routine)}
          className="flex items-center gap-1 bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md"
        >
          <Play size={16} className="fill-current" /> 시작
        </button>
      </div>
    </div>
  );
});

export default RoutineItem;
