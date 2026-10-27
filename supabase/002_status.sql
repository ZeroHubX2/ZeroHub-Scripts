alter table public.scripts
  add column if not exists status            text        not null default 'working',
  add column if not exists status_note       text        not null default '',
  add column if not exists status_updated_at timestamptz not null default now(),
  add column if not exists check_url         text        not null default '';

alter table public.scripts drop constraint if exists scripts_status_valid;
alter table public.scripts
  add constraint scripts_status_valid check (status in ('working', 'updating', 'down'));

create or replace function public.scripts_touch_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status or new.status_note is distinct from old.status_note then
    new.status_updated_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists scripts_touch_status on public.scripts;
create trigger scripts_touch_status
before update on public.scripts
for each row execute function public.scripts_touch_status();

update public.scripts set check_url = 'https://raw.githubusercontent.com/ZeroHubX2/Zero-X/refs/heads/main/Anime%20Zero'
where name = 'Anime Zero';
update public.scripts set check_url = 'https://raw.githubusercontent.com/ZeroHubX2/All-Star-Towerdefense/refs/heads/main/Zero%20Hub'
where name = 'All Star Tower Defense';
update public.scripts set check_url = 'https://raw.githubusercontent.com/ZeroHubX2/Break-and-Steal-an-Egg/refs/heads/main/Zero%20Hub'
where name = 'Break and Steal an Egg';
