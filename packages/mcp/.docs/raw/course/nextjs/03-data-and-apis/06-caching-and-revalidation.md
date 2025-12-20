# Caching and Revalidation

Next.js caches server-rendered data by default in many cases. You can control caching per request.

Common tools:
- `fetch(..., { cache: "no-store" })` for always-fresh
- `fetch(..., { next: { revalidate: 60 } })` for ISR-like updates
- `revalidatePath()` to refresh specific routes after a mutation

Examples:

```tsx
// Always fresh
const res = await fetch("https://api.example.com/items", {
  cache: "no-store",
});
```

```tsx
// Revalidate every 60 seconds
const res = await fetch("https://api.example.com/items", {
  next: { revalidate: 60 },
});
```

```tsx
// After a mutation
import { revalidatePath } from "next/cache";

export async function createItem() {
  // ...mutation
  revalidatePath("/items");
}
```

Rule of thumb:
- Use cache for read-heavy pages
- Use no-store for dashboards or user-specific data

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
## Summary
- You know what this concept is and where it fits in App Router
- You can apply the core pattern in a real project
- You can avoid the most common mistakes

## Checklist
- I can explain this concept in one paragraph
- I can implement a minimal example
- I know which file(s) this belongs to
