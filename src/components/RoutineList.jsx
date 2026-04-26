import { useState } from 'react';
import { Play, Plus, Trash2, Edit } from 'lucide-react';
import { useRoutines } from '../hooks/useRoutines';
import CustomRoutineModal from './CustomRoutineModal';

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

  const handlePlay = (routine) => {
    requestNotificationPermission();
    onSelectRoutine(routine);
  };

  const handleEdit = (routine) => {
    setEditingRoutine(routine);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("정말로 이 루틴을 삭제하시겠습니까?")) {
      deleteRoutine(id);
    }
  };

  const handleSave = (data) => {
    if (editingRoutine) {
      updateRoutine(editingRoutine.id, data);
    } else {
      addRoutine(data);
    }
    setIsModalOpen(false);
    setEditingRoutine(null);
  };

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
          <div key={routine.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{routine.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {routine.sets}세트 • Work {routine.workTime}s / Rest {routine.restTime}s
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(routine)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(routine.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
                onClick={() => handlePlay(routine)}
                className="flex items-center gap-1 bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors shadow-md"
              >
                <Play size={16} className="fill-current" /> 시작
              </button>
            </div>
          </div>
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
