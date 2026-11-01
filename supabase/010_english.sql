alter table public.scripts add column if not exists description_en text not null default '';
alter table public.announcements add column if not exists title_en text not null default '';
alter table public.announcements add column if not exists body_en text not null default '';

update public.scripts set description_en = 'One script for every map. It detects the game you are playing and loads the right script automatically.' where name = 'ZeroHub รันได้ทุกแมพ';
update public.scripts set description_en = 'Auto farm, auto skills, auto quests' where name = 'Anime Zero';
update public.scripts set description_en = 'Macro system, auto join' where name = 'All Star Tower Defense';
update public.scripts set description_en = 'Auto hit eggs' where name = 'Break and Steal an Egg';
update public.scripts set description_en = 'ESP, auto loot, kill aura' where name = 'Survive the Apocalypse';
update public.scripts set description_en = 'Auto farm, auto train, auto rebirth' where name = 'Anime Eyes';

update public.announcements set title_en = 'ZeroHub Scripts is live!',
  body_en = 'The ZeroHub script library: free for every map. Copy one loader and it works in every game. Report any issues on Discord.'
where title = 'เปิดเว็บ ZeroHub Scripts แล้ว!';

update public.announcements set title_en = 'New covers for Anime Zero and Break and Steal an Egg',
  body_en = 'Updated the covers to match the latest game pages on Roblox.'
where title = 'อัปเดตหน้าปก Anime Zero และ Break and Steal an Egg';

update public.announcements set title_en = 'Anime Zero Update',
  body_en = E'- Story support for HxH Act 4 and West City Act 1-2\n- New summons and new rarities'
where title = 'Anime Zero Update';

update public.announcements set title_en = 'Survive the Apocalypse is now supported!',
  body_en = 'New map: Survive the Apocalypse.'
where title = 'Survive the Apocalypse is now supported!';

update public.announcements set title_en = 'Break and Steal an Egg Update',
  body_en = E'- Script bug fixes\n- New text-style ESP\n- 2x hit speed\n- Fixed bypass movement'
where title = 'Break and Steal an Egg Update' and body like '%ESP%';

update public.announcements set title_en = 'Break and Steal an Egg Update',
  body_en = E'- New specific-animal hunt mode\n- Added hit aura\n- Fixed some script bugs'
where title = 'Break and Steal an Egg Update' and body like '%เพิ่มโหมดหาสัตว์เฉพาะ%';

update public.announcements set title_en = 'Anime Eyes is now supported!',
  body_en = 'New map: Anime Eyes. Works with the same ZeroHub loader.'
where title = 'Anime Eyes is now supported!';

update public.announcements set title_en = 'New config loader: AutoRejoin and AutoLoad',
  body_en = E'- AutoRejoin = if the server restarts or you disconnect, the script rejoins the game for you\n- AutoLoad = after a server restart, a disconnect, or an AutoRejoin server hop, the script runs itself again\nOpen any script''s code and press "Copy config". The standard loader still works as before.'
where title = 'เพิ่มโหลดเดอร์แบบคอนฟิก AutoRejoin และ AutoLoad';
