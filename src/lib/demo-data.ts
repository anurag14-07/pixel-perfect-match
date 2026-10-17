import type { Analysis } from "./analysis-schema";

export const DEMO_REPORT_ID = "demo-cbc";

export const DEMO_ANALYSIS: Analysis = {
  title: "Complete Blood Count & Lipid Panel",
  reportType: "Blood test",
  summary:
    "Most values are within the normal range. Hemoglobin is slightly low and LDL cholesterol is mildly high. Neither is an emergency, but both are worth discussing with a doctor at a routine visit. (Fictional demo report.)",
  values: [
    { name: "Hemoglobin", value: "11.8", unit: "g/dL", range: "12.0 – 15.5", status: "low", explanation: "Hemoglobin carries oxygen in your blood. A slightly low level can be associated with tiredness and is commonly checked further with iron tests." },
    { name: "White Blood Cells", value: "6.4", unit: "×10³/µL", range: "4.0 – 11.0", status: "normal", explanation: "These cells help fight infection. Your level is in the typical range." },
    { name: "Platelets", value: "245", unit: "×10³/µL", range: "150 – 400", status: "normal", explanation: "Platelets help your blood clot. Your count is normal." },
    { name: "LDL Cholesterol", value: "142", unit: "mg/dL", range: "< 100", status: "high", explanation: "Often called 'bad' cholesterol. Higher levels over time may be associated with heart health risk; diet and activity often play a role." },
    { name: "HDL Cholesterol", value: "54", unit: "mg/dL", range: "> 40", status: "normal", explanation: "The 'good' cholesterol that helps remove excess cholesterol. Your level is healthy." },
    { name: "Fasting Glucose", value: "92", unit: "mg/dL", range: "70 – 99", status: "normal", explanation: "Blood sugar after fasting. Your level is in the normal range." },
  ],
  keyPoints: [
    "Hemoglobin is slightly below the reference range.",
    "LDL cholesterol is above the recommended level.",
    "Infection-fighting cells, platelets and blood sugar look normal.",
    "Nothing here suggests an emergency.",
  ],
  nextSteps: {
    urgency: "routine",
    specialist: "General Physician",
    guidance: [
      "Book a routine visit with a general physician to review these results.",
      "Ask whether follow-up tests such as iron studies are useful.",
      "Bring previous reports so trends can be compared.",
    ],
    questionsForDoctor: [
      "Could my low hemoglobin explain feeling tired?",
      "Should I repeat my cholesterol test, and when?",
      "Are there lifestyle changes you'd recommend for me?",
    ],
    lifestyle: [
      "Include iron-rich foods like leafy greens, lentils and beans.",
      "Favor whole grains, fruits and vegetables; limit fried foods.",
      "Aim for regular moderate activity, like brisk walking.",
    ],
  },
};

export const CATEGORIES = [
  { name: "Blood Test", hint: "CBC, hemoglobin" },
  { name: "Lipid Panel", hint: "Cholesterol" },
  { name: "Thyroid", hint: "TSH, T3, T4" },
  { name: "Vitamins", hint: "D, B12" },
  { name: "Liver", hint: "LFT" },
  { name: "Kidney", hint: "KFT, creatinine" },
];

export type Provider = {
  id: string;
  name: string;
  kind: "doctor" | "hospital";
  specialty: string;
  distanceKm: number;
  rating: number;
  experience: number;
  address: string;
  qualifications: string[];
  about: string;
  fee: number;
  x: number;
  y: number;
};

export const PROVIDERS: Provider[] = [
  { id: "dr-ananya-rao", name: "Dr. Ananya Rao", kind: "doctor", specialty: "General Physician", distanceKm: 1.2, rating: 4.8, experience: 12, address: "14 Lakeview Road", qualifications: ["MBBS", "MD (Internal Medicine)"], about: "Focuses on preventive care and clear explanations of lab results.", fee: 600, x: 32, y: 40 },
  { id: "dr-kabir-mehta", name: "Dr. Kabir Mehta", kind: "doctor", specialty: "Cardiologist", distanceKm: 2.8, rating: 4.7, experience: 18, address: "Heartline Clinic, 3rd Floor", qualifications: ["MBBS", "MD", "DM (Cardiology)"], about: "Heart health, cholesterol management and cardiac risk assessment.", fee: 1200, x: 64, y: 28 },
  { id: "dr-sara-iyer", name: "Dr. Sara Iyer", kind: "doctor", specialty: "Endocrinologist", distanceKm: 3.4, rating: 4.9, experience: 10, address: "22 Park Street", qualifications: ["MBBS", "DNB (Endocrinology)"], about: "Thyroid, diabetes and hormonal health.", fee: 1000, x: 70, y: 66 },
  { id: "dr-vikram-shah", name: "Dr. Vikram Shah", kind: "doctor", specialty: "Hematologist", distanceKm: 4.1, rating: 4.6, experience: 15, address: "Bloomfield Medical Centre", qualifications: ["MBBS", "MD (Pathology)", "DM (Hematology)"], about: "Blood disorders including anemia and platelet conditions.", fee: 1100, x: 22, y: 72 },
  { id: "city-care-hospital", name: "City Care Hospital", kind: "hospital", specialty: "Multi-specialty", distanceKm: 2.1, rating: 4.5, experience: 25, address: "Ring Road, Sector 9", qualifications: ["NABH accredited", "24/7 emergency"], about: "Full-service hospital with diagnostics and specialist departments.", fee: 500, x: 48, y: 52 },
  { id: "greenleaf-clinic", name: "Greenleaf Diagnostics", kind: "hospital", specialty: "Diagnostics Lab", distanceKm: 0.9, rating: 4.4, experience: 8, address: "5 Market Lane", qualifications: ["NABL accredited lab"], about: "Blood tests, imaging and home sample collection.", fee: 300, x: 40, y: 20 },
];

export const getProvider = (id: string) => PROVIDERS.find((p) => p.id === id);
