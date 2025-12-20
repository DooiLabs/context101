# TypeScript Setup and Strictness

Set up TypeScript early and keep it strict to catch errors.

Key files:
- `tsconfig.json`
- `next-env.d.ts`

Common settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

Tips:
- Use path aliases to avoid long relative imports
- Prefer `unknown` over `any`
- Keep `strict` on from day one
