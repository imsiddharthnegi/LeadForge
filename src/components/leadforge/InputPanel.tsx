import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
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
  animationPhase?: "idle" | "phase1" | "phase2" | "phase3";
}

const PAIN_MAX = 280;

export function InputPanel({ state, setState, onGenerate, loading, animationPhase = "idle" }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (animationPhase === "phase1") {
      setIsPulsing(true);
    } else {
      setIsPulsing(false);
    }
  }, [animationPhase]);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative glass-card rounded-card p-4 md:p-6 lg:p-8"
    >
      <div className="space-y-6">
        {/* Niche + Location Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Niche */}
          <div>
            <label className="block text-xs font-semibold text-[hsl(var(--text-secondary))] mb-2 uppercase tracking-wider">Niche</label>
            <NicheSelector value={state.niche} onChange={(v) => update("niche", v)} options={NICHES} />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[hsl(var(--text-secondary))] mb-2 uppercase tracking-wider">Location (optional)</label>
            <input
              value={state.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="e.g. United States"
              className="w-full h-11 px-3.5 rounded-input bg-white/[0.025] border border-white/[0.07] text-sm focus:outline-none focus:border-cyan-brand/50 focus:ring-2 focus:ring-cyan-brand/10 transition-all placeholder:text-[hsl(var(--text-muted))]"
            />
          </div>
        </div>

        {/* Pain Point */}
        <div>
          <label className="block text-xs font-semibold text-[hsl(var(--text-secondary))] mb-2 uppercase tracking-wider">Pain Point (optional)</label>
          <textarea
            value={state.painPoint}
            onChange={(e) => update("painPoint", e.target.value.slice(0, PAIN_MAX))}
            placeholder="Describe the problem your leads might have..."
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-input bg-white/[0.025] border border-white/[0.07] text-sm focus:outline-none focus:border-cyan-brand/50 focus:ring-2 focus:ring-cyan-brand/10 resize-none transition-all placeholder:text-[hsl(var(--text-muted))]"
          />
        </div>

        {/* Lead Count */}
        <div>
          <label className="block text-xs font-semibold text-[hsl(var(--text-secondary))] mb-3 uppercase tracking-wider">Number of Leads</label>
          <div className="flex items-center justify-center py-3">
            <RadialDial value={state.count} min={3} max={15} onChange={(v) => update("count", v)} />
          </div>
        </div>

        {/* Quality Filter */}
        <div>
          <label className="block text-xs font-semibold text-[hsl(var(--text-secondary))] mb-2 uppercase tracking-wider">Quality Filter</label>
          <div className="flex gap-2 p-1 rounded-input bg-white/[0.02] border border-white/[0.06]">
            {[
              { id: "all", label: "All" },
              { id: "high", label: "High (75+)" },
              { id: "hot", label: "Hot (90+)" },
            ].map(({ id, label }) => {
              const active = state.filter === (id as any);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => update("filter", id as any)}
                  className={`flex-1 h-9 rounded-badge text-xs font-medium transition-all ${
                    active
                      ? "bg-cyan-brand text-black"
                      : "text-[hsl(var(--text-secondary))] hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Enrichment Toggles */}
        <div>
          <label className="block text-xs font-semibold text-[hsl(var(--text-secondary))] mb-3 uppercase tracking-wider">Enrichment</label>
          <div className="space-y-2">
            {[
              { k: "linkedin" as const, label: "LinkedIn Profiles" },
              { k: "tech" as const, label: "Tech Stack" },
              { k: "funding" as const, label: "Funding Stage" },
            ].map(({ k, label }) => {
              const v = state.enrich[k];
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => update("enrich", { ...state.enrich, [k]: !v })}
                  className="w-full flex items-center justify-between px-3.5 h-10 rounded-input bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors"
                >
                  <span className="text-sm text-[hsl(var(--text-secondary))]">{label}</span>
                  <span className={`relative w-10 h-5 rounded-full transition-colors ${v ? "bg-cyan-brand" : "bg-white/10"}`}>
                    <motion.span
                      animate={{ x: v ? 18 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          ref={buttonRef}
          type="button"
          disabled={loading || !state.niche}
          onClick={onGenerate}
          whileTap={{ scale: 0.96 }}
          animate={isPulsing ? { scale: [1, 1.08, 1] } : {}}
          transition={isPulsing ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : {}}
          className="relative w-full h-12 rounded-input font-semibold text-base text-black overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-cyan-brand hover:bg-cyan-brand/90"
        >
          <div className="flex items-center justify-center gap-2">
            <Zap size={16} strokeWidth={2} />
            <span>{loading ? "Generating..." : "Generate Leads"}</span>
          </div>
        </motion.button>

        {/* Powered by text */}
        <p className="text-center text-[10px] font-mono text-[hsl(var(--text-muted))] tracking-wide">
          Powered by Groq · llama-3.3-70b-versatile
        </p>
      </div>
    </motion.div>
  );
}
