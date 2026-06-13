import { motion } from "framer-motion";
import { PageHeader } from "@/components/leadforge/PageHeader";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend, Label
} from "recharts";

const CYAN = "#22d3ee";
const SLATE_BLUE = "#64748b";
const AMBER = "#f59e0b";
const GRAY = "#6b7280";
const DARK_GRAY = "#475569";

// Consistent niche-to-color mapping between Pie/Donut and Bar Charts
const COLOR_MAP: Record<string, string> = {
  "SaaS Startups": CYAN,
  "SaaS": CYAN,
  "E-commerce": SLATE_BLUE,
  "DTC": SLATE_BLUE,
  "Agencies": AMBER,
  "Agency": AMBER,
  "Healthcare": GRAY,
  "Health": GRAY,
  "Other": DARK_GRAY,
  "Fintech": SLATE_BLUE,
  "Legal": GRAY,
};

const lineData = [
  { session: "S1", score: 64 },
  { session: "S2", score: 71 },
  { session: "S3", score: 68 },
  { session: "S4", score: 79 },
  { session: "S5", score: 82 },
  { session: "S6", score: 76 },
  { session: "S7", score: 88 },
];

const donutData = [
  { name: "SaaS Startups", value: 32 },
  { name: "E-commerce", value: 24 },
  { name: "Agencies", value: 18 },
  { name: "Healthcare", value: 14 },
  { name: "Other", value: 12 },
];

const barData = [
  { industry: "SaaS", score: 84 },
  { industry: "Fintech", score: 79 },
  { industry: "DTC", score: 72 },
  { industry: "Health", score: 76 },
  { industry: "Legal", score: 68 },
  { industry: "Agency", score: 81 },
];

const tooltipStyle = {
  background: "hsl(220 50% 4% / 0.95)",
  border: "1px solid hsl(0 0% 100% / 0.08)",
  borderRadius: "10px",
  fontSize: "12px",
  fontFamily: "JetBrains Mono, monospace",
  boxShadow: "0 10px 40px -10px hsl(189 82% 53% / 0.3)",
};

function ChartCard({ title, eyebrow, children, delay = 0, className = "" }: {
  title: string; eyebrow: string; children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden ${className}`}
      style={{ backgroundColor: "#1a1f28", borderColor: "rgba(255, 255, 255, 0.08)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#22d3ee] uppercase">{eyebrow}</span>
          <h3 className="font-display text-lg font-semibold mt-1 text-white">{title}</h3>
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export default function Analytics() {
  const totalLeads = donutData.reduce((acc, curr) => acc + curr.value, 0);

  // Dynamic Insights Strip Calculation
  const overallAvg = barData.reduce((acc, curr) => acc + curr.score, 0) / barData.length;
  const bestIndustry = [...barData].sort((a, b) => b.score - a.score)[0];
  const percentageAbove = Math.round(((bestIndustry.score - overallAvg) / overallAvg) * 100);

  const nameMapper: Record<string, string> = {
    SaaS: "SaaS Startups",
    Fintech: "Fintech",
    DTC: "E-commerce (DTC)",
    Health: "Healthcare",
    Legal: "Legal",
    Agency: "Agencies"
  };

  const industryName = nameMapper[bestIndustry.industry] || bestIndustry.industry;
  const insightText = `${industryName} leads score ${percentageAbove}% higher than your average industry score this period.`;

  // Custom Legend Text Formatter for sufficient contrast
  const renderLegendText = (value: string) => {
    return <span className="text-slate-300 font-medium ml-1.5">{value}</span>;
  };

  // Custom Label on last data point of the area chart
  const renderCustomLabel = (props: any) => {
    const { x, y, index, value } = props;
    if (index === lineData.length - 1) {
      return (
        <g>
          {/* Pill background */}
          <rect
            x={x - 28}
            y={y - 32}
            width={56}
            height={20}
            rx={6}
            fill="#1a1f28"
            stroke={CYAN}
            strokeWidth={1.5}
          />
          <text
            x={x}
            y={y - 19}
            fill={CYAN}
            fontSize={10}
            fontWeight="bold"
            fontFamily="JetBrains Mono, monospace"
            textAnchor="middle"
          >
            S7: {value}
          </text>
        </g>
      );
    }
    return null;
  };

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        subtitle="Trends across sessions, niches, and industries — calibrate your next run."
      />
      <main className="px-4 sm:px-6 lg:px-10 pb-20 space-y-6">
        {/* Prominent Area Chart (taller height: 350px) */}
        <ChartCard title="Lead Quality — Last 7 Sessions" eyebrow="Trend" delay={0}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={lineData} margin={{ top: 20, right: 16, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CYAN} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={CYAN} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
              <XAxis
                dataKey="session"
                stroke="hsl(215 20% 70%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                stroke="hsl(215 20% 70%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[40, 100]}
                dx={-4}
              />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: CYAN, strokeOpacity: 0.2 }} />
              <Area
                type="monotone"
                dataKey="score"
                stroke={CYAN}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorScore)"
                dot={{ r: 4, fill: CYAN, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: CYAN, stroke: "#1a1f28", strokeWidth: 2 }}
                label={renderCustomLabel}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Dynamic Insight Strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border"
          style={{
            backgroundColor: "rgba(34, 211, 238, 0.08)",
            borderColor: "rgba(34, 211, 238, 0.15)"
          }}
        >
          <TrendingUp className="w-5 h-5 text-[#22d3ee] shrink-0 animate-pulse" />
          <span className="text-[#22d3ee] text-sm font-semibold tracking-wide">
            {insightText}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Donut Chart with Center Label & Fixed Palette */}
          <ChartCard title="Leads by Niche" eyebrow="Distribution" delay={0.1}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  stroke="#1a1f28"
                  strokeWidth={2}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={COLOR_MAP[entry.name] || GRAY} />
                  ))}
                  <Label
                    content={(props: any) => {
                      const { cx, cy } = props.viewBox || {};
                      if (!cx || !cy) return null;
                      return (
                        <g>
                          <text
                            x={cx}
                            y={cy - 4}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-white font-display text-2xl font-bold"
                          >
                            {totalLeads}
                          </text>
                          <text
                            x={cx}
                            y={cy + 16}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-slate-400 font-mono text-[9px] uppercase tracking-wider"
                          >
                            Total Leads
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={renderLegendText}
                  wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Bar Chart with Dynamic Per-Bar Palette Matching */}
          <ChartCard title="Avg Score by Industry" eyebrow="Comparison" delay={0.2}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis
                  dataKey="industry"
                  stroke="hsl(215 20% 70%)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={6}
                />
                <YAxis
                  stroke="hsl(215 20% 70%)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  dx={-4}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(34, 211, 238, 0.05)" }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={COLOR_MAP[entry.industry] || GRAY} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </>
  );
}
