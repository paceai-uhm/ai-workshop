-- Slice 3: Japanese titles and due dates.
--
-- Both columns are nullable and carry no default, because the roadmap says a
-- task has an English title plus an OPTIONAL Japanese title and an OPTIONAL
-- due date. Existing rows stay valid without a backfill.
--
-- due_date is `date`, not `timestamptz`. A due date is a calendar day, not an
-- instant: "due today" has to mean the same thing regardless of what hour the
-- page is loaded. Storing an instant would make the Overdue / Due today /
-- Later split depend on the time of day, which is the bug this avoids.

alter table public.tasks
  add column if not exists title_ja text,
  add column if not exists due_date date;

-- The list is read as "my tasks, grouped by due date". This index matches that
-- access path so the grouping stays cheap as a list grows.
create index if not exists tasks_user_id_due_date_idx
  on public.tasks (user_id, due_date);
