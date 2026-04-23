-- Creator MVP: explicitly disable RLS on creator_* tables.
-- MVP работает без auth; dev-user — фиксированный UUID из кода.
-- TODO: вернуть RLS + политики по auth.uid() после интеграции auth.

alter table public.creator_decks         disable row level security;
alter table public.creator_slides        disable row level security;
alter table public.creator_assets        disable row level security;
alter table public.creator_deck_versions disable row level security;
