# Middleware and Edge Runtime

Middleware runs before a request is completed. It is useful for auth, redirects, and localization.

Create `middleware.ts` at the project root:

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isLoggedIn = req.cookies.get("session")?.value;
  if (!isLoggedIn && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

Notes:
- Runs on the edge by default
- Keep it fast (no heavy DB calls)
- Use it for routing logic, not full business logic
