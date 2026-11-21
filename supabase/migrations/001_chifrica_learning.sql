create type public.enrollment_status as enum ('enrolled', 'in_progress', 'completed');
create type public.lesson_status as enum ('in_progress', 'completed');
create type public.exam_kind as enum ('checkpoint', 'final');
create type public.exam_attempt_status as enum ('passed', 'failed');

create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null default '',
    phone text,
    avatar_url text,
    role text not null default 'student',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.courses (
    id text primary key,
    title text not null,
    description text not null,
    instructor_name text not null,
    duration text not null,
    difficulty text not null,
    thumbnail_url text,
    published boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.course_overviews (
    course_id text primary key references public.courses(id) on delete cascade,
    summary text not null,
    outcomes jsonb not null default '[]'::jsonb,
    syllabus jsonb not null default '[]'::jsonb
);

create table public.course_modules (
    course_id text not null references public.courses(id) on delete cascade,
    position integer not null check (position > 0),
    title text not null,
    content text,
    image_url text,
    primary key (course_id, position)
);

create table public.enrollments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    course_id text not null references public.courses(id) on delete cascade,
    status public.enrollment_status not null default 'enrolled',
    enrolled_at timestamptz not null default now(),
    completed_at timestamptz,
    unique (user_id, course_id)
);

create table public.lesson_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    course_id text not null references public.courses(id) on delete cascade,
    module_position integer not null,
    status public.lesson_status not null default 'in_progress',
    completed_at timestamptz,
    updated_at timestamptz not null default now(),
    unique (user_id, course_id, module_position),
    foreign key (course_id, module_position)
        references public.course_modules(course_id, position) on delete cascade
);

create table public.exams (
    id uuid primary key default gen_random_uuid(),
    course_id text not null references public.courses(id) on delete cascade,
    kind public.exam_kind not null,
    topic_end integer,
    title text not null,
    passing_score integer not null default 70 check (passing_score between 1 and 100),
    created_at timestamptz not null default now(),
    unique (course_id, kind, topic_end),
    check (
        (kind = 'checkpoint' and topic_end is not null)
        or (kind = 'final' and topic_end is null)
    )
);

create table public.exam_questions (
    id uuid primary key default gen_random_uuid(),
    exam_id uuid not null references public.exams(id) on delete cascade,
    position integer not null check (position > 0),
    prompt text not null,
    options jsonb not null,
    correct_option integer not null,
    unique (exam_id, position)
);

create table public.exam_attempts (
    id uuid primary key default gen_random_uuid(),
    exam_id uuid not null references public.exams(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    status public.exam_attempt_status not null,
    score integer not null check (score between 0 and 100),
    answers jsonb not null default '{}'::jsonb,
    attempted_at timestamptz not null default now()
);

create table public.certificates (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    course_id text not null references public.courses(id) on delete cascade,
    enrollment_id uuid not null references public.enrollments(id) on delete cascade,
    certificate_number text not null unique,
    issued_at timestamptz not null default now(),
    unique (user_id, course_id)
);

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_overviews enable row level security;
alter table public.course_modules enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.certificates enable row level security;

create policy "public can preview published courses"
on public.courses for select
using (published = true);

create policy "public can preview course overviews"
on public.course_overviews for select
using (
    exists (
        select 1 from public.courses c
        where c.id = course_id and c.published = true
    )
);

create policy "users read their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "users update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "users read their enrollments"
on public.enrollments for select
using (auth.uid() = user_id);

create policy "users read their lesson progress"
on public.lesson_progress for select
using (auth.uid() = user_id);

create policy "enrolled users read course modules"
on public.course_modules for select
using (
    exists (
        select 1
        from public.enrollments e
        where e.user_id = auth.uid()
          and e.course_id = course_modules.course_id
    )
);

create policy "enrolled users read exams"
on public.exams for select
using (
    exists (
        select 1
        from public.enrollments e
        where e.user_id = auth.uid()
          and e.course_id = exams.course_id
    )
);

create policy "enrolled users read exam questions"
on public.exam_questions for select
using (
    exists (
        select 1
        from public.exams x
        join public.enrollments e on e.course_id = x.course_id
        where x.id = exam_questions.exam_id
          and e.user_id = auth.uid()
    )
);

create policy "users read their exam attempts"
on public.exam_attempts for select
using (auth.uid() = user_id);

create policy "users read their certificates"
on public.certificates for select
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, full_name, phone)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        new.raw_user_meta_data->>'phone'
    )
    on conflict (id) do update
        set full_name = excluded.full_name,
            phone = excluded.phone,
            updated_at = now();
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.enroll_in_course(p_course_id text)
returns public.enrollments
language plpgsql
security definer
set search_path = public
as $$
declare
    result public.enrollments;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    if not exists (
        select 1 from public.courses
        where id = p_course_id and published = true
    ) then
        raise exception 'Course not found';
    end if;

    insert into public.enrollments (user_id, course_id, status)
    values (auth.uid(), p_course_id, 'enrolled')
    on conflict (user_id, course_id) do update
        set status = case
            when public.enrollments.status = 'completed'
                then 'completed'
            else 'in_progress'
        end
    returning * into result;

    return result;
