import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle, BarChart3, BrainCircuit, Camera, Eye, EyeOff,
  Flame, Lock, ScanFace, Sparkles, VideoOff,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features · FocusAI" },
      { name: "description", content: "Detailed feature set: AI camera detection, real-time monitoring, smart alerts, heatmaps, privacy-first design." },
    ],
  }),
  component: Features,
});

const items = [
  { i: Camera, t: "AI Camera Detection", d: "Multi-camera fusion with sub-pixel face localization." },
  { i: Eye, t: "Real-Time Monitoring", d: "Frame-level engagement scoring at 30fps with edge inference." },
  { i: AlertTriangle, t: "Smart Alerts", d: "Discreet, threshold-based notifications for educators." },
  { i: BarChart3, t: "Focus Analytics", d: "Daily, weekly and per-subject engagement breakdowns." },
  { i: Flame, t: "Heatmaps", d: "Seat × time engagement maps reveal hidden patterns." },
  { i: EyeOff, t: "Privacy Mode", d: "On-the-fly face blurring on any teacher-facing display." },
  { i: VideoOff, t: "No Video Storage", d: "All frames discarded after inference. Only signals persist." },
  { i: BrainCircuit, t: "AI Recommendations", d: "GPT-grade suggestions tailored to your class' patterns." },
  { i: ScanFace, t: "Re-Identification", d: "Per-student tracking without storing identifying biometrics." },
];

function Features() {
  return (
    <Layout>
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono">
              <Sparkles className="size-3" style={{ color: "var(--neon-cyan)" }} /> Capabilities
            </div>
            <h1 className="mt-5 text-5xl md:text-6xl font-semibold tracking-tight">
              Every detail, <span className="text-gradient">engineered for the classroom</span>
            </h1>
            <p className="mt-4 text-muted-foreground">
              Nine systems, one cohesive product. Built privacy-first and fast at the edge.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group relative glass rounded-2xl p-6 overflow-hidden hover:bg-white/5 transition"
              >
                <div className="absolute -top-20 -right-20 size-40 rounded-full bg-gradient-purple opacity-0 group-hover:opacity-30 blur-3xl transition-opacity" />
                <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center mb-5 glow-cyan group-hover:scale-110 transition-transform">
                  <f.i className="size-5 text-background" />
                </div>
                <h3 className="font-semibold text-lg">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
                <div className="mt-5 text-xs font-mono text-muted-foreground flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-success pulse-dot" /> production-ready
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 glass-strong rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Lock className="size-7" style={{ color: "var(--neon-cyan)" }} />
              <h2 className="mt-4 text-3xl font-semibold">Privacy is the product</h2>
              <p className="mt-3 text-muted-foreground">
                Frames are processed locally on the edge node. Faces are never sent to the cloud.
                Only anonymized signals — focus, drowsiness, distraction — leave the device.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/monitoring" className="px-5 py-3 rounded-xl bg-gradient-primary text-background font-medium glow-purple">See it live</Link>
                <Link to="/teacher" className="px-5 py-3 rounded-xl glass-strong">Open dashboard</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "0", v: "Frames stored" },
                { k: "100%", v: "Edge processed" },
                { k: "GDPR", v: "Compliant" },
                { k: "AES-256", v: "In-transit" },
              ].map((s) => (
                <div key={s.v} className="glass rounded-xl p-5 text-center">
                  <div className="text-3xl font-semibold text-gradient">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
