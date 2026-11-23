import { connection } from "next/server";
import { getStore } from "@/lib/store";
import { toStudentActivity } from "@/lib/types";
import { parseNewActivity } from "@/lib/validation";

// GET /api/activities          → lista para o aluno (sem a resposta esperada)
// GET /api/activities?view=professor → lista completa, para a tela do professor
// POST /api/activities         → professor cria uma atividade
//
// Não há login: a demo é aberta. A resposta esperada só sai na visão do professor.

export async function GET(request: Request) {
  await connection();
  const activities = await getStore().list();
  const isTeacher = new URL(request.url).searchParams.get("view") === "professor";
  return Response.json(isTeacher ? activities : activities.map(toStudentActivity));
}

export async function POST(request: Request) {
  const parsed = parseNewActivity(await request.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const activity = await getStore().create(parsed.value);
  return Response.json(activity, { status: 201 });
}
