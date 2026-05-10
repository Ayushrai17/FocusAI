import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertTriangle, Bell, Camera, Eye, Smartphone, Users, Wifi, Moon } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import feed from "@/assets/classroom-feed.jpg";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Live Monitoring · FocusAI" },
      { name: "description", content: "Real-time AI classroom monitoring dashboard with live focus, distraction and drowsiness detection." },
    ],
  }),
  component: Monitor,
});

type Tone = "success" | "danger" | "warning";
const boxes: { top: string; left: string; w: string; h: string; label: string; tone: Tone; conf: number }[] = [
  { top: "48%", left: "4%", w: "13%", h: "30%", label: "Focused", tone: "success", conf: 96 },
  { top: "44%", left: "20%", w: "12%", h: "32%", label: "Focused", tone: "success", conf: 92 },
  { top: "44%", left: "36%", w: "13%", h: "33%", label: "Distracted", tone: "danger", conf: 88 },
  { top: "46%", left: "53%", w: "12%", h: "31%", label: "Focused", tone: "success", conf: 95 },
  { top: "44%", left: "68%", w: "13%", h: "33%", label: "Sleeping", tone: "warning", conf: 81 },
  { top: "46%", left: "84%", w: "13%", h: "31%", label: "Focused", tone: "success", conf: 90 },
  { top: "30%", left: "12%", w: "10%", h: "20%", label: "Focused", tone: "success", conf: 89 },
  { top: "30%", left: "44%", w: "10%", h: "20%", label: "Distracted", tone: "danger", conf: 84 },
  { top: "30%", left: "70%", w: "10%", h: "20%", label: "Focused", tone: "success", conf: 91 },
];

const allAlerts = [
  { i: Eye, t: "Student #12 distracted for 3 min", tone: "danger" as Tone },
  { i: Smartphone, t: "Phone usage detected · Row 3", tone: "danger" as Tone },
  { i: Users, t: "Low engagement in back rows", tone: "warning" as Tone },
  { i: AlertTriangle, t: "Class attention dropping (−12%)", tone: "warning" as Tone },
  { i: Moon, t: "Drowsiness detected · Student #7", tone: "warning" as Tone },
  { i: Eye, t: "Focus restored · Student #4", tone: "success" as Tone },
];

