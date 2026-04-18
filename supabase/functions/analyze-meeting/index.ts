// Analyzes a sales meeting conversation snippet using Lovable AI Gateway
// and returns structured insights via tool calling.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an intelligent real-time meeting assistant for sales and client conversations.
Analyze the conversation and return STRICT structured insights using the provided tool.

Rules:
- Be concise and clear. No long paragraphs. No extra explanations.
- Always fill all sections.
- Objection: client concern (pricing, trust, timing, competition, etc.) or "None".
- Intent: e.g., interested, hesitant, negotiating, rejecting, exploring.
- Sentiment: Positive | Neutral | Negative.
- Suggestion: short, practical line the rep should say NEXT.
- Warning: risk signal, or "No immediate risk".
- Hindsight: smart pattern-based insight from general sales wisdom.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversation } = await req.json();

    if (!conversation || typeof conversation !== "string" || !conversation.trim()) {
      return new Response(
        JSON.stringify({ error: "conversation is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (conversation.length > 8000) {
      return new Response(
        JSON.stringify({ error: "conversation too long (max 8000 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI gateway not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Conversation:\n${conversation}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_insights",
              description: "Return structured meeting insights.",
              parameters: {
                type: "object",
                properties: {
                  objection: { type: "string", description: "Client concern or 'None'." },
                  intent: { type: "string", description: "interested | hesitant | negotiating | rejecting | exploring | other" },
                  sentiment: { type: "string", enum: ["Positive", "Neutral", "Negative"] },
                  suggestion: { type: "string", description: "Short next line for the rep." },
                  warning: { type: "string", description: "Risk signal or 'No immediate risk'." },
                  hindsight: { type: "string", description: "Smart sales-pattern insight." },
                },
                required: ["objection", "intent", "sentiment", "suggestion", "warning", "hindsight"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_insights" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds in Lovable workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Model did not return structured output" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("Failed to parse tool args", toolCall.function.arguments);
      return new Response(JSON.stringify({ error: "Invalid model output" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ insights: parsed }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-meeting error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
