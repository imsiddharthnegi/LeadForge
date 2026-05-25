import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GenerationTerminalProps {
  niche: string;
  location: string;
  count: number;
  onComplete: () => void;
}

export function GenerationTerminal({ niche, location, count, onComplete }: GenerationTerminalProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  // Build terminal lines dynamically based on input
  const TERMINAL_LINES = [
    `Scanning ${niche}${location ? ` in ${location}` : ""}...`,
    "Identifying decision makers...",
    "Enriching contact data...",
    "Scoring lead quality...",
    "Generating personalized outreach hooks...",
    `Done. ${count} leads ready.`,
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < TERMINAL_LINES.length) {
        setDisplayedLines((prev) => [...prev, TERMINAL_LINES[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 200); // 200ms intervals as specified

    return () => clearInterval(interval);
  }, [TERMINAL_LINES, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="rounded-card p-5 bg-black/60 border border-cyan-500/20 font-mono text-sm min-h-[220px] flex flex-col justify-start overflow-hidden"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {displayedLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
          className="py-1.5 flex items-start gap-2"
        >
          <span className="text-cyan-500/60 flex-shrink-0">›</span>
          <span className="text-cyan-500 break-words">{line}</span>
        </motion.div>
      ))}
      {displayedLines.length < TERMINAL_LINES.length && (
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="py-1.5 flex items-center gap-2"
        >
          <span className="text-cyan-500/40">›</span>
          <span className="text-cyan-500/50 italic">Processing...</span>
        </motion.div>
      )}
    </motion.div>
  );
}
