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
