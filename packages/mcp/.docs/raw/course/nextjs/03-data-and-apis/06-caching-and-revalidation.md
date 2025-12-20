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
