# Image Optimization with next/image

Next.js provides an optimized Image component that automatically optimizes images for better performance.

**Why Use next/image?**

- **Automatic optimization** - Converts to WebP/AVIF when supported
- **Lazy loading** - Images load as they enter viewport
- **Responsive images** - Serves appropriate sizes
- **Prevents layout shift** - Requires dimensions
- **Better performance** - Smaller file sizes, faster loads

**Basic Usage:**

```typescript
import Image from 'next/image';

export default function Home() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
    />
  );
}
```

**Local Images:**

Place images in the `public/` folder:

```
public/
└── images/
    └── hero.jpg
```

```typescript
<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
/>
```

**Remote Images:**

Configure allowed domains in `next.config.js`:

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
  },
}
```

```typescript
<Image
  src="https://example.com/images/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
/>
```

**Fill Mode (Responsive):**

For images that fill their container:

```typescript
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image
    src="/hero.jpg"
    alt="Hero"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>
```

**Priority Loading:**

For above-the-fold images:

```typescript
<Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={600}
  priority
/>
```

**Image Sizes:**

Specify sizes for responsive images:

```typescript
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Styling:**

```typescript
<Image
  src="/image.jpg"
  alt="Image"
  width={800}
  height={600}
  className="rounded-lg shadow-lg"
  style={{ objectFit: 'cover' }}
/>
```

**Object Fit:**

Control how image fills container:

- `object-contain` - Fit entire image
- `object-cover` - Fill container, may crop
- `object-fill` - Stretch to fill
- `object-none` - Original size
- `object-scale-down` - Like contain or none

**Best Practices:**

1. **Always provide alt text** (accessibility)
2. **Use priority for above-the-fold images**
3. **Configure remotePatterns** for external images
4. **Provide width/height** or use fill
5. **Use appropriate sizes** for responsive images

**Performance Benefits:**

- Smaller file sizes (WebP/AVIF)
- Faster page loads (lazy loading)
- Better Core Web Vitals scores
- Reduced bandwidth usage

## Why this matters
Styling and deployment choices affect performance, DX, and long-term maintainability.
A stable design system and a reliable deploy pipeline prevent last-minute issues.

## Key ideas
- Keep styles scoped by default
- Optimize assets and images
- Define a deploy checklist and stick to it

## Mini task
- Add a global theme token and use it in a component
- Run a production build and inspect output
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
import Image from "next/image";

export default function Page() {
  return <Image src="/hero.png" alt="Hero" width={1200} height={600} />;
}
```

```tsx
// Example 2: Variation or extension
export function ExampleVariant() {
  return <section>Replace with a second example</section>;
}
```
