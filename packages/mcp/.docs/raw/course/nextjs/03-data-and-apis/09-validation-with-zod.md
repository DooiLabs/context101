# Validation with Zod

Validate inputs on server.

```ts
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1)
});
```
