# Project state
Last updated: 2026-09-12

## Works
- GitHub repo exists and is public: paceai-uhm/ai-workshop. One commit
  ("Initial commit"), one file (README.md).
- Supabase project exists and is healthy: name "ai-workshop", ref
  jcfkqthzvsnkggmczgbt, region us-west-1, Postgres 17.6, created
  2026-09-08. A `tasks` table was added by hand in the SQL Editor for
  slice 2 (id, user_id, title, completed, created_at), with RLS enabled
  and select/insert/update policies scoped to auth.uid() = user_id. Auth
  users will exist once people sign up through the app.
- The Vercel project ("ai-workshop") is linked to the repo, so a push to
  main triggers a build.
- The Next.js App Router app is scaffolded and the production deployment
  builds successfully.
- On the live site, a visitor can go to /signup, enter an email and
  password, and is immediately signed in and taken to /tasks (email
  confirmation is off in Supabase). /tasks shows that person's email in
  the header and a Log out button; clicking it signs them out and sends
  them to /login. Trying to open /tasks while signed out sends them to
  /login instead. Entering the right email with the wrong password on
  /login keeps them on that page and shows a red error message. After
  logging in, closing the tab and reopening the site returns them
  straight to /tasks without asking for the password again. On /tasks, a
  form adds a task by title (client-side insert via Supabase, no full
  page reload, input clears on success); tasks render in a "Tasks"
  section, and checking a task's box moves it to a "Completed" section
  with its title struck through. Both the initial list and every toggle
  are persisted in the `tasks` table, so a reload keeps state, and RLS
  means each account only ever sees its own rows. Due dates, Japanese
  titles, and the Overdue/Due today/Later sort are slice 3.

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
1. Run the slice 2 SQL (see the "Slice 2" PR description) in the Supabase
   SQL Editor before the deployed preview will work, then verify slice
   2's done-criteria on the preview URL and mark it done in roadmap.md.
2. Start slice 3 (Japanese and quiz mode).
