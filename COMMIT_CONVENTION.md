# Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org) specification. Writing commit messages in this format keeps the history readable, makes reviews easier, and allows changelogs to be generated automatically.

## Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- **type** — one of the types listed below (required).
- **scope** — optional, a lowercase noun describing the affected area, e.g. `events`, `auth`, `api`, `ui`.
- **description** — a short summary of the change.
- **body** — optional; explains **what** changed and **why**, wrapped at 72 characters.
- **footer** — optional; breaking changes and issue references, e.g. `Closes #42`.

## Types

| Type       | Use for                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| `feat`     | A new feature for the user (new page, section, component, endpoint).                                            |
| `fix`      | A bug fix.                                                                                                      |
| `docs`     | Documentation changes only (README, this file, comments in docs).                                               |
| `style`    | Changes that do not affect the meaning of the code (whitespace, Prettier formatting, missing semicolons, etc.). |
| `refactor` | A code change that neither fixes a bug nor adds a feature.                                                      |
| `perf`     | A code change that improves performance.                                                                        |
| `build`    | Changes that affect the build system or external dependencies (npm, Vite, TypeScript config, etc.).             |
| `chore`    | Other changes that don't modify source or test files (e.g. updating `.gitignore`).                              |
| `revert`   | Reverts a previous commit.                                                                                      |

## Examples

```text
feat: add events calendar to the home page
feat(events): add filters for upcoming and past events
fix: resolve navbar overlap on small screens
fix(api): handle missing club ID in members endpoint
docs: document npm scripts in the README
style: apply Prettier formatting to src/
refactor: extract club card into a reusable component
perf: lazy-load event images
test: add unit tests for date helpers
build: bump TypeScript to the latest version
ci: add GitHub Actions workflow to run lint and format checks
chore: update .gitignore
revert: revert "feat: add events calendar"
```

## Breaking changes

Mark breaking changes with a `!` after the type/scope and add a `BREAKING CHANGE:` footer explaining what changed and how to migrate.

```text
feat(api)!: change club response shape

BREAKING CHANGE: the `getClub` endpoint now returns `{ data: club }`
instead of the club object directly. Update all consumers accordingly.
```

## Rules

1. Use the imperative mood in the description: "add", not "added" or "adds".
2. Do not capitalize the description and do not end it with a period.
3. Keep the first line at or under 72 characters.
4. One logical change per commit; do not mix a feature with unrelated formatting.
5. Reference related issues in the footer so GitHub closes them automatically when the commit lands on the default branch:

```text
fix(nav): prevent menu from covering the logo

Closes #34
```

## Quick workflow

```bash
git add <files>
git commit -m "type(scope): description"
```

Run `npm run format`, `npm run lint`, and `npm run typecheck` before committing so the checks stay green.
