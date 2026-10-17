import { useSyncExternalStore } from "react";
import type { Analysis } from "./analysis-schema";
import { DEMO_ANALYSIS, DEMO_REPORT_ID } from "./demo-data";

export type Report = {
  id: string;
  name: string;
  mediaType: string;
  uploadedAt: string;
  status: "analyzing" | "analyzed" | "failed";
  preview?: string;
  analysis?: Analysis;
  demo?: boolean;
};

export type Booking = {
  id: string;
  providerId: string;
  date: string;
  time: string;
  patient: string;
};

const DEMO_REPORT: Report = {
  id: DEMO_REPORT_ID,
  name: "Sample_Blood_Report_DEMO.pdf",
  mediaType: "application/pdf",
  uploadedAt: "2026-10-01T09:00:00.000Z",
  status: "analyzed",
  analysis: DEMO_ANALYSIS,
  demo: true,
};

const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; val: unknown }>();

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  const c = cache.get(key);
  if (c && c.raw === raw) return c.val as T;
  let val: T = fallback;
  try {
    if (raw) val = JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  cache.set(key, { raw, val });
  return val;
}
function write<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* quota: drop previews */
  }
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const EMPTY: never[] = [];
export function getReports(): Report[] {
  const user = read<Report[]>("mg.reports", EMPTY);
  return [...user, DEMO_REPORT];
}
export function getReport(id: string) {
  return getReports().find((r) => r.id === id);
}
export function saveReport(r: Report) {
  if (r.demo) return;
  const user = read<Report[]>("mg.reports", EMPTY).filter((x) => x.id !== r.id);
  write("mg.reports", [r, ...user]);
}
export function deleteReport(id: string) {
  write("mg.reports", read<Report[]>("mg.reports", EMPTY).filter((x) => x.id !== id));
}

export function getBookings(): Booking[] {
  return read<Booking[]>("mg.bookings", EMPTY);
}
export function addBooking(b: Booking) {
  write("mg.bookings", [b, ...getBookings()]);
}

let reportsSnap: Report[] = [DEMO_REPORT];
let reportsRaw: string | null | undefined;
function reportsSnapshot() {
  const raw = typeof window === "undefined" ? null : localStorage.getItem("mg.reports");
  if (raw !== reportsRaw) {
    reportsRaw = raw;
    reportsSnap = getReports();
  }
  return reportsSnap;
}
const serverReports = [DEMO_REPORT];
export function useReports() {
  return useSyncExternalStore(subscribe, reportsSnapshot, () => serverReports);
}
export function useBookings() {
  return useSyncExternalStore(subscribe, getBookings, () => EMPTY as Booking[]);
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(new Error("Could not read file"));
    r.readAsDataURL(file);
  });
}

export async function analyzeFile(file: File): Promise<Report> {
  const id = crypto.randomUUID();
  const base: Report = {
    id,
    name: file.name,
    mediaType: file.type,
    uploadedAt: new Date().toISOString(),
    status: "analyzing",
  };
  saveReport(base);
  try {
    const dataBase64 = await fileToBase64(file);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name, mediaType: file.type, dataBase64 }),
    });
    const json = (await res.json().catch(() => ({}))) as { analysis?: Analysis; error?: string };
    if (!res.ok || !json.analysis) throw new Error(json.error ?? "Analysis failed");
    const done: Report = { ...base, status: "analyzed", analysis: json.analysis };
    saveReport(done);
    return done;
  } catch (e) {
    saveReport({ ...base, status: "failed" });
    throw e;
  }
}

export function analysisToContext(a: Analysis) {
  return `${a.title}. ${a.summary}\n${a.values.map((v) => `${v.name}: ${v.value} ${v.unit} (range ${v.range}, ${v.status})`).join("\n")}`;
}
