import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { useHydrated } from "@tanstack/react-router";
import { PageShell, PageTitle, StatusBadge } from "@/components/site";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/analysis/$id")({
  head: () => ({
    meta: [
      { title: "Report Analysis — MediGuide AI" },
      { name: "description", content: "Extracted values, plain-language explanations and key points from your report." },
      { property: "og:title", content: "Report Analysis — MediGuide AI" },
      { property: "og:description", content: "Your lab values explained in plain language." },
    ],
  }),
  component: AnalysisPage,
});

function AnalysisPage() {
  const { id } = Route.useParams();
  const hydrated = useHydrated();
  const report = useReports().find((r) => r.id === id);
  if (!hydrated && !report) return <PageShell><p className="text-muted-foreground">Loading…</p></PageShell>;
  if (!report?.analysis)
    return (
      <PageShell>
        <PageTitle eyebrow="Analysis" title="Report not found" />
        <Link to="/reports" className="text-sm font-bold underline">Back to My Reports</Link>
      </PageShell>
    );
  const a = report.analysis;
  return (
    <PageShell>
      <PageTitle eyebrow={`${a.reportType}${report.demo ? " · Demo (fictional)" : ""}`} title={a.title} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-ink p-7 text-ink-foreground">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Summary</p>
            <p className="mt-3 leading-relaxed">{a.summary}</p>
          </div>
          <div className="overflow-hidden rounded-3xl border bg-card">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_90px] gap-4 border-b px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground md:grid">
              <span>Test</span><span>Result</span><span>Reference</span><span>Status</span>
            </div>
            {a.values.length === 0 && <p className="p-6 text-sm text-muted-foreground">No measurable values found.</p>}
            {a.values.map((v) => (
              <div key={v.name} className="border-b px-6 py-4 last:border-0">
                <div className="grid grid-cols-2 gap-2 md:grid-cols-[1.4fr_1fr_1fr_90px] md:gap-4">
                  <span className="font-semibold">{v.name}</span>
                  <span className="text-right font-display text-sm font-bold md:text-left">{v.value} <span className="font-sans text-xs font-normal text-muted-foreground">{v.unit}</span></span>
                  <span className="text-xs text-muted-foreground md:text-sm">{v.range}</span>
                  <span className="text-right md:text-left"><StatusBadge status={v.status} /></span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{v.explanation}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-3xl border bg-card p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald">Important points</p>
            <ul className="mt-4 space-y-3">
              {a.keyPoints.map((k) => (
                <li key={k} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />{k}</li>
              ))}
            </ul>
          </div>
          <Link to="/next-steps/$id" params={{ id }} className="group flex items-center justify-between rounded-full bg-primary py-3 pl-6 pr-3 text-primary-foreground">
            <span className="font-display text-xs font-bold uppercase">See next steps</span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald text-ink"><ArrowRight className="h-4 w-4" /></span>
          </Link>
          <Link to="/chat" search={{ report: id }} className="flex items-center justify-center gap-2 rounded-full border py-3 text-xs font-bold uppercase tracking-wider hover:bg-muted">
            <MessageCircle className="h-4 w-4" /> Ask about this report
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}
