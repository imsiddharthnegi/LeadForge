import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const STATUS_MESSAGES = [
  "Analyzing niche...",
  "Finding companies...",
  "Enriching profiles...",
  "Scoring leads..."
];

export function ProgressIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-6 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="text-xs font-mono text-cyan-brand tracking-wide"
        >
          {STATUS_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
