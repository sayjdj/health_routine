
import { motion } from 'framer-motion';

export default function ProgressBar({ progress, color }) {
  return (
    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mt-6 relative">
      {/* ⚡ Bolt Optimization: Using scaleX instead of width to prevent expensive layout reflows and offload animation to the GPU. */}
      <motion.div
        className={`h-full w-full origin-left ${color}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.5, ease: "linear" }}
        style={{ originX: 0 }}
      />
    </div>
  );
}
