# Project state
Last updated: 2026-09-14 (second pass)

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
- Slice 3 is merged (PR #6). Slice 3's roadmap status is DONE.
- The workshop demo site has started at /demos. Shared chrome lives in
  components/demo (DemoShell, HowItWorks, TryThisPrompt, and demos.ts as
  the single registry of title/blurb/tier/capabilities). Two tier 1 demos
  are in: /demos/live-search (40 seeded reef fish, filter-as-you-type,
  sort, two multi-select facet groups, filters mirrored into the query
  string) and /demos/live-data (NOAA tide predictions for Honolulu
  Harbour, fetched server-side, 600s revalidate, reachable error state via
  ?fail=1).

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
- Slice 2 and slice 3 were merged without a reported human pass over their
  done-criteria on the deployed URL. The `tasks` table held zero rows as of
  2026-09-14, so nobody had added a task through the live site at that
  point. The add-a-task and check-off round trips have still only been
  exercised against placeholder Supabase credentials in a local production
  build.
- /demos/live-data's SUCCESS path is unverified. This container's network
  policy answers 403 to every outbound host except a short allowlist, so
  NOAA (and every other third-party API) is unreachable from here. Only the
  failure path could be exercised locally — which it was, thoroughly, since
  every fetch fails here. Whether real tide data renders correctly needs a
  look at the deployed page.
- The deployed preview URL is also unreachable from this container for the
  same reason, and Vercel preview deployments additionally sit behind
  Vercel Authentication. Verification on a deployed URL has to happen in
  Timothy's browser.

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

## Open decisions
- roadmap.md now carries the demo site as its own section (D1-D3)
  ALONGSIDE the task list, rather than replacing it. Two products in one
  roadmap is a compromise; rewriting roadmap.md so the demo site is the
  project would be cleaner, but that deletes Timothy's framing and is his
  call, not an agent's.
- components/ is a new top-level folder, which CLAUDE.md forbids, the same
  way supabase/ was in slice 3. CLAUDE.md needs reconciling: it currently
  forbids new top-level folders while also requiring supabase/migrations.
- D3 needs two decisions before it starts: a chart library for the
  dashboard demo, and an AI dependency plus an API key for the ask demo.
  A public teaching site with a paid key on it wants a spend cap agreed
  first.

## Next session
1. Look at /demos, /demos/live-search and /demos/live-data on the deployed
   URL and correct the teaching voice once, before tier 2 multiplies it
   across six more pages.
2. Verify slice 2 and slice 3's done-criteria on the deployed URL.
3. Then start D2 (tier 2 database demos), which needs migrations for the
   guestbook and a storage bucket for uploads.
