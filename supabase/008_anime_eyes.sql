update public.scripts
set maps = maps || '[{"name":"Anime Eyes","url":"https://www.roblox.com/games/97617452700163"}]'::jsonb
where name = 'ZeroHub รันได้ทุกแมพ'
  and not maps @> '[{"name":"Anime Eyes"}]'::jsonb;

insert into public.scripts (name, description, image, script, maps, sort_order, check_url)
select
  'Anime Eyes',
  'ออโต้ฟาร์ม ออโต้เทรน ออโต้รีเบิร์ธ',
  'img/ae.webp',
  'loadstring(game:HttpGet("https://zero-hub-api.onrender.com/api/script/ZeroHub"))()',
  '[{"name":"Anime Eyes","url":"https://www.roblox.com/games/97617452700163"}]',
  6,
  'https://raw.githubusercontent.com/ZeroHubX2/Anime-Eyes/refs/heads/main/Zero%20Hub'
where not exists (select 1 from public.scripts where name = 'Anime Eyes');

insert into public.announcements (title, body, tag, image, created_at)
select
  'Anime Eyes is now supported!',
  'เพิ่มแมพใหม่ Anime Eyes ใช้โหลดเดอร์ ZeroHub ตัวเดียวได้เลย',
  'new',
  'img/ae.webp',
  '2026-10-31 13:59:00+07'
where not exists (
  select 1 from public.announcements where title = 'Anime Eyes is now supported!'
);
