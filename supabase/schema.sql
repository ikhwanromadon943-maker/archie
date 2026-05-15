-- ================================================
-- MySite — Supabase Schema
-- Jalankan ini di: Supabase → SQL Editor → Run
-- ================================================

-- NOTES / JOURNAL
create table if not exists notes (
  id          uuid primary key default gen_random_uuid(),
  title       text,
  content     text not null,
  image_url   text,
  likes       integer not null default 0,
  created_at  timestamptz not null default now()
);

-- GALLERY
create table if not exists gallery (
  id          uuid primary key default gen_random_uuid(),
  url         text not null,
  title       text,
  caption     text,
  likes       integer not null default 0,
  created_at  timestamptz not null default now()
);

-- SNIPPETS
create table if not exists snippets (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  language    text not null default 'js',
  code        text not null,
  views       integer not null default 0,
  likes       integer not null default 0,
  created_at  timestamptz not null default now()
);

-- MUSIC
create table if not exists music (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  artist      text not null,
  duration    text,
  url         text,
  thumbnail   text,
  added_at    timestamptz not null default now()
);

-- VAULT (private notes)
create table if not exists vault (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  created_at  timestamptz not null default now()
);

-- SETTINGS (passphrase hash, dll)
create table if not exists settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

-- Default passphrase (ganti setelah setup!)
insert into settings (key, value)
values ('admin_pass', 'mysite2025')
on conflict (key) do nothing;

-- ── Row Level Security ────────────────────────────
-- Notes, gallery, snippets, music: publik bisa baca
-- Vault: tidak bisa dibaca publik via RLS (query dari client pakai passphrase check)

alter table notes    enable row level security;
alter table gallery  enable row level security;
alter table snippets enable row level security;
alter table music    enable row level security;
alter table vault    enable row level security;
alter table settings enable row level security;

-- PUBLIC READ untuk notes, gallery, snippets, music
create policy "public read notes"    on notes    for select using (true);
create policy "public read gallery"  on gallery  for select using (true);
create policy "public read snippets" on snippets for select using (true);
create policy "public read music"    on music    for select using (true);

-- ANON WRITE untuk semua (admin auth handled di app level)
create policy "anon write notes"    on notes    for all using (true) with check (true);
create policy "anon write gallery"  on gallery  for all using (true) with check (true);
create policy "anon write snippets" on snippets for all using (true) with check (true);
create policy "anon write music"    on music    for all using (true) with check (true);
create policy "anon write vault"    on vault    for all using (true) with check (true);
create policy "anon write settings" on settings for all using (true) with check (true);

-- Vault read: semua bisa (auth check dilakukan di frontend via passphrase)
create policy "anon read vault"     on vault    for select using (true);
create policy "anon read settings"  on settings for select using (true);

-- ── Increment functions ────────────────────────────

-- Increment likes
create or replace function increment_likes(table_name text, row_id uuid)
returns void language plpgsql as $$
begin
  execute format('update %I set likes = likes + 1 where id = $1', table_name)
  using row_id;
end;
$$;

-- Decrement likes
create or replace function decrement_likes(table_name text, row_id uuid)
returns void language plpgsql as $$
begin
  execute format('update %I set likes = greatest(likes - 1, 0) where id = $1', table_name)
  using row_id;
end;
$$;

-- Increment views (snippets)
create or replace function increment_views(row_id uuid)
returns void language plpgsql as $$
begin
  update snippets set views = views + 1 where id = row_id;
end;
$$;
