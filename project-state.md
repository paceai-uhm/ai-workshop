# Project state
Last updated: 2026-09-14

## Works
- GitHub repo exists and is public: paceai-uhm/ai-workshop.
- Supabase project exists and is healthy: name "ai-workshop", ref
  jcfkqthzvsnkggmczgbt, region us-west-1, Postgres 17.6, created
  2026-09-08. It holds one table, `tasks` (id, user_id, title, title_ja,
  due_date, completed, created_at), with RLS enabled and select / insert /
  update policies scoped to `auth.uid() = user_id`.
- The Vercel project ("ai-workshop") is linked to the repo, so a push to
  main triggers a build.
- The Next.js App Router app is scaffolded and the production deployment
  builds successfully.
- Auth: a visitor can sign up at /signup with email and password and is
  taken straight to /tasks (email confirmation is off in Supabase).
  /tasks shows their email and a Log out button; signing out returns them
  to /login; opening /tasks while signed out redirects to /login; a wrong
  password shows red error text; the session survives closing the tab.
- Tasks: /tasks has a form taking an English title, an optional Japanese
  title, and an optional due date. Adding a task inserts it client-side
  with no full page reload and clears the form. Tasks render under
  Overdue / Due today / Later headings in that order, with Completed last;
  an overdue task's date text is red. Checking a task off moves it to
  Completed with its title struck through, and the change is optimistic
  with a rollback if the write fails.
- Quiz mode: a "Quiz me" toggle re-renders each bilingual task's title in
  a randomly chosen language, re-rolling every time it is switched on. A
  "Show answer" control on a quizzed row reveals the other language in
  place, without navigating.
- Migrations now live in the repo under supabase/migrations and the
  Supabase migration history is no longer empty.

## Broken or flaky
- `npm run lint` fails ("Invalid project directory") because Next.js
  16.3.5 removed the `next lint` subcommand and this repo has no ESLint
  config of its own. Pre-existing since slice 1. Fixing it needs a
  dependency decision (an ESLint config/package), so it is still
  untouched. The lint gate in CLAUDE.md is currently a gate that cannot
  run, and therefore cannot fail.
- `next dev` appends a `<!-- BEGIN:nextjs-agent-rules -->` block to
  CLAUDE.md every time it starts, and the block's own text asks the agent
  to commit it. It has been reverted rather than committed. Setting
  `agentRules: false` in next.config.ts would stop it; not done yet
  because it changes instruction-file behaviour and is Timothy's call.

## Not yet verified
- Slice 2 and slice 3 have NOT been checked against their done-criteria on
  the deployed URL by a human. The `tasks` table held zero rows as of
  2026-09-14, so nobody has added a task through the live site yet.
- The add-a-task and check-off round trips were exercised only against
  placeholder Supabase credentials in a local production build, so the
  rendering, grouping, quiz and reveal behaviour is verified but the live
  insert/update path is not.

## Environment notes
- Stack: Next.js App Router, TypeScript, plain CSS, Supabase, Vercel.
- Vercel team: "AI Workshop" (slug ai-workshop4, hobby plan).
- Candidate production URLs, both reported failing as of slice 1:
  ai-workshop-git-main-ai-workshop4.vercel.app
  ai-workshop-k46f-git-main-ai-workshop4.vercel.app
- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are
  set in Vercel already. There is still no local .env.local, so auth only
  works against the deployed URL, not localhost.
- Auth uses @supabase/supabase-js and @supabase/ssr. Browser client in
  lib/supabase/client.ts, server client in lib/supabase/server.ts,
  session refresh and route protection in lib/supabase/middleware.ts,
  wired up from root-level proxy.ts.
- Dates: `due_date` is a Postgres `date`, and "today" is computed on the
  server in `Pacific/Honolulu` (lib/dates.ts, `APP_TIME_ZONE`) and passed
  to the client, so the Overdue / Due today / Later split cannot shift on
  hydration or drift with the hour. All date comparisons are string
  comparisons on "YYYY-MM-DD".
- "Remind" is scoped to on-page Overdue / Due today / Later sections.
  Push notifications are out of scope and sit in the roadmap backlog.

## Next session
1. Verify slice 3's done-criteria on the deployed URL, and slice 2's while
   you are there, then mark slice 3 done in roadmap.md.
2. Decide whether the demo-pages teaching site becomes the project. It is
   not in roadmap.md at all today, so it cannot be worked on under
   CLAUDE.md's "only the ACTIVE slice" rule until the roadmap says so.
