# Data Fetching with Route Handlers

Use API route handlers for server data.

```ts
// app/api/items/route.ts
export async function GET() {
  return Response.json([{ id: 1 }]);
}
```

Call from server components or client fetch.

## Why this matters
Data is where most apps get complex. Clear server/client boundaries and predictable APIs
reduce bugs and security risks.

## Key ideas
- Validate inputs on the server
- Keep secrets out of client components
- Prefer server actions and route handlers for mutations

## Mini task
- Add a route handler that returns JSON
- Fetch it from a server component and render the result
## Common pitfalls
- Mixing Pages Router patterns with App Router
- Forgetting to encode params in dynamic routes

## Example
```tsx
// app/products/[id]/page.tsx
export default function Page({ params }: { params: { id: string } }) {
  return <h1>Product {params.id}</h1>;
}
```
## Example
```tsx
// app/users/page.tsx
export default async function Page() {
  const res = await fetch("https://example.com/api/users", { cache: "no-store" });
  const users = await res.json();
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```
## Example
```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true, timestamp: Date.now() });
}
```
## Summary
- You know what this concept is and where it fits in App Router
- You can apply the core pattern in a real project
- You can avoid the most common mistakes

## Checklist
- I can explain this concept in one paragraph
- I can implement a minimal example
- I know which file(s) this belongs to
