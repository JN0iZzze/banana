-- Creator MVP: initial schema.
-- Auth is NOT wired in MVP. A fixed dev user id is used by the app:
--   DEV_USER_ID = '00000000-0000-0000-0000-000000000001'
-- Columns created_by/updated_by are plain uuid (no FK to auth.users).
-- RLS is disabled for all tables in MVP; enable after auth integration.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- creator_decks
-- ---------------------------------------------------------------------------
-- TODO: enable RLS after auth integration
create table if not exists public.creator_decks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                   -- глобальная уникальность
  title text not null,
  description text,
  status text not null default 'draft' check (status in ('draft','ready','archived')),
  created_by uuid not null,
  updated_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- creator_slides
-- ---------------------------------------------------------------------------
-- TODO: enable RLS after auth integration
create table if not exists public.creator_slides (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.creator_decks(id) on delete cascade,
  order_index integer not null,
  title text,
  speaker_notes text,
  hidden boolean not null default false,
  document jsonb not null,
  validation_status text not null default 'valid' check (validation_status in ('valid','invalid')),
  validation_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists creator_slides_deck_id_idx on public.creator_slides(deck_id);
-- NOTE: unique (deck_id, order_index) is NOT deferrable. Repository-level
-- reorder must use a two-phase update (e.g. temporary negative indices, then
-- final values) to avoid transient uniqueness violations.
create unique index if not exists creator_slides_deck_order_uidx on public.creator_slides(deck_id, order_index);

-- ---------------------------------------------------------------------------
-- creator_assets
-- ---------------------------------------------------------------------------
-- TODO: enable RLS after auth integration
create table if not exists public.creator_assets (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references public.creator_decks(id) on delete set null,
  kind text not null check (kind in ('image','video','file')),
  storage_path text not null,
  public_url text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  created_by uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists creator_assets_deck_id_idx on public.creator_assets(deck_id);

-- ---------------------------------------------------------------------------
-- creator_deck_versions
-- ---------------------------------------------------------------------------
-- Reserved for future versioning feature; not written by MVP code.
-- TODO: enable RLS after auth integration
create table if not exists public.creator_deck_versions (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.creator_decks(id) on delete cascade,
  version_number integer not null,
  snapshot jsonb not null,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  unique (deck_id, version_number)
);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.creator_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists creator_decks_set_updated_at on public.creator_decks;
create trigger creator_decks_set_updated_at
before update on public.creator_decks
for each row execute function public.creator_set_updated_at();

drop trigger if exists creator_slides_set_updated_at on public.creator_slides;
create trigger creator_slides_set_updated_at
before update on public.creator_slides
for each row execute function public.creator_set_updated_at();
