update public.scripts set status = 'working', status_note = '' where name = 'Break and Steal an Egg';

insert into public.announcements (title, body, tag, image, created_at, title_en, body_en)
select
  'Break and Steal an Egg Update',
  E'- แก้ระบบบายพาส ใช้ได้แค่ด่าน 1-10 ส่วนด่าน 11 และ 12 จะไม่ใช้ (ถ้าฟาร์มอยู่ด่าน 12 แล้วเปิดโหมดบายพาส สคริปต์จะไปใช้บายพาสที่ด่าน 10 แทน)\n- เพิ่มโหมดวาป (ปิงต้องไม่สูงเกินไป)\n- โหมดล่าสัตว์ 1 ด่าน เลือกได้หลายตัว แต่ต้องเป็นตัวในด่านนั้นเท่านั้น ถ้าเปลี่ยนไปเลือกด่านอื่น ตัวที่เลือกไว้จะรีเซ็ต\n- โหมดผสมสัตว์ ไล่หาสัตว์ตั้งแต่ตัวที่ 1 จนครบ 3 ตัว ใส่เครื่อง และรับไข่ให้เอง\n- แก้บัคในสคริปต์ และดูดเพชรเข้าตัว\n- ร้านค้า: เพิ่มร้านค้าสัตว์ขี่',
  'update',
  'img/egg.webp',
  '2026-11-04 20:30:00+07',
  'Break and Steal an Egg Update',
  E'- Fixed bypass: it now works on stages 1-10 only, not 11 or 12 (if you farm stage 12 with bypass mode on, it uses bypass at stage 10 instead)\n- Added warp mode (needs a low ping)\n- Single-stage hunt mode: pick several animals, but only from that stage. Switching to another stage resets your picks\n- Breeding mode: finds animals from the 1st until it has 3, puts them in the machine and collects the egg for you\n- Script bug fixes, and gems are now pulled to you\n- Shop: added the mount shop'
where not exists (
  select 1 from public.announcements where title = 'Break and Steal an Egg Update' and created_at = '2026-11-04 20:30:00+07'
);
