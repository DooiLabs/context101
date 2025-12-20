# Creating Your First Next.js Project

Let's create your first Next.js project! This is the foundation for everything we'll build.

**Prerequisites:**
- Node.js 18.17 or later installed
- npm, yarn, pnpm, or bun package manager
- A code editor (VS Code recommended)

**Step 1: Create the Project**

Open your terminal and run:

```bash
npx create-next-app@latest my-nextjs-app
```

You'll be asked several questions:
- **TypeScript?** → Yes (recommended)
- **ESLint?** → Yes (recommended)
- **Tailwind CSS?** → Your choice (we'll cover styling later)
- **App Router?** → Yes (we'll use the modern App Router)
- **src/ directory?** → Optional (we'll use it for organization)
- **Import alias (@/*)?** → Yes (recommended)

**Step 2: Navigate to Project**

```bash
cd my-nextjs-app
```

**Step 3: Start Development Server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Next.js welcome page!

**Project Structure (App Router):**

```
my-nextjs-app/
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page (/)
│   └── globals.css     # Global styles
├── public/             # Static files
├── next.config.js      # Next.js configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript config
```

**Key Files:**
- `app/page.tsx`: Your home page (route: `/`)
- `app/layout.tsx`: Root layout wrapper
- `public/`: Static assets (images, etc.)

**Development Commands:**
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

**What Just Happened?**
Next.js created a complete project structure with:
- TypeScript configuration
- ESLint setup
- Development server ready
- Hot module replacement (HMR) enabled

You're now ready to start building!

## Why this matters
This step sets the foundation for everything else in a Next.js app. Small decisions here
(structure, types, or component boundaries) affect performance and maintainability later.

## Key ideas
- Prefer server components by default and opt into client only when needed
- Keep the app structure predictable and consistent
- Start with strict TypeScript settings to prevent drift

## Mini task
- Update this project’s file structure to match the recommendation in this step
- Write a short note: “Why this structure helps me later”
## Summary
- You know what this concept is and where it fits in App Router
- You can apply the core pattern in a real project
- You can avoid the most common mistakes

## Checklist
- I can explain this concept in one paragraph
- I can implement a minimal example
- I know which file(s) this belongs to
