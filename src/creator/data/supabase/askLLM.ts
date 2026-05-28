import { getSupabaseClient } from './client';

export type LLMMessage = { role: 'system' | 'user' | 'assistant'; content: string };

/**
 * Thin wrapper around the `llm` Edge Function (server-side OpenRouter proxy).
 * The OpenRouter key never touches the browser — it lives in Supabase secrets.
 * Returns the raw OpenRouter chat-completion payload.
 */
export async function askLLM(messages: LLMMessage[], model?: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke('llm', {
    body: { messages, model },
  });
  if (error) throw error;
  return data;
}
