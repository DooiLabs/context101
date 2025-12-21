# Catch-All and Optional Catch-All Routes

Catch-all routes allow you to match multiple URL segments with a single route. This is useful for documentation sites, file systems, or any hierarchical content.

**Catch-All Routes [...slug]:**

Matches one or more segments:

```
app/
└── docs/
    └── [...slug]/
        └── page.tsx    → /docs/* (requires at least one segment)
```

Examples:
- `/docs/getting-started` → `slug = ['getting-started']`
- `/docs/api/authentication` → `slug = ['api', 'authentication']`
- `/docs` → **404** (doesn't match)

```typescript
// app/docs/[...slug]/page.tsx
export default async function DocsPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug; // Array of strings
  
  return (
    <div>
      <h1>Docs: {slug.join('/')}</h1>
    </div>
  );
}
```

**Optional Catch-All Routes [[...slug]]:**

Matches zero or more segments:

```
app/
└── shop/
    └── [[...slug]]/
        └── page.tsx    → /shop/* (can match zero segments)
```

Examples:
- `/shop` → `slug = undefined` or `[]`
- `/shop/electronics` → `slug = ['electronics']`
- `/shop/electronics/laptops` → `slug = ['electronics', 'laptops']`

```typescript
// app/shop/[[...slug]]/page.tsx
export default async function ShopPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug || [];
  
  if (slug.length === 0) {
    return <div>All Products</div>;
  }
  
  return <div>Category: {slug.join('/')}</div>;
}
```

**Key Differences:**

| Type | Syntax | Matches `/docs` | Matches `/docs/a` | Matches `/docs/a/b` |
|------|--------|------------------|-------------------|---------------------|
| Catch-all | `[...slug]` | ❌ 404 | ✅ `['a']` | ✅ `['a', 'b']` |
| Optional catch-all | `[[...slug]]` | ✅ `[]` | ✅ `['a']` | ✅ `['a', 'b']` |

**Common Use Cases:**

1. **Documentation Sites:**
   ```
   /docs/getting-started
   /docs/api/authentication
   /docs/guides/deployment
   ```

2. **File Browsers:**
   ```
   /files/folder1/subfolder
   /files/folder1/subfolder/file.txt
   ```

3. **Category Pages:**
   ```
   /shop (all products)
   /shop/electronics (category)
   /shop/electronics/laptops (subcategory)
   ```

**Accessing Segments:**

```typescript
const params = await props.params;
const segments = params.slug || []; // Always an array

// Get first segment
const first = segments[0];

// Get last segment
const last = segments[segments.length - 1];

// Join all segments
const path = segments.join('/');
```

**Best Practices:**

- Use catch-all for hierarchical content
- Use optional catch-all when parent route should also work
- Always handle empty arrays for optional catch-all
- Consider using `notFound()` for invalid paths

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
