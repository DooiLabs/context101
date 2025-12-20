# What is Next.js?

Next.js is a powerful React framework for building full-stack web applications. It was developed by Vercel and extends React's capabilities with production-ready features.

**Key Features of Next.js:**
- **Server-Side Rendering (SSR)**: Render pages on the server for better SEO and performance
- **Static Site Generation (SSG)**: Pre-render pages at build time
- **Automatic Code Splitting**: Optimize bundle sizes automatically
- **Built-in Routing**: File-system based routing (no configuration needed)
- **API Routes**: Build backend APIs alongside your frontend
- **Image Optimization**: Automatic image optimization with next/image
- **TypeScript Support**: Built-in TypeScript support
- **Fast Refresh**: Instant feedback during development

**Why Use Next.js?**
- Better performance out of the box
- Improved SEO capabilities
- Simplified deployment (especially with Vercel)
- Great developer experience
- Active community and ecosystem

**Next.js vs React:**
- React is a library for building user interfaces
- Next.js is a framework built on top of React that provides additional features like routing, SSR, and API routes
- Next.js handles many concerns that you'd need to configure manually with plain React

**Two Router Systems:**
Next.js supports two routing systems:
1. **Pages Router** (traditional): Uses the `pages/` directory
2. **App Router** (modern, Next.js 13+): Uses the `app/` directory with React Server Components

We'll focus on the modern App Router in this course, but we'll also cover Pages Router concepts where relevant.