end;
$$;

create or replace function public.complete_lesson(
    p_course_id text,
    p_module_position integer
)
returns public.lesson_progress
language plpgsql
security definer
set search_path = public
as $$
declare
    result public.lesson_progress;
    prior_count integer;
    module_count integer;
    checkpoint_passed boolean;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    if not exists (
        select 1
        from public.enrollments
        where user_id = auth.uid()
          and course_id = p_course_id
    ) then
        raise exception 'Course is not enrolled';
    end if;

    if not exists (
        select 1
        from public.course_modules
        where course_id = p_course_id and position = p_module_position
    ) then
        raise exception 'Module not found';
    end if;

    if p_module_position > 1 then
        select count(*)
        into prior_count
        from public.lesson_progress
        where user_id = auth.uid()
          and course_id = p_course_id
          and module_position = p_module_position - 1
          and status = 'completed';

        if prior_count = 0 then
            raise exception 'Complete the previous module first';
        end if;
    end if;

    if p_module_position > 1 and p_module_position - 1 in (2, 4, 6, 8, 10, 12, 14, 16, 18, 20) then
        select exists (
            select 1
            from public.exams x
            join public.exam_attempts a on a.exam_id = x.id
            where x.course_id = p_course_id
              and x.kind = 'checkpoint'
              and x.topic_end = p_module_position - 1
              and a.user_id = auth.uid()
              and a.status = 'passed'
        ) into checkpoint_passed;

        if not checkpoint_passed then
            raise exception 'Pass the checkpoint exam before continuing';
        end if;
    end if;

    insert into public.lesson_progress (
        user_id, course_id, module_position, status, completed_at
    )
    values (
        auth.uid(), p_course_id, p_module_position, 'completed', now()
    )
    on conflict (user_id, course_id, module_position) do update
        set status = 'completed',
            completed_at = coalesce(public.lesson_progress.completed_at, now()),
            updated_at = now()
    returning * into result;

    select count(*) into module_count
    from public.course_modules
    where course_id = p_course_id;

    update public.enrollments
    set status = 'in_progress'
    where user_id = auth.uid() and course_id = p_course_id;

    return result;
end;
$$;

create or replace function public.submit_exam(
    p_exam_id uuid,
    p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    exam_row public.exams%rowtype;
    question_count integer;
    correct_count integer := 0;
    final_score integer;
    attempt_status public.exam_attempt_status;
    enrollment_row public.enrollments%rowtype;
    module_count integer;
    completed_count integer;
begin
    if auth.uid() is null then
        raise exception 'Authentication required';
    end if;

    select * into exam_row from public.exams where id = p_exam_id;
    if not found then
        raise exception 'Exam not found';
    end if;

    select * into enrollment_row
    from public.enrollments
    where user_id = auth.uid() and course_id = exam_row.course_id;
    if not found then
        raise exception 'Course is not enrolled';
    end if;

    if exam_row.kind = 'checkpoint' then
        select count(*) into completed_count
        from public.lesson_progress
        where user_id = auth.uid()
          and course_id = exam_row.course_id
          and module_position <= exam_row.topic_end
          and status = 'completed';

        if completed_count < exam_row.topic_end then
            raise exception 'Complete both topics before taking this checkpoint exam';
        end if;
    else
        select count(*) into module_count
        from public.course_modules
        where course_id = exam_row.course_id;

        select count(*) into completed_count
        from public.lesson_progress
        where user_id = auth.uid()
          and course_id = exam_row.course_id
          and status = 'completed';

        if completed_count < module_count then
            raise exception 'Complete every topic before taking the final exam';
        end if;
    end if;

    select count(*) into question_count
    from public.exam_questions
    where exam_id = p_exam_id;

    select count(*)
    into correct_count
    from public.exam_questions q
    where q.exam_id = p_exam_id
      and ((p_answers ->> (q.id::text))::integer = q.correct_option);

    final_score := case
        when question_count = 0 then 0
        else round(correct_count::numeric * 100 / question_count)
    end;
    attempt_status := case
        when final_score >= exam_row.passing_score then 'passed'
        else 'failed'
    end;

    insert into public.exam_attempts (
        exam_id, user_id, status, score, answers
    )
    values (
        p_exam_id, auth.uid(), attempt_status, final_score, p_answers
    );

    if exam_row.kind = 'final' and attempt_status = 'passed' then
        update public.enrollments
        set status = 'completed',
            completed_at = now()
        where id = enrollment_row.id;

        insert into public.certificates (
            user_id, course_id, enrollment_id, certificate_number
        )
        values (
            auth.uid(),
            exam_row.course_id,
            enrollment_row.id,
            'CHI-' || upper(replace(exam_row.course_id, '-', '')) || '-' || to_char(now(), 'YYYYMMDD') || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)
        )
        on conflict (user_id, course_id) do nothing;
    end if;

    return jsonb_build_object(
        'passed', attempt_status = 'passed',
        'score', final_score
    );
