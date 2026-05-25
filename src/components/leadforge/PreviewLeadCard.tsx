import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function PreviewLeadCard() {
  // Mock lead data for preview
  const mockLead = {
    company_name: "TechFlow AI",
    website: "techflow.ai",
    contact_person: "Sarah Chen",
    job_title: "VP of Operations",
    email: "sarah.chen@techflow.ai",
    phone: "+1 (555) 234-5678",
    pain_point: "Struggling to automate their lead qualification process",
    outreach_hook: "Your team could save 15+ hours per week by automating lead scoring with our AI platform, just like other mid-market SaaS companies.",
    company_size: "50–100 employees",
    quality_score: 87,
    intent_signals: ["High Intent", "Budget Approved"],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="relative w-full"
    >
      {/* Card container with preview styling */}
      <div className="relative bg-[hsl(var(--surface-2))] rounded-card border border-white/[0.07] p-6 overflow-hidden">
        {/* Background content (blurred/frosted) */}
        <div className="blur-[3px] opacity-40 pointer-events-none">
          {/* Header: Company name + Score */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-foreground leading-tight truncate">
                {mockLead.company_name}
              </h3>
              <div className="inline-flex items-center gap-1 text-sm text-cyan-brand/70 mt-1 truncate">
                {mockLead.website}
              </div>
            </div>
            <div className="px-3 py-1 rounded-badge text-xs font-bold text-white bg-green-500/10 border border-green-500/30 shrink-0">
              {mockLead.quality_score}
            </div>
          </div>

          {/* Decision maker */}
          <div className="flex items-center gap-2 mb-5 text-sm">
            <span className="text-foreground font-medium">{mockLead.contact_person}</span>
            <span className="text-[hsl(var(--text-muted))]">·</span>
            <span className="text-[hsl(var(--text-secondary))]">{mockLead.job_title}</span>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-foreground truncate font-mono text-xs">{mockLead.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground truncate font-mono text-xs">{mockLead.phone}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.07] mb-5" />

          {/* Pain point */}
          <div className="mb-5 flex gap-2">
            <p className="text-sm text-[hsl(var(--text-secondary))] italic">{mockLead.pain_point}</p>
          </div>

          {/* Outreach hook */}
          <div className="mb-5 p-4 rounded-card bg-[hsl(var(--surface-3))] border border-white/[0.07]">
            <p className="text-sm text-foreground leading-relaxed">{mockLead.outreach_hook}</p>
          </div>

          {/* Footer: Tags */}
          <div className="flex items-center gap-2 pt-4 border-t border-white/[0.07]">
            <span className="px-2 py-1 rounded-badge text-xs bg-white/[0.04] border border-white/[0.1] text-[hsl(var(--text-secondary))]">
              {mockLead.company_size}
            </span>
            {mockLead.intent_signals?.map((s, i) => (
              <span key={i} className="px-2 py-1 rounded-badge text-xs bg-white/[0.04] border border-white/[0.1] text-[hsl(var(--text-secondary))]">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Frosted overlay */}
        <div className="absolute inset-0 rounded-card bg-gradient-to-b from-white/[0.02] via-white/0 to-white/0 pointer-events-none" />

        {/* Center label with icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-card">
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={24} className="text-cyan-brand/70" />
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Your leads will appear here</p>
              <p className="text-xs text-[hsl(var(--text-secondary))] mt-1">Click Generate to see real results</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
