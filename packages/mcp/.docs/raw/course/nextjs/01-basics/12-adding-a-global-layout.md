# Adding a Global Layout

Use root layout for shared UI.

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <header>Site Header</header>
        {children}
      </body>
    </html>
  );
}
```

Use nested layouts for section-level UI.
