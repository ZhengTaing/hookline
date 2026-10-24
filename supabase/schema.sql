-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- One row per user holds all of their progress as JSON.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Row level security: each signed-in user can only see and change their own row.
alter table public.progress enable row level security;

create policy "Read own progress" on public.progress
  for select using (auth.uid() = user_id);

create policy "Insert own progress" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "Update own progress" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
