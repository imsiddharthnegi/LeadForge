import { Grid3x3 } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative w-full min-h-[600px] flex flex-col items-center justify-center"
    >
      {/* Pulsing ring background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <motion.div
          className="w-32 h-32 rounded-full border border-cyan-brand/30"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6 relative z-10"
      >
        <Grid3x3 size={48} className="text-cyan-brand/80" strokeWidth={1.5} />
      </motion.div>

      {/* Heading */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-xl font-semibold text-foreground"
      >
        Ready to generate leads
      </motion.h3>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-2 text-sm text-[hsl(var(--text-secondary))]"
      >
        Enter a niche and location above, then click Generate
      </motion.p>
    </motion.div>
  );
}
