grant execute on function public.enroll_in_course(text) to authenticated;

drop policy if exists "users insert their own enrollment" on public.enrollments;
create policy "users insert their own enrollment"
on public.enrollments for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users update their own enrollment" on public.enrollments;
create policy "users update their own enrollment"
on public.enrollments for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
