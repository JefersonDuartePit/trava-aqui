import Anthropic from "@anthropic-ai/sdk";

// Ponto único de acesso ao Claude. Novas funções de IA (como a pista da v1) usam askJson.

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

export class AiUnavailableError extends Error {}

let client: Anthropic | undefined;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AiUnavailableError("ANTHROPIC_API_KEY não configurada.");
  }
  client ??= new Anthropic({ maxRetries: 1 });
  return client;
}

export interface AskJsonInput {
  system: string;
  prompt: string;
  /** JSON Schema da resposta. O Claude devolve exatamente esse formato. */
  schema: Record<string, unknown>;
  maxTokens?: number;
}

/** Faz uma pergunta ao Claude e devolve o JSON da resposta, já parseado. */
export async function askJson<T>(
  { system, prompt, schema, maxTokens = 800 }: AskJsonInput,
  anthropic: Pick<Anthropic, "messages"> = getClient(),
): Promise<T> {
  let response: Anthropic.Message;
  try {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      output_config: { effort: "low", format: { type: "json_schema", schema } },
      messages: [{ role: "user", content: prompt }],
    });
  } catch (cause) {
    throw new AiUnavailableError("Falha ao chamar o Claude.", { cause });
  }

  if (response.stop_reason !== "end_turn") {
    throw new AiUnavailableError(`Resposta incompleta do Claude: ${String(response.stop_reason)}`);
  }

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

  try {
    return JSON.parse(text) as T;
  } catch (cause) {
    throw new AiUnavailableError("O Claude não devolveu JSON válido.", { cause });
  }
}
