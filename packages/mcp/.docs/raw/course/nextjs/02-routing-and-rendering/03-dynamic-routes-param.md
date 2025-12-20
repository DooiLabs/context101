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
