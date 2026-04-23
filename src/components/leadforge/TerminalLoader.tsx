import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props { niche: string; }

const TEMPLATE = (niche: string) => [
  "⬡ Initializing AI intelligence layer...",
  `⬡ Scanning niche database: ${niche || "GENERAL"}...`,
  "⬡ Profiling decision makers...",
  "⬡ Running quality scoring algorithm...",
  "⬡ Enriching contact data...",
  "⬡ Generating personalized outreach hooks...",
  "✓ Intelligence report ready.",
];

const ASCII = `
 _      ____    _    ____  _____ ___  ____   ____ _____
| |    | ___|  / \\  |  _ \\|  ___/ _ \\|  _ \\ / ___| ____|
| |    |___ \\ / _ \\ | | | | |_ | | | | |_) | |  _|  _|
| |___  ___) / ___ \\| |_| |  _|| |_| |  _ <| |_| | |___
|_____|____/_/   \\_\\____/|_|   \\___/|_| \\_\\\\____|_____|
`.trim();

export function TerminalLoader({ niche }: Props) {
  const lines = TEMPLATE(niche);
  const [shown, setShown] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [eta, setEta] = useState(8);
  const idxRef = useRef(0);
  const charRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const i = idxRef.current;
      if (i >= lines.length) return;
      const target = lines[i];
      const c = charRef.current;
      if (c < target.length) {
        charRef.current = c + 2;
        setCurrent(target.slice(0, charRef.current));
      } else {
        setShown((prev) => [...prev, target]);
        idxRef.current = i + 1;
        charRef.current = 0;
        setCurrent("");
      }
    }, 35);
    return () => clearInterval(interval);
  }, [lines]);

  useEffect(() => {
    const t = setInterval(() => setEta((v) => (v > 1 ? v - 1 : v)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative w-full"
    >
      <div className="ambient-glow-violet" />
      <div className="relative scanlines glass-strong rounded-2xl overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-5 h-10 border-b border-white/[0.06] bg-black/30">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-brand/80" />
            <span className="w-3 h-3 rounded-full bg-amber-brand/80" />
            <span className="w-3 h-3 rounded-full bg-green-brand/80" />
          </div>
          <span className="font-mono text-[10px] text-[hsl(var(--text-muted))] tracking-wider">leadforge://intel-engine</span>
          <span className="font-mono text-[10px] text-cyan-brand">~{eta}s</span>
        </div>

        <div className="p-6 lg:p-8 font-mono text-[12px] leading-relaxed min-h-[420px]">
          <pre className="text-cyan-brand/80 text-[8px] sm:text-[9px] mb-5 leading-tight">{ASCII}</pre>

          <div className="space-y-1.5">
            {shown.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className={line.startsWith("✓") ? "text-green-brand" : "text-[hsl(var(--text-secondary))]"}
              >
                <span className="text-cyan-brand/60 mr-2">$</span>{line}
              </motion.div>
            ))}
            {current && (
              <div className="text-[hsl(var(--text-secondary))]">
                <span className="text-cyan-brand/60 mr-2">$</span>{current}
                <span className="inline-block w-2 h-3 bg-cyan-brand align-middle ml-0.5 blink" />
              </div>
            )}
          </div>

          {/* Progress arc */}
          <div className="mt-8 flex items-center justify-center">
            <svg width={60} height={60} viewBox="0 0 60 60" className="animate-spin" style={{ animationDuration: "1.6s" }}>
              <circle cx={30} cy={30} r={25} stroke="hsl(0 0% 100% / 0.06)" strokeWidth={3} fill="none" />
              <circle
                cx={30} cy={30} r={25}
                stroke="hsl(var(--accent-cyan))" strokeWidth={3} fill="none"
                strokeLinecap="round" strokeDasharray="40 200"
                style={{ filter: "drop-shadow(0 0 4px hsl(var(--accent-cyan)))" }}
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
