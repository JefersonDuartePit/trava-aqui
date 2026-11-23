import { connection } from "next/server";
import { getStore } from "@/lib/store";
import { toStudentActivity } from "@/lib/types";

// GET /api/activities/:id → a atividade como o aluno vê (sem a resposta esperada).

export async function GET(_request: Request, ctx: RouteContext<"/api/activities/[id]">) {
  await connection();
  const { id } = await ctx.params;
  const activity = await getStore().get(id);
  if (!activity) return Response.json({ error: "Atividade não encontrada." }, { status: 404 });
  return Response.json(toStudentActivity(activity));
}
