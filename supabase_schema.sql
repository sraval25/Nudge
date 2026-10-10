-- NUDGE 4.0 cloud backend
-- Run this in Supabase Dashboard → SQL Editor.
-- This intentionally stores the app state in one JSONB document for the prototype.
-- We can normalize individual tables later without changing the UI contract.

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

drop policy if exists "Users can read their own NUDGE state" on public.user_state;
create policy "Users can read their own NUDGE state"
on public.user_state for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own NUDGE state" on public.user_state;
create policy "Users can insert their own NUDGE state"
on public.user_state for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own NUDGE state" on public.user_state;
create policy "Users can update their own NUDGE state"
on public.user_state for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists user_state_updated_at_idx on public.user_state(updated_at);
