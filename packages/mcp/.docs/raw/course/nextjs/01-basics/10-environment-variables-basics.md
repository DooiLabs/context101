# Environment Variables Basics

Manage environment variables safely.

Rules:
- Server-only: `process.env.MY_SECRET`
- Client-safe: `NEXT_PUBLIC_*`

Example:

```ts
const apiBase = process.env.NEXT_PUBLIC_API_BASE;
```

Never expose secrets without `NEXT_PUBLIC_`.
