import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Award, CalendarCheck, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/site";
import { getProvider } from "@/lib/demo-data";
import { availableSlots, dateKey, upcomingDates } from "@/lib/booking";
import { addBooking, useBookings, type Booking } from "@/lib/store";

export const Route = createFileRoute("/care/$providerId")({
  loader: ({ params }) => {
    const p = getProvider(params.providerId);
    if (!p) throw notFound();
    return { provider: p };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.provider.name} — MediGuide AI` : "Provider — MediGuide AI" },
      { name: "description", content: loaderData ? `${loaderData.provider.specialty}. View profile and book an appointment.` : "Provider details" },
      { property: "og:title", content: loaderData ? `${loaderData.provider.name} — MediGuide AI` : "Provider — MediGuide AI" },
      { property: "og:description", content: "Profile, qualifications and available appointment slots." },
    ],
  }),
  component: ProviderPage,
});

function ProviderPage() {
  const { provider: p } = Route.useLoaderData();
  const dates = useMemo(() => upcomingDates(new Date(), 7), []);
  const [date, setDate] = useState(dates[0]!);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState<Booking | null>(null);
  const bookings = useBookings();
  const booked = bookings.filter((b) => b.providerId === p.id && b.date === dateKey(date)).map((b) => b.time);
  const slots = availableSlots(p.id, date, booked);

  const book = () => {
    if (!time) { toast.error("Please choose a time slot."); return; }
    if (name.trim().length < 2) { toast.error("Please enter the patient name."); return; }
    const b: Booking = { id: crypto.randomUUID(), providerId: p.id, date: dateKey(date), time, patient: name.trim().slice(0, 80) };
    addBooking(b);
    setConfirmed(b);
    setTime(null);
    toast.success("Appointment requested");
  };

  return (
    <PageShell>
      <Link to="/care" className="mb-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> All providers
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl bg-ink p-8 text-ink-foreground">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald">{p.specialty} · Demo profile</p>
          <h1 className="mt-3 text-3xl font-bold uppercase md:text-4xl">{p.name}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-muted">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-current text-emerald" />{p.rating}</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{p.address} · {p.distanceKm} km</span>
            <span>{p.experience} yrs</span>
          </div>
          <p className="mt-6 max-w-lg text-ink-muted">{p.about}</p>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-emerald">Qualifications</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.qualifications.map((q) => (
              <span key={q} className="flex items-center gap-1 rounded-full border border-ink-line px-3 py-1 text-xs"><Award className="h-3 w-3" />{q}</span>
            ))}
          </div>
          <p className="mt-8 font-display text-lg font-bold">₹{p.fee} <span className="font-sans text-sm font-normal text-ink-muted">consultation</span></p>
        </div>

        <div className="rounded-3xl border bg-card p-6">
          <AnimatePresence mode="wait">
            {confirmed ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-soft text-emerald"><CalendarCheck className="h-7 w-7" /></span>
                <h2 className="mt-5 text-lg font-bold uppercase">Request sent</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {confirmed.patient} with {p.name}<br />
                  {new Date(confirmed.date).toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })} at {confirmed.time}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">Demo booking — no real appointment was made.</p>
                <button onClick={() => setConfirmed(null)} className="mt-6 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted">Book another</button>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-base font-bold uppercase">Choose a date</h2>
                <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7 lg:grid-cols-4">
                  {dates.map((d) => {
                    const active = dateKey(d) === dateKey(date);
                    return (
                      <button key={dateKey(d)} onClick={() => { setDate(d); setTime(null); }} className={`rounded-2xl border px-2 py-3 text-center transition ${active ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                        <span className="block text-[10px] uppercase">{d.toLocaleDateString(undefined, { weekday: "short" })}</span>
                        <span className="block font-display text-lg font-bold">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
                <h2 className="mt-6 text-base font-bold uppercase">Available slots</h2>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {slots.map((t) => (
                    <button key={t} onClick={() => setTime(t)} className={`rounded-full border py-2 text-xs font-semibold transition ${time === t ? "border-emerald bg-emerald text-ink" : "hover:bg-muted"}`}>{t}</button>
                  ))}
                </div>
                <label className="mt-6 block text-xs font-bold uppercase tracking-wider">Patient name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Full name" className="mt-2 w-full rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
                <button onClick={book} className="mt-6 w-full rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">Confirm booking</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageShell>
  );
}
