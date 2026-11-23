import { AiUnavailableError } from "@/lib/claude";
import { evaluateAnswer } from "@/lib/evaluate";
import { aiLimiter, clientKey } from "@/lib/rate-limit";
import { getStore } from "@/lib/store";
import { parseAnswer } from "@/lib/validation";

// POST /api/activities/:id/evaluate { answer } → { verdict, feedback }
// A resposta do aluno não é guardada: vai para o Claude e volta como feedback.

export async function POST(request: Request, ctx: RouteContext<"/api/activities/[id]/evaluate">) {
  const { id } = await ctx.params;
  const activity = await getStore().get(id);
  if (!activity) return Response.json({ error: "Atividade não encontrada." }, { status: 404 });

  const parsed = parseAnswer(await request.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  if (!aiLimiter.allow(clientKey(request))) {
    return Response.json(
      { error: "Muitas tentativas seguidas. Espere um minuto e tente de novo." },
      { status: 429 },
    );
  }

  try {
    return Response.json(await evaluateAnswer(activity, parsed.value));
  } catch (error) {
    if (error instanceof AiUnavailableError) {
      console.error("[evaluate]", error.message, error.cause);
      return Response.json(
        { error: "A IA não respondeu agora. Tente de novo em instantes." },
        { status: 503 },
      );
    }
    throw error;
  }
}
