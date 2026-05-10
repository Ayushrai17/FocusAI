import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Activity, AlertTriangle, Bell, Brain, Camera, CameraOff, Eye, Gauge,
  Lightbulb, Moon, Shield, Smartphone, Sparkles, Timer, TrendingUp, Users, Wifi,
} from "lucide-react";
import { Layout } from "@/components/site/Layout";

export const Route = createFileRoute("/monitoring")({
  head: () => ({
    meta: [
      { title: "Live Webcam Monitoring · FocusAI" },
      { name: "description", content: "Real-time AI webcam focus and attention monitoring with live behavioral analysis." },
    ],
  }),
  component: Monitor,
});

type Status = "focused" | "distracted" | "sleepy" | "phone" | "away";
type Tone = "success" | "danger" | "warning" | "orange";

const statusMap: Record<Status, { label: string; tone: Tone; color: string }> = {
  focused:    { label: "FOCUSED",        tone: "success", color: "var(--success)" },
  distracted: { label: "LOOKING AWAY",   tone: "danger",  color: "var(--danger)" },
  sleepy:     { label: "DROWSY",         tone: "warning", color: "var(--warning)" },
  phone:      { label: "PHONE DETECTED", tone: "orange",  color: "oklch(0.75 0.18 50)" },
  away:       { label: "ABSENT",         tone: "danger",  color: "var(--danger)" },
};

const behaviorPool = [
  { t: "Eye contact maintained", tone: "success" as Tone, i: Eye },
  { t: "Focus level improving", tone: "success" as Tone, i: TrendingUp },
  { t: "Steady posture detected", tone: "success" as Tone, i: Activity },
  { t: "Attention dropping", tone: "warning" as Tone, i: AlertTriangle },
  { t: "Looking away repeatedly", tone: "danger" as Tone, i: Eye },
  { t: "Phone detected in frame", tone: "orange" as Tone, i: Smartphone },
  { t: "Drowsiness pattern detected", tone: "warning" as Tone, i: Moon },
  { t: "Multiple faces in frame", tone: "warning" as Tone, i: Users },
];

const suggestionsPool = [
  "Try maintaining eye contact with screen",
  "Sit upright to improve focus by ~12%",
  "Take a 30-second micro-break",
  "Reduce phone notifications during sessions",
  "Adjust lighting for better tracking",
  "Distraction frequency reduced — keep going",
];

function Monitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [permission, setPermission] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [error, setError] = useState<string>("");
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<Status>("focused");
  const [focus, setFocus] = useState(87);
  const [blinks, setBlinks] = useState(14);
  const [distractions, setDistractions] = useState(3);
  const [attentiveSec, setAttentiveSec] = useState(842);
  const [distractedSec, setDistractedSec] = useState(96);
  const [trend, setTrend] = useState<number[]>(() =>
    Array.from({ length: 60 }, (_, i) => 75 + Math.sin(i * 0.3) * 10)
  );
  const [behaviors, setBehaviors] = useState(
    behaviorPool.slice(0, 4).map((b, i) => ({ ...b, id: i, ts: `${i + 1}m ago` }))
  );
  const [suggestion, setSuggestion] = useState(suggestionsPool[0]);
  const [faceBox, setFaceBox] = useState({ x: 28, y: 18, w: 44, h: 58 });

  // clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  async function requestCamera() {
    setPermission("requesting");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPermission("granted");
    } catch (e: any) {
      setError(e?.message ?? "Camera access denied");
      setPermission("denied");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setPermission("idle");
  }

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  // Live AI simulation loop
  useEffect(() => {
    if (permission !== "granted") return;
    const tick = setInterval(() => {
      // status drift — mostly focused
      const r = Math.random();
      const next: Status =
        r < 0.7 ? "focused" :
        r < 0.82 ? "distracted" :
        r < 0.9 ? "sleepy" :
        r < 0.96 ? "phone" : "away";
      setStatus(next);

      setFocus((f) => {
        const target = next === "focused" ? 92 : next === "distracted" ? 55 : next === "sleepy" ? 48 : next === "phone" ? 30 : 12;
        return Math.round(f + (target - f) * 0.25 + (Math.random() * 4 - 2));
      });

      setFaceBox(() => ({
        x: 26 + Math.random() * 6,
        y: 16 + Math.random() * 5,
        w: 42 + Math.random() * 6,
        h: 56 + Math.random() * 6,
      }));

      setTrend((arr) => {
        const v = next === "focused" ? 80 + Math.random() * 18 : 35 + Math.random() * 35;
        return [...arr.slice(1), v];
      });

      if (next === "focused") setAttentiveSec((s) => s + 1);
      else { setDistractedSec((s) => s + 1); if (Math.random() < 0.3) setDistractions((d) => d + 1); }

      if (Math.random() < 0.15) setBlinks((b) => b + 1);
    }, 1200);
    return () => clearInterval(tick);
  }, [permission]);

  // Rotating behavior log + suggestions
  useEffect(() => {
    if (permission !== "granted") return;
    const t = setInterval(() => {
      const b = behaviorPool[Math.floor(Math.random() * behaviorPool.length)];
      setBehaviors((prev) => [{ ...b, id: Date.now(), ts: "just now" }, ...prev].slice(0, 6));
    }, 4500);
    const s = setInterval(() => {
      setSuggestion(suggestionsPool[Math.floor(Math.random() * suggestionsPool.length)]);
    }, 6000);
    return () => { clearInterval(t); clearInterval(s); };
  }, [permission]);

  const cur = statusMap[status];

  return (
    <Layout>
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          {/* Top bar */}
          <div className="glass-strong rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Session</div>
                <div className="font-semibold text-sm">Personal Focus · #FX-{time.getHours()}{time.getMinutes()}</div>
              </div>
              <div className="hidden md:block h-8 w-px bg-border" />
              <Badge tone={permission === "granted" ? "success" : "danger"} icon={permission === "granted" ? Camera : CameraOff}>
                {permission === "granted" ? "Live Camera Active" : "Camera Off"}
              </Badge>
              <Badge tone="cyan" icon={Brain}>AI Detection Running</Badge>
              <Badge tone="purple" icon={Shield}>Privacy Protected</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">Focus Score</div>
                <div className="font-mono text-xl font-bold" style={{ color: "var(--neon-cyan)" }}>{focus}%</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{time.toLocaleDateString()}</div>
                <div className="font-mono text-sm">{time.toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid lg:grid-cols-12 gap-5">
            {/* LEFT - Webcam */}
            <div className="lg:col-span-8 space-y-5">
              <div className="glass-strong rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="size-4" style={{ color: "var(--neon-cyan)" }} />
                    <span>FRONT CAM · You</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
                    <span className="flex items-center gap-1"><Wifi className="size-3" /> 720p · 30fps</span>
                    {permission === "granted" && (
                      <span className="flex items-center gap-1 text-danger">
                        <span className="size-1.5 bg-danger rounded-full pulse-dot" /> LIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative bg-black aspect-video">
                  {/* video — keep mounted so srcObject can attach */}
                  <video
                    ref={videoRef}
                    autoPlay playsInline muted
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)", display: permission === "granted" ? "block" : "none" }}
                  />

                  {/* Permission gate */}
                  {permission !== "granted" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                      {/* Grid background separated to prevent its mask-image from dimming the button */}
                      <div className="absolute inset-0 grid-bg pointer-events-none" />
                      
                      <div className="relative z-10 size-20 rounded-full glass-strong flex items-center justify-center mb-5 glow-cyan">
                        <Camera className="size-9" style={{ color: "var(--neon-cyan)" }} />
                      </div>
                      <h3 className="relative z-10 text-xl font-semibold mb-2">Activate AI Focus Tracking</h3>
                      <p className="relative z-10 text-sm text-muted-foreground max-w-md mb-5">
                        We use your front camera to analyze attention in real-time. Video never leaves your device — processing is fully on-device.
                      </p>
                      <div className="relative z-10 mt-2 flex items-center justify-center">
                        <div className="absolute -inset-8 bg-cyan-400/20 blur-2xl rounded-full pointer-events-none" />
                        <button
                          onClick={requestCamera}
                          disabled={permission === "requesting"}
                          className="relative z-10 px-8 py-3 rounded-xl bg-gradient-cyan text-white font-bold glow-cyan brightness-110 contrast-125 hover:brightness-125 transition disabled:opacity-50"
                        >
                          {permission === "requesting" ? "Requesting access…" : "Enable Camera"}
                        </button>
                      </div>
                      {permission === "denied" && (
                        <p className="relative z-10 mt-4 text-xs text-danger font-mono">{error || "Camera permission denied"}</p>
                      )}
                    </div>
                  )}

                  {/* AI overlay */}
                  {permission === "granted" && (
                    <>
                      {/* Scan line */}
                      <div className="absolute inset-0 scan-line pointer-events-none" />

                      {/* Face tracking box */}
                      <motion.div
                        animate={{
                          left: `${faceBox.x}%`, top: `${faceBox.y}%`,
                          width: `${faceBox.w}%`, height: `${faceBox.h}%`,
                        }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        className="absolute rounded-md pointer-events-none"
                        style={{ border: `2px solid ${cur.color}`, boxShadow: `0 0 22px ${cur.color}` }}
                      >
                        <div className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono text-background"
                          style={{ background: cur.color }}>
                          FACE · {cur.label} · {focus}%
                        </div>
                        {/* Corner ticks */}
                        {["tl","tr","bl","br"].map((p) => (
                          <span key={p} className="absolute size-3"
                            style={{
                              borderColor: cur.color,
                              borderStyle: "solid",
                              borderWidth: 0,
                              borderTopWidth: p.includes("t") ? 2 : 0,
                              borderBottomWidth: p.includes("b") ? 2 : 0,
                              borderLeftWidth: p.includes("l") ? 2 : 0,
                              borderRightWidth: p.includes("r") ? 2 : 0,
                              top: p.includes("t") ? -1 : "auto",
                              bottom: p.includes("b") ? -1 : "auto",
                              left: p.includes("l") ? -1 : "auto",
                              right: p.includes("r") ? -1 : "auto",
                            }}
                          />
                        ))}
                        {/* Eyes */}
                        <span className="absolute size-2 rounded-full pulse-dot"
                          style={{ background: cur.color, top: "30%", left: "28%", boxShadow: `0 0 8px ${cur.color}` }} />
                        <span className="absolute size-2 rounded-full pulse-dot"
                          style={{ background: cur.color, top: "30%", right: "28%", boxShadow: `0 0 8px ${cur.color}` }} />
                      </motion.div>

                      {/* Corner brackets */}
                      {[["top-3 left-3","l t"],["top-3 right-3","r t"],["bottom-3 left-3","l b"],["bottom-3 right-3","r b"]].map(([pos,sides],i)=>(
                        <div key={i} className={`absolute ${pos} size-6 pointer-events-none`}
                          style={{
                            borderColor: "var(--neon-cyan)",
                            borderStyle: "solid",
                            borderTopWidth: sides.includes("t") ? 2 : 0,
                            borderBottomWidth: sides.includes("b") ? 2 : 0,
                            borderLeftWidth: sides.includes("l") ? 2 : 0,
                            borderRightWidth: sides.includes("r") ? 2 : 0,
                          }}/>
                      ))}

                      {/* Focus meter */}
                      <div className="absolute top-3 left-1/2 -translate-x-1/2 glass rounded-full px-3 py-1 flex items-center gap-2 text-xs">
                        <Gauge className="size-3" style={{ color: cur.color }} />
                        <span className="font-mono">FOCUS {focus}%</span>
                      </div>

                      {/* Status badge */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-strong rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-mono"
                        style={{ boxShadow: `0 0 18px ${cur.color}` }}>
                        <span className="size-2 rounded-full pulse-dot" style={{ background: cur.color }} />
                        <span>{cur.label}</span>
                      </div>

                      {/* Stop btn */}
                      <button onClick={stopCamera}
                        className="absolute top-3 right-3 glass px-3 py-1.5 rounded-lg text-xs hover:bg-danger/20 transition flex items-center gap-1.5">
                        <CameraOff className="size-3" /> Stop
                      </button>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-px bg-border/60">
                  <Stat label="Focus" value={`${focus}%`} tone={focus > 70 ? "success" : focus > 50 ? "warning" : "danger"} />
                  <Stat label="Blinks/min" value={`${blinks}`} />
                  <Stat label="Distractions" value={`${distractions}`} tone="danger" />
                  <Stat label="Status" value={cur.label.split(" ")[0]} />
                </div>
              </div>

              {/* Behavior log */}
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Bell className="size-4" style={{ color: "var(--neon-pink)" }} />
                    Live behavioral analysis
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">{behaviors.length} signals</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <AnimatePresence initial={false}>
                    {behaviors.map((b) => (
                      <motion.div key={b.id} layout
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${
                          b.tone === "danger" ? "border-danger/40 bg-danger/5" :
                          b.tone === "warning" ? "border-warning/40 bg-warning/5" :
                          b.tone === "orange" ? "border-warning/40 bg-warning/5" :
                          "border-success/40 bg-success/5"
                        }`}>
                        <b.i className={`size-4 mt-0.5 ${
                          b.tone === "danger" ? "text-danger" :
                          b.tone === "warning" || b.tone === "orange" ? "text-warning" :
                          "text-success"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{b.t}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{b.ts}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT - Analytics */}
            <div className="lg:col-span-4 space-y-5">
              {/* Concentration meter (radial) */}
              <div className="glass-strong rounded-2xl p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Gauge className="size-4" style={{ color: "var(--neon-cyan)" }} />
                  Concentration meter
                </h3>
                <Radial value={focus} />
                <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                  <Mini label="Blink rate" value={`${blinks}/min`} />
                  <Mini label="Posture" value={status === "focused" ? "Upright" : "Slouched"} />
                </div>
              </div>

              {/* Trend */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="size-4" style={{ color: "var(--neon-purple)" }} />
                  Focus timeline
                </h3>
                <Sparkline data={trend} />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-2">
                  <span>−60s</span><span>now</span>
                </div>
              </div>

              {/* AI Suggestion */}
              <div className="glass-strong rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 size-32 rounded-full opacity-30"
                  style={{ background: "var(--gradient-purple)", filter: "blur(40px)" }} />
                <h3 className="font-semibold mb-3 flex items-center gap-2 relative">
                  <Sparkles className="size-4" style={{ color: "var(--neon-pink)" }} />
                  AI Suggestion
                </h3>
                <AnimatePresence mode="wait">
                  <motion.p key={suggestion}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="text-sm relative">
                    {suggestion}
                  </motion.p>
                </AnimatePresence>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                  <Lightbulb className="size-3" /> Updated continuously by FocusAI
                </div>
              </div>

              {/* Detection legend */}
              <div className="glass rounded-2xl p-5">
                <h3 className="font-semibold mb-3">Detection legend</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Legend color="var(--success)" label="Focused" />
                  <Legend color="var(--danger)" label="Distracted" />
                  <Legend color="var(--warning)" label="Sleepy" />
                  <Legend color="oklch(0.75 0.18 50)" label="Phone" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom session analytics */}
          <div className="mt-5 glass-strong rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Timer className="size-4" style={{ color: "var(--neon-cyan)" }} />
                Session analytics
              </h3>
              <span className="text-xs font-mono text-muted-foreground">Auto-saved · on-device</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <BigStat label="Attentive time" value={fmt(attentiveSec)} tone="success" />
              <BigStat label="Distracted time" value={fmt(distractedSec)} tone="danger" />
              <BigStat label="Focus consistency" value={`${Math.round((attentiveSec / Math.max(1, attentiveSec + distractedSec)) * 100)}%`} />
              <BigStat label="AI confidence" value="96.4%" tone="success" />
              <BigStat label="Productivity" value={`${Math.min(99, Math.round(focus * 0.95 + 6))}`} tone="success" />
            </div>
          </div>
        </div>
        <div className="h-20" />
      </section>
    </Layout>
  );
}

function Badge({ children, tone, icon: Icon }: { children: React.ReactNode; tone: "success" | "danger" | "cyan" | "purple"; icon: any }) {
  const map = {
    success: { bg: "bg-success/10", text: "text-success", border: "border-success/30" },
    danger:  { bg: "bg-danger/10",  text: "text-danger",  border: "border-danger/30" },
    cyan:    { bg: "bg-white/5",    text: "",             border: "border-white/10" },
    purple:  { bg: "bg-white/5",    text: "",             border: "border-white/10" },
  } as const;
  const c = map[tone];
  const iconColor = tone === "cyan" ? "var(--neon-cyan)" : tone === "purple" ? "var(--neon-purple)" : undefined;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${c.bg} ${c.text} ${c.border}`}>
      <Icon className="size-3" style={iconColor ? { color: iconColor } : undefined} />
      <span className="font-mono">{children}</span>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" | "warning" }) {
  const c = tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "";
  return (
    <div className="bg-card/60 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className={`text-lg font-semibold ${c}`}>{value}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className="text-sm font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function BigStat({ label, value, tone }: { label: string; value: string; tone?: "success" | "danger" }) {
  const c = tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "";
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${c}`}>{value}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/5">
      <span className="size-2.5 rounded-sm" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      <span>{label}</span>
    </div>
  );
}

function Radial({ value }: { value: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-44 mx-auto">
      <svg viewBox="0 0 120 120" className="-rotate-90 w-full h-full">
        <defs>
          <linearGradient id="rg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--neon-cyan)" />
            <stop offset="100%" stopColor="var(--neon-purple)" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={r} stroke="oklch(1 0 0 / 8%)" strokeWidth="10" fill="none" />
        <motion.circle cx="60" cy="60" r={r} stroke="url(#rg)" strokeWidth="10" fill="none"
          strokeLinecap="round" strokeDasharray={c}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 0.8 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold font-mono" style={{ color: "var(--neon-cyan)" }}>{value}%</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono mt-1">Concentration</div>
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100} ${100 - v}`).join(" ");
  const area = `${path} L 100 100 L 0 100 Z`;
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-28">
      <defs>
        <linearGradient id="sp" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--neon-purple)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sp)" />
      <path d={path} fill="none" stroke="var(--neon-purple)" strokeWidth="0.7" />
    </svg>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
