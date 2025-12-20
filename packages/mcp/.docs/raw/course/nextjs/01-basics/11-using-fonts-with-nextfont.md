# Using Fonts with next/font

Next.js can optimize fonts for performance.

Example:

```tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

Benefits:
- Automatic optimization
- No layout shift

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
