import { createOpenAI } from "@ai-sdk/openai";

export const CHAT_MODEL = "openai/gpt-6-astra";
const RUN_ID = "X-Lovable-AIG-Run-ID";

export function createGateway(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured");
  let runId = request.headers.get(RUN_ID)?.trim() || undefined;
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (input, init) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID)) headers.set(RUN_ID, runId);
      const res = await fetch(input, { ...init, headers });
      runId ??= res.headers.get(RUN_ID)?.trim() || undefined;
      return res;
    },
  });
  return { model: provider.responses(CHAT_MODEL), getRunId: () => runId };
}

export const openaiOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

export function gatewayError(err: unknown) {
  const e = err as { statusCode?: number; status?: number; message?: string };
  const status = e?.statusCode ?? e?.status ?? 500;
  const message =
    status === 429
      ? "Too many requests right now. Please wait a moment and try again."
      : status === 402
        ? "AI credits are used up for this workspace. Please add credits to continue."
        : status === 403
          ? "AI access is currently unavailable for this workspace."
          : "The AI service had a problem. Please try again.";
  console.error("AI gateway error", status, e?.message);
  return Response.json({ error: message }, { status: status >= 400 ? status : 500 });
}
