# API Routes - Creating Backend Endpoints

API Routes let you create backend endpoints directly in your Next.js app. No separate server needed!

**Creating API Routes:**

API routes use `route.ts` (or `route.js`) files:

```
app/
└── api/
    └── users/
        └── route.ts    → /api/users
```

**Basic GET Route:**

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ];
  
  return NextResponse.json(users);
}
```

**POST Route:**

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Create user logic here
  const newUser = {
    id: Date.now(),
    ...body,
  };
  
  return NextResponse.json(newUser, { status: 201 });
}
```

**Dynamic Routes:**

```typescript
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const userId = params.id;
  
  // Fetch user logic
  const user = { id: userId, name: 'John' };
  
  return NextResponse.json(user);
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  // Delete user logic
  return NextResponse.json({ deleted: true });
}
```

**HTTP Methods:**

Export functions named after HTTP methods:

- `GET` - Read data
- `POST` - Create data
- `PUT` - Update data (full)
- `PATCH` - Update data (partial)
- `DELETE` - Delete data
- `HEAD` - Get headers only
- `OPTIONS` - CORS preflight

**Request Handling:**

```typescript
export async function POST(request: Request) {
  // Get request body
  const body = await request.json();
  
  // Get query params
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');
  
  // Get headers
  const authHeader = request.headers.get('authorization');
  
  // Process request
  return NextResponse.json({ success: true });
}
```

**Response Helpers:**

```typescript
// JSON response
return NextResponse.json({ data: 'value' });

// With status code
return NextResponse.json({ error: 'Not found' }, { status: 404 });

// Text response
return new Response('Hello', { status: 200 });

// Redirect
return NextResponse.redirect('https://example.com');

// Set headers
return NextResponse.json(data, {
  headers: { 'Cache-Control': 'no-store' },
});
```

**Error Handling:**

```typescript
export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 }
    );
  }
}
```

**Best Practices:**

1. **Keep API routes focused** (one responsibility)
2. **Handle errors** properly
3. **Validate input** data
4. **Use proper status codes**
5. **Secure sensitive endpoints**

**Use Cases:**

- Database operations
- Authentication
- File uploads
- Third-party API proxies
- Webhooks
- Form submissions

## Why this matters
Data is where most apps get complex. Clear server/client boundaries and predictable APIs
reduce bugs and security risks.

## Key ideas
- Validate inputs on the server
- Keep secrets out of client components
- Prefer server actions and route handlers for mutations

## Mini task
- Add a route handler that returns JSON
- Fetch it from a server component and render the result
## Common pitfalls
- Mixing Pages Router patterns with App Router
- Forgetting to encode params in dynamic routes

## Example
```tsx
// app/products/[id]/page.tsx
export default function Page({ params }: { params: { id: string } }) {
  return <h1>Product {params.id}</h1>;
}
```
## Example
```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ ok: true, timestamp: Date.now() });
}
```
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
export async function GET() {
  return Response.json({ ok: true });
}
```

```tsx
// Example 2: Variation or extension
export function ExampleVariant() {
  return <section>Replace with a second example</section>;
}
```
