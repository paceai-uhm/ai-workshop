-- Baseline: the `tasks` table as it already exists in the live project.
--
-- Slice 2 created this table by hand in the Supabase SQL Editor, so the repo
-- had no record of it and `supabase_migrations` was empty. This file was
-- reconstructed on 2026-09-13 from the live schema of project
-- jcfkqthzvsnkggmczgbt (columns, the ON DELETE CASCADE foreign key, and the
-- three RLS policies) so that the repo is the source of truth from here on.
--
-- Every statement is idempotent: running this against the live database that
-- already has the table is a no-op, and running it against a fresh database
-- produces the same schema.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

-- A signed-in account may only ever touch rows whose user_id is its own.
-- This is what makes one person's list invisible to another; the UI does not
-- filter by user at all, the database does.

drop policy if exists "Users can view their own tasks" on public.tasks;
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own tasks" on public.tasks;
create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
