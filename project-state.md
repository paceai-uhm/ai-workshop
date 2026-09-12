# Project state
Last updated: 2026-09-12

## Works
- GitHub repo exists and is public: paceai-uhm/ai-workshop. One commit
  ("Initial commit"), one file (README.md).
- Supabase project exists and is healthy: name "ai-workshop", ref
  jcfkqthzvsnkggmczgbt, region us-west-1, Postgres 17.6, created
  2026-09-08. No tables, no auth users, not used by any code yet.
- The Vercel project ("ai-workshop") is linked to the repo, so a push to
  main triggers a build.
- The Next.js App Router app is scaffolded (minimal placeholder home page)
  and the production deployment builds successfully.

## Broken or flaky
- (none currently known)

## Environment notes
- Stack: Next.js App Router, TypeScript, plain CSS, Supabase, Vercel.
- Vercel team: "AI Workshop" (slug ai-workshop4, hobby plan).
- Candidate production URLs, both currently failing:
  ai-workshop-git-main-ai-workshop4.vercel.app
  ai-workshop-k46f-git-main-ai-workshop4.vercel.app
- Supabase env vars are not set in Vercel yet. They go in Vercel project
  settings and in a local .env.local, never in chat and never in git.
- "Remind" is scoped to on-page Overdue / Due today / Later sections.
  Push notifications are out of scope and sit in the roadmap backlog.

## Next session
1. Start slice 1 (Accounts).
