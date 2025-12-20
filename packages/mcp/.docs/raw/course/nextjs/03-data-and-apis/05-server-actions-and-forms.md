# Server Actions and Forms

Server Actions let you run server-side logic directly from forms and components without creating a separate API route.

When to use:
- Simple form submissions
- Mutations that should stay on the server
- Avoiding extra client-side fetch code

Basic pattern (App Router):

```tsx
// app/actions.ts
"use server";

export async function createTodo(formData: FormData) {
  const title = String(formData.get("title") || "");
  if (!title) return;

  // TODO: write to DB
}
```

```tsx
// app/page.tsx
import { createTodo } from "./actions";

export default function Page() {
  return (
    <form action={createTodo}>
      <input name="title" placeholder="Add a todo" />
      <button type="submit">Save</button>
    </form>
  );
}
```

Notes:
- Server Actions run on the server only
- You can add validation and return errors
- Combine with revalidation to refresh data

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
