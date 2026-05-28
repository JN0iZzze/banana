// Edge Function: llm — server-side proxy to OpenRouter.
// The OpenRouter key lives only in Supabase secrets (OPENROUTER_API_KEY) and
// never reaches the browser. The client calls this function via supabase.functions.invoke('llm').
// Contract: POST { messages: {role, content}[], model?: string } -> OpenRouter chat completion JSON.

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("OPENROUTER_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENROUTER_API_KEY is not set in Edge Function secrets" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { messages, model } = await req.json().catch(() => ({ messages: undefined, model: undefined }));
  if (!Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: "Body must be { messages: [...] }" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const r = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: model ?? "openrouter/free", messages }),
  });

  const payload = await r.text();
  return new Response(payload, {
    status: r.status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
