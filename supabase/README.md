# Chifrica Supabase setup

## 1. Create the project

1. Create a Supabase project.
2. Open **SQL Editor** and run `migrations/001_chifrica_learning.sql`.
3. In **Authentication > Providers > Email**, enable email/password sign-in.
4. Copy the project URL and publishable/anonymous key.
5. Create `.env.local` from `.env.example`:

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

## 4. RLS summary

- Users can read/update only their profile.
- Users can read only their enrolments, progress, attempts, and certificates.
- Module content and exam questions require an enrolment for the course.
- Course and course-overview records are publicly readable when `published = true`.
- Direct lesson, exam, enrolment, and certificate writes are prevented from client tables.
- Learning actions are performed through `SECURITY DEFINER` RPC functions with explicit user checks.

## 5. Production notes

- The frontend will continue to work with browser demo data when Supabase variables are absent.
- With Supabase configured, registration and login use Supabase Auth.
- Replace the seed's demo questions and static module content with instructor-authored content before launch.
- Configure email confirmation and redirects in Supabase Authentication settings for production.
