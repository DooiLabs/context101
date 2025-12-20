# Dynamic Routes - [param]

Dynamic routes allow you to create pages with variable segments in the URL. This is perfect for blog posts, user profiles, product pages, and more.

**Creating Dynamic Routes:**

Use square brackets `[]` in folder names to create dynamic segments:

```
app/
└── posts/
    └── [slug]/
        └── page.tsx    → /posts/:slug
```

**Accessing Parameters:**

In App Router (Next.js 13+), params are accessed asynchronously:

```typescript
// app/posts/[slug]/page.tsx
export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  
  return (
    <div>
      <h1>Post: {params.slug}</h1>
    </div>
  );
}
```

**Important Notes:**
- Params are now **async** in Next.js 16+ (must use `await`)
- The parameter name matches the folder name
- TypeScript types help ensure type safety

**Multiple Dynamic Segments:**

You can have multiple dynamic segments:

```
app/
└── shop/
    └── [category]/
        └── [product]/
            └── page.tsx    → /shop/:category/:product
```

```typescript
export default async function ProductPage(props: {
  params: Promise<{ category: string; product: string }>;
}) {
  const params = await props.params;
  return <div>{params.category} - {params.product}</div>;
}
```

**Common Use Cases:**

1. **Blog Posts:**
   - `/blog/my-first-post`
   - `/blog/nextjs-tutorial`

2. **User Profiles:**
   - `/users/123`
   - `/users/john-doe`

3. **Product Pages:**
   - `/products/laptop-123`
   - `/products/phone-456`

**Linking to Dynamic Routes:**

```typescript
import Link from 'next/link';

<Link href={`/posts/${post.slug}`}>
  {post.title}
</Link>
```

**Try It:**

Create a dynamic route for user profiles and link to different users from your home page!

## Why this matters
Routing in App Router is more than URLs—it defines how layouts, data, and UI streaming behave.
Understanding these primitives lets you build complex flows without custom routing libraries.

## Key ideas
- Layouts persist and can share data
- Suspense boundaries enable streaming UI
- Error and not-found boundaries provide safe fallbacks

## Mini task
- Add a new route segment and a nested layout
- Introduce a `loading.tsx` and confirm it shows during slow data
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
## Summary
- You know what this concept is and where it fits in App Router
- You can apply the core pattern in a real project
- You can avoid the most common mistakes

## Checklist
- I can explain this concept in one paragraph
- I can implement a minimal example
- I know which file(s) this belongs to
