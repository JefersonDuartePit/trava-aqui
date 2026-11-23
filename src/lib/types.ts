// Tipos compartilhados entre a API e as telas.

export interface Activity {
  id: string;
  subject: string;
  question: string;
  /** Só o professor vê. Nunca vai para a tela do aluno. */
  expectedAnswer: string;
  createdAt: string;
}

/** O que o aluno recebe: a atividade sem a resposta esperada. */
export type StudentActivity = Omit<Activity, "expectedAnswer">;

export interface NewActivity {
  subject: string;
  question: string;
  expectedAnswer: string;
}

export type Verdict = "certo" | "quase" | "ainda-nao";

export interface Evaluation {
  verdict: Verdict;
  feedback: string;
}

export function toStudentActivity({ expectedAnswer: _omit, ...rest }: Activity): StudentActivity {
  void _omit;
  return rest;
}
