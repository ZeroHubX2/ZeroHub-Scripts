insert into public.announcements (title, body, tag, image)
select
  'Break and Steal an Egg Update',
  E'- เพิ่มโหมดหาสัตว์เฉพาะ\n- เพิ่มออร่าตี\n- แก้บัคบางจุดในสคริปต์',
  'update',
  'img/egg.webp'
where not exists (
  select 1 from public.announcements where title = 'Break and Steal an Egg Update' and body like '%เพิ่มโหมดหาสัตว์เฉพาะ%'
);
