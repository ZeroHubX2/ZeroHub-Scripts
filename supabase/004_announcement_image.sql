alter table public.announcements add column if not exists image text;

insert into public.announcements (title, body, tag, image, created_at)
select
  'Anime Zero Update',
  E'- รองรับสตอรี่ให้ด่าน HxH Act4 และด่าน West City Act 1-2\n- การสุ่มตัวใหม่และความหายากใหม่',
  'update',
  'img/az.webp',
  '2026-10-27 19:24:00+07'
where not exists (
  select 1 from public.announcements where title = 'Anime Zero Update' and created_at = '2026-10-27 19:24:00+07'
);
