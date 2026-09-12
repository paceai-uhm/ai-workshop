# Project state
Last updated: 2026-09-12

## Works
- GitHub repo exists and is public: paceai-uhm/ai-workshop. One commit
  ("Initial commit"), one file (README.md).
- Supabase project exists and is healthy: name "ai-workshop", ref
  jcfkqthzvsnkggmczgbt, region us-west-1, Postgres 17.6, created
  2026-09-08. No tables yet; auth users will exist once people sign up
  through the app.
- The Vercel project ("ai-workshop") is linked to the repo, so a push to
  main triggers a build.
- The Next.js App Router app is scaffolded and the production deployment
  builds successfully.
- Slice 1 (Accounts) is built, on branch claude/great-feynman-r73hbs, PR
  open: sign up at /signup, log in at /login with a red-text error on
  failure, log out from /tasks, and the session persists in cookies
  across closing the tab. A proxy (Next's middleware convention, renamed
  per Next 16) redirects signed-out visitors away from /tasks to /login;
  / redirects to /tasks or /login depending on session state. /tasks
  itself is still a placeholder header (email + Log out); the task list
  is slice 2.

## Broken or flaky
- `npm run lint` fails ("Invalid project directory") because Next.js
  16.3.5 removed the `next lint` subcommand and this repo has no ESLint
  config of its own. Pre-existing, not caused by slice 1. Needs a
  dependency decision (an ESLint config/package) before it can be fixed,
  so left alone for now.

## Environment notes
- Stack: Next.js App Router, TypeScript, plain CSS, Supabase, Vercel.
- Vercel team: "AI Workshop" (slug ai-workshop4, hobby plan).
- Candidate production URLs, both currently failing:
  ai-workshop-git-main-ai-workshop4.vercel.app
  ai-workshop-k46f-git-main-ai-workshop4.vercel.app
- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are
  set in Vercel already. No local .env.local exists in this session, so
  auth only works against the deployed preview/production URL, not
  localhost, until a local .env.local is added by hand.
- Auth uses @supabase/supabase-js and @supabase/ssr (added this slice,
  approved before installing per CLAUDE.md's dependency rule). Browser
  client in lib/supabase/client.ts, server client in
  lib/supabase/server.ts, session-refresh/route-protection logic in
  lib/supabase/middleware.ts, wired up from root-level proxy.ts.
- Email confirmation is off in Supabase, so signup logs a user in
  immediately.
- "Remind" is scoped to on-page Overdue / Due today / Later sections.
  Push notifications are out of scope and sit in the roadmap backlog.

## Next session
1. Get slice 1's PR merged, mark it done in roadmap.md.
2. Start slice 2 (Tasks that persist).
