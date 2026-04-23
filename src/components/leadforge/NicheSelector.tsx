import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  customLabel?: string;
}

export function NicheSelector({ value, onChange, options, customLabel = "Custom" }: Props) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const isCustom = !options.includes(value);
  const displayValue = value || "Select a niche…";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 h-12 px-4 rounded-lg border bg-white/[0.025] text-sm transition-colors ${
          open ? "border-cyan-brand/50 bg-white/[0.04]" : "border-white/[0.07] hover:border-white/15"
        }`}
      >
        <span className={value ? "text-foreground" : "text-[hsl(var(--text-muted))]"}>{displayValue}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[hsl(var(--text-secondary))]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 6, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute z-50 left-0 right-0 top-full mt-1 glass-strong rounded-lg p-1.5 max-h-72 overflow-auto scrollbar-thin"
          >
            {options.map((opt, i) => {
              const selected = value === opt;
              return (
                <motion.button
                  key={opt}
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025 }}
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 h-10 rounded-md text-sm text-left transition-colors ${
                    selected ? "bg-cyan-brand/10 text-cyan-brand" : "hover:bg-white/[0.05]"
                  }`}
                >
                  <span>{opt}</span>
                  {selected && (
                    <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                      <Check size={14} />
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
            <div className="px-2 py-2 border-t border-white/[0.05] mt-1">
              <label className="text-[10px] uppercase tracking-wider text-[hsl(var(--text-muted))] font-mono">{customLabel}</label>
              <div className="flex gap-1.5 mt-1.5">
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder="e.g. Crypto Exchanges"
                  className="flex-1 h-9 px-3 rounded-md bg-white/[0.03] border border-white/[0.08] text-sm focus:outline-none focus:border-cyan-brand/50"
                />
                <button
                  type="button"
                  disabled={!custom.trim()}
                  onClick={() => { onChange(custom.trim()); setOpen(false); setCustom(""); }}
                  className="px-3 h-9 rounded-md bg-cyan-brand text-black text-xs font-semibold disabled:opacity-30"
                >Use</button>
              </div>
              {isCustom && value && (
                <div className="mt-2 text-[11px] text-cyan-brand font-mono">Active: {value}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
