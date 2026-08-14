-- ================================================
-- Migration: Guestbook security hardening
-- Jalankan ini kalau guestbook table sudah ada dari setup sebelumnya
-- (lewati kalau baru pertama kali run schema.sql yang terbaru)
-- ================================================

-- 1) Tambah kolom owner_token kalau belum ada
alter table guestbook add column if not exists owner_token uuid not null default gen_random_uuid();

-- 2) Hapus policy lama yang terlalu longgar (anon bisa update/delete apa saja)
drop policy if exists "public read guestbook" on guestbook;
drop policy if exists "anon write guestbook" on guestbook;

-- 3) Policy baru: insert bebas, TIDAK ADA select/update/delete langsung untuk anon
create policy "anon insert guestbook" on guestbook for insert with check (true);

-- 4) View publik yang tidak menampilkan owner_token
create or replace view guestbook_public as
  select id, name, message, parent_id, is_admin, likes, created_at
  from guestbook;

grant select on guestbook_public to anon, authenticated;

-- 5) RPC untuk post & delete (lihat schema.sql untuk komentar lengkap)
create or replace function post_guestbook_entry(
  p_name text, p_message text, p_parent_id uuid default null, p_is_admin boolean default false
)
returns table(id uuid, owner_token uuid)
language plpgsql security definer as $$
declare
  new_id uuid;
  new_token uuid := gen_random_uuid();
begin
  insert into guestbook (name, message, parent_id, is_admin, owner_token)
  values (p_name, p_message, p_parent_id, p_is_admin, new_token)
  returning guestbook.id into new_id;

  return query select new_id, new_token;
end;
$$;

create or replace function delete_guestbook_entry(
  p_id uuid, p_owner_token uuid default null, p_admin_pass text default null
)
returns boolean
language plpgsql security definer as $$
declare
  real_token uuid;
  real_pass  text;
begin
  select owner_token into real_token from guestbook where id = p_id;
  if real_token is null then
    return false;
  end if;

  if p_admin_pass is not null and length(trim(p_admin_pass)) > 0 then
    select value into real_pass from settings where key = 'admin_pass';
    if real_pass is not null and real_pass = p_admin_pass then
      delete from guestbook where id = p_id;
      return true;
    end if;
    return false;
  end if;

  if p_owner_token is not null and p_owner_token = real_token then
    delete from guestbook where id = p_id;
    return true;
  end if;

  return false;
end;
$$;
