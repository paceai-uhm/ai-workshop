# Project state
Last updated: 2026-09-11

## Works
- GitHub repo exists and is public: paceai-uhm/ai-workshop. One commit
  ("Initial commit"), one file (README.md).
- Supabase project exists and is healthy: name "ai-workshop", ref
  jcfkqthzvsnkggmczgbt, region us-west-1, Postgres 17.6, created
  2026-09-08. No tables, no auth users, not used by any code yet.
- Two Vercel projects exist and are linked to the repo, so a push to main
  does trigger a build.

## Broken or flaky
- There is no Next.js app yet. The repo has no package.json and no app/
  directory, so there is nothing to deploy.
- Both Vercel production deployments are in state ERROR. Build log:
  "No Next.js version detected. Make sure your package.json has 'next' in
  either 'dependencies' or 'devDependencies'." This is the expected result
  of an empty repo and should clear once the app is scaffolded.
- Duplicate Vercel projects: "ai-workshop" and "ai-workshop-k46f", both
  pointed at paceai-uhm/ai-workshop, created seconds apart. One must be
  deleted before a demo, or the live URL is ambiguous.

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
1. Delete one of the two Vercel projects and write down which URL is the
   real one.
2. Scaffold the Next.js App Router app and push, so a deployment goes green.
3. Start slice 1 (Accounts). Do not touch tasks, Japanese, or quiz mode.
