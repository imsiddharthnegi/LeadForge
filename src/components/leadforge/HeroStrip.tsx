import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, KeyRound } from "lucide-react";

const phrases = [
  "Discover enterprise clients.",
  "Score leads with AI precision.",
  "Close faster. Waste less time.",
];

function useTypewriter(words: string[], speed = 55, pause = 1600) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"type" | "hold" | "del">("type");

  useEffect(() => {
    const word = words[i % words.length];
    let t: number | undefined;
    if (phase === "type") {
      if (text.length < word.length) {
        t = window.setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
      } else {
        t = window.setTimeout(() => setPhase("hold"), pause);
      }
    } else if (phase === "hold") {
      t = window.setTimeout(() => setPhase("del"), pause);
    } else {
      if (text.length > 0) {
        t = window.setTimeout(() => setText(text.slice(0, -1)), speed / 2);
      } else {
        setPhase("type");
        setI((v) => v + 1);
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, i, words, speed, pause]);

  return text;
}

interface Props { onOpenKey: () => void }

export function HeroStrip({ onOpenKey }: Props) {
  const t = useTypewriter(phrases);
  const heroWords = "AI-powered B2B lead intelligence, in seconds.".split(" ");

  return (
    <header className="relative z-10 px-6 lg:px-10 pt-6 pb-2">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="font-display text-3xl md:text-4xl font-bold tracking-tight hero-extrude"
        >
          <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            LeadForge
          </span>
        </motion.h1>

        {/* Status chip */}
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass text-xs font-mono"
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-green-brand pulse-dot" />
            <span className="relative w-2 h-2 rounded-full bg-green-brand" />
          </span>
          <span className="text-[hsl(var(--text-secondary))]">AI Engine Online</span>
          <span className="text-white/30">·</span>
          <span className="text-cyan-brand">1,500 free / day</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={onOpenKey}
            className="group flex items-center gap-1.5 px-3.5 h-9 rounded-lg text-xs font-medium text-[hsl(var(--text-secondary))] hover:text-foreground border border-white/[0.07] hover:border-white/15 transition-all bg-white/[0.02]"
          >
            <KeyRound size={13} /> API Key
          </button>
          <button className="group relative flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold bg-gradient-brand text-black overflow-hidden">
            <span className="relative z-10">Deploy</span>
            <ArrowUpRight size={13} className="relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-colors" />
          </button>
        </motion.div>
      </div>

      {/* Subline */}
      <div className="mt-7 flex flex-col gap-2 max-w-3xl">
        <h2 className="font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight">
          {heroWords.map((w, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.06, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-block mr-2"
            >
              {idx === heroWords.length - 1 ? <span className="text-gradient-brand">{w}</span> : w}
            </motion.span>
          ))}
        </h2>

        <div className="font-mono text-sm md:text-base text-[hsl(var(--text-secondary))] mt-2 h-6">
          <span className="text-cyan-brand mr-2">{`>`}</span>
          <span>{t}</span>
          <span className="inline-block w-2 h-4 align-middle ml-0.5 bg-cyan-brand blink" />
        </div>
      </div>
    </header>
  );
}
