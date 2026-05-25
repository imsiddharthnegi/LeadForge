import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroStrip } from "@/components/leadforge/HeroStrip";
import { InputPanel, type InputState } from "@/components/leadforge/InputPanel";
import { EmptyState } from "@/components/leadforge/EmptyState";
import { LeadCard } from "@/components/leadforge/LeadCard";
import { LeadCardSkeleton } from "@/components/leadforge/LeadCardSkeleton";
import { ProgressIndicator } from "@/components/leadforge/ProgressIndicator";
import { StatsBar } from "@/components/leadforge/StatsBar";
import { HowItWorks } from "@/components/leadforge/HowItWorks";
import { Footer } from "@/components/leadforge/Footer";
import { GenerationTerminal } from "@/components/leadforge/GenerationTerminal";
import { CountUpScore } from "@/components/leadforge/CountUpScore";
import { generateLeads, type Lead } from "@/lib/gemini";
import { Search, Download, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const SAVED_KEY = "leadforge_saved_ids";

const Index = () => {
  const [input, setInput] = useState<InputState>({
    niche: "SaaS Startups",
    location: "",
    painPoint: "",
    count: 8,
    filter: "all",
    enrich: { linkedin: true, tech: true, funding: true },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"score-desc" | "score-asc" | "name">("score-desc");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); } catch { return new Set(); }
  });
  const [generationPhase, setGenerationPhase] = useState<"idle" | "phase1" | "phase2" | "phase3">("idle");
  const [generateButtonRef, setGenerateButtonRef] = useState<HTMLButtonElement | null>(null);

  const persistSaved = (s: Set<string>) => {
    setSavedIds(new Set(s));
    localStorage.setItem(SAVED_KEY, JSON.stringify([...s]));
  };

  const toggleSave = (id: string) => {
    const next = new Set(savedIds);
    if (next.has(id)) { next.delete(id); toast("Removed from saved"); }
    else { next.add(id); toast.success("Saved to your library"); }
    persistSaved(next);
  };

  const handleGenerate = async () => {
    if (!input.niche) { toast.error("Pick a niche first"); return; }
    
    // Phase 1: Button pulse and orb glow
    setGenerationPhase("phase1");
    setLoading(true);
    setError(null);
    setLeads([]);
    
    // Phase 2: Terminal feed
    setTimeout(() => setGenerationPhase("phase2"), 300);
    
    try {
      const result = await generateLeads({
        niche: input.niche, location: input.location, painPoint: input.painPoint,
        count: input.count, enrich: input.enrich,
      });
      setLeads(result);
      
      // Phase 3: Lead cards staggered reveal (triggered after terminal completes)
      // This is handled in the render logic via generationPhase
    } catch (e: any) {
      const msg = e?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Show toast notification when phase3 completes and leads exist
  useEffect(() => {
    if (generationPhase === "phase3" && leads.length > 0) {
      setTimeout(() => {
        toast.success(`${leads.length} leads generated`);
      }, leads.length * 100 + 500); // Delay until after cards finish animating in
    }
  }, [generationPhase, leads.length]);

  const filteredLeads = useMemo(() => {
    let out = leads.slice();
    if (input.filter === "high") out = out.filter((l) => l.quality_score >= 75);
    if (input.filter === "hot") out = out.filter((l) => l.quality_score >= 90);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((l) =>
        l.company_name?.toLowerCase().includes(q) ||
        l.contact_person?.toLowerCase().includes(q) ||
        l.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "score-desc") out.sort((a, b) => b.quality_score - a.quality_score);
    if (sort === "score-asc") out.sort((a, b) => a.quality_score - b.quality_score);
    if (sort === "name") out.sort((a, b) => a.company_name.localeCompare(b.company_name));
    return out;
  }, [leads, input.filter, search, sort]);

  const stats = useMemo(() => {
    const total = leads.length;
    const avg = total ? leads.reduce((s, l) => s + (l.quality_score || 0), 0) / total : 0;
    return {
      total, avg,
      high: leads.filter((l) => l.quality_score >= 75).length,
      hot: leads.filter((l) => l.quality_score >= 90).length,
    };
  }, [leads]);

  const exportCsv = () => {
    if (!leads.length) return;
    const headers = [
      "company_name","contact_person","job_title","email","phone","website",
      "company_size","annual_revenue","funding_stage","tech_stack","linkedin_url",
      "quality_score","intent_signals","tags","pain_point","outreach_hook","best_contact_time"
    ];
    const esc = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = leads.map((l) =>
      headers.map((h) => {
        const v = (l as any)[h];
        if (Array.isArray(v)) return esc(v.join("; "));
        return esc(v);
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `leadforge-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${leads.length} leads to CSV`);
  };

  const copyAllHooks = () => {
    if (!leads.length) return;
    const hooks = leads
      .map((l, i) => `${i + 1}. "${l.outreach_hook}"`)
      .join("\n\n");
    navigator.clipboard.writeText(hooks);
    toast.success(`Copied ${leads.length} hooks to clipboard`);
  };

  return (
    <>
      <HeroStrip />
      <main className="px-4 sm:px-6 lg:px-10 pb-20 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 lg:gap-7">
          <div className="md:block">
            <InputPanel state={input} setState={setInput} onGenerate={handleGenerate} loading={loading} animationPhase={generationPhase} />
          </div>
          <div className="relative min-h-[480px]">
            <AnimatePresence mode="wait">
              {loading && generationPhase !== "phase3" ? (
                <motion.div key="loader" exit={{ opacity: 0 }} className="space-y-5">
                  {generationPhase === "phase2" && (
                    <GenerationTerminal onComplete={() => setGenerationPhase("phase3")} />
                  )}
                  {generationPhase === "phase1" && (
                    <div className="space-y-4">
                      {Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <LeadCardSkeleton key={i} index={i} />
                        ))}
                    </div>
                  )}
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  className="relative rounded-2xl p-10 min-h-[400px] flex flex-col items-center justify-center text-center overflow-hidden glass-card"
                  style={{
                    border: "1px solid hsl(var(--accent-red) / 0.35)",
                    boxShadow: "0 0 0 1px hsl(var(--accent-red) / 0.15), 0 20px 60px -20px hsl(var(--accent-red) / 0.45), inset 0 1px 0 0 hsl(0 0% 100% / 0.05)",
                  }}
                >
                  <motion.div
                    aria-hidden
                    className="absolute -inset-20 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at 50% 50%, hsl(var(--accent-red) / 0.18), transparent 60%)",
                      filter: "blur(40px)",
                    }}
                    animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="relative w-14 h-14 rounded-2xl grid place-items-center mb-5"
                    style={{
                      background: "hsl(var(--accent-red) / 0.12)",
                      border: "1px solid hsl(var(--accent-red) / 0.4)",
                      boxShadow: "0 0 30px -5px hsl(var(--accent-red) / 0.5)",
                    }}
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AlertCircle size={22} style={{ color: "hsl(var(--accent-red))" }} />
                  </motion.div>
                  <h3 className="relative font-display text-xl font-semibold tracking-tight">Something didn't quite work</h3>
                  <p className="relative mt-2 text-sm text-[hsl(var(--text-secondary))] max-w-sm leading-relaxed">{error}</p>
                  <motion.button
                    onClick={handleGenerate}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative mt-6 inline-flex items-center gap-2 px-5 h-11 rounded-full text-sm font-semibold overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--accent-cyan)), hsl(var(--accent-violet)))",
                      color: "hsl(var(--bg-void))",
                      boxShadow: "0 10px 30px -8px hsl(var(--accent-cyan) / 0.5)",
                    }}
                  >
                    <motion.span
                      className="relative inline-flex"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw size={15} />
                    </motion.span>
                    <span className="relative">Regenerate</span>
                  </motion.button>
                </motion.div>
              ) : leads.length === 0 ? (
                <motion.div key="empty"><EmptyState /></motion.div>
              ) : generationPhase === "phase3" || !loading ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <StatsBar total={stats.total} avg={stats.avg} high={stats.high} hot={stats.hot} onExport={exportCsv} onCopyHooks={copyAllHooks} />
                  <div className="glass-card rounded-xl p-3 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 px-3 h-9 rounded-md bg-white/[0.025] border border-white/[0.06] flex-1 min-w-[180px]">
                      <Search size={14} className="text-[hsl(var(--text-secondary))]" />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search company or contact…"
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                      />
                    </div>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as any)}
                      className="h-9 px-3 rounded-md bg-white/[0.025] border border-white/[0.06] text-xs font-mono focus:outline-none focus:border-cyan-brand/50"
                    >
                      <option value="score-desc">Score ↓</option>
                      <option value="score-asc">Score ↑</option>
                      <option value="name">Name A–Z</option>
                    </select>
                    <span className="text-[10px] font-mono text-[hsl(var(--text-muted))] ml-auto">
                      {filteredLeads.length} of {leads.length}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {filteredLeads.map((l, i) => (
                      <motion.div
                        key={l._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: generationPhase === "phase3" ? i * 0.1 : 0,
                          duration: 0.6,
                          ease: [0.2, 0.8, 0.2, 1],
                        }}
                      >
                        <LeadCard
                          lead={l}
                          index={i}
                          saved={savedIds.has(l._id!)}
                          onToggleSave={() => toggleSave(l._id!)}
                          animateScore={generationPhase === "phase3"}
                        />
                      </motion.div>
                    ))}
                    {filteredLeads.length === 0 && (
                      <div className="glass-card rounded-xl p-8 text-center text-sm text-[hsl(var(--text-secondary))]">
                        No leads match your filters.
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[hsl(var(--text-muted))] mt-6 text-center px-2">
                    AI-generated sample data for demonstration purposes. Verify details before outreach.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>
      {leads.length === 0 && <HowItWorks />}
      <Footer />
    </>
  );
};

export default Index;
