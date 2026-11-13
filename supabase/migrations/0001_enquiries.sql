-- ISOFORM website: contact enquiries, admin access, shared spam limit, and the
-- 12-month clean-up. Run once in the Supabase dashboard (SQL Editor), or with
-- `supabase db push` if the project is linked to the Supabase CLI.
--
-- Who can do what:
-- - The website's server function uses the SECRET key (service_role), which
--   bypasses row-level security: it inserts enquiries and checks the spam limit.
-- - Admins (users listed in public.admins) can read, update and delete
--   enquiries from /admin, signed in with the PUBLISHABLE key.
-- - Everyone else (anon, other signed-in users) can do nothing.

-- ---------------------------------------------------------------------------
-- Enquiries
-- ---------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  contact text not null check (char_length(contact) between 5 and 120),
  business text not null default '' check (char_length(business) <= 120),
  services text[] not null default '{}',
  message text not null check (char_length(message) between 10 and 4000),
  -- new: not answered yet · replied: we answered · client: became a project
  -- (kept beyond 12 months) · closed: finished, deleted after 12 months
  status text not null default 'new' check (status in ('new', 'replied', 'client', 'closed'))
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists enquiries_touch_updated_at on public.enquiries;
create trigger enquiries_touch_updated_at
  before update on public.enquiries
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Admins: the only signed-in users allowed into /admin
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);

-- true when the signed-in user is an admin (security definer, so policies can
-- call it without needing read access to the admins table themselves)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.enquiries enable row level security;
alter table public.admins enable row level security;

drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries" on public.enquiries
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "admins update enquiries" on public.enquiries;
create policy "admins update enquiries" on public.enquiries
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "admins delete enquiries" on public.enquiries;
create policy "admins delete enquiries" on public.enquiries
  for delete to authenticated using ((select public.is_admin()));

-- an admin can see their own admin row (used to confirm access after sign-in)
drop policy if exists "admins see themselves" on public.admins;
create policy "admins see themselves" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

-- No insert policy on enquiries: only the website's server (secret key) adds them.
revoke all on public.enquiries from anon;
revoke all on public.admins from anon;

-- ---------------------------------------------------------------------------
-- Shared spam limit (works across all of Vercel's servers)
-- Keys are salted hashes of the visitor's IP address, never the address itself,
-- and every row is deleted after the window (10 minutes).
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limits (
  key text not null,
  hit_at timestamptz not null default now()
);

create index if not exists rate_limits_key_hit_at_idx on public.rate_limits (key, hit_at);
alter table public.rate_limits enable row level security; -- no policies: server only
revoke all on public.rate_limits from anon, authenticated;

-- Records one enquiry attempt. Returns 0 when allowed, or the number of seconds
-- to wait when the limit is reached.
create or replace function public.hit_rate_limit(p_key text, p_window_seconds int, p_max int)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  window_start timestamptz := now() - make_interval(secs => p_window_seconds);
  recent int;
  oldest timestamptz;
begin
  delete from public.rate_limits where hit_at < window_start;
  select count(*), min(hit_at) into recent, oldest from public.rate_limits where key = p_key;
  if recent >= p_max then
    return greatest(1, ceil(extract(epoch from (oldest + make_interval(secs => p_window_seconds) - now())))::int);
  end if;
  insert into public.rate_limits (key) values (p_key);
  return 0;
end;
$$;

revoke all on function public.hit_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, int, int) to service_role;

-- ---------------------------------------------------------------------------
-- 12-month clean-up (privacy policy: enquiries that don't become projects are
-- deleted within 12 months). Runs every night at 03:00 UTC.
-- ---------------------------------------------------------------------------
-- If this line fails, turn on "pg_cron" in the dashboard (Database, Extensions)
-- and run the whole file again: every step is safe to re-run.
create extension if not exists pg_cron;

select cron.unschedule(jobid) from cron.job where jobname = 'isoform-delete-old-enquiries';
select cron.schedule(
  'isoform-delete-old-enquiries',
  '0 3 * * *',
  $$ delete from public.enquiries where status <> 'client' and created_at < now() - interval '12 months' $$
);
