import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/monitoring", label: "Live Monitor" },
  { to: "/teacher", label: "Teacher" },
  { to: "/student", label: "Student" },
];

export function Nav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-7xl glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center glow-cyan">
            <Sparkles className="size-4 text-background" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">FocusAI</div>
            <div className="text-[10px] text-muted-foreground font-mono">Smart Camera System</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <Link
          to="/monitoring"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-primary text-background text-sm font-medium glow-purple hover:scale-[1.03] transition-transform"
        >
          Launch App
        </Link>
      </div>
    </header>
  );
}
