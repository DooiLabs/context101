# Database Access Patterns

Keep DB access server-only.

Example pattern:
- `lib/db.ts` for client
- `lib/server/*.ts` for queries

Never import DB client into client components.
