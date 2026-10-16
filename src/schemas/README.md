# Zod Schemas

Runtime validation schemas built with [Zod v4](https://zod.dev). Routes and controllers use these to parse and validate incoming data (params, query, bodies) before any business logic runs. Types are inferred from the schemas with `z.infer`, so validation and typing never drift apart.

See `example.schemas.ts` for a worked example.

## Naming

One file per domain, named after its route file — drop the route-file suffix and append `.schemas.ts`:

| Route file                    | Schema file                      |
| ----------------------------- | -------------------------------- |
| `src/rootRoutes.ts`           | `src/schemas/root.schemas.ts`    |
| `src/routes/user.route.ts`    | `src/schemas/user.schemas.ts`    |
| `src/routes/example.route.ts` | `src/schemas/example.schemas.ts` |

Each schema file holds:

- **Params** — e.g. `exampleIdParamSchema`, for values taken from the URL path.
- **Query** — for query-string values.
- **Bodies** — `createXSchema`, `updateXSchema`, etc. for request payloads.
- **Responses** — `xResponseSchema`, for response bodies.
- **Types** — one `z.infer` export per schema.

## Conventions

- **Request bodies use `z.strictObject`** so unknown keys are rejected instead of silently ignored.
- **Params and query values are strings** — use `z.coerce.number()`, `z.coerce.boolean()`, etc. to convert them.
- **Custom error messages** use Zod v4 syntax: `z.string().min(2, { error: "Too short." })`.
- **Export the schema and its type together**, e.g. `createExampleSchema` and `type CreateExample = z.infer<typeof createExampleSchema>`.
- **Don't duplicate shapes in `src/types/`** — infer types from the schema that validates them.
- **Use `safeParse` in handlers**, not `parse`, and return `400` with `result.error.issues` on failure.

## Usage in a controller

```ts
import type { Request, Response } from "express";
import { createExampleSchema } from "../schemas/example.schemas.js";

export const createExample = (req: Request, res: Response) => {
  const parsed = createExampleSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ type: "error", errors: parsed.error.issues });
  }

  const input = parsed.data; // fully typed as CreateExample
  // ... pass `input` to the service.
};
```

Note the `.js` extension in imports — the project compiles with `module: nodenext`, so relative imports use the compiled file name.
