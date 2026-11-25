alter table public.courses
    add column if not exists category text not null default 'Popular';
