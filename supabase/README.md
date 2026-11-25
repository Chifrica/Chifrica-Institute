# Chifrica Supabase setup

## 1. Create the project

1. Create a Supabase project.
2. Open **SQL Editor** and run `migrations/001_chifrica_learning.sql`.
3. Run `migrations/002_course_categories.sql` to add course categories. Existing courses default to **Popular**; set `courses.category` to values such as `Programming`, `Design`, `AI & Emerging Tech`, or `Professional Skills` to place them in those catalogue filters.
4. In **Authentication > Providers > Email**, enable email/password sign-in.
5. Copy the project URL and publishable/anonymous key.
6. Create `.env.local` from `.env.example`:

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

Restart `npm run dev` after changing environment variables.

## 2. Table structure

- `profiles`: one row per authenticated user; created automatically from auth metadata.
- `courses`: published course catalogue.
- `course_overviews`: public summary, outcomes, and module syllabus.
- `course_modules`: lesson content; visible only after enrolment.
- `enrollments`: unique user/course enrolment and completion status.
- `lesson_progress`: server-recorded completed module positions.
- `exams`: checkpoint or final exam for a course.
- `exam_questions`: questions and server-side correct options.
- `exam_attempts`: immutable scoring records for users.
- `certificates`: issued automatically after a passing final exam.

## 3. Learning rules

- Account creation creates a profile through `handle_new_user`.
- Enrolment uses `enroll_in_course(course_id)`.
- One module is completed at a time through `complete_lesson(course_id, position)`.
- A checkpoint exam is required after topics 2, 4, 6, and so on.
- The final exam is available only after every module is complete.
- `submit_exam(exam_id, answers)` validates answers and returns the server-calculated score.
- A passing final exam changes the enrolment to `completed` and creates a certificate.

## 4. Course content

The application reads the published catalogue from `courses`, preview details and topic titles from `course_overviews`, and enrolled lesson materials from `course_modules`. Progress and exam results are read from the signed-in student's Supabase records; the browser is not a course-data store.

Add and publish course content in Supabase. Each `course_modules` row represents one topic; `content` holds the lesson text and `image_url` is an optional topic image. Keep the public syllabus in sync with those module positions and titles. For example:

```sql
update public.course_modules
set content = 'Instructor-authored lesson text.',
    image_url = 'https://YOUR_PUBLIC_IMAGE_URL'
where course_id = 'python' and position = 1;

update public.course_overviews
set summary = 'Course overview shown before enrolment.',
    outcomes = '["Outcome one", "Outcome two"]'::jsonb,
    syllabus = (
        select coalesce(
            jsonb_agg(jsonb_build_object('position', position, 'title', title) order by position),
            '[]'::jsonb
        )
        from public.course_modules
        where course_id = 'python'
    )
where course_id = 'python';
```

Use publicly accessible image URLs. Module content remains protected by enrolment RLS; the syllabus and overview remain available to visitors previewing a course. Missing lesson text is shown as an explicit empty state rather than replaced with browser-side sample content.

## 5. RLS summary

- Users can read/update only their profile.
- Users can read only their enrolments, progress, attempts, and certificates.
- Module content and exam questions require an enrolment for the course.
- Course and course-overview records are publicly readable when `published = true`.
- Direct lesson, exam, enrolment, and certificate writes are prevented from client tables.
- Learning actions are performed through `SECURITY DEFINER` RPC functions with explicit user checks.

## 6. Production notes

- Supabase configuration is required for login, course loading, enrolment, and learning progress.
- Replace the seed exam questions with instructor-authored questions before launch.
- Configure email confirmation and redirects in Supabase Authentication settings for production.
