import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, BrainCircuit, Camera, ChartNoAxesCombined,
  Eye, Lock, Moon, ScanFace, Smartphone, Sparkles, Zap, ArrowRight,
  Cpu, Cloud, Gauge, Mic, CalendarCheck, FileBarChart, Lightbulb,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";
import hero from "@/assets/hero-classroom.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FocusAI — AI-Powered Classroom Focus Monitoring" },
      { name: "description", content: "Real-time student engagement detection using AI and computer vision. Privacy-first edge processing for modern classrooms." },
      { property: "og:title", content: "FocusAI — AI Classroom Smart Camera" },
      { property: "og:description", content: "Real-time student engagement detection using AI and computer vision." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Tech />
      <Future />
      <CTA />
    </Layout>
  );
}

function Hero() {
  return (
    <section className="relative px-4">
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="relative mx-auto max-w-7xl pt-10 pb-24 grid lg:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success pulse-dot" />
            AI System Active · v1.0
          </div>
          <h1 className="mt-5 text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight">
            AI-Powered <span className="text-gradient">Classroom Focus</span> Monitoring
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Real-time student engagement detection using AI and computer vision.
            Help educators see attention patterns the human eye can't.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/teacher" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-background font-medium glow-purple hover:scale-[1.03] transition-transform">
              View Dashboard <ArrowRight className="size-4" />
            </Link>
            <Link to="/monitoring" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass-strong hover:bg-white/10 transition">
              <Eye className="size-4" /> Live Demo
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { k: "98.4%", v: "Detection accuracy" },
              { k: "<40ms", v: "Edge latency" },
              { k: "0", v: "Video stored" },
            ].map((s) => (
              <div key={s.v} className="glass rounded-xl px-3 py-3">
                <div className="text-lg font-semibold text-gradient">{s.k}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-6 relative"
        >
          <div className="absolute -inset-10 bg-gradient-purple opacity-20 blur-3xl rounded-full" />
          <div className="relative rounded-3xl overflow-hidden glass-strong glow-purple float">
            <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-background/80 to-transparent">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="size-2 rounded-full bg-danger pulse-dot" />
                LIVE · CAM-04
              </div>
              <div className="text-xs font-mono text-muted-foreground">1920×1080 · 30fps</div>
            </div>
            <div className="relative scan-line">
              <img src={hero} alt="AI classroom" className="w-full h-auto" width={1920} height={1080} />
              {/* detection boxes overlay */}
              <DetectionBox style={{ top: "55%", left: "8%", width: "14%", height: "30%" }} label="Focused" tone="success" />
              <DetectionBox style={{ top: "52%", left: "26%", width: "13%", height: "32%" }} label="Focused" tone="success" />
              <DetectionBox style={{ top: "58%", left: "60%", width: "13%", height: "30%" }} label="Distracted" tone="danger" />
              <DetectionBox style={{ top: "55%", left: "78%", width: "14%", height: "32%" }} label="Sleeping" tone="warning" />
            </div>
            <div className="grid grid-cols-3 gap-px bg-border/60">
              {[
                { l: "Attention", v: "82%", c: "text-success" },
                { l: "Distraction", v: "11%", c: "text-danger" },
                { l: "Drowsy", v: "7%", c: "text-warning" },
              ].map((m) => (
                <div key={m.l} className="bg-card/60 px-4 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{m.l}</div>
                  <div className={`text-xl font-semibold ${m.c}`}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DetectionBox({
  style, label, tone,
}: { style: React.CSSProperties; label: string; tone: "success" | "danger" | "warning" }) {
  const color = tone === "success" ? "border-success" : tone === "danger" ? "border-danger" : "border-warning";
  const bg = tone === "success" ? "bg-success" : tone === "danger" ? "bg-danger" : "bg-warning";
  return (
    <div className={`absolute border-2 ${color} rounded-md`} style={{ ...style, boxShadow: "0 0 18px currentColor" }}>
      <div className={`absolute -top-5 left-0 text-[10px] font-mono px-1.5 py-0.5 rounded ${bg} text-background`}>
        {label}
      </div>
    </div>
  );
}

function Stats() {
  const stats = [
    { v: 82, label: "of teachers struggle to track student attention" },
    { v: 78, label: "of students lose focus during long lectures" },
    { v: 64, label: "are distracted by phones and notifications" },
  ];
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-7xl glass-strong rounded-3xl p-8 md:p-12 grid md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="text-center"
          >
            <div className="text-6xl font-semibold text-gradient">{s.v}%</div>
            <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const features = [
  { i: ScanFace, t: "Real-Time Focus Detection", d: "Per-student attention scoring updated 30 times per second." },
  { i: Moon, t: "Sleep Detection", d: "Detects micro-sleep and drowsiness with eye-aspect-ratio analysis." },
  { i: Smartphone, t: "Mobile Distraction Detection", d: "Identifies phone usage and off-task behaviors instantly." },
  { i: AlertTriangle, t: "Teacher Alert System", d: "Discreet on-device alerts when engagement drops below threshold." },
  { i: ChartNoAxesCombined, t: "AI Analytics Dashboard", d: "Heatmaps, trends, and engagement insights — all in one place." },
  { i: Lock, t: "Privacy Protected", d: "Edge processing. No video stored. Only anonymized signals leave the device." },
];

function Features() {
  return (
    <section className="px-4 py-20" id="features">
      <div className="mx-auto max-w-7xl">
        <SectionHead overline="Capabilities" title="Designed for the modern classroom" subtitle="Six core systems working together to surface what matters." />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group glass rounded-2xl p-6 hover:bg-white/5 transition"
            >
              <div className="size-11 rounded-xl bg-gradient-cyan grid place-items-center mb-4 group-hover:scale-110 transition-transform">
                <f.i className="size-5 text-background" />
              </div>
              <h3 className="font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { i: Camera, t: "Camera scans classroom", d: "Ceiling-mounted cameras stream encrypted frames to the on-prem edge node." },
    { i: BrainCircuit, t: "AI analyzes engagement", d: "Vision models detect focus, drowsiness, and distraction in real-time." },
    { i: Activity, t: "Teacher receives insights", d: "Live alerts and rich post-class analytics — no video ever leaves the device." },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHead overline="How it works" title="From frame to insight in 40ms" />
        <div className="mt-12 grid md:grid-cols-3 gap-5 relative">
          {steps.map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-6 relative"
            >
              <div className="text-xs font-mono text-muted-foreground">STEP 0{i + 1}</div>
              <div className="size-12 rounded-xl bg-gradient-purple grid place-items-center my-4 glow-purple">
                <s.i className="size-5 text-background" />
              </div>
              <h3 className="font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tech() {
  const items = [
    { i: Eye, t: "Computer Vision" },
    { i: BrainCircuit, t: "AI Detection" },
    { i: ScanFace, t: "Facial Attention Tracking" },
    { i: Gauge, t: "Analytics Engine" },
    { i: Cpu, t: "Edge Processing" },
    { i: Cloud, t: "Cloud Dashboard" },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHead overline="Stack" title="Built on a modern AI vision pipeline" />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((it) => (
            <div key={it.t} className="glass rounded-xl p-5 text-center hover:bg-white/5 transition">
              <it.i className="size-6 mx-auto text-cyan" style={{ color: "var(--neon-cyan)" }} />
              <div className="mt-3 text-sm">{it.t}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Future() {
  const items = [
    { i: Sparkles, t: "Emotion detection", d: "Subtle affective state recognition for empathetic teaching." },
    { i: Mic, t: "Voice analysis", d: "Audio cues for engagement and classroom dynamics." },
    { i: CalendarCheck, t: "Smart attendance", d: "Frictionless face-based attendance, instantly synced." },
    { i: FileBarChart, t: "Auto report generation", d: "Per-class and per-student PDF reports with one click." },
    { i: Lightbulb, t: "Learning recommendations", d: "AI suggests pacing changes based on engagement curves." },
  ];
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHead overline="Roadmap" title="Future scope" subtitle="Where the platform is heading next." />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass rounded-2xl p-6"
            >
              <f.i className="size-6" style={{ color: "var(--neon-pink)" }} />
              <h3 className="mt-3 font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-5xl glass-strong rounded-3xl p-12 text-center relative overflow-hidden glow-purple">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <Zap className="size-8 mx-auto" style={{ color: "var(--neon-cyan)" }} />
        <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
          Ready to see your classroom <span className="text-gradient">in a new light?</span>
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Step into the live monitoring view and explore the dashboard built for educators.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/monitoring" className="px-5 py-3 rounded-xl bg-gradient-primary text-background font-medium glow-purple">
            Open Live Monitor
          </Link>
          <Link to="/teacher" className="px-5 py-3 rounded-xl glass-strong">
            Teacher Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ overline, title, subtitle }: { overline: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--neon-cyan)" }}>{overline}</div>
      <h2 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
