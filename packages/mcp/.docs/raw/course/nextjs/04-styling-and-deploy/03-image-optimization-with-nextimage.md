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
