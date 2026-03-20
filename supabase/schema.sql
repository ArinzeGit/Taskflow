-- Run this in Supabase SQL Editor.
-- This is a starter schema for boards and tasks.

create extension if not exists "pgcrypto";

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) > 0),
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null check (char_length(title) > 0),
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  assignee_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

alter table public.boards enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "boards_select_own" on public.boards;
create policy "boards_select_own"
on public.boards
for select
using (auth.uid() = owner_id);

drop policy if exists "boards_insert_own" on public.boards;
create policy "boards_insert_own"
on public.boards
for insert
with check (auth.uid() = owner_id);

drop policy if exists "boards_update_own" on public.boards;
create policy "boards_update_own"
on public.boards
for update
using (auth.uid() = owner_id);

drop policy if exists "boards_delete_own" on public.boards;
create policy "boards_delete_own"
on public.boards
for delete
using (auth.uid() = owner_id);

drop policy if exists "tasks_select_by_board_owner" on public.tasks;
create policy "tasks_select_by_board_owner"
on public.tasks
for select
using (
  exists (
    select 1
    from public.boards b
    where b.id = tasks.board_id
      and b.owner_id = auth.uid()
  )
);

drop policy if exists "tasks_insert_by_board_owner" on public.tasks;
create policy "tasks_insert_by_board_owner"
on public.tasks
for insert
with check (
  exists (
    select 1
    from public.boards b
    where b.id = tasks.board_id
      and b.owner_id = auth.uid()
  )
);

drop policy if exists "tasks_update_by_board_owner" on public.tasks;
create policy "tasks_update_by_board_owner"
on public.tasks
for update
using (
  exists (
    select 1
    from public.boards b
    where b.id = tasks.board_id
      and b.owner_id = auth.uid()
  )
);

drop policy if exists "tasks_delete_by_board_owner" on public.tasks;
create policy "tasks_delete_by_board_owner"
on public.tasks
for delete
using (
  exists (
    select 1
    from public.boards b
    where b.id = tasks.board_id
      and b.owner_id = auth.uid()
  )
);
