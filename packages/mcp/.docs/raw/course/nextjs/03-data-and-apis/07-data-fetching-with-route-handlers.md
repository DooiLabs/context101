# Data Fetching with Route Handlers

Use API route handlers for server data.

```ts
// app/api/items/route.ts
export async function GET() {
  return Response.json([{ id: 1 }]);
}
```

Call from server components or client fetch.
