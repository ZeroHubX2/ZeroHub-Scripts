update public.scripts
set maps = maps || '[{"name":"Survive the Apocalypse","url":"https://www.roblox.com/games/90148635862803"}]'::jsonb
where name = 'ZeroHub รันได้ทุกแมพ'
  and not maps @> '[{"name":"Survive the Apocalypse"}]'::jsonb;

insert into public.scripts (name, description, image, script, maps, sort_order, check_url)
select
  'Survive the Apocalypse',
  'ESP ออโต้เก็บของ ระบบฐาน',
  'img/sta.webp',
  'loadstring(game:HttpGet("https://zero-hub-api.onrender.com/api/script/ZeroHub"))()',
  '[{"name":"Survive the Apocalypse","url":"https://www.roblox.com/games/90148635862803"}]',
  5,
  'https://raw.githubusercontent.com/ZeroHubX2/Survive-the-Apocalypse-/refs/heads/main/Zero%20Hub'
where not exists (select 1 from public.scripts where name = 'Survive the Apocalypse');

insert into public.announcements (title, body, tag, image, created_at)
select
  'Survive the Apocalypse is now supported!',
  'เพิ่มแมพใหม่ Survive the Apocalypse ใช้โหลดเดอร์ ZeroHub ตัวเดียวได้เลย',
  'new',
  'img/sta.webp',
  '2026-10-28 22:53:00+07'
where not exists (
  select 1 from public.announcements where title = 'Survive the Apocalypse is now supported!'
);
