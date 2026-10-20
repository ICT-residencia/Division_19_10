# O próximo ciclo do ICT

Apresentação interativa do planejamento de execução do MVP5 de credenciamento de ICTs, com acompanhamento de checklist por tarefa. Continuação visual da apresentação oficial do Credenciamento de ICTs.

Stack: React, Vite, TypeScript, Tailwind e Motion. Sem WebGL: o fundo é um canvas 2D leve.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # type-check e build em dist/
```

## Navegação

Rolagem, setas do teclado, PageUp e PageDown, Home e End, os pontos à direita e a tecla F para tela cheia. Esc fecha o painel de detalhe.

## Seções

1. Abertura
2. Onde estamos
3. O que já construímos
4. A divisão
5. O fluxo: as 27 tarefas em ordem numérica, em cinco grupos que se expandem. Cada linha mostra responsável, status (Concluída, Em progresso, Pendente) e progresso do checklist.
6. Execução por responsável: um seletor com os quatro desenvolvedores, suas tarefas, a próxima atividade, as dependências e o progresso.
7. Próximos passos

Clicar em uma tarefa abre o painel com dependências, checklist, descrição original da issue, notas e links.

## Checklists e persistência local

- Os itens vêm do texto oficial das issues (critérios de aceite e evidência esperada), mais as etapas de revisão e integração da equipe. Nada é genérico.
- Para gerar de novo a partir do GitHub (somente leitura): `node scripts/fetch-issues.mjs` e depois `node scripts/parse-issues.mjs`. Exige o `gh` autenticado.
- Marcações e notas ficam em `localStorage`, na chave `ict-workspace:v1`. Só o que difere do padrão é guardado.
- Exportar e importar em JSON: painel **Fontes** ou seção 6.
- Marcar um item não altera o status oficial no GitHub, e checklist 100% não significa issue fechada. Não existe sincronização com o GitHub.
- Em tarefas concluídas, só o que está comprovado no GitHub (PR mergeada) vem marcado. O resto aparece como não verificado.

## Dados

`src/data.ts` guarda o inventário (responsável no GitHub, responsável aprovado, pontuação, esforço, dependências). `src/data/issues.json` guarda o conteúdo das issues.

- Estados lidos das issues e PRs em 19/10/2026. As colunas In review e In progress do Project são o último estado informado.
- A distribuição 4/3/3/2 foi aprovada por Lukas e aplicada nas issues T-016 a T-027 em 19/10/2026.
- Dificuldade: arquitetura 30%, segurança 20%, dependências 20%, integração 20%, incerteza 10%. Os esforços são estimativas.

## Referência visual

Tokens, tipografia e linguagem de movimento derivados do repositório da apresentação oficial (`styles.css`, `main.js`, `bg.js`). Nada foi copiado: o design system foi reescrito para esta aplicação.
