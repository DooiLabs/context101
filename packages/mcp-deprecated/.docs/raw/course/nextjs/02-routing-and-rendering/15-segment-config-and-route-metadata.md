# Segment Config and Route Metadata

Control caching and runtime per route.

```ts
export const dynamic = "force-dynamic";
export const revalidate = 60;
```

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
## Example
```tsx
// app/page.tsx
export const metadata = { title: "Home" };
```

```tsx
import Image from "next/image";

<Image src="/hero.png" alt="Hero" width={1200} height={600} />
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
export const metadata = { title: "Page Title" };

export default function Page() {
  return <h1>SEO Ready</h1>;
}
```

```tsx
// Example 2: Variation or extension
export function ExampleVariant() {
  return <section>Replace with a second example</section>;
}
```
