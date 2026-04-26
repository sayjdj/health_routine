
import { motion } from 'framer-motion';

export default function ProgressBar({ progress, color }) {
  return (
    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mt-6 relative">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "linear" }}
      />
    </div>
  );
}
