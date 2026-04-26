

export default function CapabilityCard({ capability }) {
  if (!capability) return null;

  return (
    <div className="bg-white px-4 py-3 shadow-sm rounded-b-xl border-b border-gray-100 flex justify-between items-center text-sm">
      <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
        <span className="text-gray-500 text-xs mb-1">난이도</span>
        <span className="font-semibold text-gray-800">{capability.level}</span>
      </div>
      <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0">
        <span className="text-gray-500 text-xs mb-1">타겟 부위</span>
        <span className="font-semibold text-gray-800">{capability.target}</span>
      </div>
      <div className="flex flex-col items-center flex-1 last:border-0">
        <span className="text-gray-500 text-xs mb-1">소모 칼로리</span>
        <span className="font-semibold text-gray-800">{capability.calories}</span>
      </div>
    </div>
  );
}
