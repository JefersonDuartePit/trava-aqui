"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Evaluation, StudentActivity } from "@/lib/types";
import { LIMITS } from "@/lib/validation";

const VERDICT_LABEL: Record<Evaluation["verdict"], string> = {
  certo: "Isso aí!",
  quase: "Quase lá",
  "ainda-nao": "Ainda não",
};

export default function Atividade() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<StudentActivity | null | undefined>(undefined);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetch(`/api/activities/${id}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then(setActivity)
      .catch(() => setActivity(null));
  }, [id]);

  async function check(event: React.FormEvent) {
    event.preventDefault();
    setChecking(true);
    setError("");
    setEvaluation(null);
    const response = await fetch(`/api/activities/${id}/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    setChecking(false);
    const body = await response.json();
    if (!response.ok) setError(body.error);
    else setEvaluation(body);
  }

  if (activity === undefined) {
    return (
      <main className="container">
        <p className="muted">Carregando…</p>
      </main>
    );
  }

  if (activity === null) {
    return (
      <main className="container">
        <p>Essa atividade não existe mais.</p>
        <Link href="/aluno">Voltar para as atividades</Link>
      </main>
    );
  }

  return (
    <main className="container">
      <Link href="/aluno">← Atividades</Link>
      <div className="card">
        <span className="tag">{activity.subject}</span>
        <h1>{activity.question}</h1>
      </div>

      <form className="card" onSubmit={check}>
        <label>
          Sua resposta
          <textarea
            id="answer"
            value={answer}
            maxLength={LIMITS.answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Escreva com suas palavras"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={checking}>
          {checking ? "Conferindo…" : "Conferir resposta"}
        </button>
      </form>

      {evaluation && (
        <div className="feedback" data-verdict={evaluation.verdict} role="status">
          <strong>{VERDICT_LABEL[evaluation.verdict]}</strong>
          {evaluation.feedback}
        </div>
      )}
    </main>
  );
}
