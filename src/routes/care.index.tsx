import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { List, Map as MapIcon, Star, MapPin, Building2, UserRound } from "lucide-react";
import { z } from "zod";
import { PageShell, PageTitle } from "@/components/site";
import { PROVIDERS } from "@/lib/demo-data";

export const Route = createFileRoute("/care/")({
  validateSearch: z.object({ specialty: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Nearby Care — MediGuide AI" },
      { name: "description", content: "Find doctors and hospitals near you by specialty and book an appointment." },
      { property: "og:title", content: "Nearby Care — MediGuide AI" },
      { property: "og:description", content: "Doctors and hospitals, distances, specialties and booking." },
    ],
  }),
  component: Care,
});

function Care() {
  const { specialty } = Route.useSearch();
  const specialties = ["All", ...new Set(PROVIDERS.map((p) => p.specialty))];
  const initial = specialties.find((s) => s.toLowerCase() === specialty?.toLowerCase()) ?? "All";
  const [filter, setFilter] = useState(initial);
  const [view, setView] = useState<"list" | "map">("list");
  const list = PROVIDERS.filter((p) => filter === "All" || p.specialty === filter).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <PageShell>
      <PageTitle eyebrow="Nearby care" title="Doctors & hospitals">
        <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase">Demo data</span>{" "}
        Listings and locations are fictional examples.
      </PageTitle>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {specialties.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${filter === s ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex rounded-full border p-1">
          {(["list", "map"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} aria-label={`${v} view`} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase ${view === v ? "bg-primary text-primary-foreground" : ""}`}>
              {v === "list" ? <List className="h-3.5 w-3.5" /> : <MapIcon className="h-3.5 w-3.5" />}{v}
            </button>
          ))}
        </div>
      </div>

      {view === "map" ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border bg-card">
          {[20, 40, 60, 80].map((r) => (
            <div key={r} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ring-circle" style={{ width: `${r * 1.4}%`, height: `${r * 2.2}%` }} />
          ))}
          <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-emerald shadow-soft" title="You" />
          {list.map((p) => (
            <Link key={p.id} to="/care/$providerId" params={{ providerId: p.id }} className="group absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-soft transition group-hover:scale-105">
                <MapPin className="h-3 w-3 text-emerald" />{p.name} · {p.distanceKm} km
              </span>
            </Link>
          ))}
          <p className="absolute bottom-3 left-4 text-[11px] text-muted-foreground">Illustrative map · demo data</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((p) => (
            <Link key={p.id} to="/care/$providerId" params={{ providerId: p.id }} className="flex gap-4 rounded-3xl border bg-card p-5 transition hover:shadow-soft">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink text-emerald">
                {p.kind === "doctor" ? <UserRound className="h-6 w-6" /> : <Building2 className="h-6 w-6" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{p.name}</p>
                  <span className="shrink-0 font-display text-xs font-bold">{p.distanceKm} km</span>
                </div>
                <p className="text-sm text-muted-foreground">{p.specialty}</p>
                <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-current text-emerald" />{p.rating}</span>
                  <span>{p.address}</span>
                </p>
                <span className="mt-3 inline-block rounded-full bg-primary px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">Book appointment</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
