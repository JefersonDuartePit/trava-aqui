"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StudentActivity } from "@/lib/types";

export default function AlunoPage() {
  const [activities, setActivities] = useState<StudentActivity[] | null>(null);

  useEffect(() => {
    fetch("/api/activities", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then(setActivities)
      .catch(() => setActivities([]));
  }, []);

  return (
    <main className="container">
      <h1>Escolha uma atividade</h1>
      {activities === null && <p className="muted">Carregando atividades…</p>}
      {activities?.length === 0 && (
        <p className="muted">Nenhuma atividade ainda. Peça para o professor criar uma.</p>
      )}
      <ul className="list">
        {activities?.map((activity) => (
          <li key={activity.id}>
            <Link href={`/aluno/${activity.id}`} className="choice">
              <div className="card">
                <span className="tag">{activity.subject}</span>
                <strong>{activity.question}</strong>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
