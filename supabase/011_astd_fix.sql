insert into public.announcements (title, body, tag, image, created_at, title_en, body_en)
select
  'All Star Tower Defense Update',
  E'- แก้บัคเล็กๆ น้อยๆ\nสามารถใช้ได้ตามปกตินะครับ',
  'fix',
  'img/astd.webp',
  '2026-11-01 15:21:00+07',
  'All Star Tower Defense Update',
  E'- Minor bug fixes\nEverything works as usual.'
where not exists (
  select 1 from public.announcements where title = 'All Star Tower Defense Update' and created_at = '2026-11-01 15:21:00+07'
);
