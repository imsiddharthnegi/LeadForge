import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const PROGRESS_MESSAGES = [
  "Analyzing niche...",
  "Finding companies...",
  "Enriching profiles...",
  "Scoring leads..."
];

export function ProgressIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 space-y-3">
      {/* Progress bar */}
      <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-brand to-violet-brand"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated message */}
      <motion.div
        key={messageIndex}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.4 }}
        className="text-center text-xs font-mono text-cyan-brand"
      >
        {PROGRESS_MESSAGES[messageIndex]}
      </motion.div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5">
        {PROGRESS_MESSAGES.map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/20"
            animate={{
              backgroundColor: i === messageIndex ? "hsl(var(--accent-cyan))" : "hsl(0 0% 100% / 0.2)",
              scale: i === messageIndex ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
