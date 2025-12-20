# Using the Link Component

The `Link` component is Next.js's way to navigate between pages. It provides client-side navigation (faster, no page reload) and automatic prefetching.

**Why Use Link Instead of <a>?**

Regular `<a>` tags cause a full page reload:
- Slower navigation
- Loses client-side state
- No prefetching
- Worse user experience

Next.js `Link` provides:
- Client-side navigation (instant)
- Preserves React state
- Automatic prefetching
- Better performance

**Basic Usage:**

```typescript
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

**Link Props:**

1. **`href`** (required): The destination route
   ```typescript
   <Link href="/about">About</Link>
   <Link href="/blog/post-1">Post</Link>
   ```

2. **`replace`**: Replace history instead of pushing
   ```typescript
   <Link href="/" replace>Home</Link>
   ```

3. **`prefetch`**: Control prefetching (default: true)
   ```typescript
   <Link href="/about" prefetch={false}>About</Link>
   ```

4. **`scroll`**: Scroll to top on navigation (default: true)
   ```typescript
   <Link href="/about" scroll={false}>About</Link>
   ```

**Styling Links:**

You can style Link like any element:

```typescript
<Link 
  href="/about"
  className="text-blue-500 hover:text-blue-700"
>
  About
</Link>
```

**Link with Dynamic Routes:**

```typescript
<Link href={`/blog/${post.slug}`}>
  {post.title}
</Link>
```

**External Links:**

For external URLs, use regular `<a>` tags:

```typescript
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Site
</a>
```

**Active Link Styling:**

You can detect active routes using `usePathname`:

```typescript
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav>
      <Link 
        href="/"
        className={pathname === '/' ? 'active' : ''}
      >
        Home
      </Link>
      <Link 
        href="/about"
        className={pathname === '/about' ? 'active' : ''}
      >
        About
      </Link>
    </nav>
  );
}
```

**Best Practices:**

1. **Always use Link for internal navigation**
2. **Use <a> for external links**
3. **Add proper styling for better UX**
4. **Consider active state styling**
5. **Use descriptive link text (accessibility)**

**Common Patterns:**

```typescript
// Navigation component
import Link from 'next/link';

export default function Nav() {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];
  
  return (
    <nav>
      {links.map(link => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

**Try It:**

Create a Navigation component and add it to your layout. Style it nicely with hover effects!
