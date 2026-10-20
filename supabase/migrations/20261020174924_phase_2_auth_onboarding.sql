-- CampusOS: Phase 2 identity and first-semester setup.
-- The auth trigger is the only code path that creates a profile row.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  university text,
  degree text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) <= 120),
  constraint profiles_university_length check (university is null or char_length(university) between 1 and 160),
  constraint profiles_degree_length check (degree is null or char_length(degree) between 1 and 120)
);

create table public.semesters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  semester_number smallint,
  academic_year text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint semesters_id_user_id_key unique (id, user_id),
  constraint semesters_name_length check (char_length(name) between 1 and 80),
  constraint semesters_number_range check (semester_number is null or semester_number between 1 and 16),
  constraint semesters_academic_year_length check (academic_year is null or char_length(academic_year) <= 32),
  constraint semesters_date_order check (start_date is null or end_date is null or end_date > start_date),
  constraint semesters_user_name_key unique (user_id, name)
);

create unique index semesters_one_current_per_user_idx
  on public.semesters (user_id)
  where is_current;
create index semesters_user_id_idx on public.semesters (user_id);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  semester_id uuid not null,
  name text not null,
  code text,
  credits numeric(4, 1),
  instructor text,
  color text not null default '#6B8F82',
  subject_type text not null default 'theory',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subjects_semester_owner_fkey foreign key (semester_id, user_id)
    references public.semesters (id, user_id) on delete cascade,
  constraint subjects_name_length check (char_length(name) between 1 and 120),
  constraint subjects_code_length check (code is null or char_length(code) <= 24),
  constraint subjects_credits_range check (credits is null or credits between 0 and 99.9),
  constraint subjects_instructor_length check (instructor is null or char_length(instructor) <= 120),
  constraint subjects_type_valid check (subject_type in ('theory', 'lab', 'elective')),
  constraint subjects_color_format check (color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint subjects_semester_name_key unique (semester_id, name)
);

create index subjects_user_semester_idx on public.subjects (user_id, semester_id);
create index subjects_semester_owner_idx on public.subjects (semester_id, user_id);

-- Keep all trigger helpers outside exposed schemas. Use an empty search path and
-- qualified relations so an untrusted role cannot shadow dependencies.
create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;
revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();
create trigger semesters_set_updated_at
  before update on public.semesters
  for each row execute function private.set_updated_at();
create trigger subjects_set_updated_at
  before update on public.subjects
  for each row execute function private.set_updated_at();

create function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(
      nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'name'), ''),
      ''
    ),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- One atomic, retry-safe onboarding write. SECURITY INVOKER keeps table RLS and
-- grants in force; the function can only act on auth.uid().
create function public.complete_onboarding(
  p_university text,
  p_degree text,
  p_semester_name text,
  p_semester_number smallint,
  p_subjects text[]
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_semester_id uuid;
  v_university text := pg_catalog.btrim(p_university);
  v_degree text := pg_catalog.btrim(p_degree);
  v_semester_name text := pg_catalog.btrim(p_semester_name);
begin
  if v_user_id is null then
    raise exception using errcode = '42501', message = 'Sign in before completing setup.';
  end if;
  if v_university is null or pg_catalog.char_length(v_university) not between 1 and 160
     or v_degree is null or pg_catalog.char_length(v_degree) not between 1 and 120
     or v_semester_name is null or pg_catalog.char_length(v_semester_name) not between 1 and 80
     or (p_semester_number is not null and p_semester_number not between 1 and 16) then
    raise exception using errcode = '22023', message = 'Please check your university, degree, and semester details.';
  end if;
  if p_subjects is null or pg_catalog.cardinality(p_subjects) < 1 or pg_catalog.cardinality(p_subjects) > 20
     or exists (
       select 1 from pg_catalog.unnest(p_subjects) as supplied(name)
       where pg_catalog.char_length(pg_catalog.btrim(supplied.name)) not between 1 and 120
     ) then
    raise exception using errcode = '22023', message = 'Add between 1 and 20 subject names.';
  end if;

  update public.profiles
    set university = v_university, degree = v_degree
    where id = v_user_id;
  if not found then
    raise exception using errcode = '23503', message = 'Your student profile is not ready yet. Please try again.';
  end if;

  update public.semesters set is_current = false
    where user_id = v_user_id and is_current;
  insert into public.semesters (user_id, name, semester_number, is_current)
    values (v_user_id, v_semester_name, p_semester_number, true)
    on conflict (user_id, name) do update
      set semester_number = excluded.semester_number, is_current = true
    returning id into v_semester_id;

  insert into public.subjects (user_id, semester_id, name)
    select v_user_id, v_semester_id, pg_catalog.btrim(supplied.name)
    from (
      select distinct on (pg_catalog.lower(pg_catalog.btrim(name))) pg_catalog.btrim(name) as name
      from pg_catalog.unnest(p_subjects) as supplied(name)
      order by pg_catalog.lower(pg_catalog.btrim(name))
    ) as supplied
    on conflict (semester_id, name) do nothing;

  return v_semester_id;
end;
$$;
revoke all on function public.complete_onboarding(text, text, text, smallint, text[]) from public, anon;
grant execute on function public.complete_onboarding(text, text, text, smallint, text[]) to authenticated;

alter table public.profiles enable row level security;
alter table public.semesters enable row level security;
alter table public.subjects enable row level security;

revoke all on table public.profiles, public.semesters, public.subjects from anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name, avatar_url, university, degree) on table public.profiles to authenticated;
grant select, insert, update, delete on table public.semesters, public.subjects to authenticated;

create policy profiles_select_own on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy semesters_select_own on public.semesters
  for select to authenticated using ((select auth.uid()) = user_id);
create policy semesters_insert_own on public.semesters
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy semesters_update_own on public.semesters
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy semesters_delete_own on public.semesters
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy subjects_select_own on public.subjects
  for select to authenticated using ((select auth.uid()) = user_id);
create policy subjects_insert_own on public.subjects
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy subjects_update_own on public.subjects
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy subjects_delete_own on public.subjects
  for delete to authenticated using ((select auth.uid()) = user_id);
