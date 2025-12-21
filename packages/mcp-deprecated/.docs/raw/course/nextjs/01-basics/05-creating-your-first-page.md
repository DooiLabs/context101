# Creating Your First Page

Now let's create your first custom page! This is where you'll learn the basics of Next.js pages.

**What is a Page in Next.js?**

A page is a React component that gets rendered for a specific route. In the App Router, any file named `page.tsx` (or `page.js`) creates a route.

**Server Components by Default:**

In Next.js 13+ with App Router, components are **Server Components** by default. This means:
- They run on the server
- Can directly access databases, file systems, etc.
- No JavaScript sent to client (smaller bundles)
- Better SEO and performance

**Creating a Simple Page:**

```typescript
// app/page.tsx
export default function Home() {
  return (
    <main>
      <h1>Welcome to Next.js!</h1>
      <p>This is my first page.</p>
    </main>
  );
}
```

**Key Points:**

1. **Default Export**: Must export a default function
2. **Component Name**: Can be any valid JavaScript name
3. **Return JSX**: Returns JSX (like regular React)
4. **Server Component**: Runs on server by default

**When to Use Client Components:**

Add `'use client'` at the top if you need:
- React hooks (useState, useEffect, etc.)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (window, document, etc.)
- Third-party libraries that require client-side

```typescript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Best Practices:**

1. **Use Server Components by default** (better performance)
2. **Only use 'use client' when necessary**
3. **Keep client components small** (push interactivity to leaf components)
4. **Use semantic HTML** (main, section, article, etc.)

**Page Structure:**

```typescript
// Import statements
import { ... } from '...';

// Metadata (optional, we'll cover this later)
export const metadata = { ... };

// Page component
export default function PageName() {
  // Component logic
  return (
    // JSX
  );
}
```

**Try It:**

1. Open `app/page.tsx`
2. Modify the content
3. Save and see it update automatically (Hot Module Replacement)
4. The page should update in your browser instantly!

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
