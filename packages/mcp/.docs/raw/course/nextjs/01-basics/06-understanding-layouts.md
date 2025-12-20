# Understanding Layouts

Layouts are a powerful feature in Next.js that allow you to create shared UI that persists across route changes.

**What is a Layout?**

A layout is a component that wraps pages and provides shared UI. Unlike pages, layouts:
- Persist across route changes
- Don't re-render when navigating
- Can be nested
- Share state between pages

**Root Layout (Required):**

Every Next.js app must have a root layout at `app/layout.tsx`:

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

**Key Requirements:**
- Must have `<html>` and `<body>` tags
- Must accept and render `children`
- Should set `lang` attribute on `<html>`

**Nested Layouts:**

You can create layouts for specific route segments:

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>
        <nav>Dashboard Navigation</nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
```

This layout wraps all routes under `/dashboard/*`.

**Layout Hierarchy:**

```
app/
├── layout.tsx              # Root layout (wraps everything)
│   └── dashboard/
│       ├── layout.tsx      # Dashboard layout (wraps /dashboard/*)
│       │   └── settings/
│       │       └── page.tsx # /dashboard/settings
│       └── page.tsx         # /dashboard
└── page.tsx                 # / (only root layout)
```

**Common Use Cases:**

1. **Shared Navigation:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
```

2. **Providers (Context, etc.):**
```typescript
'use client';

import { ThemeProvider } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

3. **Metadata:**
```typescript
export const metadata = {
  title: 'My App',
  description: 'My awesome Next.js app',
};

export default function RootLayout({ children }) {
  // ...
}
```

**Layout vs Page:**

- **Layout**: Shared UI, persists, wraps pages
- **Page**: Route-specific content, re-renders on navigation

**Important Notes:**
- Layouts must be Server Components (can't use 'use client' on root layout)
- You can have client components inside layouts
- Layouts preserve React state during navigation
- Layouts don't re-render unless their params change
