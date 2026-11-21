# senior-mode-sandbox

<!-- At most 80 lines: what an agent cannot derive from the code. History and decisions go in docs/. -->

## Commands
- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Test: `npm test` (Vitest)
- Build: `npm run build`
- All checks: `senior-mode check` (also the pre-push hook)

## Code map
- `src/app/`: Next.js App Router (layout, pages, CSS modules)
- `src/lib/`: pure helpers with colocated `*.test.ts` (e.g. `price.ts`)
- `docs/`: architecture, specs, ADRs

## Pitfalls
- Next.js 16: APIs differ from training data; read `node_modules/next/dist/docs/` before writing code (see `AGENTS.md`).
- Prices are integer cents; `formatPrice` in `src/lib/price.ts` is the only place that converts to euros.

<!-- senior-mode:principles (kept up to date by senior-mode setup; edit outside this block) -->
## Principles
- Keep it simple: the smallest change that meets the acceptance criteria, no speculative abstraction.
- One responsibility per module and function; add an interface when a second implementation exists.
- Test first: a failing test, the code, then refactor; the test goes in the same commit as the code.
- Atomic Conventional Commits; the body says why.
- One pull request per issue, about 400 changed lines at most.
- Decisions that outlive a pull request go in `docs/adr/`; M and L features start from `docs/specs/`.
- Done means the checks ran and pass (`senior-mode check`, or `.githooks/pre-push`).
- Agent machines use development environments only, never production; `envGuard` (in `.claude/senior-mode.json`) enforces it when configured.
- Ask when a product or architecture decision is open; never guess.
<!-- /senior-mode:principles -->
