import { motion } from "framer-motion";
import { useState } from "react";
import type { Lead } from "@/lib/gemini";
import { Mail, Phone, ExternalLink, Copy, Heart, Quote, Linkedin } from "lucide-react";
import { toast } from "sonner";

function gradientFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const h1 = h % 360;
  const h2 = (h1 + 60) % 360;
  return `linear-gradient(135deg, hsl(${h1} 80% 55%), hsl(${h2} 80% 45%))`;
}

function scoreColor(s: number) {
  if (s >= 70) return "hsl(var(--accent-green))";
  if (s >= 40) return "hsl(var(--accent-amber))";
  return "hsl(var(--accent-red))";
}

function scoreMeta(s: number) {
  if (s >= 90) return { label: "HOT 🔥", color: "hsl(var(--accent-amber))", bg: "hsl(38 92% 50% / 0.12)", border: "hsl(38 92% 50% / 0.4)" };
  if (s >= 75) return { label: "HIGH", color: "hsl(var(--accent-green))", bg: "hsl(158 76% 40% / 0.12)", border: "hsl(158 76% 40% / 0.4)" };
  if (s >= 50) return { label: "MEDIUM", color: "hsl(var(--accent-cyan))", bg: "hsl(189 100% 50% / 0.1)", border: "hsl(189 100% 50% / 0.35)" };
  return { label: "LOW", color: "hsl(var(--accent-red))", bg: "hsl(0 84% 60% / 0.1)", border: "hsl(0 84% 60% / 0.35)" };
}

interface Props {
  lead: Lead;
  index: number;
  saved: boolean;
  onToggleSave: () => void;
}

export function LeadCard({ lead, index, saved, onToggleSave }: Props) {
  const meta = scoreMeta(lead.quality_score);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -6;
    setTilt({ x: y, y: x });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: "preserve-3d" }}
      className="group relative glass rounded-xl p-5 lg:p-6 transition-all duration-300 hover:shadow-lg"
      whileHover={{ y: -4 }}
    >
      {/* Quality score left border accent */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300"
        style={{ background: scoreColor(lead.quality_score) }}
      />
      
      {/* Gradient border glow on hover */}
      <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
           style={{
             background: "linear-gradient(135deg, hsl(var(--accent-cyan) / 0.5), hsl(var(--accent-violet) / 0.3))",
             zIndex: -1,
             filter: "blur(8px)"
           }}
      />

      {/* Top section with company name and score */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl font-bold leading-tight truncate text-foreground">
            {lead.company_name}
          </h3>
          <div className="mt-1.5 text-sm text-[hsl(var(--text-secondary))]">
            <span className="text-foreground font-medium">{lead.contact_person}</span>
            <span className="mx-2 text-white/20">·</span>
            <span>{lead.job_title}</span>
          </div>
        </div>

        {/* Quality score with pulse dot */}
        <div className="flex items-center gap-2 shrink-0">
          <div 
            className="pulse-dot w-2 h-2 rounded-full"
            style={{ background: scoreColor(lead.quality_score) }}
          />
          <motion.div
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: index * 0.08 + 0.3, type: "spring", stiffness: 200, damping: 16 }}
            className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider whitespace-nowrap"
            style={{
              background: meta.bg,
              color: meta.color,
              border: `1px solid ${meta.border}`,
              boxShadow: `0 0 18px -2px ${meta.color.replace(")", " / 0.4)")}`,
            }}
          >
            {lead.quality_score}
          </motion.div>
        </div>
      </div>

      {/* Links and metadata row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {lead.website && (
          <a
            href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono text-[hsl(var(--text-secondary))] hover:text-cyan-brand bg-white/[0.04] hover:bg-cyan-brand/10 transition-colors"
          >
            {lead.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            <ExternalLink size={10} />
          </a>
        )}
        {lead.linkedin_url && (
          <a href={lead.linkedin_url} target="_blank" rel="noreferrer"
             className="text-[hsl(var(--text-secondary))] hover:text-cyan-brand transition-colors">
            <Linkedin size={13} />
          </a>
        )}
        <span className="text-[10px] font-mono text-[hsl(var(--text-muted))]">
          {lead.company_size} · {lead.annual_revenue}
        </span>
      </div>

      {/* Contact info container */}
      <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] space-y-2">
        <button onClick={() => copy(lead.email, "Email")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-white/[0.03] hover:bg-cyan-brand/10 hover:text-cyan-brand border border-white/[0.06] transition-all duration-200 font-mono active:scale-95">
          <Mail size={13} /> <span className="flex-1 text-left truncate">{lead.email}</span> <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button onClick={() => copy(lead.phone, "Phone")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs bg-white/[0.03] hover:bg-cyan-brand/10 hover:text-cyan-brand border border-white/[0.06] transition-all duration-200 font-mono active:scale-95">
          <Phone size={13} /> <span className="flex-1 text-left truncate">{lead.phone}</span> <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* AI-generated content section */}
      <div className="mb-4 space-y-3 p-4 rounded-lg bg-gradient-to-br from-violet-brand/[0.08] to-cyan-brand/[0.08] border border-white/[0.08]">
        {/* Pain point */}
        {lead.pain_point && (
          <div>
            <p className="text-[10px] font-mono font-semibold text-[hsl(var(--text-muted))] mb-1">PAIN POINT</p>
            <p className="text-[12px] text-[hsl(var(--text-secondary))] leading-relaxed">{lead.pain_point}</p>
          </div>
        )}

        {/* Outreach hook */}
        <div>
          <p className="text-[10px] font-mono font-semibold text-[hsl(var(--text-muted))] mb-1">OUTREACH HOOK</p>
          <div className="flex items-start gap-2">
            <Quote size={14} className="text-cyan-brand/50 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-display text-sm leading-relaxed italic text-foreground/95">{lead.outreach_hook}</p>
              <button
                onClick={() => copy(lead.outreach_hook, "Hook")}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-medium bg-cyan-brand/20 hover:bg-cyan-brand/30 text-cyan-brand border border-cyan-brand/40 transition-all duration-200 active:scale-95"
              >
                <Copy size={11} /> Copy Hook
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tech stack and intent signals */}
      <div className="space-y-2">
        {lead.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {lead.tech_stack.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-violet-brand/10 text-violet-brand border border-violet-brand/20">
                {t}
              </span>
            ))}
          </div>
        )}
        {lead.intent_signals?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {lead.intent_signals.map((s, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-amber-brand/10 text-amber-brand border border-amber-brand/25">
                ⚡ {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <span className="text-[10px] font-mono text-[hsl(var(--text-muted))]">
          Best time: {lead.best_contact_time}
        </span>
        <motion.button
          onClick={onToggleSave}
          whileTap={{ scale: 0.85 }}
          className={`grid place-items-center w-8 h-8 rounded-md border transition-all ${
            saved ? "bg-red-brand/15 border-red-brand/40 text-red-brand shadow-lg shadow-red-brand/20" : "bg-white/[0.03] border-white/[0.06] hover:border-white/15 hover:shadow-md"
          }`}
        >
          <motion.span animate={saved ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.4 }}>
            <Heart size={14} fill={saved ? "currentColor" : "none"} />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
