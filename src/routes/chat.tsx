import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Paperclip, Send, Stethoscope, Trash2 } from "lucide-react";
import { z } from "zod";
import { Disclaimer, PageShell, PageTitle, useReportUpload } from "@/components/site";
import { analysisToContext, getReport } from "@/lib/store";
import { isUrgent } from "@/lib/safety";

export const Route = createFileRoute("/chat")({
  validateSearch: z.object({ report: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "MediAI Chat — MediGuide AI" },
      { name: "description", content: "Ask plain-language questions about your medical report." },
      { property: "og:title", content: "MediAI Chat — MediGuide AI" },
      { property: "og:description", content: "Chat with an educational AI about your lab results." },
    ],
  }),
  component: ChatPage,
});

const KEY = "mg.chat";
const SUGGESTED = ["What does a high LDL mean?", "Explain my report in simple terms", "What questions should I ask my doctor?"];

function ChatPage() {
  const search = Route.useSearch();
  const [reportId, setReportId] = useState<string | undefined>(search.report);
  const [input, setInput] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, setMessages, error } = useChat({ transport });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "[]") as UIMessage[];
      if (saved.length) setMessages(saved);
    } catch { /* ignore */ }
    textRef.current?.focus();
  }, [setMessages]);
  useEffect(() => {
    if (status === "ready") { localStorage.setItem(KEY, JSON.stringify(messages)); textRef.current?.focus(); }
  }, [messages, status]);

  const send = (text: string, rid = reportId) => {
    if (!text.trim() || status === "streaming" || status === "submitted") return;
    const a = rid ? getReport(rid)?.analysis : undefined;
    sendMessage({ text }, { body: { reportContext: a ? analysisToContext(a) : undefined } });
    setInput("");
  };
  const upload = useReportUpload((id) => { setReportId(id); send("Explain my report in simple terms", id); });
  const report = reportId ? getReport(reportId) : undefined;
  const busy = status === "submitted" || status === "streaming";

  return (
    <PageShell>
      <PageTitle eyebrow="MediAI" title="Ask about your health">
        {report?.analysis ? `Using: ${report.analysis.title}` : "Upload a report or ask a general question."}
      </PageTitle>
      {upload.input}
      <div className="flex min-h-[460px] flex-col rounded-3xl border bg-card">
        <div className="flex-1 space-y-5 p-6">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border px-4 py-2 text-xs hover:bg-muted">{s}</button>
              ))}
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
              {m.role !== "user" && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-emerald"><Stethoscope className="h-4 w-4" /></span>}
              <div className={m.role === "user" ? "max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground" : "max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed"}>
                {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
                {m.role === "user" && isUrgent(m.parts.map((p) => (p.type === "text" ? p.text : "")).join(" ")) && (
                  <p className="mt-2 text-xs font-bold">If this is an emergency, call your local emergency number now.</p>
                )}
              </div>
            </div>
          ))}
          {status === "submitted" && (
            <div className="flex gap-1 pl-11">{[0, 1, 2].map((i) => <span key={i} className="typing-dot h-2 w-2 rounded-full bg-emerald" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
          )}
          {error && <p className="text-sm text-destructive">Something went wrong. Please try again.</p>}
        </div>
        <div className="flex items-end gap-2 border-t p-3">
          <button aria-label="Upload report" onClick={upload.open} disabled={upload.busy} className="rounded-full p-2.5 hover:bg-muted"><Paperclip className="h-4 w-4" /></button>
          <textarea ref={textRef} value={input} rows={1} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about a value, a term, or your next step…" className="flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" />
          {messages.length > 0 && <button aria-label="Clear chat" onClick={() => { setMessages([]); localStorage.removeItem(KEY); }} className="rounded-full p-2.5 hover:bg-muted"><Trash2 className="h-4 w-4" /></button>}
          <button aria-label="Send" onClick={() => send(input)} disabled={busy} className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground disabled:opacity-50"><Send className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-4"><Disclaimer compact /></div>
    </PageShell>
  );
}
