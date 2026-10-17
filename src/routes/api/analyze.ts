import { createFileRoute } from "@tanstack/react-router";
import { Output, streamText } from "ai";
import { z } from "zod";
import { analysisSchema } from "@/lib/analysis-schema";
import { ACCEPTED_TYPES, SAFETY_RULES } from "@/lib/safety";

const body = z.object({
  name: z.string().max(200),
  mediaType: z.string(),
  dataBase64: z.string().optional(),
  text: z.string().max(20000).optional(),
});

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { createGateway, openaiOptions, gatewayError } = await import("@/lib/ai.server");
        const parsed = body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Invalid request" }, { status: 400 });
        const { name, mediaType, dataBase64, text } = parsed.data;
        if (!text && (!dataBase64 || !ACCEPTED_TYPES.includes(mediaType)))
          return Response.json({ error: "Please upload a PDF, JPG or PNG report." }, { status: 400 });
        if (dataBase64 && dataBase64.length > 12_000_000)
          return Response.json({ error: "File is too large." }, { status: 400 });

        try {
          const { model } = createGateway(request);
          const content: Array<
            | { type: "text"; text: string }
            | { type: "file"; data: string; mediaType: string; filename?: string }
          > = [
            {
              type: "text",
              text: `Analyze this medical report ("${name}"). Extract every measurable value with its unit and reference range, mark status vs range, and explain each in one or two plain-language sentences. Write a short summary, 3-6 key points, and educational next steps (which type of specialist could be relevant, questions to ask, general healthy-habit tips). If the document is not a medical report, say so in the summary and return empty lists.${text ? `\n\nREPORT TEXT:\n${text}` : ""}`,
            },
          ];
          if (dataBase64) content.push({ type: "file", data: dataBase64, mediaType, filename: name });

          const result = streamText({
            model,
            instructions: SAFETY_RULES,
            messages: [{ role: "user", content }],
            output: Output.object({ schema: analysisSchema }),
            abortSignal: request.signal,
            providerOptions: openaiOptions,
          });
          const output = await result.output;
          return Response.json({ analysis: output });
        } catch (err) {
          return gatewayError(err);
        }
      },
    },
  },
});
