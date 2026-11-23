"use client";

import { useEffect, useState } from "react";
import type { Activity } from "@/lib/types";
import { LIMITS } from "@/lib/validation";

async function fetchActivities(): Promise<Activity[]> {
  const response = await fetch("/api/activities?view=professor", { cache: "no-store" });
  return response.ok ? response.json() : [];
}

export default function ProfessorPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchActivities().then(setActivities);
  }, []);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const response = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, question, expectedAnswer }),
    });
    setSaving(false);
    if (!response.ok) {
      setError(((await response.json()) as { error: string }).error);
      return;
    }
    setSubject("");
    setQuestion("");
    setExpectedAnswer("");
    setActivities(await fetchActivities());
  }

  return (
    <main className="container">
      <h1>Área do professor</h1>

      <form className="card" onSubmit={create}>
        <h2>Nova atividade</h2>
        <label>
          Matéria
          <input
            id="subject"
            value={subject}
            maxLength={LIMITS.subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Biologia"
          />
        </label>
        <label>
          Pergunta para o aluno
          <textarea
            id="question"
            value={question}
            maxLength={LIMITS.question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Por que a fotossíntese depende da luz?"
          />
        </label>
        <label>
          Resposta esperada (o aluno não vê)
          <textarea
            id="expectedAnswer"
            value={expectedAnswer}
            maxLength={LIMITS.expectedAnswer}
            onChange={(event) => setExpectedAnswer(event.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Criar atividade"}
        </button>
      </form>

      <h2>Atividades criadas</h2>
      <ul className="list">
        {activities.map((activity) => (
          <li key={activity.id} className="card">
            <span className="tag">{activity.subject}</span>
            <strong>{activity.question}</strong>
            <p className="answer">{activity.expectedAnswer}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
