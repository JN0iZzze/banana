-- Creator MVP: storage bucket for assets.
-- Public bucket — MVP без auth; ссылки на файлы раздаются всем.
-- После подключения auth заменить на private + signed URLs.
insert into storage.buckets (id, name, public)
values ('creator-assets', 'creator-assets', true)
on conflict (id) do nothing;

-- Storage RLS по умолчанию — чтение из public buckets разрешено всем,
-- запись/удаление — через service/anon роль. Для MVP этого достаточно.
-- TODO: добавить storage policies после auth integration.
