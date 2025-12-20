# Styling with CSS Modules

CSS Modules provide scoped CSS that's automatically scoped to your components, preventing style conflicts.

**What are CSS Modules?**

- CSS files with `.module.css` extension
- Styles are scoped to the component
- Class names are automatically hashed
- No global style pollution

**Creating a CSS Module:**

```css
/* Button.module.css */
.button {
  padding: 0.5rem 1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.button:hover {
  background-color: #0051cc;
}

.primary {
  background-color: #0070f3;
}
```

**Using CSS Modules:**

```typescript
// Button.tsx
import styles from './Button.module.css';

export default function Button() {
  return (
    <button className={styles.button}>
      Click me
    </button>
  );
}
```

**Multiple Classes:**

```typescript
import styles from './Button.module.css';

export default function Button({ variant }: { variant: string }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      Click me
    </button>
  );
}
```

**Benefits:**

- **Scoped styles** - No conflicts between components
- **Type safety** - TypeScript knows your class names
- **Dead code elimination** - Unused styles are removed
- **Easy to use** - Just import and use

**Composition:**

```css
/* Card.module.css */
.card {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}
```

```typescript
import styles from './Card.module.css';

export default function Card() {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Title</h2>
    </div>
  );
}
```

**Global Styles:**

For global styles, use `globals.css`:

```css
/* app/globals.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

**Best Practices:**

1. **Use CSS Modules for component styles**
2. **Use globals.css for reset/base styles**
3. **Keep modules co-located** with components
4. **Use descriptive class names**
5. **Leverage CSS features** (variables, nesting in some setups)

**When to Use:**

- Component-specific styles
- When you want scoped CSS
- To avoid style conflicts
- For better maintainability

## Why this matters
Styling and deployment choices affect performance, DX, and long-term maintainability.
A stable design system and a reliable deploy pipeline prevent last-minute issues.

## Key ideas
- Keep styles scoped by default
- Optimize assets and images
- Define a deploy checklist and stick to it

## Mini task
- Add a global theme token and use it in a component
- Run a production build and inspect output
## Common pitfalls
- Global styles leaking into components
- Overusing utility classes without a design system

## Quick check
- Is the design consistent across pages?
- Are you reusing primitives (buttons, cards)?
## Summary
- You know what this concept is and where it fits in App Router
- You can apply the core pattern in a real project
- You can avoid the most common mistakes

## Checklist
- I can explain this concept in one paragraph
- I can implement a minimal example
- I know which file(s) this belongs to
