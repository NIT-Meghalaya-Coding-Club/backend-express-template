import eslint from "@eslint/js";
import { includeIgnoreFile } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { fileURLToPath } from "node:url";

// Reuse .gitignore so ESLint ignores the same files as git
// (node_modules, dist, build, coverage, env files, etc.).
const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default tseslint.config(
  includeIgnoreFile(gitignorePath),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
  },
  // Base recommended rules for JavaScript.
  eslint.configs.recommended,
  // TypeScript-specific recommended rules (type-agnostic).
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.ts", "**/*.mts", "**/*.cts"],
    rules: {
      // Allow intentionally unused arguments/variables/catch bindings prefixed with `_`.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  // Disables rules that conflict with Prettier (must be last).
  prettier,
);
