import { describe, expect, it } from "vitest";
import { LIMITS, parseAnswer, parseNewActivity } from "./validation";

describe("parseNewActivity", () => {
  it("aceita uma atividade completa e tira espaços", () => {
    const parsed = parseNewActivity({ subject: " Física ", question: "O que é força?", expectedAnswer: "Massa vezes aceleração." });
    expect(parsed).toEqual({
      ok: true,
      value: { subject: "Física", question: "O que é força?", expectedAnswer: "Massa vezes aceleração." },
    });
  });

  it("recusa campos vazios ou ausentes", () => {
    expect(parseNewActivity({ subject: "Física", question: "  " }).ok).toBe(false);
    expect(parseNewActivity(null).ok).toBe(false);
  });

  it("recusa texto acima do limite", () => {
    const parsed = parseNewActivity({
      subject: "Física",
      question: "x".repeat(LIMITS.question + 1),
      expectedAnswer: "y",
    });
    expect(parsed.ok).toBe(false);
  });
});

describe("parseAnswer", () => {
  it("aceita uma resposta", () => {
    expect(parseAnswer({ answer: " luz " })).toEqual({ ok: true, value: "luz" });
  });

  it("recusa resposta vazia ou longa demais", () => {
    expect(parseAnswer({ answer: "" }).ok).toBe(false);
    expect(parseAnswer({ answer: "a".repeat(LIMITS.answer + 1) }).ok).toBe(false);
  });
});
