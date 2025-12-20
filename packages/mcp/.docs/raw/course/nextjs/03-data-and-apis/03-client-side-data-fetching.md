# Client-Side Data Fetching

Sometimes you need to fetch data on the client side - for user interactions, real-time updates, or user-specific content.

**When to Use Client-Side Fetching:**

- User-specific data (dashboard, profile)
- Real-time updates (chat, notifications)
- Data that changes based on user interaction (search, filters)
- After user actions (form submissions, clicks)

**Basic Pattern:**

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

**Using SWR (Recommended):**

SWR provides caching, revalidation, and better DX:

```typescript
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function UserProfile({ userId }: { userId: string }) {
  const { data, error, isLoading } = useSWR(`/api/users/${userId}`, fetcher);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  );
}
```

**Using React Query:**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export default function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(r => r.json()),
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return <div>{data.name}</div>;
}
```

**Best Practices:**

1. **Use Server Components when possible** (better performance)
2. **Use SWR or React Query** for better caching and DX
3. **Handle loading and error states**
4. **Debounce search inputs** to avoid too many requests
5. **Cache responses** when appropriate

**Server vs Client Fetching:**

| Aspect | Server Components | Client Components |
|--------|------------------|-------------------|
| When | Initial page load | After user interaction |
| Performance | Faster (pre-rendered) | Slower (needs JS) |
| SEO | Better (content in HTML) | Worse (needs JS) |
| Use Case | Static/dynamic content | User-specific, real-time |

**Try It:**

Create a search component that fetches results as the user types!
