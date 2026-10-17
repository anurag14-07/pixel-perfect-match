# MediGuide AI — Build Plan

Premium black-and-white editorial healthcare AI app, closely following the reference: asymmetric split hero (black left panel, white right panel), bold uppercase display type, thin concentric circle outlines, a black "pill" bar crossing the split, emerald accent dots/arrows.

## Design system
- Colors: off-white background, near-black panel, navy text, single emerald/teal accent (all as tokens).
- Type: Unbounded-style wide display for headlines (editorial, like the reference), Manrope for body.
- Thin 1px borders, large rounded corners, soft shadows, generous whitespace, subtle motion (fade/slide, typing dots).

## Pages
1. **Home (/)** — Split hero: left black panel with logo, "UNDERSTAND YOUR HEALTH. KNOW YOUR NEXT STEP.", outlined ANALYZE MY REPORT. Right panel with nav, concentric circles, report categories (Blood, Thyroid, Lipid, Vitamin, Liver, Kidney) placed along the arc, black START AI ANALYSIS button with emerald arrow, compact demo-report preview bar at the bottom (like the player bar). Below: features, Report → AI → Next Step flow, disclaimer.
2. **MediAI Chat (/chat)** — One conversation, saved in the browser. Report upload (PDF/JPG/PNG), suggested questions, streaming AI answers with structured sections.
3. **Report Analysis (/analysis/$id)** — Extracted values table with normal/high/low badges, plain-language explanations, summary, key points.
4. **Next Steps (/next-steps/$id)** — Educational guidance, which specialist to consider, questions to ask, strong disclaimers.
5. **Nearby Care (/care)** — Doctor/hospital list with map/list toggle, distances, specialties, filters (clearly labeled demo data; map is a stylized illustration).
6. **Provider Details (/care/$providerId)** — Profile, qualifications, date picker, time slots, booking confirmation.
7. **My Reports (/reports)** — Library with dates, status, preview, "Analyze" actions, plus a fictional sample report for Demo Mode.

## Functionality
- Real AI analysis of uploaded reports and real chat, with safety rules (educational only, no diagnosis, no prescriptions or dosage advice).
- Demo Mode with a fictional sample report works without uploading.
- Loading states, typing animation, error handling, toasts, page transitions.
- Reports and bookings saved in the browser (no login needed).
- Fully responsive: split hero stacks on mobile, decorations simplified.

## Technical details
- The requested FastAPI/Python + Gemma + SQLite stack isn't supported here; equivalent: TanStack Start server functions + Lovable AI Gateway (default chat model, multimodal input for PDF/images) — keys stay server-side. AI logic in a modular server-only module.
- Framer Motion, Lucide icons, sonner toasts, shadcn components.
- localStorage for reports, chat, bookings; Lovable Cloud can be added later for accounts/persistence.
- Per-route head() metadata; vitest tests for safety-prompt rules and booking slot logic.
