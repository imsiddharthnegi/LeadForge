import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TERMINAL_LINES = [
  "Scanning niche...",
  "Identifying decision makers...",
  "Enriching contact data...",
  "Scoring lead quality...",
  "Generating outreach hooks...",
];

interface GenerationTerminalProps {
  onComplete: () => void;
}

export function GenerationTerminal({ onComplete }: GenerationTerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < TERMINAL_LINES.length) {
        setDisplayedLines((prev) => [...prev, TERMINAL_LINES[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-card p-4 bg-black/40 border border-cyan-brand/20 font-mono text-xs min-h-[180px] flex flex-col justify-start"
    >
      {displayedLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="text-cyan-brand/80 py-1 flex items-center"
        >
          <span className="text-cyan-brand/50 mr-2">→</span>
          <span>{line}</span>
        </motion.div>
      ))}
      {displayedLines.length < TERMINAL_LINES.length && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-cyan-brand/40 py-1 flex items-center"
        >
          <span className="text-cyan-brand/30 mr-2">▊</span>
          <span>Processing...</span>
        </motion.div>
      )}
    </motion.div>
  );
}
