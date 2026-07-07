import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { useRoutines } from '../hooks/useRoutines';
import CustomRoutineModal from './CustomRoutineModal';
import RoutineItem from './RoutineItem';

export default function RoutineList({ onSelectRoutine }) {
  const { routines, addRoutine, updateRoutine, deleteRoutine, resetToDefault } = useRoutines();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        await Notification.requestPermission();
      }
    }
  };

  // ⚡ Bolt: Stabilized event handlers with useCallback.
  // Why: When passed to memoized child components like RoutineItem,
  //      unstable references break React.memo() checks, causing re-renders.
  const handlePlay = useCallback((routine) => {
    requestNotificationPermission();
    onSelectRoutine(routine);
  }, [onSelectRoutine]);

  const handleEdit = useCallback((routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id) => {
    if (window.confirm("정말로 이 루틴을 삭제하시겠습니까?")) {
      deleteRoutine(id);
    }
  }, [deleteRoutine]);

  const handleSave = useCallback((data) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, data);
    } else {
      addRoutine(data);
    }
    setIsModalOpen(false);
    setEditingRoutine(null);
  }, [editingRoutine, updateRoutine, addRoutine]);

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <div className="flex justify-between items-center mb-6 pt-4">
        <h1 className="text-2xl font-bold text-gray-800">하체 루틴 선택</h1>
        <button
          onClick={resetToDefault}
          className="text-sm text-gray-500 underline"
        >
          기본값 복원
        </button>
      </div>

      <div className="space-y-4">
        {routines.map((routine) => (
          <RoutineItem
            key={routine.id}
            routine={routine}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <button
        onClick={() => { setEditingRoutine(null); setIsModalOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-10"
      >
        <Plus size={24} />
      </button>

      {isModalOpen && (
        <CustomRoutineModal
          initialData={editingRoutine}
          onSave={handleSave}
          onClose={() => { setIsModalOpen(false); setEditingRoutine(null); }}
        />
      )}
    </div>
  );
}
