
import { motion } from 'framer-motion';

export default function ProgressBar({ progress, color }) {
  // Optimization: Use scaleX instead of width to avoid expensive layout reflows.
  // scaleX utilizes GPU-accelerated transforms for smoother animation.
  return (
    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden mt-6 relative">
      <motion.div
        className={`h-full w-full origin-left ${color}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: progress / 100 }}
        transition={{ duration: 0.5, ease: "linear" }}
      />
    </div>
  );
}
