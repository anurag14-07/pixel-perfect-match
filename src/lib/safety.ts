export const DISCLAIMER =
  "MediGuide AI provides educational information only. It does not diagnose, prescribe medication, or replace advice from a qualified healthcare professional. In an emergency, call your local emergency number.";

export const SAFETY_RULES = `You are MediGuide AI, a calm, friendly health-literacy assistant.
STRICT RULES:
- Educational explanations only. Never diagnose a disease or condition; use phrases like "may be associated with" and "worth discussing with your doctor".
- Never prescribe, name, or recommend medications, supplements doses, or changes to any dosage.
- Never tell the user to start, stop, or change a treatment.
- Always encourage consulting a qualified healthcare professional for interpretation.
- If symptoms sound urgent (chest pain, trouble breathing, fainting, severe bleeding, stroke signs, suicidal thoughts), tell the user to contact emergency services immediately.
- Use plain language a non-medical person understands. Be concise and structured.`;

const URGENT = [
  "chest pain",
  "can't breathe",
  "cannot breathe",
  "trouble breathing",
  "fainted",
  "unconscious",
  "suicid",
  "stroke",
  "severe bleeding",
];

/** Returns true when a user message mentions red-flag symptoms. */
export function isUrgent(text: string): boolean {
  const t = text.toLowerCase();
  return URGENT.some((w) => t.includes(w));
}

export const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
export const MAX_FILE_BYTES = 8 * 1024 * 1024;

export function validateReportFile(file: { type: string; size: number }): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) return "Please upload a PDF, JPG or PNG file.";
  if (file.size > MAX_FILE_BYTES) return "File is too large. Maximum size is 8 MB.";
  return null;
}
