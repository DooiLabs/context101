# Understanding Next.js Directory Structure

Understanding the Next.js directory structure is crucial for building applications effectively.

**App Router Structure (Next.js 13+):**

```
my-nextjs-app/
├── app/                    # App Router directory
│   ├── layout.tsx         # Root layout (required)
│   ├── page.tsx           # Home page (/)
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error UI
│   ├── not-found.tsx      # 404 page
│   ├── globals.css        # Global styles
│   │
│   ├── about/
│   │   └── page.tsx       # /about route
│   │
│   ├── blog/
│   │   ├── page.tsx       # /blog route
│   │   └── [slug]/
│   │       └── page.tsx   # /blog/[slug] dynamic route
│   │
│   └── api/               # API routes
│       └── users/
│           └── route.ts   # /api/users endpoint
│
├── public/                # Static files
│   ├── images/
│   └── favicon.ico
│
├── components/            # Reusable components (optional)
├── lib/                   # Utility functions (optional)
├── types/                 # TypeScript types (optional)
│
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript config
```

**Key Directories:**

1. **`app/`** - App Router directory
   - `page.tsx` - Creates a route
   - `layout.tsx` - Shared layout for routes
   - `loading.tsx` - Loading UI (automatic)
   - `error.tsx` - Error UI (automatic)
   - `not-found.tsx` - 404 page
   - Folders create URL segments

2. **`public/`** - Static files
   - Accessible at `/filename`
   - Images, fonts, icons, etc.
   - Example: `public/logo.png` → `/logo.png`

3. **`components/`** - Reusable components (convention)
   - Not required, but recommended
   - Organize your React components here

4. **`lib/`** - Utility functions (convention)
   - Helper functions, API clients, etc.

**Special Files in `app/`:**

- **`layout.tsx`**: Wraps pages, shared UI
- **`page.tsx`**: Creates a route
- **`loading.tsx`**: Shows while page loads
- **`error.tsx`**: Shows on errors
- **`not-found.tsx`**: 404 page
- **`route.ts`**: API endpoint (not a page)

**File-Based Routing:**

```
app/page.tsx              → /
app/about/page.tsx        → /about
app/blog/page.tsx         → /blog
app/blog/[id]/page.tsx    → /blog/:id (dynamic)
app/shop/[...slug]/page.tsx → /shop/* (catch-all)
```

**Nested Layouts:**

```
app/
├── layout.tsx           # Root layout
├── dashboard/
│   ├── layout.tsx       # Dashboard layout (nested)
│   └── page.tsx         # /dashboard
```

The dashboard layout wraps only dashboard pages and is nested inside the root layout.

**Important Notes:**
- File names are case-sensitive
- `page.tsx` is required for routes
- Folders create URL segments
- Special files have specific purposes

## Why this matters
This step sets the foundation for everything else in a Next.js app. Small decisions here
(structure, types, or component boundaries) affect performance and maintainability later.

## Key ideas
- Prefer server components by default and opt into client only when needed
- Keep the app structure predictable and consistent
- Start with strict TypeScript settings to prevent drift

## Mini task
- Update this project’s file structure to match the recommendation in this step
- Write a short note: “Why this structure helps me later”
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
