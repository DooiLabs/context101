# Using Tailwind CSS

Tailwind CSS is a utility-first CSS framework that lets you build modern designs quickly using utility classes.

**What is Tailwind CSS?**

- Utility-first CSS framework
- Write styles directly in your JSX
- No need to write custom CSS
- Highly customizable
- Purges unused styles automatically

**Setup (if not already done):**

If you didn't select Tailwind during `create-next-app`, install it:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configuration:**

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Add to globals.css:**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Basic Usage:**

```typescript
export default function Home() {
  return (
    <div className="p-4 bg-blue-500 text-white rounded-lg">
      <h1 className="text-2xl font-bold">Hello Tailwind</h1>
      <p className="mt-2">This is styled with Tailwind!</p>
    </div>
  );
}
```

**Common Utilities:**

**Spacing:**
- `p-4` - padding
- `m-4` - margin
- `px-4` - horizontal padding
- `py-4` - vertical padding

**Colors:**
- `bg-blue-500` - background color
- `text-white` - text color
- `border-gray-300` - border color

**Typography:**
- `text-xl` - font size
- `font-bold` - font weight
- `text-center` - text alignment

**Layout:**
- `flex` - flexbox
- `grid` - CSS grid
- `hidden` - display none
- `block` - display block

**Responsive Design:**

```typescript
<div className="text-sm md:text-lg lg:text-xl">
  Responsive text
</div>
```

Breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

**Hover and Focus:**

```typescript
<button className="bg-blue-500 hover:bg-blue-600 focus:ring-2">
  Click me
</button>
```

**Dark Mode:**

```typescript
<div className="bg-white dark:bg-gray-800">
  Content
</div>
```

**Best Practices:**

1. **Use utility classes** for most styling
2. **Create components** for repeated patterns
3. **Use responsive prefixes** for mobile-first design
4. **Customize theme** for brand colors
5. **Keep it readable** - don't overuse classes

**Component Patterns:**

```typescript
// Reusable button component
export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      {children}
    </button>
  );
}
```

**Customization:**

Extend Tailwind in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      brand: '#0070f3',
    },
  },
}
```

**Try It:**

Style your pages with Tailwind CSS!
