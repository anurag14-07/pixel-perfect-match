export const SLOT_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:30", "12:00", "14:00", "14:30", "15:30", "16:00", "17:00", "17:30"];

/** Next N bookable dates starting tomorrow, skipping Sundays. */
export function upcomingDates(from: Date, count = 7): Date[] {
  const out: Date[] = [];
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));
  }
  return out;
}

/** Deterministic demo availability: removes some slots per provider/date, plus already-booked ones. */
export function availableSlots(providerId: string, date: Date, booked: string[] = []): string[] {
  const seed = [...providerId].reduce((a, c) => a + c.charCodeAt(0), 0) + date.getDate();
  return SLOT_TIMES.filter((t, i) => (seed + i) % 4 !== 0 && !booked.includes(t));
}

export function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
