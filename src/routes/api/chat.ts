import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { SAFETY_RULES } from "@/lib/safety";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { createGateway, openaiOptions, gatewayError } = await import("@/lib/ai.server");
        const json = (await request.json().catch(() => null)) as {
          messages?: UIMessage[];
          reportContext?: string;
        } | null;
        if (!json?.messages?.length) return Response.json({ error: "Invalid request" }, { status: 400 });
        try {
          const { model } = createGateway(request);
          const context = json.reportContext
            ? `\n\nThe user's current report analysis (for reference):\n${json.reportContext.slice(0, 8000)}`
            : "";
          const result = streamText({
            model,
            instructions: `${SAFETY_RULES}\nFormat answers with short markdown headings or bullet lists when helpful. End medical explanations with a one-line reminder to consult a professional.${context}`,
            messages: await convertToModelMessages(json.messages.slice(-20)),
            abortSignal: request.signal,
            providerOptions: openaiOptions,
          });
          return result.toUIMessageStreamResponse({ sendReasoning: false });
        } catch (err) {
          return gatewayError(err);
        }
      },
    },
  },
});
