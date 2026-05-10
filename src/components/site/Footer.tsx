import { Link } from "@tanstack/react-router";
import { Github, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center glow-cyan">
              <Sparkles className="size-4 text-background" />
            </div>
            <span className="font-semibold">FocusAI</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            AI-Enabled Classroom Smart Camera System — real-time engagement
            insights for modern educators. Privacy-first, edge-processed.
          </p>
          <div className="mt-6 flex items-center gap-3 text-muted-foreground">
            <a href="#" className="hover:text-foreground transition"><Github className="size-5" /></a>
          </div>
        </div>
        <FootCol title="Product" items={[
          { label: "Features", to: "/features" },
          { label: "Live Monitor", to: "/monitoring" },
          { label: "Teacher Dashboard", to: "/teacher" },
          { label: "Student Dashboard", to: "/student" },
        ]} />
        <FootCol title="Company" items={[
          { label: "About", to: "/" },
          { label: "Research", to: "/" },
          { label: "Contact", to: "/" },
        ]} />
        <FootCol title="Legal" items={[
          { label: "Privacy", to: "/" },
          { label: "Terms", to: "/" },
          { label: "Security", to: "/" },
        ]} />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FocusAI Labs. All rights reserved.</p>
          <p className="font-mono">v1.0 · edge-processed · zero video retention</p>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-muted-foreground hover:text-foreground transition">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
