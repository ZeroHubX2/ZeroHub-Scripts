create table if not exists public.scripts (
  id          bigint generated always as identity primary key,
  name        text        not null,
  description text        not null default '',
  image       text        not null default '',
  script      text        not null,
  maps        jsonb       not null default '[]'::jsonb,
  sort_order  integer     not null default 0,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint maps_is_array check (jsonb_typeof(maps) = 'array')
);

create or replace function public.scripts_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists scripts_touch_updated_at on public.scripts;
create trigger scripts_touch_updated_at
before update on public.scripts
for each row execute function public.scripts_touch_updated_at();

alter table public.scripts enable row level security;

drop policy if exists "Anyone can read active scripts" on public.scripts;
create policy "Anyone can read active scripts"
on public.scripts
for select
to anon, authenticated
using (is_active);

revoke all on public.scripts from anon, authenticated;
grant select on public.scripts to anon, authenticated;

insert into public.scripts (name, description, image, script, maps, sort_order) values
(
  'ZeroHub รันได้ทุกแมพ',
  'สคริปต์เดียวใช้ได้ทุกแมพ ระบบตรวจแมพที่เล่นอยู่แล้วโหลดสคริปต์ที่ถูกต้องให้อัตโนมัติ',
  'img/zerohub.webp',
  'loadstring(game:HttpGet("https://zero-hub-api.onrender.com/api/script/ZeroHub"))()',
  '[{"name":"Anime Zero","url":"https://www.roblox.com/games/114574503491412"},{"name":"All Star Tower Defense","url":"https://www.roblox.com/games/4996049426"},{"name":"Break and Steal an Egg","url":"https://www.roblox.com/games/114326934417838"}]',
  1
),
(
  'Anime Zero',
  'ออโต้ฟาร์ม ออโต้สกิล ออโต้เควส',
  'img/az.webp',
  'loadstring(game:HttpGet("https://raw.githubusercontent.com/ZeroHubX2/Zero-X/refs/heads/main/Anime%20Zero"))()',
  '[{"name":"Anime Zero","url":"https://www.roblox.com/games/114574503491412"}]',
  2
),
(
  'All Star Tower Defense',
  'ออโต้วางยูนิต ออโต้อัปเกรด ฟาร์มด่าน',
  'img/astd.webp',
  'loadstring(game:HttpGet("https://raw.githubusercontent.com/ZeroHubX2/All-Star-Towerdefense/refs/heads/main/Zero%20Hub"))()',
  '[{"name":"All Star Tower Defense","url":"https://www.roblox.com/games/4996049426"}]',
  3
),
(
  'Break and Steal an Egg',
  'ออโต้ขโมยไข่ ออโต้ขาย',
  'img/egg.webp',
  'loadstring(game:HttpGet("https://raw.githubusercontent.com/ZeroHubX2/Break-and-Steal-an-Egg/refs/heads/main/Zero%20Hub"))()',
  '[{"name":"Break and Steal an Egg","url":"https://www.roblox.com/games/114326934417838"}]',
  4
);
