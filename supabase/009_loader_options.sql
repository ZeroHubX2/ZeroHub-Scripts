insert into public.announcements (title, body, tag)
select
  'เพิ่มโหลดเดอร์แบบคอนฟิก AutoRejoin และ AutoLoad',
  E'- AutoRejoin = เซิร์ฟรีหรือเน็ตหลุด สคริปต์จะพากลับเข้าเกมให้อัตโนมัติ\n- AutoLoad = เซิร์ฟรี เน็ตหลุด หรือ AutoRejoin ย้ายเซิร์ฟ สคริปต์จะรันตัวเองใหม่ให้อัตโนมัติ\nกดดูโค้ดสคริปต์ไหนก็ได้ แล้วกด "คัดลอกแบบคอนฟิก" ส่วนแบบธรรมดายังใช้ได้เหมือนเดิม',
  'new'
where not exists (
  select 1 from public.announcements where title = 'เพิ่มโหลดเดอร์แบบคอนฟิก AutoRejoin และ AutoLoad'
);
