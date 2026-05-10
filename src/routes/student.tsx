import { createFileRoute } from "@tanstack/react-router";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  RadialBar, RadialBarChart, PolarAngleAxis,
} from "recharts";
import { Award, Flame, Sparkles, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { motion } from "framer-motion";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard · FocusAI" },
      { name: "description", content: "Personal focus analytics, productivity suggestions and improvement tracking." },
    ],
  }),
  component: Student,
});

const daily = Array.from({ length: 8 }, (_, i) => ({
  h: `${9 + i}:00`,
  focus: 60 + Math.round(Math.sin(i * 0.9) * 18 + i * 2),
}));
const weekly = [
  { d: "Mon", v: 72 }, { d: "Tue", v: 78 }, { d: "Wed", v: 70 },
  { d: "Thu", v: 84 }, { d: "Fri", v: 81 }, { d: "Sat", v: 88 },
];

function Student() {
  return (
    <Layout>
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="glass-strong rounded-2xl px-6 py-5 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-gradient-primary grid place-items-center font-semibold text-background text-lg glow-purple">AR</div>
              <div>
                <div className="text-xs font-mono text-muted-foreground">STUDENT DASHBOARD</div>
                <h1 className="text-2xl font-semibold mt-0.5">Hi, Aarav</h1>
                <p className="text-sm text-muted-foreground">Grade 12 · Roll #24 · Stream: Science</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Streak days={12} />
            </div>
          </div>

          <div className="mt-5 grid lg:grid-cols-3 gap-5">
            <Card title="Personal focus" subtitle="this week">
              <Radial value={84} />
              <p className="text-center text-sm text-muted-foreground mt-2">+6% vs last week</p>
            </Card>

            <Card className="lg:col-span-2" title="Daily focus" subtitle="hour by hour">
              <div className="h-56">
                <ResponsiveContainer>
                  <AreaChart data={daily} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                    <XAxis dataKey="h" stroke="oklch(1 0 0 / 40%)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(1 0 0 / 40%)" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "oklch(0.21 0.035 270)", border: "1px solid oklch(1 0 0 / 10%)", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="focus" stroke="var(--neon-purple)" strokeWidth={2.5} fill="url(#sg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="mt-5 grid lg:grid-cols-3 gap-5">
            <Card title="Weekly improvement">
              <div className="space-y-3 mt-2">
                {weekly.map((w) => (
                  <div key={w.d}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-mono">{w.d}</span><span>{w.v}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} whileInView={{ width: `${w.v}%` }} transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Achievement badges">
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[
                  { i: Trophy, l: "Top 10%", earned: true },
                  { i: Flame, l: "12-day streak", earned: true },
                  { i: Target, l: "Focus 90+", earned: true },
                  { i: Zap, l: "Quick learner", earned: true },
                  { i: Award, l: "No phone week", earned: false },
                  { i: Sparkles, l: "Perfect week", earned: false },
                ].map((b) => (
                  <div key={b.l} className={`rounded-xl p-3 text-center ${b.earned ? "glass glow-purple" : "border border-dashed border-border opacity-50"}`}>
                    <b.i className={`size-5 mx-auto ${b.earned ? "" : "text-muted-foreground"}`} style={b.earned ? { color: "var(--neon-pink)" } : undefined} />
                    <div className="text-[10px] mt-2">{b.l}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="AI productivity tips">
              <ul className="space-y-3 mt-1">
                {[
                  "Your focus peaks 10–11 AM. Schedule hard subjects then.",
                  "You lose 18% attention after 35 mins. Try Pomodoro 35/5.",
                  "Phone glances spike on Tuesdays — keep it in the bag.",
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="size-6 shrink-0 rounded-lg bg-gradient-cyan grid place-items-center text-xs font-medium text-background">{i + 1}</span>
                    <span className="text-muted-foreground">{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-5 grid md:grid-cols-3 gap-5">
            <Card title="Distraction history" subtitle="last 7 days">
              <div className="space-y-2 text-sm">
                {[
                  { d: "Today", c: 3, k: "Phone (2), Talking (1)" },
                  { d: "Yesterday", c: 1, k: "Daydreaming" },
                  { d: "2 days ago", c: 5, k: "Phone (3), Drowsy (2)" },
                  { d: "3 days ago", c: 0, k: "Clean session" },
                ].map((d) => (
                  <div key={d.d} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <div className="font-medium">{d.d}</div>
                      <div className="text-xs text-muted-foreground">{d.k}</div>
                    </div>
                    <span className={`text-sm font-mono ${d.c === 0 ? "text-success" : d.c > 3 ? "text-danger" : "text-warning"}`}>{d.c}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Improvement level" className="md:col-span-2">
              <div className="flex items-center gap-6">
                <div className="text-5xl font-semibold text-gradient">Lvl 7</div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span>1,240 / 1,800 XP</span>
                    <span className="text-muted-foreground">560 to Lvl 8</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "69%" }} transition={{ duration: 1 }} className="h-full bg-gradient-primary glow-purple" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-white/5 flex items-center gap-1"><TrendingUp className="size-3" /> +120 XP today</span>
                    <span className="px-2 py-1 rounded-md bg-white/5 flex items-center gap-1"><Flame className="size-3 text-warning" /> 12-day streak</span>
                    <span className="px-2 py-1 rounded-md bg-white/5">Avg attention: 84%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
        <div className="h-16" />
      </section>
    </Layout>
  );
}

function Card({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-5 ${className}`}>
      <div className="mb-3">
        <h3 className="font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Radial({ value }: { value: number }) {
  const data = [{ name: "focus", value, fill: "var(--neon-cyan)" }];
  return (
    <div className="relative h-48">
      <ResponsiveContainer>
        <RadialBarChart innerRadius="75%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar background={{ fill: "oklch(1 0 0 / 6%)" }} dataKey="value" cornerRadius={20} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-semibold text-gradient">{value}%</div>
          <div className="text-[11px] text-muted-foreground font-mono">attention score</div>
        </div>
      </div>
    </div>
  );
}

function Streak({ days }: { days: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-strong">
      <Flame className="size-4 text-warning" />
      <div>
        <div className="text-xs text-muted-foreground">Focus streak</div>
        <div className="font-semibold leading-tight">{days} days</div>
      </div>
    </div>
  );
}