function Monitor() {
  const [time, setTime] = useState(() => new Date());
  const [alerts, setAlerts] = useState(allAlerts.slice(0, 4).map((a, i) => ({ ...a, id: i, ts: minsAgo(i * 2 + 1) })));

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAlerts((prev) => {
        const next = allAlerts[Math.floor(Math.random() * allAlerts.length)];
        return [{ ...next, id: Date.now(), ts: "just now" }, ...prev].slice(0, 6);
      });
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <Layout>
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          {/* Top bar */}
          <div className="glass-strong rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs font-mono text-muted-foreground">CURRENT LECTURE</div>
                <div className="font-semibold">CS-204 · Data Structures · Hall A</div>
              </div>
              <div className="hidden md:block h-8 w-px bg-border" />
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-success pulse-dot" />
                <span className="font-mono text-xs">AI scanning · 30fps</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono text-muted-foreground">{time.toLocaleDateString()}</div>
                <div className="font-mono text-sm">{time.toLocaleTimeString()}</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-gradient-cyan text-background text-xs font-medium glow-cyan">
                AI System Active
              </div>
            </div>
          </div>

          <div className="mt-5 grid lg:grid-cols-12 gap-5">
            {/* Camera feed */}
            <div className="lg:col-span-8 space-y-5">
              <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="size-4" style={{ color: "var(--neon-cyan)" }} />
                    <span>CAM-04 · Hall A · Wide</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1"><Wifi className="size-3" /> 1080p · 30fps</span>
                    <span className="flex items-center gap-1 text-danger"><span className="size-1.5 bg-danger rounded-full pulse-dot" /> REC</span>
                  </div>
                </div>
                <div className="relative scan-line">
                  <img src={feed} alt="classroom feed" className="w-full h-auto" loading="lazy" width={1280} height={1280} />
                  {boxes.map((b, i) => (
                    <Box key={i} {...b} />
                  ))}
                  {/* corner brackets */}
                  <div className="absolute top-3 left-3 size-6 border-l-2 border-t-2 border-cyan" style={{ borderColor: "var(--neon-cyan)" }} />
                  <div className="absolute top-3 right-3 size-6 border-r-2 border-t-2" style={{ borderColor: "var(--neon-cyan)" }} />
                  <div className="absolute bottom-3 left-3 size-6 border-l-2 border-b-2" style={{ borderColor: "var(--neon-cyan)" }} />
                  <div className="absolute bottom-3 right-3 size-6 border-r-2 border-b-2" style={{ borderColor: "var(--neon-cyan)" }} />
                </div>
                <div className="grid grid-cols-4 gap-px bg-border/60">
                  <Stat label="Total" value="32" />
                  <Stat label="Focused" value="24" tone="success" />
                  <Stat label="Distracted" value="5" tone="danger" />
                  <Stat label="Drowsy" value="3" tone="warning" />
                </div>
              </div>

              {/* Engagement timeline */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Live engagement timeline</h3>
                  <span className="text-xs font-mono text-muted-foreground">last 60s · rolling</span>
                </div>
                <Sparkline />
              </div>
            </div>

            {/* Alerts panel */}
            <div className="lg:col-span-4 space-y-5">
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2"><Bell className="size-4" style={{ color: "var(--neon-pink)" }} /> Live alerts</h3>
                  <span className="text-xs font-mono text-muted-foreground">{alerts.length} active</span>
                </div>
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {alerts.map((a) => (
                      <motion.div
                        key={a.id}
                        layout
                        initial={{ opacity: 0, x: 30, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${
                          a.tone === "danger" ? "border-danger/40 bg-danger/5" :
                          a.tone === "warning" ? "border-warning/40 bg-warning/5" :
                          "border-success/40 bg-success/5"
                        }`}
                      >
                        <a.i className={`size-4 mt-0.5 ${a.tone === "danger" ? "text-danger" : a.tone === "warning" ? "text-warning" : "text-success"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{a.t}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{a.ts}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Engagement by row</h3>
                <div className="space-y-3">
                  {[
                    { l: "Row 1", v: 94 },
                    { l: "Row 2", v: 88 },
                    { l: "Row 3", v: 71 },
                    { l: "Row 4", v: 58 },
                    { l: "Row 5", v: 46 },
                  ].map((r) => (
                    <div key={r.l}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-mono">{r.l}</span>
                        <span className={r.v > 75 ? "text-success" : r.v > 60 ? "text-warning" : "text-danger"}>{r.v}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${r.v}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full rounded-full ${
                            r.v > 75 ? "bg-gradient-cyan" : r.v > 60 ? "bg-warning" : "bg-danger"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-3">Detection legend</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <Legend color="success" label="Focused" />
                  <Legend color="danger" label="Distracted" />
                  <Legend color="warning" label="Sleeping" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-20" />
      </section>
    </Layout>
  );
}

function Box({ top, left, w, h, label, tone, conf }: { top: string; left: string; w: string; h: string; label: string; tone: Tone; conf: number }) {
  const c = tone === "success" ? "var(--success)" : tone === "danger" ? "var(--danger)" : "var(--warning)";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute rounded-md"
      style={{
        top, left, width: w, height: h,
        border: `2px solid ${c}`,
        boxShadow: `0 0 14px ${c}`,
      }}
    >
      <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono text-background"
        style={{ background: c }}>
        {label} · {conf}%
      </div>
    </motion.div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: Tone }) {
  const c = tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="bg-card/60 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className={`text-xl font-semibold ${c}`}>{value}</div>
    </div>
  );
}

function Legend({ color, label }: { color: "success" | "danger" | "warning"; label: string }) {
  const c = `var(--${color})`;
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5">
      <span className="size-2.5 rounded-sm" style={{ background: c, boxShadow: `0 0 10px ${c}` }} />
      <span>{label}</span>
    </div>
  );
}

function Sparkline() {
  // Generate animated wave
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1500);
    return () => clearInterval(t);
  }, []);
  const points = Array.from({ length: 60 }, (_, i) => {
    const v = 70 + Math.sin((i + tick) * 0.4) * 12 + Math.cos((i + tick) * 0.7) * 6;
    return { x: i, y: Math.max(40, Math.min(95, v)) };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(p.x / 59) * 100} ${100 - p.y}`).join(" ");
  const area = `${path} L 100 100 L 0 100 Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-32">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g1)" />
      <path d={path} fill="none" stroke="var(--neon-cyan)" strokeWidth="0.6" />
    </svg>
  );
}

function minsAgo(m: number) { return `${m}m ago`; }
