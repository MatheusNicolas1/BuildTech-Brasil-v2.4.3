# Convenções de Código (MVP)

## Stack e padrões
- Monorepo com npm workspaces: `apps/*` e `packages/*`
- Next.js App Router em `apps/web`
- TypeScript strict habilitado (`strict: true`)
- ESLint obrigatório no CI/local (`npm run lint`)
- Typecheck obrigatório (`npm run typecheck`)

## Estrutura
- `apps/web/src/app`: rotas e layout (App Router)
- Evitar lógica de domínio em componentes; preferir camadas (ex.: `src/lib`, `src/services`) conforme o MVP crescer

## Nomenclatura
- Componentes React: PascalCase
- Funções/variáveis: camelCase
- Arquivos utilitários: kebab-case ou camelCase (escolher um padrão e manter consistente)

## Importações
- Usar alias `@/*` apontando para `apps/web/src/*`
- Preferir imports absolutos via alias em vez de caminhos relativos longos

## Scripts oficiais
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`

## Commits (recomendação)
- Formato: `chore:`, `feat:`, `fix:`, `docs:` (manter consistência)
