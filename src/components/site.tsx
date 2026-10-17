import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShieldAlert, Upload, Loader2 } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { DISCLAIMER, validateReportFile } from "@/lib/safety";
import { analyzeFile } from "@/lib/store";

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span
        className={`grid h-8 w-8 place-items-center rounded-md border font-display text-[10px] font-bold ${inverted ? "border-ink-foreground text-ink-foreground" : "border-foreground text-foreground"}`}
      >
        MG
      </span>
      <span className={`font-display text-sm font-semibold ${inverted ? "text-ink-foreground" : "text-foreground"}`}>
        MediGuide<span className="text-emerald">.</span>AI
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/chat", label: "MediAI Chat" },
  { to: "/reports", label: "My Reports" },
  { to: "/care", label: "Nearby Care" },
] as const;

export function NavLinks({ className = "" }: { className?: string }) {
  return (
    <nav className={`flex items-center gap-5 text-xs font-semibold uppercase tracking-wider ${className}`}>
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          className="text-muted-foreground transition-colors hover:text-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <NavLinks className="hidden sm:flex" />
      </div>
      <NavLinks className="flex justify-center gap-4 pb-3 sm:hidden" />
    </header>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-6xl px-5 py-10"
      >
        {children}
      </motion.main>
      <footer className="mx-auto max-w-6xl px-5 pb-10">
        <Disclaimer />
      </footer>
    </div>
  );
}

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-xl border bg-warn-soft text-foreground ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      <ShieldAlert className="h-4 w-4 shrink-0 text-warn" />
      <p>{DISCLAIMER}</p>
    </div>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">{eyebrow}</p>
      <h1 className="text-2xl font-bold uppercase leading-tight md:text-4xl">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    normal: "bg-emerald-soft text-accent-foreground",
    analyzed: "bg-emerald-soft text-accent-foreground",
    high: "bg-warn-soft text-warn",
    low: "bg-warn-soft text-warn",
    failed: "bg-destructive/10 text-destructive",
    analyzing: "bg-muted text-muted-foreground",
    unknown: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${map[status] ?? map.unknown}`}>
      {status}
    </span>
  );
}

export function useReportUpload(onDone?: (id: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const handle = async (file?: File) => {
    if (!file) return;
    const err = validateReportFile(file);
    if (err) return toast.error(err);
    setBusy(true);
    const t = toast.loading("Analyzing your report…");
    try {
      const r = await analyzeFile(file);
      toast.success("Analysis ready", { id: t });
      if (onDone) onDone(r.id);
      else navigate({ to: "/analysis/$id", params: { id: r.id } });
    } catch (e) {
      toast.error((e as Error).message, { id: t });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };
  const input = (
    <input
      ref={inputRef}
      type="file"
      accept="application/pdf,image/jpeg,image/png"
      className="hidden"
      onChange={(e) => handle(e.target.files?.[0])}
    />
  );
  return { open: () => inputRef.current?.click(), busy, input, handle };
}

export function UploadButton({ label = "Upload report", variant = "dark" }: { label?: string; variant?: "dark" | "outline" }) {
  const { open, busy, input } = useReportUpload();
  return (
    <>
      {input}
      <button
        onClick={open}
        disabled={busy}
        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition disabled:opacity-60 ${variant === "dark" ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-foreground hover:bg-foreground hover:text-background"}`}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {busy ? "Analyzing…" : label}
      </button>
    </>
  );
}
