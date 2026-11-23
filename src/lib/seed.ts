import type { Activity } from "./types";

// Atividades de exemplo, para o portal não abrir vazio no ensaio.
export const SEED_ACTIVITIES: Activity[] = [
  {
    id: "fotossintese",
    subject: "Biologia",
    question: "Por que a fotossíntese depende da luz?",
    expectedAnswer:
      "Porque a luz fornece a energia que a planta usa para transformar gás carbônico e água em glicose, liberando oxigênio.",
    createdAt: "2026-11-23T12:00:00.000Z",
  },
  {
    id: "porcentagem",
    subject: "Matemática",
    question:
      "Uma camiseta custava R$ 80 e entrou em promoção com 25% de desconto. Quanto ela custa agora?",
    expectedAnswer: "R$ 60, porque 25% de 80 é 20 e 80 menos 20 é 60.",
    createdAt: "2026-11-23T12:01:00.000Z",
  },
  {
    id: "abolicao",
    subject: "História",
    question:
      "Por que a abolição da escravidão em 1888 não garantiu condições dignas para a população liberta?",
    expectedAnswer:
      "Porque não houve políticas de acesso a terra, trabalho, educação ou indenização; a população liberta ficou marginalizada.",
    createdAt: "2026-11-23T12:02:00.000Z",
  },
];
