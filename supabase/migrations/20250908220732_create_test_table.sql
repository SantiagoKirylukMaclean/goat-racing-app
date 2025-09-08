-- smoke test migration: creates a minimal table to verify CI -> Supabase -> Vercel

create table if not exists public.test (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(label) between 1 and 120),
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.test is 'Temporary smoke-test table for CI/CD of DB';
comment on column public.test.label is 'Short name for smoke test';

-- RLS intentionally left DISABLED for this throwaway table to avoid client errors during the smoke test.
-- Cleanup (manual): drop table if exists public.test;
