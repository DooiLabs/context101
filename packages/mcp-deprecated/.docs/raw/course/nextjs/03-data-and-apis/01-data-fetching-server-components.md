# Data Fetching - Server Components

Server Components make data fetching simple and efficient. You can fetch data directly in your components without useEffect or other client-side patterns.

**Basic Data Fetching:**

Server Components can be async functions:

```typescript
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();
  
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**Key Points:**

1. **Component can be async** - No need for useEffect
2. **Fetch runs on server** - Better security and performance
3. **Automatic caching** - Next.js caches fetch requests
4. **No loading states needed** - Data is ready before render

**Fetch Caching:**

Next.js automatically caches fetch requests:

```typescript
// Cached by default (force-cache)
const data = await fetch('https://api.example.com/data');

// Revalidate every 60 seconds
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
});

// Always fetch fresh data (no-cache)
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});
```

**Fetching from Databases:**

You can directly access databases in Server Components:

```typescript
import { sql } from '@vercel/postgres';

export default async function UsersPage() {
  const { rows } = await sql`SELECT * FROM users`;
  
  return (
    <ul>
      {rows.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Error Handling:**

```typescript
export default async function PostsPage() {
  try {
    const posts = await getPosts();
    return <PostsList posts={posts} />;
  } catch (error) {
    return <div>Error loading posts</div>;
  }
}
```

**Loading States:**

Use `loading.tsx` for automatic loading UI:

```typescript
// app/posts/loading.tsx
export default function Loading() {
  return <div>Loading posts...</div>;
}
```

**Best Practices:**

1. **Fetch data in Server Components** (not Client Components)
2. **Use async/await** for cleaner code
3. **Handle errors** appropriately
4. **Use loading.tsx** for loading states
5. **Consider caching strategies** for performance

**Advantages:**

- Simpler code (no useEffect, useState)
- Better performance (runs on server)
- Automatic caching
- Better SEO (data in HTML)
- Secure (API keys stay on server)

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
## Example
```tsx
// app/users/page.tsx
export default async function Page() {
  const res = await fetch("https://example.com/api/users", { cache: "no-store" });
  const users = await res.json();
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
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

## Practice Tasks
1. Create a minimal example related to this step and run it locally.
2. Write a short note explaining why this concept matters in the App Router.

## Code Examples
```tsx
export default async function Page() {
  const res = await fetch("https://example.com", { cache: "no-store" });
  return <pre>{await res.text()}</pre>;
}
```

```tsx
// Example 2: Variation or extension
export function ExampleVariant() {
  return <section>Replace with a second example</section>;
}
```
