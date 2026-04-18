import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mic, MicOff, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Sales Meeting Assistant — Live Insights" },
      {
        name: "description",
        content:
          "Paste a sales conversation or speak it live to get instant structured insights: objections, intent, sentiment, suggested reply, and risk signals.",
      },
    ],
  }),
});

type Insights = {
  objection: string;
  intent: string;
  sentiment: "Positive" | "Neutral" | "Negative" | string;
  suggestion: string;
  warning: string;
  hindsight: string;
};

// Minimal Web Speech API typing
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec: SpeechRecognitionLike = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  return rec;
}

function sentimentClass(s: string) {
  const v = s.toLowerCase();
  if (v.includes("pos")) return "bg-emerald-500/15 text-emerald-600 border-emerald-500/30";
  if (v.includes("neg")) return "bg-red-500/15 text-red-600 border-red-500/30";
  return "bg-yellow-500/15 text-yellow-700 border-yellow-500/30";
}

function Index() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef<string>("");

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  const toggleMic = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const rec = getRecognition();
    if (!rec) {
      toast.error("Voice input is not supported in this browser. Try Chrome.");
      return;
    }
    baseTextRef.current = text ? text + (text.endsWith("\n") ? "" : "\n") : "";
    rec.onresult = (e: any) => {
      let finalChunk = "";
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalChunk += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (finalChunk) {
        baseTextRef.current += finalChunk + " ";
      }
      setText(baseTextRef.current + interim);
    };
    rec.onerror = (e: any) => {
      console.error("speech error", e);
      toast.error("Mic error: " + (e?.error || "unknown"));
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    try {
      rec.start();
      setListening(true);
    } catch (e) {
      console.error(e);
      toast.error("Could not start microphone");
    }
  };

  const analyze = async () => {
    const conversation = text.trim();
    if (!conversation) {
      toast.error("Add a conversation first (paste or speak).");
      return;
    }
    setLoading(true);
    setInsights(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-meeting", {
        body: { conversation },
      });
      if (error) {
        const msg = (error as any)?.context?.error || error.message || "Failed to analyze";
        toast.error(msg);
        return;
      }
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      if (data?.insights) {
        setInsights(data.insights as Insights);
      } else {
        toast.error("No insights returned");
      }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Real-time meeting assistant
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Sales Meeting Assistant
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Paste a conversation or speak it live. Get structured insights: objections,
            intent, sentiment, what to say next, risks, and pattern-based hindsight.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-medium">Conversation</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={listening ? "destructive" : "secondary"}
                  size="sm"
                  onClick={toggleMic}
                  type="button"
                >
                  {listening ? (
                    <>
                      <MicOff className="mr-1.5 h-4 w-4" /> Stop
                    </>
                  ) : (
                    <>
                      <Mic className="mr-1.5 h-4 w-4" /> Speak
                    </>
                  )}
                </Button>
              </div>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Paste or dictate the conversation here...\n\nClient: Your product looks great but the price is high.\nRep: I hear you. What budget range works?\nClient: We're also looking at two competitors.`}
              className="min-h-[260px] resize-y text-sm leading-relaxed"
              maxLength={8000}
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {text.length}/8000
                {listening ? " · listening…" : ""}
              </span>
              <Button onClick={analyze} disabled={loading || !text.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Analyzing
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-4 w-4" /> Analyze
                  </>
                )}
              </Button>
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <h2 className="mb-3 text-sm font-medium">Insights</h2>
            {!insights && !loading && (
              <div className="flex h-[260px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Results will appear here
              </div>
            )}
            {loading && (
              <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reading the conversation…
              </div>
            )}
            {insights && (
              <div className="space-y-4">
                <InsightRow icon="🔴" label="Objection" value={insights.objection} />
                <InsightRow icon="🟡" label="Intent" value={insights.intent} />
                <div>
                  <div className="mb-1 text-xs font-medium text-muted-foreground">
                    🔵 Sentiment
                  </div>
                  <Badge
                    variant="outline"
                    className={`border ${sentimentClass(insights.sentiment)}`}
                  >
                    {insights.sentiment}
                  </Badge>
                </div>
                <InsightRow icon="💡" label="Suggestion" value={insights.suggestion} highlight />
                <InsightRow icon="🚨" label="Warning" value={insights.warning} />
                <InsightRow icon="🧠" label="Hindsight Insight" value={insights.hindsight} />
              </div>
            )}
          </Card>
        </section>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Powered by Lovable AI · Voice uses your browser's speech recognition
        </footer>
      </div>
    </main>
  );
}

function InsightRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium text-muted-foreground">
        {icon} {label}
      </div>
      <div
        className={`rounded-md border px-3 py-2 text-sm ${
          highlight ? "bg-primary/5 border-primary/30" : "bg-muted/40"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
