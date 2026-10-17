import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Image as ImageIcon, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { PageShell, PageTitle, StatusBadge, UploadButton } from "@/components/site";
import { deleteReport, useReports } from "@/lib/store";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "My Reports — MediGuide AI" },
      { name: "description", content: "Your library of uploaded medical reports and their AI explanations." },
      { property: "og:title", content: "My Reports — MediGuide AI" },
      { property: "og:description", content: "Uploaded reports, statuses and AI analysis in one place." },
    ],
  }),
  component: Reports,
});

function Reports() {
  const reports = useReports();
  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow="Library" title="My Reports">
          Reports are stored only in this browser.
        </PageTitle>
        <div className="mb-8"><UploadButton /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <div key={r.id} className="flex flex-col rounded-3xl border bg-card p-5 transition hover:shadow-soft">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-emerald">
                {r.mediaType.startsWith("image") ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </span>
              <div className="flex gap-2">
                {r.demo && <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase">Demo</span>}
                <StatusBadge status={r.status} />
              </div>
            </div>
            <p className="mt-4 truncate font-semibold">{r.analysis?.title ?? r.name}</p>
            <p className="truncate text-xs text-muted-foreground">{r.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Uploaded {new Date(r.uploadedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
            </p>
            {r.analysis && <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{r.analysis.summary}</p>}
            <div className="mt-auto flex items-center justify-between pt-5">
              {r.status === "analyzed" ? (
                <Link to="/analysis/$id" params={{ id: r.id }} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                  View analysis <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">{r.status === "failed" ? "Analysis failed — upload again" : "Analyzing…"}</span>
              )}
              {!r.demo && (
                <button
                  aria-label="Delete report"
                  onClick={() => {
                    deleteReport(r.id);
                    toast.success("Report deleted");
                  }}
                  className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
