import { motion } from "framer-motion";
import { useState } from "react";
import type { Lead } from "@/lib/gemini";
import { Mail, Phone, ExternalLink, Copy, Heart, Quote } from "lucide-react";
import { toast } from "sonner";

function scoreColor(s: number) {
  if (s >= 70) return "hsl(var(--accent-green))";
  if (s >= 40) return "hsl(var(--accent-amber))";
  return "hsl(var(--accent-red))";
}

function scoreBg(s: number) {
  if (s >= 70) return "bg-green-500/10";
  if (s >= 40) return "bg-amber-500/10";
  return "bg-red-500/10";
}

function scoreBorder(s: number) {
  if (s >= 70) return "border-green-500/30";
  if (s >= 40) return "border-amber-500/30";
  return "border-red-500/30";
}

interface Props {
  lead: Lead;
  index: number;
  saved: boolean;
  onToggleSave: () => void;
}

export function LeadCard({ lead, index, saved, onToggleSave }: Props) {
  const [showEmailCopy, setShowEmailCopy] = useState(false);
  const [showPhoneCopy, setShowPhoneCopy] = useState(false);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="group relative bg-[hsl(var(--surface-2))] rounded-card border border-white/[0.07] hover:border-cyan-brand/30 transition-all duration-200 p-6"
    >
      {/* Header: Company name + Quality score pill */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground leading-tight truncate">
            {lead.company_name}
          </h3>
          {lead.website && (
            <a
              href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-cyan-brand/70 hover:text-cyan-brand transition-colors mt-1 truncate"
            >
              {lead.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              <ExternalLink size={12} className="shrink-0" />
            </a>
          )}
        </div>

        {/* Quality score badge */}
        <div className={`px-3 py-1 rounded-badge text-xs font-bold text-white ${scoreBg(lead.quality_score)} border ${scoreBorder(lead.quality_score)} shrink-0`}>
          {lead.quality_score}
        </div>
      </div>

      {/* Decision maker name + job title */}
      <div className="flex items-center gap-2 mb-5 text-sm">
        <span className="text-foreground font-medium">{lead.contact_person}</span>
        <span className="text-[hsl(var(--text-muted))]">·</span>
        <span className="text-[hsl(var(--text-secondary))]">{lead.job_title}</span>
      </div>

      {/* Contact info: Email and Phone inline */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 text-sm">
        {/* Email */}
        <div
          className="flex items-center gap-2 group/email"
          onMouseEnter={() => setShowEmailCopy(true)}
          onMouseLeave={() => setShowEmailCopy(false)}
        >
          <Mail size={16} className="text-[hsl(var(--text-secondary))] shrink-0" />
          <span className="text-foreground truncate font-mono text-xs">{lead.email}</span>
          {showEmailCopy && (
            <button
              onClick={() => copy(lead.email, "Email")}
              className="opacity-0 group-hover/email:opacity-100 transition-opacity p-1 hover:text-cyan-brand"
            >
              <Copy size={14} />
            </button>
          )}
        </div>

        {/* Phone */}
        <div
          className="flex items-center gap-2 group/phone"
          onMouseEnter={() => setShowPhoneCopy(true)}
          onMouseLeave={() => setShowPhoneCopy(false)}
        >
          <Phone size={16} className="text-[hsl(var(--text-secondary))] shrink-0" />
          <span className="text-foreground truncate font-mono text-xs">{lead.phone}</span>
          {showPhoneCopy && (
            <button
              onClick={() => copy(lead.phone, "Phone")}
              className="opacity-0 group-hover/phone:opacity-100 transition-opacity p-1 hover:text-cyan-brand"
            >
              <Copy size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.07] mb-5" />

      {/* Pain point */}
      {lead.pain_point && (
        <div className="mb-5 flex gap-2">
          <Quote size={14} className="text-[hsl(var(--text-muted))] shrink-0 mt-0.5" />
          <p className="text-sm text-[hsl(var(--text-secondary))] italic">{lead.pain_point}</p>
        </div>
      )}

      {/* Outreach hook */}
      <div className="mb-5 p-4 rounded-card bg-[hsl(var(--surface-3))] border border-white/[0.07]">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-foreground leading-relaxed">{lead.outreach_hook}</p>
          <button
            onClick={() => copy(lead.outreach_hook, "Hook")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-badge text-xs font-medium bg-cyan-brand/10 hover:bg-cyan-brand/20 text-cyan-brand border border-cyan-brand/30 transition-all shrink-0 active:scale-95"
          >
            <Copy size={12} />
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Footer: Company size + Tags */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.07]">
        <div className="flex flex-wrap gap-2">
          {lead.company_size && (
            <span className="px-2 py-1 rounded-badge text-xs bg-white/[0.04] border border-white/[0.1] text-[hsl(var(--text-secondary))]">
              {lead.company_size}
            </span>
          )}
          {lead.intent_signals?.map((s, i) => (
            <span key={i} className="px-2 py-1 rounded-badge text-xs bg-white/[0.04] border border-white/[0.1] text-[hsl(var(--text-secondary))]">
              {s}
            </span>
          ))}
        </div>

        {/* Save button */}
        <motion.button
          onClick={onToggleSave}
          whileTap={{ scale: 0.85 }}
          className={`grid place-items-center w-8 h-8 rounded-badge border transition-all ${
            saved
              ? "bg-red-500/15 border-red-500/30 text-red-500"
              : "bg-white/[0.04] border-white/[0.1] text-[hsl(var(--text-secondary))] hover:text-foreground"
          }`}
        >
          <motion.span animate={saved ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
            <Heart size={16} fill={saved ? "currentColor" : "none"} />
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
}
