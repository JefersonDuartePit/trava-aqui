import type { NewActivity } from "./types";

export const LIMITS = {
  subject: 60,
  question: 500,
  expectedAnswer: 1000,
  answer: 1500,
} as const;

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseNewActivity(body: unknown): Parsed<NewActivity> {
  const input = (body ?? {}) as Record<string, unknown>;
  const subject = text(input.subject);
  const question = text(input.question);
  const expectedAnswer = text(input.expectedAnswer);

  if (!subject || !question || !expectedAnswer) {
    return { ok: false, error: "Preencha matéria, pergunta e resposta esperada." };
  }
  if (subject.length > LIMITS.subject) {
    return { ok: false, error: `A matéria pode ter até ${LIMITS.subject} caracteres.` };
  }
  if (question.length > LIMITS.question) {
    return { ok: false, error: `A pergunta pode ter até ${LIMITS.question} caracteres.` };
  }
  if (expectedAnswer.length > LIMITS.expectedAnswer) {
    return {
      ok: false,
      error: `A resposta esperada pode ter até ${LIMITS.expectedAnswer} caracteres.`,
    };
  }
  return { ok: true, value: { subject, question, expectedAnswer } };
}

export function parseAnswer(body: unknown): Parsed<string> {
  const answer = text((body as Record<string, unknown> | null)?.answer);
  if (!answer) return { ok: false, error: "Escreva sua resposta antes de conferir." };
  if (answer.length > LIMITS.answer) {
    return { ok: false, error: `A resposta pode ter até ${LIMITS.answer} caracteres.` };
  }
  return { ok: true, value: answer };
}
