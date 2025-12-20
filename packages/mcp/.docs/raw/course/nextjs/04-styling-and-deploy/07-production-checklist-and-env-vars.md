# Production Checklist and Env Vars

Before deploy, make sure your app is production-ready:

Checklist:
- Environment variables defined (`.env.local` for dev, platform settings for prod)
- `next.config.js` reviewed for images/domains
- API routes and secrets are server-only
- Enable analytics/logging if needed
- Check bundle size and warnings

Example env access:

```ts
const apiKey = process.env.MY_API_KEY; // server-only
```

```tsx
// client: only variables prefixed with NEXT_PUBLIC_*
const baseUrl = process.env.NEXT_PUBLIC_API_BASE;
```

Tip:
- Never expose secrets without NEXT_PUBLIC
- Keep a README section for required env vars

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
