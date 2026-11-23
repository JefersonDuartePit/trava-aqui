# Trava Aqui

Portal de atividades curtas em que o professor cria uma pergunta e o aluno, quando trava, conta com uma IA que ajuda **sem entregar a resposta**.

Este repositório é a base de uma palestra sobre IA para alunos do ensino médio. A base vem pronta; as próximas versões são construídas ao vivo, a partir do que a turma pedir.

## O que a base já faz

- **Professor** (`/professor`): cria atividades com matéria, pergunta e resposta esperada.
- **Aluno** (`/aluno`): escolhe uma atividade, responde e usa **Conferir resposta**. O Claude diz se está certo, quase ou ainda não, com um comentário curto e sem revelar a resposta.
- Três atividades de exemplo (Biologia, Matemática e História), para o portal não abrir vazio.

## Cuidados com os alunos

- Sem login e sem dado pessoal. A resposta do aluno vai para a IA e volta como comentário; nada é guardado.
- A resposta esperada nunca chega à tela do aluno.
- Há um limite de chamadas à IA por aparelho (padrão: 10 por minuto).

## Como rodar

Requisitos: Node.js 22 ou mais novo e pnpm.

```bash
pnpm install
cp .env.example .env.local   # preencha ANTHROPIC_API_KEY
pnpm dev
```

Abra http://localhost:3000.

## Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | Gera os tipos de rota e roda o TypeScript |
| `pnpm test` | Testes (Vitest) |
| `pnpm build` | Build de produção |

## Publicar na Vercel

1. Importe o repositório na Vercel.
2. Configure `ANTHROPIC_API_KEY` e, de preferência, um limite de gasto na conta da Anthropic.
3. Crie um banco Upstash Redis e configure `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`. Sem ele, cada instância do servidor guarda as atividades na própria memória e os alunos podem ver listas diferentes.

## Stack

Next.js 16 (App Router), React 19, TypeScript, SDK oficial da Anthropic (`claude-haiku-5-5` por padrão) e Vitest.
