<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Trava Aqui

Portal de atividades curtas para uma palestra com alunos do ensino médio. O professor cria uma atividade; o aluno responde e uma IA ajuda sem entregar a resposta. O software evolui ao vivo, no palco, a partir do que a turma pedir.

## Regras do produto

- A IA nunca entrega a resposta esperada ao aluno. Todo prompt novo mantém essa regra.
- A resposta esperada nunca vai para a tela do aluno: use `toStudentActivity` em toda rota que serve o aluno.
- Os alunos são menores de idade: sem login, sem nome, foto, voz ou telefone. A resposta do aluno não é guardada.
- Textos de interface em português do Brasil, simples e curtos. Tudo precisa funcionar no celular.

## Arquitetura

| Onde | O quê |
|---|---|
| `src/lib/claude.ts` | `askJson`: única porta para o Claude. Recebe system, prompt e JSON Schema e devolve o JSON parseado. |
| `src/lib/evaluate.ts` | "Conferir resposta": modelo de como escrever uma função de IA nova (prompt, schema, validação). |
| `src/lib/store.ts` | Atividades: memória local ou Upstash Redis, conforme o `.env`. |
| `src/lib/rate-limit.ts` | Limite de chamadas à IA por aparelho. Toda rota que chama o Claude usa `aiLimiter`. |
| `src/app/api/...` | Rotas da API. GET que lê dados chama `await connection()` para não ser pré-renderizado. |
| `src/app/professor`, `src/app/aluno` | Telas (componentes cliente que chamam a API). |

Para uma função de IA nova (por exemplo, a pista da v1): crie `src/lib/<funcao>.ts` seguindo `evaluate.ts`, uma rota em `src/app/api/activities/[id]/<funcao>/route.ts` seguindo a rota `evaluate`, um teste com cliente falso seguindo `evaluate.test.ts` e o botão na tela do aluno.

## Validação

Antes de dar algo por pronto, rode e confira:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
