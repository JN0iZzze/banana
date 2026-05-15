-- Creator MVP: storage policies для бакета creator-assets.
--
-- Контекст: 0002_creator_storage.sql создал публичный бакет, но в нём было
-- неверное допущение, что «запись/удаление через anon роль» работает по
-- умолчанию. На самом деле у storage.objects RLS включён, а политик на
-- INSERT/UPDATE/DELETE нет → загрузка с publishable (anon) ключом падает
-- с 400 «new row violates row-level security policy».
--
-- Здесь даём роли anon (и authenticated на будущее) полный доступ СТРОГО
-- в пределах бакета creator-assets — согласовано с MVP-подходом 0003
-- (работаем без auth). Чтение публичного бакета и так открыто через
-- public endpoint; SELECT-политика добавлена для полноты (storage list).
-- TODO: сузить до auth.uid() после интеграции auth.

-- Бакет создаётся идемпотентно (на случай чистой базы без 0002).
insert into storage.buckets (id, name, public)
values ('creator-assets', 'creator-assets', true)
on conflict (id) do nothing;

-- create policy не поддерживает IF NOT EXISTS — пересоздаём идемпотентно.
drop policy if exists "creator-assets anon select" on storage.objects;
drop policy if exists "creator-assets anon insert" on storage.objects;
drop policy if exists "creator-assets anon update" on storage.objects;
drop policy if exists "creator-assets anon delete" on storage.objects;

create policy "creator-assets anon select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'creator-assets');

create policy "creator-assets anon insert"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'creator-assets');

create policy "creator-assets anon update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'creator-assets')
  with check (bucket_id = 'creator-assets');

create policy "creator-assets anon delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'creator-assets');
