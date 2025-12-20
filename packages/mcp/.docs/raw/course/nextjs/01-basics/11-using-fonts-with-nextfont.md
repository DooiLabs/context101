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
