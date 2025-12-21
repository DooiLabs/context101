# Deployment to Vercel

Deploying your Next.js app makes it accessible to the world. Vercel makes this process incredibly simple.

**Why Vercel?**

- Created by the Next.js team
- Zero configuration needed
- Automatic optimizations
- Free tier available
- Perfect Next.js integration

**Prerequisites:**

1. **Push code to GitHub** (or GitLab, Bitbucket)
2. **Have a Vercel account** (free signup)

**Deployment Steps:**

**1. Prepare Your Code:**

```bash
# Make sure everything works locally
npm run build
npm start
```

**2. Push to GitHub:**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**3. Deploy on Vercel:**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel auto-detects Next.js
5. Click "Deploy"

**4. Configure Environment Variables:**

In Vercel dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add your variables:
   - `OPENAI_API_KEY=your_key`
   - `DATABASE_URL=your_url`

**Automatic Deployments:**

- Every push to main = production deployment
- Pull requests = preview deployments
- Automatic rollbacks on errors

**Custom Domain:**

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS as instructed
4. SSL certificate is automatic

**Build Settings:**

Usually auto-detected, but you can customize:

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**

Set different values for:
- Production
- Preview
- Development

**Monitoring:**

Vercel provides:
- Analytics
- Performance metrics
- Error tracking
- Function logs

**Best Practices:**

1. **Test locally first** (`npm run build`)
2. **Never commit .env.local**
3. **Set environment variables** in Vercel
4. **Use preview deployments** for testing
5. **Monitor performance** after deployment

**Other Deployment Options:**

- **Netlify** - Similar to Vercel
- **Railway** - Good for full-stack apps
- **Render** - Simple deployment
- **Self-hosted** - More control, more setup

**Troubleshooting:**

- Check build logs in Vercel
- Verify environment variables
- Ensure Node.js version matches
- Check for build errors

**Congratulations!**

Your Next.js app is now live! 🎉

## Why this matters
Styling and deployment choices affect performance, DX, and long-term maintainability.
A stable design system and a reliable deploy pipeline prevent last-minute issues.

## Key ideas
- Keep styles scoped by default
- Optimize assets and images
- Define a deploy checklist and stick to it

## Mini task
- Add a global theme token and use it in a component
- Run a production build and inspect output
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
// Example 1: Minimal pattern for this step
export default function Example() {
  return <div>Replace with a working example</div>;
}
```

```tsx
// Example 2: Variation or extension
export function ExampleVariant() {
  return <section>Replace with a second example</section>;
}
```
