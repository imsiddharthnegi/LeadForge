import { Grid3x3 } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative w-full min-h-[400px] flex flex-col items-center justify-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-6"
      >
        <Grid3x3 size={48} className="text-[hsl(var(--text-muted))]" strokeWidth={1} />
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
