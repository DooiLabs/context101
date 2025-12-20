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
