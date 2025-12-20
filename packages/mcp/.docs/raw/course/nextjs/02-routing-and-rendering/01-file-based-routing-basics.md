# File-Based Routing Basics

Next.js uses file-based routing, meaning the file structure in your `app/` directory automatically creates routes. No configuration needed!

**How File-Based Routing Works:**

The folder structure in `app/` directly maps to URL routes:

```
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   └── page.tsx          → /blog
└── contact/
    └── page.tsx          → /contact
```

**Basic Rules:**

1. **`page.tsx` creates a route** - Any file named `page.tsx` (or `page.js`) becomes a route
2. **Folders create URL segments** - Each folder becomes a segment in the URL
3. **Nested folders = nested routes** - Folders inside folders create nested routes

**Examples:**

```
app/page.tsx                    → /
app/about/page.tsx               → /about
app/products/page.tsx            → /products
app/products/laptops/page.tsx   → /products/laptops
app/blog/[slug]/page.tsx         → /blog/:slug (dynamic)
```

**Route Groups (Organization Only):**

You can use parentheses `()` to organize routes without affecting URLs:

```
app/
├── (marketing)/
│   ├── about/page.tsx    → /about
│   └── contact/page.tsx  → /contact
└── (shop)/
    ├── products/page.tsx → /products
    └── cart/page.tsx    → /cart
```

The `(marketing)` and `(shop)` folders don't appear in URLs - they're just for organization!

**Special Routes:**

- `/` - `app/page.tsx`
- `/about` - `app/about/page.tsx`
- `/blog/post-1` - `app/blog/[slug]/page.tsx` (dynamic)
- `/docs/...` - `app/docs/[...slug]/page.tsx` (catch-all)

**Creating Routes:**

1. Create a folder (optional for root)
2. Add `page.tsx` inside
3. Export a default component
4. That's it! The route is created automatically

**Route Matching:**

Next.js matches routes in this order:
1. Static routes (exact match)
2. Dynamic routes (`[param]`)
3. Catch-all routes (`[...slug]`)
4. Optional catch-all (`[[...slug]]`)

**Best Practices:**

- Use lowercase for folder names
- Use kebab-case for multi-word routes: `my-page/` not `myPage/`
- Keep route structure flat when possible
- Use route groups for organization

**Try It:**

Create these routes:
- `/contact` - `app/contact/page.tsx`
- `/services` - `app/services/page.tsx`
- `/portfolio` - `app/portfolio/page.tsx`

Each should have unique content!
