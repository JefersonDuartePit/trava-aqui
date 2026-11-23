import { Suspense } from "react";
import Atividade from "./atividade";

// O id da URL só existe em tempo de execução, então a tela entra num Suspense.
export default function AtividadePage() {
  return (
    <Suspense
      fallback={
        <main className="container">
          <p className="muted">Carregando…</p>
        </main>
      }
    >
      <Atividade />
    </Suspense>
  );
}
