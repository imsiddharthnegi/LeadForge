import React, { Component, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/leadforge/PageHeader";
import { Users, Activity, Star, TrendingUp, Sparkles, Building2, Briefcase, Stethoscope, RotateCcw } from "lucide-react";

/* ── Class-based Error Boundary for cards ── */
class CardErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Card rendering crash caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl p-5 border border-red-500/15 bg-red-500/5 text-red-400 text-xs flex flex-col justify-center items-center text-center min-h-[140px] shadow-sm">
          <span className="font-semibold mb-1">Card Error</span>
          <span className="opacity-80">Failed to render this metric</span>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ── Mock data for visualizations ── */
const sparklineData = [6, 9, 7, 12, 8, 14, 10, 11, 15, 12];
const qualityScore = 78;
const niches = [
  { name: "SaaS Startups", pct: 100 },
  { name: "Digital Agencies", pct: 62 },
];

/* ── Score tier colors (semantic) ── */
function scoreTierColor(score: number): string {
  if (score >= 75) return "hsl(var(--accent-green))";
  if (score >= 50) return "hsl(var(--accent-amber))";
  return "hsl(var(--text-muted))";
}
function scoreTierBg(score: number): string {
  if (score >= 75) return "hsl(var(--accent-green) / 0.12)";
  if (score >= 50) return "hsl(var(--accent-amber) / 0.12)";
  return "hsl(var(--text-muted) / 0.12)";
}

interface SessionItem {
  icon: React.ElementType;
  niche: string;
  count: number;
  score: number;
  time: string;
  location: string;
}

interface SessionGroup {
  label: string;
  sessions: SessionItem[];
}

const sessionGroups: SessionGroup[] = [
  {
    label: "Today",
    sessions: [
      { icon: Sparkles,  niche: "SaaS Startups",     count: 12, score: 82, time: "2:14 PM",  location: "United States" },
    ],
  },
  {
    label: "Yesterday",
    sessions: [
      { icon: Building2, niche: "E-commerce Stores",  count: 8,  score: 74, time: "4:30 PM",  location: "Global" },
    ],
  },
  {
    label: "This Week",
    sessions: [
      { icon: Briefcase,   niche: "Digital Agencies",     count: 10, score: 79, time: "Mon 11:20 AM", location: "Europe" },
      { icon: Stethoscope, niche: "Healthcare Providers", count: 6,  score: 71, time: "Sun 9:45 AM",  location: "Canada" },
    ],
  },
  {
    label: "Earlier",
    sessions: [
      { icon: Sparkles, niche: "Fitness Studios", count: 9, score: 68, time: "Jun 4", location: "Australia" },
    ],
  },
];

/* ── Sparkline component (Robust) ── */
function Sparkline({ data, width = 120, height = 36 }: { data: number[]; width?: number; height?: number }) {
  if (!data || data.length === 0) {
    return <div style={{ width, height }} className="bg-white/[0.02] rounded" />;
  }
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padY = 4;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1 || 1)) * width;
    const y = height - padY - ((v - min) / range) * (height - padY * 2);
    return `${x},${y}`;
  });

  const linePath = `M ${points.join(" L ")}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkFill)" />
      <path d={linePath} fill="none" stroke="#22d3ee" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.7} />
      <circle
        cx={width}
        cy={height - padY - ((data[data.length - 1] - min) / range) * (height - padY * 2)}
        r={2.5}
        fill="#22d3ee"
      />
    </svg>
  );
}

/* ── Mini quality ring component (Robust) ── */
function QualityRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score || 0, 0) / 100, 1);
  const dashOffset = circumference * (1 - pct);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.3 }}
          style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.35))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-lg font-bold leading-none">{score || 0}</span>
        <span className="text-[8px] font-mono uppercase tracking-wider text-[hsl(var(--text-muted))] mt-0.5">AVG</span>
      </div>
    </div>
  );
}

/* ── Activity Feed component ── */
function ActivityFeed() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs tracking-wider text-[hsl(var(--text-secondary))] uppercase font-semibold">
          Recent Activity
        </h3>
      </div>

      <div className="space-y-6">
        {sessionGroups.map((group) => (
          <div key={group.label} className="space-y-3">
            <h4 className="font-mono text-[10px] tracking-widest text-[hsl(var(--text-muted))] uppercase font-bold">
              {group.label}
            </h4>

            <div className="space-y-2.5">
              {group.sessions.map((session, idx) => {
                const Icon = session.icon;
                const scoreColor = scoreTierColor(session.score);
                const scoreBg = scoreTierBg(session.score);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="group relative flex items-center justify-between p-4 rounded-xl border border-white/[0.04] bg-[#1a1f28] hover:border-cyan-brand/20 hover:bg-[#1a1f28]/60 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="grid place-items-center w-9 h-9 rounded-lg bg-cyan-brand/10 border border-cyan-brand/20 text-cyan-brand">
                        <Icon size={16} />
                      </span>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {session.niche}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--text-secondary))] mt-0.5">
                          <span>{session.count} leads generated</span>
                          <span>·</span>
                          <span>avg score:</span>
                          <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border"
                            style={{
                              color: scoreColor,
                              backgroundColor: scoreBg,
                              borderColor: `${scoreColor}20`,
                            }}
                          >
                            {session.score}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-[hsl(var(--text-muted))] group-hover:opacity-0 transition-opacity">
                        {session.time} · {session.location}
                      </span>

                      <button
                        onClick={() => navigate("/")}
                        className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 h-8 rounded-lg bg-cyan-brand/10 hover:bg-cyan-brand/20 text-cyan-brand border border-cyan-brand/30 text-xs font-semibold"
                      >
                        <RotateCcw size={12} />
                        <span>Re-run</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Shared card wrapper ── */
const cardBase = "rounded-2xl p-5 relative overflow-hidden";
const cardStyle = {
  background: "#1a1f28",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 0 rgba(255,255,255,0.04)",
};

const fadeIn = (i: number) => ({
  initial: { opacity: 0, y: 14 } as const,
  animate: { opacity: 1, y: 0 } as const,
  transition: { delay: i * 0.07, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] },
});

function IconBadge({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <span
      className="grid place-items-center w-10 h-10 rounded-xl shrink-0"
      style={{
        background: "rgba(34,211,238,0.08)",
        border: "1px solid rgba(34,211,238,0.2)",
        boxShadow: "0 0 24px -5px rgba(34,211,238,0.25)",
      }}
    >
      <Icon size={18} style={{ color: "#22d3ee" }} strokeWidth={1.8} />
    </span>
  );
}

function DeltaBadge({ text, positive }: { text: string; positive: boolean }) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-wider"
      style={{ color: positive ? "hsl(var(--accent-green))" : "#22d3ee" }}
    >
      {text}
    </span>
  );
}

export default function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="Your lead intelligence at a glance — performance, momentum, and what's coming next."
      />
      <main className="px-4 sm:px-6 lg:px-10 pb-20">
        {/* ── Stat grid — each card has unique content ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

          {/* Card 1 — Total Leads Generated + sparkline */}
          <CardErrorBoundary>
            <motion.div {...fadeIn(0)} className={cardBase} style={cardStyle}>
              <div className="relative flex items-start justify-between">
                <IconBadge icon={Users} />
                <DeltaBadge text="+12.4%" positive />
              </div>
              <div className="relative mt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">1,284</div>
                  <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mt-1">Total Leads Generated</div>
                </div>
                <div className="pb-1 opacity-90">
                  <Sparkline data={sparklineData} />
                </div>
              </div>
            </motion.div>
          </CardErrorBoundary>

          {/* Card 2 — Sessions Run (breather card, simple) */}
          <CardErrorBoundary>
            <motion.div {...fadeIn(1)} className={cardBase} style={cardStyle}>
              <div className="relative flex items-start justify-between">
                <IconBadge icon={Activity} />
                <DeltaBadge text="+8 this week" positive />
              </div>
              <div className="relative mt-5">
                <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">47</div>
                <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mt-1">Sessions Run</div>
              </div>
            </motion.div>
          </CardErrorBoundary>

          {/* Card 3 — Avg Quality Score + mini ring */}
          <CardErrorBoundary>
            <motion.div {...fadeIn(2)} className={cardBase} style={cardStyle}>
              <div className="relative flex items-start justify-between">
                <IconBadge icon={Star} />
                <DeltaBadge text="+3 vs last month" positive />
              </div>
              <div className="relative mt-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-1">Avg Quality Score</div>
                  <div className="text-[11px] font-mono text-[hsl(var(--text-muted))]">out of 100</div>
                </div>
                <QualityRing score={qualityScore} />
              </div>
            </motion.div>
          </CardErrorBoundary>

          {/* Card 4 — Top Niche + comparative bars */}
          <CardErrorBoundary>
            <motion.div {...fadeIn(3)} className={cardBase} style={cardStyle}>
              <div className="relative flex items-start justify-between">
                <IconBadge icon={TrendingUp} />
                <DeltaBadge text="32% of total" positive={false} />
              </div>
              <div className="relative mt-4">
                <div className="text-[11px] uppercase tracking-wider text-[hsl(var(--text-secondary))] mb-3">Top Niche</div>
                <div className="space-y-2.5">
                  {(niches || []).map((n) => (
                    <div key={n.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium truncate mr-2">{n.name}</span>
                        <span className="text-[10px] font-mono text-[hsl(var(--text-muted))] shrink-0">{n.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: n.pct === 100
                              ? "linear-gradient(90deg, #22d3ee, #67e8f9)"
                              : "rgba(34,211,238,0.35)",
                            boxShadow: n.pct === 100 ? "0 0 8px rgba(34,211,238,0.3)" : undefined,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${n.pct}%` }}
                          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </CardErrorBoundary>

        </div>

        {/* ── Activity feed with date grouping ── */}
        <ActivityFeed />
      </main>
    </>
  );
}
