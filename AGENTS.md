# Project Rules

- Always update unit tests when changing code. All tests must pass before committing.
- Keep code simple and readable. Prefer clarity over cleverness.

# Tooling

- Use `bun <file>` to run scripts
- Use `bun test` to run tests (import from `bun:test`)
- Use `bun install` to add dependencies
- Use `bunx <package>` to run packages

# TypeScript Conventions

- Use `interface` over `type` for object shapes; use `type` for unions, intersections, and aliases
- Use `import type` for type-only imports
- Mark classes and methods as `readonly` where applicable
- Prefer `const` assertions (`as const`) over enums for simple constant sets
- Use `private readonly` for constructor-injected dependencies
- Use `export` at the definition site, never at the bottom of the file
- Avoid `any` — use `unknown` and narrow with type guards
- Leverage `strict` mode — make use of `noUncheckedIndexedAccess` with proper narrowing
