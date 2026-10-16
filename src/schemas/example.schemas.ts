import { z } from "zod";

/**
 * Example Zod schemas — copy this file as the starting point for a new
 * domain, e.g. `club.schemas.ts` for the club routes and controller.
 *
 * Conventions (see README.md in this folder):
 * - Request bodies use `z.strictObject` so unknown keys are rejected.
 * - Route params and query values arrive as strings, so coerce them.
 * - Export a TypeScript type for every schema via `z.infer`.
 */

// Route params.
export const exampleIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Request body. `strictObject` rejects unknown keys (extra fields -> 400).
export const createExampleSchema = z.strictObject({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters." })
    .max(100, { error: "Name must be at most 100 characters." }),
  description: z.string().trim().max(500).optional(),
  category: z.enum(["technical", "cultural", "sports", "social"]),
  active: z.boolean().default(true),
});

// Response body.
export const exampleResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  description: z.string().optional(),
  category: z.enum(["technical", "cultural", "sports", "social"]),
  active: z.boolean(),
});

// Types inferred from the schemas above — never write them by hand.
export type ExampleIdParam = z.infer<typeof exampleIdParamSchema>;
export type CreateExample = z.infer<typeof createExampleSchema>;
export type ExampleResponse = z.infer<typeof exampleResponseSchema>;
