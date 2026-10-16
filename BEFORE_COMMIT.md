# Before You Commit

A short checklist to run before pushing a pull request to this repo.

## Quick checks

```bash
npm run format        # Prettier --write .
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run build         # tsc -b  (catches build-only errors)
```

If you touched anything that runs at runtime, smoke-test it:

```bash
npm run dev                       # then in another shell:
curl http://localhost:3000/health              # 200 { "type": "success", ... }
curl http://localhost:3000/does-not-exist      # 404 { "type": "error", ... }
```

## Commit message

- Follow [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) (Conventional Commits style).
- `<type>[scope]: description` — imperative mood, lowercase, no trailing period, first line ≤ 72 chars.
- One logical change per commit; reference issues in the footer (`Closes #12`) so GitHub closes them automatically when merged.

## Code conventions (quick reference)

- Imports end in `.js` — the project compiles with `module: nodenext`, and `tsx` runs the same paths directly (`"./server.js"`).
- Add new env vars in `src/config/env.ts` with validation; never read `process.env` elsewhere.
- One Zod schema file per domain under `src/schemas/`; infer types with `z.infer` instead of duplicating them in `src/types/` (see `src/schemas/README.md`).
- Strict TS is on — `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`. Indexing/optional access usually needs an explicit null/undefined check.
- Register a new router in `src/rootRoutes.ts` **before** the 404 fallback and `handleError` (those two are last), and keep `app.use(rootRoutes)` last in `src/server.ts`.
- Use the response envelope `{ "type": "success" | "error", "message"? , ... }`; Zod validation failures return `400 { "type": "error", "errors": [...] }`.

## Hygiene

- Review `git diff` — remove stray `console.log`/debug code and accidental large files (`node_modules/`, `dist/`, `.env` — all gitignored).
- `.env` is gitignored and never auto-loaded; use inline vars, `--env-file=.env` (Node ≥ 22), or `dotenv`, and commit a `.env.example` if you introduce a new var.
- No test suite exists yet — typecheck + lint + a manual smoke test are the bar. If you add one, prefer `node:test` (built-in) or vitest.
- Graceful `SIGINT`/`SIGTERM` handling is already wired in `src/server.ts`; keep `npm run dev`'s hot restart in mind when editing there.

## References

- [COMMIT_CONVENTION.md](./COMMIT_CONVENTION.md) — commit message types.
- [src/schemas/README.md](./src/schemas/README.md) — Zod schema patterns.
- `npm run format` / `npm run lint` / `npm run typecheck` / `npm run build`.
