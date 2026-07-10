-- Mirror Supabase auth users into public.users the moment they sign up,
-- regardless of how (Google OAuth, email/password, future providers).
-- Run once against the database: npx prisma db execute --file prisma/sql/mirror-auth-users.sql

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, "avatarUrl", "createdAt", "updatedAt")
  values (
    new.id,
    coalesce(new.email, new.id || '@users.local'),
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    now(),
    now()
  )
  on conflict (id) do update
    set email      = excluded.email,
        name       = coalesce(excluded.name, public.users.name),
        "avatarUrl" = coalesce(excluded."avatarUrl", public.users."avatarUrl"),
        "updatedAt" = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Backfill auth users that signed up before the trigger existed.
insert into public.users (id, email, name, "avatarUrl", "createdAt", "updatedAt")
select
  u.id,
  coalesce(u.email, u.id || '@users.local'),
  coalesce(u.raw_user_meta_data ->> 'name', u.raw_user_meta_data ->> 'full_name'),
  u.raw_user_meta_data ->> 'avatar_url',
  now(),
  now()
from auth.users u
on conflict (id) do nothing;
