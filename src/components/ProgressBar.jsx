
import { motion } from 'framer-motion';

export default function ProgressBar({ progress, color }) {
  // ⚡ Bolt Optimization: Use GPU-accelerated scaleX instead of width
  // Animating width causes expensive layout reflows on every frame.
  // Using transform: scaleX with transform-origin: left is much more performant.
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
