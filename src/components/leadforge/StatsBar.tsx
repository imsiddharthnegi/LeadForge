import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

export function CountUp({ value, duration = 1.2, decimals = 0 }: { value: number; duration?: number; decimals?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{decimals ? n.toFixed(decimals) : Math.round(n)}</>;
}

interface Props {
  total: number;
  avg: number;
  high: number;
  hot: number;
  onExport: () => void;
  onCopyHooks: () => void;
}

export function StatsBar({ total, avg, high, hot, onExport, onCopyHooks }: Props) {
  const stats = [
    { label: "Total Leads", value: total, color: "hsl(var(--text-primary))" },
    { label: "Avg Quality", value: avg, decimals: 1, color: "hsl(var(--accent-cyan))" },
    { label: "High (75+)", value: high, color: "hsl(var(--accent-green))" },
    { label: "Hot (90+)", value: hot, color: "hsl(var(--accent-amber))" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.07, type: "spring", stiffness: 280, damping: 22 }}
            className="glass rounded-xl px-4 py-3"
          >
            <div className="text-[10px] uppercase tracking-wider text-[hsl(var(--text-muted))] font-mono">{s.label}</div>
            <div className="font-display text-2xl font-semibold mt-1" style={{ color: s.color }}>
              <CountUp value={s.value} decimals={s.decimals} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.32, type: "spring", stiffness: 280, damping: 22 }}
          onClick={onExport}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-gradient-to-r from-[hsl(var(--accent-cyan))] to-[hsl(var(--accent-cyan))] text-black font-semibold text-sm transition-all active:scale-95"
          style={{ boxShadow: "0 10px 32px -8px hsl(var(--accent-cyan) / 0.4)" }}
        >
          <Download size={16} /> Export CSV
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.38, type: "spring", stiffness: 280, damping: 22 }}
          onClick={onCopyHooks}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-white/[0.05] hover:bg-white/10 border border-white/[0.1] text-foreground font-semibold text-sm transition-all active:scale-95"
        >
          <Copy size={16} /> Copy All Hooks
        </motion.button>
      </div>
    </div>
  );
}
