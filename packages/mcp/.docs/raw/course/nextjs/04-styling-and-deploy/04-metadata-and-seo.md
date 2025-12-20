# Metadata and SEO

Metadata helps search engines understand your pages and improves how they appear in search results and social media.

**What is Metadata?**

- Information about your page (title, description, etc.)
- Used by search engines (SEO)
- Used by social media (Open Graph)
- Controls how your page appears in search results

**Static Metadata:**

```typescript
// app/layout.tsx or app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page Title',
  description: 'Page description for SEO',
};
```

**Dynamic Metadata:**

For dynamic routes, use `generateMetadata`:

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

**Common Metadata Fields:**

```typescript
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description',
  keywords: ['nextjs', 'react', 'tutorial'],
  authors: [{ name: 'John Doe' }],
  openGraph: {
    title: 'Page Title',
    description: 'Page description',
    url: 'https://example.com',
    siteName: 'My Site',
    images: [{ url: '/og-image.jpg' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Page Title',
    description: 'Page description',
    images: ['/twitter-image.jpg'],
  },
};
```

**Open Graph (Social Media):**

```typescript
openGraph: {
  title: 'My Page',
  description: 'Page description',
  url: 'https://example.com/page',
  siteName: 'My Site',
  images: [
    {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Page image',
    },
  ],
  locale: 'en_US',
  type: 'website',
}
```

**Twitter Cards:**

```typescript
twitter: {
  card: 'summary_large_image',
  title: 'My Page',
  description: 'Page description',
  images: ['/twitter-image.jpg'],
}
```

**Metadata in Layouts:**

Layouts can define default metadata:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'My App',
    template: '%s | My App',
  },
  description: 'Default description',
};
```

Pages can override:

```typescript
// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About', // Becomes "About | My App"
  description: 'About page description',
};
```

**Best Practices:**

1. **Unique titles** for each page
2. **Descriptive descriptions** (150-160 characters)
3. **Open Graph images** (1200x630px recommended)
4. **Use generateMetadata** for dynamic content
5. **Test with tools** (Google Search Console, social preview tools)

**SEO Benefits:**

- Better search rankings
- Improved click-through rates
- Rich snippets in search results
- Better social media sharing

**Testing:**

- Use browser dev tools to inspect `<head>`
- Test with social media preview tools
- Use Google Search Console
- Validate with SEO tools
