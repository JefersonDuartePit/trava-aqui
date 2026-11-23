import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <h1>Travou? A gente destrava junto.</h1>
      <p className="muted">
        O professor cria uma atividade curta. O aluno responde e a IA confere, sem entregar a
        resposta.
      </p>
      <div className="choice-grid">
        <Link href="/professor" className="choice">
          <div className="card">
            <span className="tag">Professor</span>
            <h2>Criar uma atividade</h2>
            <p className="muted">Escreva a pergunta e a resposta que você espera.</p>
          </div>
        </Link>
        <Link href="/aluno" className="choice">
          <div className="card">
            <span className="tag">Aluno</span>
            <h2>Responder uma atividade</h2>
            <p className="muted">Escolha uma atividade, tente responder e confira.</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
