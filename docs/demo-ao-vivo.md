# Demo ao vivo: v1 e v2

Durante a palestra, o app evolui em dois pedidos ao agente. Cada versão tem um **template HTML** que define o visual e o comportamento esperados. Quando o pedido da v1 ou da v2 chegar, siga o template da versão correspondente.

| Versão | Template | Visual | O que muda no comportamento |
|---|---|---|---|
| Base | (o que já está no repo) | Esqueleto neutro, sem identidade visual | Professor cria atividade; aluno responde e confere |
| v1 | [`templates/v1.html`](templates/v1.html) | **Genérico de IA, de propósito**: degradê roxo e azul, emoji em tudo, vidro fosco, tudo centralizado e arredondado, frases de marketing | Botão **"💡 Me dá uma pista!"** na tela do aluno: uma pista única gerada pela IA |
| v2 | [`templates/v2.html`](templates/v2.html) | **Especificado**: fundo claro, azul de acento, marca-texto amarelo, sem emoji nem degradê, hierarquia clara, pensado para celular | Três pistas em níveis, liberadas uma por tentativa; o professor revisa, edita e aprova as pistas antes de o aluno ver |

## Por que a v1 é feia

A turma precisa ver a diferença entre pedir sem especificar e pedir especificando. A v1 representa o que a IA entrega quando ninguém diz como quer o resultado. A v2 representa o resultado quando a pessoa define o objetivo, o padrão visual e as regras. **Não melhore o visual da v1.** Reproduza o template como ele é.

## Regras para o agente

Quando o pedido mencionar a v1 ou a v2:

1. **Leia o template da versão antes de escrever código.** Abra o HTML inteiro: o CSS, as telas e o JavaScript de comportamento.
2. **Reproduza o visual do template no app.** Mesmas cores, fontes, espaçamentos, textos, emojis (na v1) e estrutura de telas. Substitua o CSS da versão anterior em `src/app/globals.css` e ajuste as telas em `src/app/`. O resultado no navegador precisa ser reconhecível como o template.
3. **Troque os dados simulados por dados reais.** No template, atividades, pistas e conferência são falsas. No app, tudo vem da API e do Claude. Nada de lista fixa no front.
4. **A IA continua passando por `askJson`.** Siga o padrão de `src/lib/evaluate.ts`: prompt, JSON Schema, validação do retorno, teste com cliente falso.
5. **Não traga o que é só do template.** A faixa "Template da v2", os selos NOVO e o `alert()` da v1 não vão para o app.
6. **Valide antes de dar por pronto:** `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

### Comportamento da v1

- O pedido da pista vai para uma rota nova, `POST /api/activities/[id]/hint`, com limite de chamadas (`aiLimiter`).
- O prompt da v1 é ingênuo: pede "uma pista para ajudar o aluno". O template mostra pistas que praticamente entregam a resposta. Esse é o problema que a turma vai apontar, então **não proteja contra ele na v1**.

### Comportamento da v2

- Ao criar a atividade, a IA gera **três pistas**, da mais leve à mais direta, sem entregar a resposta. Elas ficam guardadas na atividade com status "aguardando revisão".
- O professor revisa, edita, pede outra versão de uma pista e aprova. Só atividades aprovadas aparecem para o aluno.
- O aluno libera a pista seguinte só depois de uma nova tentativa de resposta. O app mostra tentativas e pistas usadas.
- A rota da pista da v1 deixa de gerar pista na hora: passa a devolver a próxima pista aprovada.
- As pistas nunca chegam à tela do aluno antes de liberadas.

## Como ver os templates

Abra o arquivo no navegador. Os dois funcionam sozinhos, sem servidor, e navegam por `#/professor` e `#/aluno`.