end;
$$;

insert into public.courses (id,title,description,instructor_name,duration,difficulty,thumbnail_url) values
('react-native','React Native Development','Design and build polished mobile apps for Android and iOS.','Ada Okafor','10 weeks','Intermediate','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=85'),
('frontend-development','Frontend Web Development','Create responsive websites with HTML, CSS, and JavaScript.','Chidi Nwosu','8 weeks','Beginner','https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=85'),
('html-css','HTML & CSS Fundamentals','Build accessible, responsive web pages from scratch.','Ada Okafor','5 weeks','Beginner','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=85'),
('javascript-essentials','JavaScript Essentials','Learn the core JavaScript skills behind interactive websites.','Chidi Nwosu','6 weeks','Beginner','https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&auto=format&fit=crop&q=85'),
('python','Python Programming','Start coding with Python through practical, beginner-friendly projects.','Ngozi Eze','8 weeks','Beginner','https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=900&auto=format&fit=crop&q=85'),
('ui-ux','UI/UX Design','Turn user needs into clear, thoughtful digital experiences.','Amara Ude','6 weeks','Beginner','https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&auto=format&fit=crop&q=85')
on conflict (id) do update set
title=excluded.title,
description=excluded.description,
instructor_name=excluded.instructor_name,
duration=excluded.duration,
difficulty=excluded.difficulty,
thumbnail_url=excluded.thumbnail_url;

insert into public.course_overviews (course_id, summary, outcomes, syllabus)
select id,
       description,
       '["Understand the core concepts", "Apply each topic through practical work", "Complete assessments and earn a certificate"]'::jsonb,
       '[]'::jsonb
from public.courses
on conflict (course_id) do update
set summary = excluded.summary,
    outcomes = excluded.outcomes;

