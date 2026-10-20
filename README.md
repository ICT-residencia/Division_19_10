# Divisão 19/10 · MVP5

Apresentação da divisão das tarefas do MVP5 de credenciamento de ICTs. Páginas em tela cheia, uma ideia por tela.

Stack: React, Vite, TypeScript, Tailwind e Motion.

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # type-check e build em dist/
```

Navegação: setas do teclado, rolagem ou os pontos à direita.

## Dados

Tudo vem de `src/data.ts`: tarefas, responsável proposto, pontuação de complexidade (0 a 100), esforço estimado e dependências.

- Estados lidos das issues e PRs do GitHub em 19/10/2026. As colunas In review e In progress são o último estado informado.
- Pontuação: arquitetura 30%, segurança 20%, dependências 20%, integração 20%, incerteza 10%. Os esforços são estimativas.
- A distribuição 6/2/2/2 foi aprovada por Lukas e ainda não foi aplicada no GitHub.
