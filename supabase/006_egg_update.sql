insert into public.announcements (title, body, tag, image, created_at)
select
  'Break and Steal an Egg Update',
  E'- แก้บัคในสคริปต์\n- ESP เพิ่มแบบใหม่แบบข้อความ\n- ตีเร็ว X2\n- แก้ระบบวิ่งแบบบายพาส',
  'update',
  'img/egg.webp',
  '2026-10-29 15:58:00+07'
where not exists (
  select 1 from public.announcements where title = 'Break and Steal an Egg Update' and created_at = '2026-10-29 15:58:00+07'
);
