# Dark Mode with Tailwind

Enable class-based dark mode.

```js
// tailwind.config.js
module.exports = { darkMode: "class" };
```

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
