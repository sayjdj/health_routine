import { useState, useEffect } from 'react';

export default function CustomRoutineModal({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    youtubeId: '',
    workTime: 45,
    restTime: 15,
    sets: 3,
    description: '',
    capability: { level: '초급', target: '하체', calories: '0kcal' }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('capability.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        capability: { ...formData.capability, [field]: value }
      });
    } else if (['workTime', 'restTime', 'sets'].includes(name)) {
      setFormData({ ...formData, [name]: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">{initialData ? '루틴 수정' : '새 루틴 추가'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube ID (예: mw5Z_v-CAsU)</label>
            <input type="text" name="youtubeId" value={formData.youtubeId} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">운동 시간 (초)</label>
              <input type="number" name="workTime" value={formData.workTime} onChange={handleChange} required min="1" className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">휴식 시간 (초)</label>
              <input type="number" name="restTime" value={formData.restTime} onChange={handleChange} required min="0" className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">세트 수</label>
              <input type="number" name="sets" value={formData.sets} onChange={handleChange} required min="1" className="w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full border border-gray-300 rounded-md p-2"></textarea>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">난이도</label>
              <input type="text" name="capability.level" value={formData.capability.level} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">타겟 부위</label>
              <input type="text" name="capability.target" value={formData.capability.target} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">취소</button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
}
