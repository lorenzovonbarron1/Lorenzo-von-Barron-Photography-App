-- ─────────────────────────────────────────────────────────────
-- LYNK submissions table.
-- Run this once in the Supabase SQL editor (or as a migration),
-- then set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
-- (see .env.example) and rebuild the site.
--
-- Security model: the site is a static export, so inserts come
-- from the browser with the public anon key. RLS below lets anon
-- INSERT only — it can never read, update, or delete records.
-- Review submissions in the Supabase dashboard (or any
-- authenticated/service-role client).
-- ─────────────────────────────────────────────────────────────

create table if not exists public.lynk_submissions (
  id uuid primary key,
  submission_type text not null check (submission_type in ('booking', 'budget_offer')),
  category_slug text not null,
  package_id text not null,
  package_name text not null,
  listed_price text,
  listed_price_value numeric,
  offered_budget numeric,
  requested_discount_amount numeric,
  requested_discount_percent numeric,
  scope_flexibility jsonb not null default '[]'::jsonb,
  flexible_timing text,
  flexible_deliverables text,
  reason text,
  name text not null,
  email text not null,
  phone text,
  instagram text,
  preferred_date date,
  location text,
  project_notes text,
  notes text,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'accepted', 'declined', 'follow_up')),
  created_at timestamptz not null default now()
);

alter table public.lynk_submissions enable row level security;

-- Anonymous visitors may only submit; never read or modify.
create policy "anon can insert enquiries"
  on public.lynk_submissions
  for insert
  to anon
  with check (true);

create index if not exists lynk_submissions_status_idx
  on public.lynk_submissions (status, created_at desc);

-- Optional next step (not required for delivery): notify Lorenzo
-- by email on each insert via a Supabase Database Webhook or an
-- Edge Function triggered on INSERT into this table.
