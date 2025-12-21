# Static Site Generation (SSG) with generateStaticParams

Static Site Generation (SSG) pre-renders pages at build time, creating static HTML files. This is perfect for content that doesn't change frequently.

**What is SSG?**

- Pages are generated at **build time** (not on each request)
- Static HTML files are created
- Extremely fast (served from CDN)
- Great for blogs, documentation, marketing sites

**Using generateStaticParams:**

For dynamic routes, use `generateStaticParams` to specify which pages to generate:

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  // Fetch all blog post slugs
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await fetch(`https://api.example.com/posts/${params.slug}`).then(r => r.json());
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

**How It Works:**

1. **Build time**: `generateStaticParams` runs and returns all slugs
2. **For each slug**: Next.js generates a static HTML page
3. **Runtime**: Pages are served as static files (super fast!)

**Example with Local Data:**

```typescript
// lib/posts.ts
export const posts = [
  { slug: 'post-1', title: 'First Post', content: '...' },
  { slug: 'post-2', title: 'Second Post', content: '...' },
];

// app/blog/[slug]/page.tsx
import { posts } from '@/lib/posts';

export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = posts.find((p) => p.slug === params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

**Benefits:**

- **Fast**: Pre-rendered HTML served instantly
- **SEO**: Content in HTML (search engines love it)
- **Scalable**: Can handle millions of requests
- **Cost-effective**: No server needed for static pages

**When to Use SSG:**

- Blog posts
- Documentation
- Marketing pages
- Product catalogs (if data doesn't change often)
- Any content that's known at build time

**Limitations:**

- Data must be available at build time
- Rebuilding required for new content
- Not suitable for user-specific or real-time data

**Combining with ISR:**

You can combine SSG with Incremental Static Regeneration (ISR) to update pages periodically without rebuilding the entire site.

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

## Practice Tasks
1. Create a minimal example related to this step and run it locally.
2. Write a short note explaining why this concept matters in the App Router.

## Code Examples
```tsx
// Example 1: Minimal pattern for this step
export default function Example() {
  return <div>Replace with a working example</div>;
}
```

```tsx
// Example 2: Variation or extension
export function ExampleVariant() {
  return <section>Replace with a second example</section>;
}
```
