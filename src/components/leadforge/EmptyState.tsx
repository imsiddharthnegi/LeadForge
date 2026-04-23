import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="relative glass rounded-2xl min-h-[480px] flex flex-col items-center justify-center p-10 text-center overflow-hidden"
    >
      <div className="ambient-glow-violet" />
      <div className="relative z-10">
        {/* Isometric building */}
        <svg width="180" height="180" viewBox="0 0 200 200" className="mb-6 mx-auto">
          <defs>
            <linearGradient id="bldg-front" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(220 30% 14%)" />
              <stop offset="100%" stopColor="hsl(220 50% 6%)" />
            </linearGradient>
            <linearGradient id="bldg-side" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(220 30% 10%)" />
              <stop offset="100%" stopColor="hsl(220 50% 4%)" />
            </linearGradient>
          </defs>
          {/* shadow */}
          <ellipse cx="100" cy="180" rx="70" ry="8" fill="hsl(var(--accent-cyan))" opacity="0.1" />
          {/* front face */}
          <polygon points="60,70 100,90 100,170 60,150" fill="url(#bldg-front)" stroke="hsl(0 0% 100% / 0.08)" />
          {/* side face */}
          <polygon points="100,90 140,70 140,150 100,170" fill="url(#bldg-side)" stroke="hsl(0 0% 100% / 0.08)" />
          {/* top */}
          <polygon points="60,70 100,50 140,70 100,90" fill="hsl(220 30% 18%)" stroke="hsl(0 0% 100% / 0.1)" />
          {/* windows front */}
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => {
              const delay = (row + col) * 0.4;
              return (
                <motion.rect
                  key={`f-${row}-${col}`}
                  x={68 + col * 14} y={92 + row * 22} width="8" height="10"
                  fill="hsl(var(--accent-cyan))"
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: [0.15, 0.9, 0.15] }}
                  transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })
          )}
          {/* windows side */}
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => {
              const delay = (row + col) * 0.5 + 0.3;
              return (
                <motion.rect
                  key={`s-${row}-${col}`}
                  x={106 + col * 14} y={94 + row * 22} width="8" height="10"
                  fill="hsl(var(--accent-violet))"
                  initial={{ opacity: 0.15 }}
                  animate={{ opacity: [0.15, 0.85, 0.15] }}
                  transition={{ duration: 3.5, delay, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })
          )}
        </svg>

        <h3 className="font-display text-xl font-semibold">Your leads will appear here</h3>
        <p className="mt-2 text-sm text-[hsl(var(--text-secondary))] max-w-xs mx-auto">
          Set your target parameters on the left and let the intelligence engine surface buyers ready to talk.
        </p>

        <div className="mt-6 flex items-center gap-2 justify-center text-[11px] font-mono text-[hsl(var(--text-muted))]">
          <Building2 size={12} />
          <span>Awaiting input</span>
          <span className="inline-block w-1.5 h-3 bg-cyan-brand/60 blink ml-1" />
        </div>
      </div>
    </motion.div>
  );
}
