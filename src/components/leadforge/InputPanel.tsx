import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { NicheSelector } from "./NicheSelector";
import { RadialDial } from "./RadialDial";

const NICHES = [
  "SaaS Startups",
  "Digital Marketing Agencies",
  "E-commerce Stores",
  "Restaurants",
  "Real Estate",
  "Fitness Studios",
  "Healthcare",
  "Legal Firms",
];

export type QualityFilter = "all" | "high" | "hot";

export interface InputState {
  niche: string;
  location: string;
  painPoint: string;
  count: number;
  filter: QualityFilter;
  enrich: { linkedin: boolean; tech: boolean; funding: boolean };
}

interface Props {
  state: InputState;
  setState: (s: InputState) => void;
  onGenerate: () => void;
  loading: boolean;
}

const PAIN_MAX = 280;

export function InputPanel({ state, setState, onGenerate, loading }: Props) {
  const [locFocus, setLocFocus] = useState(false);
  const [btnTilt, setBtnTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && state.niche && !loading) {
        e.preventDefault();
        onGenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.niche, loading, onGenerate]);

  const update = <K extends keyof InputState>(k: K, v: InputState[K]) =>
    setState({ ...state, [k]: v });

  const painLen = state.painPoint.length;
  const painNear = painLen > PAIN_MAX * 0.85;

  const FilterPill = ({ id, label }: { id: QualityFilter; label: string }) => {
    const active = state.filter === id;
    return (
      <button
        type="button"
        onClick={() => update("filter", id)}
        className={`relative flex-1 h-9 px-3 rounded-md text-xs font-medium transition-colors ${
          active ? "text-black" : "text-[hsl(var(--text-secondary))] hover:text-foreground"
        }`}
      >
        {active && (
          <motion.span
            layoutId="filter-bg"
            className="absolute inset-0 rounded-md bg-cyan-brand"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <span className="relative z-10">{label}</span>
      </button>
    );
  };

  const Toggle = ({ k, label }: { k: keyof InputState["enrich"]; label: string }) => {
    const v = state.enrich[k];
    return (
      <button
        type="button"
        onClick={() => update("enrich", { ...state.enrich, [k]: !v })}
        className="flex items-center justify-between w-full px-3 h-10 rounded-md bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
      >
        <span className="text-xs text-[hsl(var(--text-secondary))]">{label}</span>
        <span
          className={`relative w-9 h-5 rounded-full transition-colors ${v ? "bg-cyan-brand" : "bg-white/10"}`}
        >
          <motion.span
            animate={{ x: v ? 16 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
          />
        </span>
      </button>
    );
  };

  const handleBtnMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setBtnTilt({
      x: ((e.clientX - r.left - r.width / 2) / r.width) * 8,
      y: ((e.clientY - r.top - r.height / 2) / r.height) * 4,
    });
  };

  return (
    <div className="relative">
      <div className="ambient-glow-cyan" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 glass rounded-2xl p-6 lg:p-7"
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-brand uppercase">
            Target Parameters
          </span>
          <span className="font-mono text-[10px] text-[hsl(var(--text-muted))]">v2.4.1</span>
        </div>

        <div className="space-y-5">
          {/* Niche */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-1.5">Niche</label>
            <NicheSelector value={state.niche} onChange={(v) => update("niche", v)} options={NICHES} />
          </div>

          {/* Location */}
          <div className="relative">
            <label
              className={`pointer-events-none absolute left-9 transition-all duration-200 origin-left ${
                locFocus || state.location ? "top-0 scale-75 text-cyan-brand" : "top-3.5 text-[hsl(var(--text-muted))]"
              } text-xs`}
            >
              Location (optional)
            </label>
            <div className="flex items-center gap-2 border-b border-white/10 focus-within:border-cyan-brand/60 transition-colors pl-1">
              <Globe size={16} className="text-[hsl(var(--text-secondary))]" />
              <input
                value={state.location}
                onChange={(e) => update("location", e.target.value)}
                onFocus={() => setLocFocus(true)}
                onBlur={() => setLocFocus(false)}
                className="w-full h-12 bg-transparent text-sm focus:outline-none pt-2"
              />
            </div>
          </div>

          {/* Pain point */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))]">Pain Point</label>
              <span className={`text-[10px] font-mono ${painNear ? "text-red-brand" : "text-[hsl(var(--text-muted))]"}`}
                    style={painNear ? { textShadow: "0 0 8px hsl(var(--accent-red))" } : undefined}>
                {painLen}/{PAIN_MAX}
              </span>
            </div>
            <textarea
              value={state.painPoint}
              onChange={(e) => update("painPoint", e.target.value.slice(0, PAIN_MAX))}
              placeholder="e.g. struggling to convert free-trial users into paid customers"
              rows={Math.max(2, Math.min(5, Math.ceil(state.painPoint.length / 60) + 1))}
              className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.025] border border-white/[0.07] text-sm focus:outline-none focus:border-cyan-brand/50 resize-none transition-all placeholder:text-[hsl(var(--text-muted))]"
            />
          </div>

          {/* Lead count dial */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-2">Lead Count</label>
            <div className="flex items-center justify-center py-2">
              <RadialDial value={state.count} min={3} max={15} onChange={(v) => update("count", v)} />
            </div>
          </div>

          {/* Quality filter */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-1.5">Quality Filter</label>
            <div className="flex gap-1 p-1 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <FilterPill id="all" label="All" />
              <FilterPill id="high" label="High Only (75+)" />
              <FilterPill id="hot" label="Hot Only (90+)" />
            </div>
          </div>

          {/* Enrichment */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-1.5">Enrichment</label>
            <div className="space-y-1.5">
              <Toggle k="linkedin" label="Include LinkedIn" />
              <Toggle k="tech" label="Include Tech Stack" />
              <Toggle k="funding" label="Include Funding Stage" />
            </div>
          </div>

          {/* Generate */}
          <motion.button
            type="button"
            disabled={loading || !state.niche}
            onClick={onGenerate}
            onMouseMove={handleBtnMove}
            onMouseLeave={() => setBtnTilt({ x: 0, y: 0 })}
            whileTap={{ scale: 0.96 }}
            animate={{ x: btnTilt.x, y: btnTilt.y }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative w-full h-14 rounded-full font-display font-semibold text-base text-black overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{
              background: "linear-gradient(135deg, hsl(var(--accent-cyan)), hsl(var(--accent-violet)))",
              boxShadow: "0 10px 40px -10px hsl(var(--accent-cyan) / 0.6), inset 0 1px 0 hsl(0 0% 100% / 0.3)",
            }}
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "radial-gradient(circle at 50% 50%, hsl(0 0% 100% / 0.25), transparent 70%)" }}
            />
            <span className="relative tracking-tight">
              {loading ? "Generating Intelligence…" : "Generate Intelligence Report"}
            </span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
