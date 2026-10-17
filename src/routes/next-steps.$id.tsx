import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HelpCircle, Leaf, Stethoscope, AlertTriangle } from "lucide-react";
import { useHydrated } from "@tanstack/react-router";
import { Disclaimer, PageShell, PageTitle } from "@/components/site";
import { useReports } from "@/lib/store";

export const Route = createFileRoute("/next-steps/$id")({
  head: () => ({
    meta: [
      { title: "Next Steps — MediGuide AI" },
      { name: "description", content: "Educational guidance on what to do after reading your report." },
      { property: "og:title", content: "Next Steps — MediGuide AI" },
      { property: "og:description", content: "Which specialist to consider and what to ask your doctor." },
    ],
  }),
  component: NextSteps,
});

const URGENCY = {
  routine: { label: "Routine follow-up", cls: "bg-emerald-soft text-accent-foreground" },
  soon: { label: "See a doctor soon", cls: "bg-warn-soft text-warn" },
  urgent: { label: "Seek care promptly", cls: "bg-destructive/10 text-destructive" },
};

function NextSteps() {
  const { id } = Route.useParams();
  const hydrated = useHydrated();
  const report = useReports().find((r) => r.id === id);
  if (!hydrated && !report) return <PageShell><p className="text-muted-foreground">Loading…</p></PageShell>;
  if (!report?.analysis) return <PageShell><PageTitle eyebrow="Next steps" title="Report not found" /></PageShell>;
  const n = report.analysis.nextSteps;
  const u = URGENCY[n.urgency];
  return (
    <PageShell>
      <PageTitle eyebrow="Next-step recommendation" title={`Talk to a ${n.specialist}`}>
        Based on {report.analysis.title}. This is general educational guidance, not a medical decision.
      </PageTitle>
      <div className="mb-6"><Disclaimer /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-ink p-7 text-ink-foreground md:row-span-2">
          <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase ${u.cls}`}>
            {n.urgency === "urgent" && <AlertTriangle className="mr-1 h-3.5 w-3.5" />}{u.label}
          </span>
          <Stethoscope className="mt-8 h-7 w-7 text-emerald" />
          <h2 className="mt-4 text-xl font-bold uppercase">Suggested guidance</h2>
          <ol className="mt-5 space-y-4">
            {n.guidance.map((g, i) => (
              <li key={g} className="flex gap-4 text-sm">
                <span className="font-display font-bold text-emerald">0{i + 1}</span><span className="text-ink-muted">{g}</span>
              </li>
            ))}
          </ol>
          <Link to="/care" search={{ specialty: n.specialist }} className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink-foreground py-2.5 pl-5 pr-2 text-ink">
            <span className="text-xs font-bold uppercase tracking-wider">Find a {n.specialist}</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald"><ArrowRight className="h-4 w-4" /></span>
          </Link>
        </div>
        <Card icon={HelpCircle} title="Questions for your doctor" items={n.questionsForDoctor} />
        <Card icon={Leaf} title="Healthy habits to discuss" items={n.lifestyle} />
      </div>
    </PageShell>
  );
}

function Card({ icon: Icon, title, items }: { icon: typeof Leaf; title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border bg-card p-7">
      <Icon className="h-6 w-6 text-emerald" />
      <h3 className="mt-4 text-base font-bold uppercase">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {items.map((q) => <li key={q}>— {q}</li>)}
      </ul>
    </div>
  );
}
