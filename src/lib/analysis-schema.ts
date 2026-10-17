import { z } from "zod";

export const analysisSchema = z.object({
  title: z.string(),
  reportType: z.string(),
  summary: z.string(),
  values: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
      unit: z.string(),
      range: z.string(),
      status: z.enum(["normal", "high", "low", "unknown"]),
      explanation: z.string(),
    }),
  ),
  keyPoints: z.array(z.string()),
  nextSteps: z.object({
    urgency: z.enum(["routine", "soon", "urgent"]),
    specialist: z.string(),
    guidance: z.array(z.string()),
    questionsForDoctor: z.array(z.string()),
    lifestyle: z.array(z.string()),
  }),
});

export type Analysis = z.infer<typeof analysisSchema>;
