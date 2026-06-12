import { motion } from "framer-motion";
import { PageHeader } from "@/components/leadforge/PageHeader";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const CYAN = "hsl(189 82% 53%)";
const SLATE_BLUE = "hsl(215 25% 40%)";
const AMBER = "hsl(38 90% 60%)";
const GRAY = "hsl(215 15% 65%)";
const GRAY_MUTED = "hsl(215 12% 50%)";

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
const donutColors = [CYAN, SLATE_BLUE, AMBER, GRAY, GRAY_MUTED];

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
  boxShadow: "0 10px 40px -10px hsl(var(--accent-cyan) / 0.3)",
};

function ChartCard({ title, eyebrow, children, delay = 0, className = "" }: {
  title: string; eyebrow: string; children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-brand uppercase">{eyebrow}</span>
          <h3 className="font-display text-lg font-semibold mt-1">{title}</h3>
        </div>
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

export default function Analytics() {
  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        subtitle="Trends across sessions, niches, and industries — calibrate your next run."
      />
      <main className="px-4 sm:px-6 lg:px-10 pb-20 space-y-5">
        <ChartCard title="Lead Quality — Last 7 Sessions" eyebrow="Trend" delay={0}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.06)" />
              <XAxis dataKey="session" stroke="hsl(215 20% 55%)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={11} tickLine={false} axisLine={false} domain={[40, 100]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: CYAN, strokeOpacity: 0.2 }} />
              <Line
                type="monotone" dataKey="score" stroke={CYAN} strokeWidth={2.5}
                dot={{ r: 4, fill: CYAN, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: CYAN, stroke: "hsl(215 28% 7%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ChartCard title="Leads by Niche" eyebrow="Distribution" delay={0.1}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={donutData} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                  paddingAngle={3} stroke="hsl(220 50% 4%)" strokeWidth={2}
                >
                  {donutData.map((_, i) => (
                    <Cell key={i} fill={donutColors[i % donutColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono, monospace", paddingTop: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Avg Score by Industry" eyebrow="Comparison" delay={0.2}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.06)" />
                <XAxis dataKey="industry" stroke="hsl(215 20% 55%)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215 20% 55%)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--accent-cyan) / 0.05)" }} />
                <Bar dataKey="score" fill={CYAN} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </>
  );
}