insert into public.course_modules (course_id, position, title)
select c.course_id, c.position, c.title
from (
    values
    ('react-native',1,'Getting started with React Native'),
    ('react-native',2,'Your first mobile screen'),
    ('react-native',3,'Components and props'),
    ('react-native',4,'Styling mobile interfaces'),
    ('react-native',5,'Working with state'),
    ('react-native',6,'Handling user input'),
    ('react-native',7,'Navigation fundamentals'),
    ('react-native',8,'Building reusable components'),
    ('react-native',9,'Lists and scroll views'),
    ('react-native',10,'Fetching data from an API'),
    ('react-native',11,'Forms and validation'),
    ('react-native',12,'Saving data on device'),
    ('react-native',13,'Images and media'),
    ('react-native',14,'Device features'),
    ('react-native',15,'Working with animations'),
    ('react-native',16,'Testing your application'),
    ('react-native',17,'Performance best practices'),
    ('react-native',18,'Preparing for release'),
    ('react-native',19,'Publishing to app stores'),
    ('react-native',20,'Final mobile app project'),
    ('frontend-development',1,'How the web works'),
    ('frontend-development',2,'Semantic HTML'),
    ('frontend-development',3,'CSS selectors and layout'),
    ('frontend-development',4,'Responsive design'),
    ('frontend-development',5,'JavaScript essentials'),
    ('frontend-development',6,'DOM interactions'),
    ('frontend-development',7,'Forms and accessibility'),
    ('frontend-development',8,'Working with APIs'),
    ('frontend-development',9,'Reusable page components'),
    ('frontend-development',10,'Version control with Git'),
    ('frontend-development',11,'Deploying a website'),
    ('frontend-development',12,'Portfolio project'),
    ('html-css',1,'How websites are structured'),
    ('html-css',2,'HTML document essentials'),
    ('html-css',3,'Text, links, and images'),
    ('html-css',4,'Forms and semantic elements'),
    ('html-css',5,'CSS foundations'),
    ('html-css',6,'Color and typography'),
    ('html-css',7,'The box model'),
    ('html-css',8,'Flexible layouts'),
    ('html-css',9,'Responsive page design'),
    ('html-css',10,'Build and publish a web page'),
    ('javascript-essentials',1,'Values and variables'),
    ('javascript-essentials',2,'Strings and numbers'),
    ('javascript-essentials',3,'Conditions and comparisons'),
    ('javascript-essentials',4,'Loops and iteration'),
    ('javascript-essentials',5,'Functions'),
    ('javascript-essentials',6,'Arrays and objects'),
    ('javascript-essentials',7,'Working with the DOM'),
    ('javascript-essentials',8,'Create an interactive project'),
    ('python',1,'Your first Python program'),
    ('python',2,'Variables and data types'),
    ('python',3,'Working with strings'),
    ('python',4,'Making decisions'),
    ('python',5,'Loops and collections'),
    ('python',6,'Functions and modules'),
    ('python',7,'Reading and writing files'),
    ('python',8,'A practical Python project'),
    ('ui-ux',1,'What makes a good user experience'),
    ('ui-ux',2,'Researching user needs'),
    ('ui-ux',3,'Mapping user journeys'),
    ('ui-ux',4,'Wireframes and layout'),
    ('ui-ux',5,'Color, type, and visual hierarchy'),
    ('ui-ux',6,'Prototyping an interface')
) as c(course_id, position, title)
on conflict (course_id, position) do update set title = excluded.title;

update public.course_overviews o
set syllabus = (
    select coalesce(jsonb_agg(jsonb_build_object('position', m.position, 'title', m.title) order by m.position), '[]'::jsonb)
    from public.course_modules m
    where m.course_id = o.course_id
);

do $$
declare
    c public.courses%rowtype;
    module_count integer;
    topic_end integer;
    exam_id uuid;
begin
    for c in select * from public.courses loop
        select count(*) into module_count
        from public.course_modules
        where course_id = c.id;

        topic_end := 2;
        while topic_end < module_count loop
            insert into public.exams (course_id, kind, topic_end, title, passing_score)
            values (
                c.id,
                'checkpoint',
                topic_end,
                c.title || ' - Topics 1-' || topic_end || ' Checkpoint',
                70
            )
            on conflict (course_id, kind, topic_end) do nothing
            returning id into exam_id;

            if exam_id is not null then
                insert into public.exam_questions (exam_id, position, prompt, options, correct_option)
                values
                    (exam_id, 1, 'Which learning approach is most effective for this checkpoint?', '["Watch only", "Read and practise", "Skip the examples"]'::jsonb, 1),
                    (exam_id, 2, 'What should you do if an example does not work?', '["Ignore it", "Review each step and debug", "Delete the project"]'::jsonb, 1),
                    (exam_id, 3, 'Which outcome shows understanding of the topics covered?', '["You can explain and apply the concepts", "You remember only the headings", "You completed nothing"]'::jsonb, 0);
            end if;

            topic_end := topic_end + 2;
        end loop;

        insert into public.exams (course_id, kind, topic_end, title, passing_score)
        values (
            c.id,
            'final',
            null,
            c.title || ' - Final Exam',
            70
        )
        on conflict (course_id, kind, topic_end) do nothing
        returning id into exam_id;

        if exam_id is not null then
            insert into public.exam_questions (exam_id, position, prompt, options, correct_option)
            values
                (exam_id, 1, 'How should a completed learner verify understanding?', '["By practical application", "By skipping review", "By guessing"]'::jsonb, 0),
                (exam_id, 2, 'Which habit supports course completion?', '["Consistent practice and reflection", "Learning only at the end", "Avoiding all feedback"]'::jsonb, 0),
                (exam_id, 3, 'What is the purpose of the final course exam?', '["To verify achievement across the course", "To replace every lesson", "To reset enrolment"]'::jsonb, 0);
        end if;
    end loop;
end;
$$;
