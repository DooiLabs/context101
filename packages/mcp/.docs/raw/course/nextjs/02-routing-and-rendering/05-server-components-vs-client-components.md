# Server Components vs Client Components

Understanding Server Components vs Client Components is crucial for building efficient Next.js applications.

**Server Components (Default):**

- Run on the server
- No JavaScript sent to client (smaller bundles)
- Can directly access databases, file systems, APIs
- Better for SEO and initial load performance
- Cannot use React hooks or browser APIs
- Cannot have event handlers

```typescript
// app/page.tsx (Server Component by default)
export default async function Home() {
  // Can fetch data directly
  const data = await fetch('https://api.example.com/data');
  const json = await data.json();
  
  return (
    <div>
      <h1>{json.title}</h1>
      {/* Can't use useState, onClick, etc. */}
    </div>
  );
}
```

**Client Components:**

- Run in the browser
- JavaScript sent to client
- Can use hooks, event handlers, browser APIs
- Required for interactivity
- Use sparingly (only when needed)

```typescript
// app/components/Counter.tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**Using Both Together:**

Server Components can import and render Client Components:

```typescript
// app/page.tsx (Server Component)
import Counter from './components/Counter';

export default function Home() {
  return (
    <div>
      <h1>Server Component</h1>
      <Counter /> {/* Client Component */}
    </div>
  );
}
```

**When to Use What:**

**Use Server Components for:**
- Fetching data
- Accessing backend resources
- Keeping sensitive information on server
- Large dependencies (reduces client bundle)
- Static content

**Use Client Components for:**
- Interactivity (onClick, onChange, etc.)
- Browser APIs (window, localStorage, etc.)
- React hooks (useState, useEffect, etc.)
- Third-party libraries that need client-side
- Real-time updates

**Component Boundary:**

The 'use client' directive creates a boundary. Everything below it (including imports) becomes client-side:

```typescript
'use client'; // Boundary starts here

import { useState } from 'react';
import SomeComponent from './SomeComponent'; // Also client-side

export default function MyComponent() {
  // All client-side code
}
```

**Best Practices:**

1. **Default to Server Components** (better performance)
2. **Use Client Components only when necessary**
3. **Keep Client Components small** (push interactivity to leaf components)
4. **Fetch data in Server Components**, pass to Client Components as props
5. **Create clear boundaries** between server and client code

**Performance Benefits:**

- Server Components: Smaller bundles, faster initial load
- Client Components: Only when interactivity is needed
- Mix both: Optimal performance and user experience
