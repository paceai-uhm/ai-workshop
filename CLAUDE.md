# CLAUDE.md

## Stack
- Next.js (App Router), TypeScript, plain CSS. No UI framework, no CSS
  framework, no component library.
- Supabase for auth and Postgres. Supabase project ref jcfkqthzvsnkggmczgbt.
- Deployed on Vercel, team slug ai-workshop4, from GitHub
  paceai-uhm/ai-workshop, branch main.
- Row Level Security is on for every table holding user data. A user reads
  and writes only their own rows.

## Commands
- npm install
- npm run dev        (local at http://localhost:3000)
- npm run build      (must pass before opening a PR)
- npm run lint
- Deploy: push to main. Vercel builds automatically. Do not deploy by hand.

## Never
- Add a dependency without asking first.
- Edit .env, .env.local, or any environment variable.
- Change auth configuration without saying what is changing and why.
- Create new top-level folders.
- Print a password, API key, service role key, or connection string into
  chat or into a committed file.
- Work on a slice that is not marked ACTIVE in roadmap.md.
- Expand scope past the done-criteria of the ACTIVE slice. If something
  looks necessary and is not in the criteria, say so and stop.

## Conventions
- One slice at a time, one branch per slice, one PR per slice.
- Every PR must build clean with npm run build before it is opened.
- Done is the human check written in roadmap.md, performed on the deployed
  URL, not on localhost.
- Server Components by default. Add "use client" only where interaction
  requires it.
- Supabase keys come from environment variables. Never hardcode a URL or key.
- Database changes go in a migration file in supabase/migrations, never
  typed straight into the dashboard.
- Update project-state.md in the same PR as whatever changed its contents.

## Current focus
See roadmap.md, work only on the slice marked ACTIVE.
