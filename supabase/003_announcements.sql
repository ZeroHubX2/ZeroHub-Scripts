create table if not exists public.announcements (
  id         bigint generated always as identity primary key,
  title      text        not null,
  body       text        not null default '',
  tag        text        not null default 'update',
  pinned     boolean     not null default false,
  is_active  boolean     not null default true,
  created_at timestamptz not null default now(),
  constraint announcements_tag_valid check (tag in ('update', 'new', 'fix', 'event'))
);

alter table public.announcements enable row level security;

drop policy if exists "Anyone can read active announcements" on public.announcements;
create policy "Anyone can read active announcements"
on public.announcements
for select
to anon, authenticated
using (is_active);

revoke all on public.announcements from anon, authenticated;
grant select on public.announcements to anon, authenticated;

insert into public.announcements (title, body, tag, pinned, created_at) values
(
  'เปิดเว็บ ZeroHub Scripts แล้ว!',
  'คลังสคริปต์ของ ZeroHub แจกฟรีทุกแมพ กดคัดลอกโหลดเดอร์ตัวเดียวใช้ได้ทุกเกม มีปัญหาแจ้งใน Discord ได้เลย',
  'new',
  true,
  '2026-10-25 21:30:00+07'
),
(
  'อัปเดตหน้าปก Anime Zero และ Break and Steal an Egg',
  'ปรับรูปปกให้ตรงกับหน้าเกมล่าสุดบน Roblox',
  'update',
  false,
  '2026-10-27 19:14:00+07'
),
(
  'เพิ่มระบบ SYSTEM STATUS',
  'เช็กได้แบบเรียลไทม์ว่าโหลดเดอร์และสคริปต์แต่ละแมพพร้อมใช้งานไหม สแกนใหม่อัตโนมัติทุก 1 นาที',
  'new',
  false,
  now()
);
