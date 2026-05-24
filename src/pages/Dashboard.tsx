import { motion } from "framer-motion";
import { PageHeader } from "@/components/leadforge/PageHeader";
import { Users, Activity, Star, TrendingUp, Sparkles, Building2, Briefcase, Stethoscope } from "lucide-react";

const stats = [
  { label: "Total Leads Generated", value: "1,284", icon: Users, accent: "cyan", delta: "+12.4%" },
  { label: "Sessions Run", value: "47", icon: Activity, accent: "violet", delta: "+8 this week" },
  { label: "Avg Quality Score", value: "78", icon: Star, accent: "amber", delta: "+3 vs last month" },
  { label: "Top Niche", value: "SaaS Startups", icon: TrendingUp, accent: "green", delta: "32% of total" },
];

const accentMap: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  cyan:   { color: "hsl(var(--accent-cyan))",   bg: "hsl(var(--accent-cyan) / 0.1)",   border: "hsl(var(--accent-cyan) / 0.3)",   glow: "0 0 30px -5px hsl(var(--accent-cyan) / 0.4)" },
  violet: { color: "hsl(var(--accent-violet))", bg: "hsl(var(--accent-violet) / 0.1)", border: "hsl(var(--accent-violet) / 0.3)", glow: "0 0 30px -5px hsl(var(--accent-violet) / 0.4)" },
  amber:  { color: "hsl(var(--accent-amber))",  bg: "hsl(var(--accent-amber) / 0.1)",  border: "hsl(var(--accent-amber) / 0.3)",  glow: "0 0 30px -5px hsl(var(--accent-amber) / 0.4)" },
  green:  { color: "hsl(var(--accent-green))",  bg: "hsl(var(--accent-green) / 0.1)",  border: "hsl(var(--accent-green) / 0.3)",  glow: "0 0 30px -5px hsl(var(--accent-green) / 0.4)" },
};

const activity = [
  { icon: Sparkles,    niche: "SaaS Startups",        count: 12, score: 82, when: "2h ago",    location: "United States" },
  { icon: Building2,   niche: "E-commerce Stores",    count: 8,  score: 74, when: "Yesterday",  location: "Global" },
  { icon: Briefcase,   niche: "Digital Agencies",     count: 10, score: 79, when: "2 days ago", location: "Europe" },
  { icon: Stethoscope, niche: "Healthcare Providers", count: 6,  score: 71, when: "4 days ago", location: "Canada" },
  { icon: Sparkles,    niche: "Fitness Studios",      count: 9,  score: 68, when: "1 week ago", location: "Australia" },
];

export default function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="Your lead intelligence at a glance — performance, momentum, and what's coming next."
      />
      <main className="px-6 lg:px-10 pb-20">
        {/* Stat grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => {
            const a = accentMap[s.accent];
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="glass-card rounded-2xl p-5 relative overflow-hidden group"
              >
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50 group-hover:opacity-80 transition-opacity"
                  style={{ background: `radial-gradient(circle, ${a.bg}, transparent 70%)`, filter: "blur(20px)" }}
                />
                <div className="relative flex items-start justify-between">
                  <span
                    className="grid place-items-center w-10 h-10 rounded-xl"
                    style={{ background: a.bg, border: `1px solid ${a.border}`, boxShadow: a.glow }}
                  >
                    <Icon size={18} style={{ color: a.color }} strokeWidth={1.8} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: a.color }}>
                    {s.delta}
                  </span>
                </div>
                <div className="relative mt-5">
                  <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mt-1">{s.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 lg:p-7"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-brand uppercase">Recent Activity</span>
              <h2 className="font-display text-xl font-semibold mt-1">Past Generation Sessions</h2>
            </div>
            <span className="text-[10px] font-mono text-[hsl(var(--text-muted))]">5 most recent</span>
          </div>
          <div className="space-y-2">
            {activity.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                >
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-[hsl(var(--accent-cyan)/0.08)] border border-[hsl(var(--accent-cyan)/0.2)] shrink-0">
                    <Icon size={16} className="text-cyan-brand" strokeWidth={1.8} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.niche} · {a.location}</div>
                    <div className="text-[11px] text-[hsl(var(--text-secondary))] font-mono mt-0.5">
                      {a.count} leads generated · avg score {a.score}
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[hsl(var(--text-muted))] shrink-0">{a.when}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </>
  );
}
