import { describe, expect, it } from "vitest";
import { isUrgent, validateReportFile } from "@/lib/safety";
import { availableSlots, upcomingDates } from "@/lib/booking";

describe("report upload rules", () => {
  it("accepts PDF, JPG and PNG", () => {
    expect(validateReportFile({ type: "application/pdf", size: 1000 })).toBeNull();
    expect(validateReportFile({ type: "image/jpeg", size: 1000 })).toBeNull();
    expect(validateReportFile({ type: "image/png", size: 1000 })).toBeNull();
  });
  it("rejects other file types", () => {
    expect(validateReportFile({ type: "text/plain", size: 10 })).not.toBeNull();
  });
});

describe("safety", () => {
  it("flags emergency symptoms", () => {
    expect(isUrgent("I have chest pain")).toBe(true);
    expect(isUrgent("what is LDL?")).toBe(false);
  });
});

describe("booking", () => {
  it("never offers Sundays", () => {
    expect(upcomingDates(new Date(2026, 9, 17), 14).some((d) => d.getDay() === 0)).toBe(false);
  });
  it("hides already booked slots", () => {
    const d = new Date(2026, 9, 20);
    const free = availableSlots("dr-x", d);
    expect(availableSlots("dr-x", d, [free[0]!])).not.toContain(free[0]);
  });
});
