# الشيخ عبدالله بن سعد آل غلفيص

Official website for Sheikh Abdullah bin Saad Al-Ghulfayss — an Islamic educational platform with lessons, lectures, series, recitations, and contact pages.

## Run & Operate

- `pnpm --filter @workspace/sheikh-site run dev` — run the frontend (assigned port via PORT env)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, react-router v7, Tajawal font (Arabic)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/sheikh-site/` — main frontend web app (served at `/`)
  - `src/app/App.tsx` — root React component (react-router RouterProvider)
  - `src/app/routes.tsx` — all page routes with basename from BASE_URL
  - `src/app/components/Layout.tsx` — site-wide header + footer + nav
  - `src/app/pages/` — one file per page (Home, Lessons, Lectures, Series, Words, Shorts, Recitations, Schedule, Contact)
  - `src/styles/index.css` — main CSS (Google Fonts, Tailwind v4, Islamic color theme)
- `artifacts/api-server/` — Express backend (served at `/api`)
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — Drizzle ORM schema

## Architecture decisions

- All routing uses react-router v7's `createBrowserRouter` with `basename` set from `import.meta.env.BASE_URL` so it works behind the Replit proxy prefix.
- Tailwind v4 uses `@theme` CSS variables for Islamic color tokens (`--color-islamic-green`, `--color-islamic-gold`, etc.) defined in `src/styles/index.css`.
- The site is RTL (Arabic) — `<html lang="ar" dir="rtl">` is set in `index.html`.
- No backend API is needed for the current site — it's a presentation-first app with static content.

## Product

A multi-page Arabic Islamic educational website for Sheikh Abdullah bin Saad Al-Ghulfayss. Pages include: Home (hero + latest content grid), Lessons, Lectures, Scientific Series, Devotional Words, Miscellaneous (Recitations), Short Clips, Schedule, and Contact.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Do NOT run `pnpm dev` at the workspace root — no dev script exists there. Use `restart_workflow` or `pnpm --filter @workspace/<slug> run dev`.
- `postcss.config.mjs` was removed/skipped — Tailwind v4 uses the `@tailwindcss/vite` plugin, not PostCSS config.
- `src/App.tsx` (scaffold placeholder) is bypassed — `src/main.tsx` imports directly from `./app/App`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
