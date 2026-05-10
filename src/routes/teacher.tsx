import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend as RLegend,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowDown, ArrowUp, BookOpen, Brain, Lightbulb, Moon, Smartphone, Users, Eye,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/teacher")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard · FocusAI" },
      { name: "description", content: "Professional analytics dashboard for educators — focus trends, heatmaps and AI suggestions." },
    ],
  }),
  component: Teacher,
});

const focusTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  focus: 60 + Math.round(Math.sin(i * 0.6) * 10 + i * 1.2),
  distraction: 40 - Math.round(Math.sin(i * 0.6) * 10 + i * 0.8),
}));
const subjectData = [
  { name: "Math", focus: 82, attendance: 96 },
  { name: "Physics", focus: 78, attendance: 92 },
  { name: "CS", focus: 88, attendance: 98 },
  { name: "English", focus: 71, attendance: 89 },
  { name: "Chem", focus: 74, attendance: 91 },
  { name: "Bio", focus: 80, attendance: 94 },
];
const weekly = [
  { day: "Mon", focus: 76 }, { day: "Tue", focus: 81 }, { day: "Wed", focus: 70 },
  { day: "Thu", focus: 84 }, { day: "Fri", focus: 78 }, { day: "Sat", focus: 88 },
];

function Teacher() {
  return (
    <Layout>
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          <Header />

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
            <KPI icon={Users} label="Total Students" value="128" delta={2} />
            <KPI icon={Eye} label="Active" value="104" delta={5} tone="success" />
            <KPI icon={Smartphone} label="Distracted" value="14" delta={-3} tone="danger" />
            <KPI icon={Moon} label="Sleep Detected" value="6" delta={-1} tone="warning" />
            <KPI icon={Brain} label="Avg Focus" value="82%" delta={4} tone="success" />
          </div>

          <div className="mt-5 grid lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2" title="Focus trend · last 14 days" right={<Pill>+8% vs prev period</Pill>}>
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={focusTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="focusG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="distG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--neon-pink)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="var(--neon-pink)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                    <XAxis dataKey="day" stroke="oklch(1 0 0 / 40%)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.035 270)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="focus" stroke="var(--neon-cyan)" strokeWidth={2} fill="url(#focusG)" />
                    <Area type="monotone" dataKey="distraction" stroke="var(--neon-pink)" strokeWidth={2} fill="url(#distG)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="AI Suggestions" right={<Lightbulb className="size-4" style={{ color: "var(--neon-cyan)" }} />}>
              <ul className="space-y-3">
                {[
                  "Add a 5-minute break around 11:20 — engagement consistently drops then.",
                  "Row 5 shows 23% lower focus. Consider rotating seating weekly.",
                  "Tuesday afternoon classes outperform Friday by 14% — mirror format.",
                  "Phone usage spikes 8 min into lectures. Try a quick interactive prompt.",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="size-6 shrink-0 rounded-lg bg-gradient-purple grid place-items-center text-xs font-medium text-background">{i + 1}</span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-5 grid lg:grid-cols-3 gap-5">
            <Card title="Subject-wise engagement">
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={subjectData}>
                    <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                    <XAxis dataKey="name" stroke="oklch(1 0 0 / 40%)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.035 270)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                    <RLegend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="focus" fill="var(--neon-cyan)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="attendance" fill="var(--neon-purple)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Engagement heatmap" subtitle="Seat × time">
              <Heatmap />
            </Card>

            <Card title="Weekly report" right={<BookOpen className="size-4 text-muted-foreground" />}>
              <div className="h-40">
                <ResponsiveContainer>
                  <LineChart data={weekly}>
                    <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                    <XAxis dataKey="day" stroke="oklch(1 0 0 / 40%)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis hide domain={[60, 100]} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.035 270)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="focus" stroke="var(--neon-pink)" strokeWidth={2.5} dot={{ fill: "var(--neon-pink)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Mini label="Best day" value="Sat" />
                <Mini label="Avg focus" value="79%" />
                <Mini label="Trend" value="↑ 6%" tone="success" />
              </div>
            </Card>
          </div>
        </div>
        <div className="h-16" />
      </section>
    </Layout>
  );
}

function Header() {
  return (
    <div className="glass-strong rounded-2xl px-6 py-5 flex flex-wrap items-center gap-4 justify-between">
      <div>
        <div className="text-xs font-mono text-muted-foreground">TEACHER DASHBOARD</div>
        <h1 className="text-2xl font-semibold mt-0.5">Good afternoon, Prof. Sharma</h1>
        <p className="text-sm text-muted-foreground">Class CS-204 · Hall A · 32 students enrolled</p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-xl glass-strong text-sm">Export PDF</button>
        <button className="px-4 py-2 rounded-xl bg-gradient-primary text-background text-sm font-medium">Generate Report</button>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, delta, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: number; tone?: "success" | "danger" | "warning" }) {
  const up = delta >= 0;
  const c = tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-success";
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="size-9 rounded-xl bg-white/5 grid place-items-center">
          <Icon className="size-4" />
        </div>
        <span className={`text-xs flex items-center gap-1 ${up ? "text-success" : "text-danger"}`}>
          {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}{Math.abs(delta)}
        </span>
      </div>
      <div className={`mt-4 text-3xl font-semibold ${c}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

function Card({ title, subtitle, right, children, className = "" }: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-xs px-2 py-1 rounded-md bg-success/10 text-success border border-success/30">{children}</span>;
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="px-2 py-2 rounded-lg bg-white/5">
      <div className={`text-sm font-semibold ${tone === "success" ? "text-success" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function Heatmap() {
  const rows = 6, cols = 8;
  const cells = Array.from({ length: rows * cols }, (_, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    const v = Math.max(0.1, Math.min(1, 0.5 + Math.sin(r * 0.7) * 0.3 + Math.cos(c * 0.6) * 0.25));
    return v;
  });
  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {cells.map((v, i) => (
        <div
          key={i}
          className="aspect-square rounded-md"
          style={{
            background: `oklch(${0.4 + v * 0.4} ${0.18} ${200 + (1 - v) * 90})`,
            boxShadow: v > 0.7 ? `0 0 8px oklch(0.85 0.18 200 / ${v * 0.6})` : "none",
          }}
          title={`${Math.round(v * 100)}%`}
        />
      ))}
    </div>
  );
}
