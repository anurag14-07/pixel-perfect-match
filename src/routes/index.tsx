import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, FileText, MessageCircle, MapPin, ScanLine, Brain, Footprints } from "lucide-react";
import { Disclaimer, Logo, NavLinks, useReportUpload } from "@/components/site";
import { CATEGORIES, DEMO_REPORT_ID } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediGuide AI — Understand Your Health. Know Your Next Step." },
      { name: "description", content: "Upload a medical report and get plain-language explanations, key points and educational next steps." },
      { property: "og:title", content: "MediGuide AI — Understand Your Health" },
      { property: "og:description", content: "Plain-language AI explanations of your medical reports, plus next steps and nearby care." },
    ],
  }),
  component: Home,
});

// positions along the arc (percent of right panel)
const ARC = [
  { top: "12%", left: "34%" },
  { top: "25%", left: "24%" },
  { top: "62%", left: "22%" },
  { top: "75%", left: "32%" },
  { top: "86%", left: "46%" },
  { top: "4%", left: "48%" },
];

function Home() {
  const { open, busy, input } = useReportUpload();
  return (
    <div className="min-h-screen bg-background">
      {input}
      <section className="mx-auto max-w-[1400px] p-3 md:p-5">
        <div className="relative grid overflow-hidden rounded-[2rem] border bg-card shadow-soft lg:min-h-[640px] lg:grid-cols-[45%_55%]">
          {/* LEFT */}
          <div className="relative flex flex-col justify-between bg-ink p-8 text-ink-foreground md:p-12">
            <Logo inverted />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="my-14 lg:my-0">
              <h1 className="text-3xl font-bold uppercase leading-[1.08] md:text-5xl">
                Understand<br />your health.<br />
                <span className="text-emerald">Know</span> your<br />next step.
              </h1>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-muted">
                MediGuide AI turns confusing lab reports into clear, plain-language explanations — then points you to the right kind of care.
              </p>
              <button
                onClick={open}
                disabled={busy}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-ink-foreground/70 px-6 py-3 text-xs font-bold uppercase tracking-wider transition hover:bg-ink-foreground hover:text-ink disabled:opacity-60"
              >
                {busy ? "Analyzing…" : "Analyze my report"} <ArrowUpRight className="h-4 w-4" />
              </button>
            </motion.div>
            <p className="text-[11px] uppercase tracking-widest text-ink-muted">Educational only · Not a diagnosis</p>
          </div>

          {/* RIGHT */}
          <div className="relative min-h-[560px] overflow-hidden p-6 md:p-10">
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
              <Link to="/chat" className="flex min-w-[200px] flex-1 items-center gap-2 rounded-full border px-4 py-2 text-xs text-muted-foreground sm:max-w-xs">
                <MessageCircle className="h-3.5 w-3.5" /> Ask MediAI about a result…
              </Link>
              <NavLinks />
            </div>

            {/* circles */}
            <div className="pointer-events-none absolute -right-40 top-1/2 hidden h-[760px] w-[760px] -translate-y-1/2 ring-circle md:block" />
            <div className="pointer-events-none absolute -right-16 top-1/2 hidden h-[420px] w-[420px] -translate-y-1/2 ring-circle md:block" />
            <div className="pointer-events-none absolute right-16 top-1/2 hidden h-36 w-36 -translate-y-1/2 place-items-center rounded-full bg-emerald-soft md:grid">
              <span className="text-center font-display text-[10px] font-bold uppercase leading-tight">Your<br />report</span>
            </div>

            {/* categories along arc */}
            <div className="relative mt-8 grid grid-cols-2 gap-3 md:absolute md:inset-0 md:mt-0 md:block">
              {CATEGORIES.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.07 }}
                  className="md:absolute"
                  style={{ top: ARC[i]!.top, left: ARC[i]!.left }}
                >
                  <p className="font-display text-xs font-bold uppercase md:text-sm">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.hint}</p>
                </motion.div>
              ))}
            </div>

            {/* crossing pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 mt-10 md:absolute md:left-[-6%] md:top-[46%] md:mt-0"
            >
              <Link
                to="/chat"
                className="group flex items-center gap-6 rounded-full bg-primary py-3 pl-7 pr-3 text-primary-foreground shadow-soft md:pl-14"
              >
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide">Start AI analysis</span>
                  <span className="block text-[11px] text-ink-muted">Chat · Upload · Explain</span>
                </span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald text-ink transition group-hover:translate-x-1">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.div>

            {/* demo preview bar */}
            <Link
              to="/analysis/$id"
              params={{ id: DEMO_REPORT_ID }}
              className="relative z-10 mt-8 flex items-center gap-4 rounded-2xl border bg-card/90 p-3 backdrop-blur transition hover:shadow-soft md:absolute md:bottom-6 md:left-8 md:right-8 md:mt-0"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-emerald">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xs font-bold uppercase">Sample blood report</p>
                <p className="text-[11px] text-muted-foreground">Demo mode · fictional data · 6 values</p>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 rounded-full bg-emerald" />
                </div>
              </div>
              <span className="hidden text-[11px] font-bold uppercase tracking-wider sm:block">View demo →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FLOW */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald">How it works</p>
        <h2 className="max-w-2xl text-2xl font-bold uppercase md:text-4xl">Report → AI → Next step</h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { icon: ScanLine, t: "Upload", d: "Add a PDF, JPG or PNG of your lab report — or try the sample." },
            { icon: Brain, t: "Understand", d: "Every value explained in plain language with a clear summary." },
            { icon: Footprints, t: "Next step", d: "Educational guidance, questions for your doctor, and nearby care." },
          ].map((s, i) => (
            <motion.div
              key={s.t}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl border bg-card p-7"
            >
              <span className="font-display text-5xl font-bold text-border">0{i + 1}</span>
              <s.icon className="mt-4 h-6 w-6 text-emerald" />
              <h3 className="mt-3 text-lg font-bold uppercase">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          <Link to="/chat" className="group rounded-3xl bg-ink p-8 text-ink-foreground">
            <MessageCircle className="h-6 w-6 text-emerald" />
            <h3 className="mt-6 text-xl font-bold uppercase">MediAI Chat</h3>
            <p className="mt-2 text-sm text-ink-muted">Ask follow-up questions about any value in your report.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">Open chat <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
          <Link to="/care" className="group rounded-3xl border bg-card p-8">
            <MapPin className="h-6 w-6 text-emerald" />
            <h3 className="mt-6 text-xl font-bold uppercase">Nearby Care</h3>
            <p className="mt-2 text-sm text-muted-foreground">Find doctors and hospitals by specialty and book a slot.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">Find care <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </Link>
        </div>
        <div className="mt-12"><Disclaimer /></div>
      </section>
    </div>
  );
}
