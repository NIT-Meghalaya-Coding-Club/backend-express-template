# clubs-website-nitm

Express + TypeScript backend for the NITM clubs website.

**Stack:** Node.js (≥ 20) · Express 5 · TypeScript (ESM) · Zod v4 · ESLint 9 (flat config) · Prettier.

## Getting started

**Prerequisites:** Node.js ≥ 20 and npm.

```bash
npm install
npm run dev
```

The dev server starts at [http://localhost:3000](http://localhost:3000).

- Override the port with `PORT=4000 npm run dev`. An invalid value like `abc` fails at startup with `Invalid PORT environment value: "abc"`.
- Environment variables are not auto-loaded from a `.env` file. Use `--env-file=.env` (Node ≥ 22), `dotenv`, or inline vars.
- Production: `npm run build && npm run start` (compiled output lands in `dist/`).

See [BEFORE_COMMIT.md](./BEFORE_COMMIT.md) for the full pre-commit checklist.

## Project layout

```
src
├── server.ts               # middleware, route mounting, listen + graceful shutdown
├── rootRoutes.ts            # mounted last: 404 fallback + error handler, plus routes
├── config/
│   └── env.ts               # single source of env vars (validated at startup)
├── schemas/
│   ├── README.md            # Zod conventions
│   └── example.schemas.ts   # reference schema (params, body, response, types)
├── routes/                  # placeholders: example.routes.ts, root.routes.ts
├── controllers/             # placeholders
├── services/                # placeholders
├── lib/                     # empty
└── types/                   # empty
```

Conventions to read before touching it: `.js` import extensions (nodenext), one Zod schema file per domain (see `src/schemas/README.md`), controllers contain no business logic, and new routers are mounted _before_ the 404 fallback in `src/rootRoutes.ts`.

## npm scripts

| Script                 | Command                         | What it does                                                                                       |
| ---------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`          | `tsx watch src/server.ts`       | Run `src/server.ts` directly with hot reload on file changes.                                      |
| `npm run build`        | `tsc -b`                        | Type-check and compile the project from `src/` to `dist/`.                                         |
| `npm start`            | `node dist/server.js`           | Run the compiled server from `dist/`. Run `npm run build` first.                                   |
| `npm run dev:build`    | `tsc -b && node dist/server.js` | Build, then immediately run the compiled output in one step.                                       |
| `npm run watch`        | `tsc -w`                        | Recompile on file changes without running the server.                                              |
| `npm run typecheck`    | `tsc --noEmit`                  | Type-check only — reports errors without writing any files to `dist/`.                             |
| `npm run lint`         | `eslint .`                      | Lint the whole project with ESLint.                                                                |
| `npm run lint:fix`     | `eslint . --fix`                | Lint and automatically fix all fixable problems.                                                   |
| `npm run format`       | `prettier --write .`            | Format all files with Prettier.                                                                    |
| `npm run format:check` | `prettier --check .`            | Check that all files are Prettier-formatted without writing changes (`npm run format` fixes them). |

### Linting

Linting is configured in `eslint.config.mjs` (ESLint flat config) and includes:

- `@eslint/js` recommended rules and `typescript-eslint` recommended rules.
- Same ignores as `.gitignore` (`node_modules/`, `dist/`, env files, etc.), so generated output is never linted.
- `eslint-config-prettier` last, so ESLint and Prettier never fight over formatting.
- Unused variables and arguments prefixed with `_` are allowed.

### Formatting

Prettier settings live in `.prettierrc.json` (2-space indent, double quotes, semicolons, trailing commas, 80-column width, LF line endings). `.prettierignore` excludes generated and non-Prettier files such as `node_modules/`, `dist/`, `package-lock.json`, and `tsconfig.json`.

### Before committing

```bash
npm run format        # Prettier --write
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run build         # tsc -b  (catches build-only errors)
```

See [BEFORE_COMMIT.md](./BEFORE_COMMIT.md) for the full checklist (git hygiene, commit messages, conventions).

## Folder structure guidelines

The numbered sections below describe the role of each folder in the project, and the golden rules at the end summarize the design.

> Note: these sections are language-agnostic sketches (the examples are CommonJS/JS). The real project is ESM TypeScript under `src/` — see "Project layout" above. Treat them as guidelines, not a literal scaffold.

## 1. `server.js` — Application entry point

Purpose: Initialize and start the application.

Do's

- Load environment variables and application configuration.
- Create the Express app.
- Register global middleware, such as JSON parsing and CORS.
- Mount routes.
- Set up global error-handling middleware.
- Start the server and handle graceful shutdown.

Don'ts

- Don't write business logic here.
- Don't write database queries here.
- Don't implement individual API endpoints here.
- Don't put all your route definitions here.

```
// server.js
const express = require("express");

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## 2. `Routes/` — API endpoint definitions

Purpose: Map HTTP requests to their appropriate controllers.

Do's

- Define URLs and HTTP methods.
- Connect endpoints to controller functions.
- Attach route-specific middleware.
- Apply authentication, authorization, and request validation middleware where appropriate.

Don'ts

- Don't write business logic.
- Don't execute FFmpeg commands.
- Don't query the database directly.
- Don't build large response objects or implement complex error handling.

```
// Routes/video.routes.js
const express = require("express");
const router = express.Router();
const videoController = require("../Controllers/video.controller");

router.post("/compress", videoController.compressVideo);
router.get("/:id", videoController.getVideo);

module.exports = router;
```

Think of routes as a map that directs requests, not as the place where the actual work happens.

## 3. `Controllers/` — HTTP request and response handling

Purpose: Act as the bridge between routes and services.

Do's

- Read request parameters, query strings, body data, and uploaded files.
- Call the appropriate service functions.
- Return HTTP status codes and JSON responses.
- Pass errors to Express error-handling middleware.
- Keep controllers relatively small.

Don'ts

- Don't put complex business rules here.
- Don't execute lengthy FFmpeg operations directly.
- Don't write SQL or Prisma queries directly.
- Don't duplicate logic already implemented in services.
- Don't return HTTP responses from service functions.

```
// Controllers/video.controller.js
const videoService = require("../Services/video.service");

exports.compressVideo = async (req, res, next) => {
  try {
    const result = await videoService.compressVideo(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
```

For a production application, remember that a long-running video compression job may need to return `202 Accepted` with a job ID rather than wait for compression to finish.

## 4. `Services/` — Business logic

Purpose: Implement what your application actually does.

Do's

- Implement business rules and workflows.
- Coordinate database operations, file processing, and storage.
- Call reusable utilities in `Lib/`.
- Validate business requirements, such as supported codecs or maximum video duration.
- Make functions reusable by multiple controllers or background workers.
- Keep processing logic independent of Express where practical.

Don'ts

- Don't use `req` or `res` objects.
- Don't send HTTP responses.
- Don't depend on route URLs.
- Don't duplicate the same business logic across multiple controllers.
- Don't put every unrelated operation into one enormous service file.

```
// Services/video.service.js
const ffmpeg = require("../Lib/ffmpeg");

exports.compressVideo = async (options) => {
  const { inputPath, outputPath, crf = 28, preset = "medium" } = options;

  return ffmpeg.compress({
    inputPath,
    outputPath,
    crf,
    preset,
  });
};
```

The service coordinates the operation; the FFmpeg utility handles the lower-level execution details.

## 5. `Config/` — Application configuration

Purpose: Centralize configuration required by the application.

Do's

- Load environment variables.
- Validate required configuration at startup.
- Configure database connections and external services.
- Define configuration defaults.
- Keep development, testing, and production configuration manageable.

Don'ts

- Don't hardcode passwords, API keys, or database credentials.
- Don't scatter `process.env` references throughout the codebase when centralized configuration would help.
- Don't put business logic here.
- Don't commit `.env` files containing real secrets.
- Don't silently substitute unsafe defaults for required production settings.

```
// Config/env.js
require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
};

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

module.exports = config;
```

For production, validate all required environment variables and use your hosting provider's secret-management system.

## 6. `Lib/` — Reusable technical utilities

Purpose: Hold lower-level helpers and integrations that multiple parts of your application can use.

Do's

- Create reusable wrappers around FFmpeg, filesystem operations, logging, or storage SDKs.
- Keep utility functions focused.
- Handle technical details, such as spawning a process and collecting its exit code.
- Expose clean interfaces so other folders don't need to know implementation details.

Don'ts

- Don't put HTTP controllers here.
- Don't put application-wide business workflows here.
- Don't turn `utils.js` into a dumping ground for unrelated functions.
- Don't hide important failures by swallowing errors.
- Don't let reusable libraries depend unnecessarily on Express.

Example structure:

```
Lib/
├── logger.js
├── file-system.js
└── storage-client.js
```

Example FFmpeg wrapper:

```
// Lib/ffmpeg.js
const { spawn } = require("node:child_process");

exports.run = (args) => {
  return new Promise((resolve, reject) => {
    const process = spawn("ffmpeg", args);

    process.on("error", reject);

    process.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });
};
```

This is a simplified example. A production wrapper should also manage cancellation, process timeouts, logs, progress events, and temporary files.

## 7. `types/` — Shared TypeScript definitions

Purpose: Define the shapes of data used across your application.

This folder is mainly relevant when you're using TypeScript. In a plain JavaScript project, you generally don't need it unless you use JSDoc or other type-definition files.

Do's

- Define reusable interfaces, type aliases, enums, and shared data contracts.
- Give types descriptive names.
- Organize definitions by domain.
- Keep types consistent with your actual application data.

Don'ts

- Don't put executable business logic here.
- Don't use `any` everywhere to avoid defining proper types.
- Don't create duplicate types for the same concept.
- Don't assume a TypeScript type validates incoming runtime data; use a runtime validator when needed.

```
// types/video.ts
export interface CompressionOptions {
  inputPath: string;
  outputPath: string;
  crf: number;
  preset: string;
}

export interface CompressionResult {
  outputPath: string;
  durationSeconds: number;
  outputSizeBytes: number;
}
```

## The golden rules

1. Routes should know where to send a request, not how to execute the business operation.
2. Controllers should know HTTP, not the implementation details of every service.
3. Services should know business logic, not Express request and response objects.
4. Libraries should provide reusable technical functionality, not own the application's entire workflow.
5. Configuration should describe how the application runs, not what the application does.
6. Types should describe data contracts, not perform runtime validation or business operations.

One final point: these are guidelines, not rigid laws. A small helper doesn't need its own file, and a service can legitimately call a database repository. The goal is to keep responsibilities clear without creating unnecessary layers.
