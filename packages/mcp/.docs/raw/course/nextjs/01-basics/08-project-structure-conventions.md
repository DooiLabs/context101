# Project Structure Conventions

Organize by feature to keep the codebase readable.

Suggested layout:
- `app/` routes and UI
- `components/` shared UI
- `lib/` utilities and helpers
- `services/` API clients
- `styles/` global styles

Guidelines:
- Keep route-specific components inside `app/`
- Put reusable UI in `components/`
- Keep server-only helpers under `lib/server`
