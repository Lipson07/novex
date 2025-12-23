export type AiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-2.0-flash-001"; // или «-001»

// Твой ключ для личного использования
const FALLBACK_KEY =
  "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";

const getApiKey = () =>
  (globalThis as any)?.process?.env?.OPENROUTER_API_KEY ||
  (import.meta as any)?.env?.VITE_OPENROUTER_API_KEY ||
  FALLBACK_KEY;

function getModel() {
  return (
    (globalThis as any)?.process?.env?.OPENROUTER_MODEL ||
    (import.meta as any)?.env?.VITE_OPENROUTER_MODEL ||
    DEFAULT_MODEL
  );
}

export async function sendChatCompletion(
  messages: AiMessage[]
): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API ключ OpenRouter не задан");

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getModel(),
      messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${text}`);
  }

  const data = await response.json();
  return (
    data?.choices?.[0]?.message?.content || "AI не вернул содержимое ответа"
  );
}
