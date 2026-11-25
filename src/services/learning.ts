import { supabase } from "../lib/supabase";
import type { Course, CourseModule, CourseOverview, LearningProgress } from "../data/courses";

export type ServerEnrollment = {
    course_id: string;
    status: "enrolled" | "in_progress" | "completed";
};

const isMissingCourseCategory = (error: { code?: string; message: string; details?: string; hint?: string }) => {
    const description = `${error.message} ${error.details ?? ""} ${error.hint ?? ""}`.toLowerCase();
    return description.includes("category")
        && (error.code === "42703"
            || error.code === "PGRST204"
            || description.includes("does not exist")
            || description.includes("schema cache"));
};

const inferCourseCategory = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();
    if (/\b(programming|developer|development|coding|javascript|python|react|software|web)\b/.test(text)) {
        return "Programming";
    }
    if (/\b(design|ui\/ux|ux|graphic|figma)\b/.test(text)) {
        return "Design";
    }
    if (/\b(ai|artificial intelligence|machine learning|data science|emerging tech)\b/.test(text)) {
        return "AI & Emerging Tech";
    }
    if (/\b(professional|business|career|leadership|communication)\b/.test(text)) {
        return "Professional Skills";
    }
    return "Popular";
};

export async function fetchPublishedCourses(): Promise<Course[]> {
    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    const { data: categorizedCourses, error: categorizedError } = await supabase
        .from("courses")
        .select("id,title,description,instructor_name,duration,difficulty,category,thumbnail_url")
        .eq("published", true)
        .order("title");

    let rows = categorizedCourses;
    let hasCategoryColumn = true;
    if (categorizedError) {
        if (!isMissingCourseCategory(categorizedError)) {
            throw categorizedError;
        }

        const { data, error } = await supabase
            .from("courses")
            .select("id,title,description,instructor_name,duration,difficulty,thumbnail_url")
            .eq("published", true)
            .order("title");
        if (error) {
            throw error;
        }
        rows = data;
        hasCategoryColumn = false;
    }

    return (rows ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        instructor: row.instructor_name,
        duration: row.duration,
        difficulty: row.difficulty,
        category: hasCategoryColumn && "category" in row && typeof row.category === "string"
            ? row.category
            : inferCourseCategory(row.title, row.description),
        image: row.thumbnail_url ?? "",
    }));
}

export async function fetchCourseOverviews(courseIds?: string[]): Promise<CourseOverview[]> {
    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    let query = supabase
        .from("course_overviews")
        .select("course_id,summary,outcomes,syllabus");
    if (courseIds) {
        query = query.in("course_id", courseIds);
    }

    const { data, error } = await query;
    if (error) {
        throw error;
    }

    return (data ?? []).map((row) => ({
        course_id: row.course_id,
        summary: row.summary,
        outcomes: Array.isArray(row.outcomes) ? row.outcomes : [],
        syllabus: Array.isArray(row.syllabus) ? row.syllabus : [],
    }));
}

export async function fetchCourseModules(courseId: string): Promise<CourseModule[]> {
    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase
        .from("course_modules")
        .select("course_id,position,title,content,image_url")
        .eq("course_id", courseId)
        .order("position");

    if (error) {
        throw error;
    }

    return (data ?? []).map((row) => ({
        course_id: row.course_id,
        position: row.position,
        title: row.title,
        content: row.content ?? "",
        image_url: row.image_url,
    }));
}

export async function fetchEnrollments(userId: string): Promise<ServerEnrollment[]> {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from("enrollments")
        .select("course_id,status")
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data ?? [];
}

export async function fetchLessonProgress(userId: string, courseId: string): Promise<string[]> {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from("lesson_progress")
        .select("module_position")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .eq("status", "completed");

    if (error) {
        throw error;
    }

    return (data ?? []).map((row) => `lesson-${row.module_position}`);
}

export async function fetchAllLessonProgress(userId: string): Promise<LearningProgress> {
    if (!supabase) {
        return {};
    }

    const { data, error } = await supabase
        .from("lesson_progress")
        .select("course_id,module_position")
        .eq("user_id", userId)
        .eq("status", "completed");

    if (error) {
        throw error;
    }

    const progress: LearningProgress = {};
    for (const row of data ?? []) {
        progress[row.course_id] = [
            ...(progress[row.course_id] ?? []),
            `lesson-${row.module_position}`,
        ];
    }
    return progress;
}

export async function enrollInCourse(courseId: string): Promise<void> {
    if (!supabase) {
        return;
    }

    const { error } = await supabase.rpc("enroll_in_course", { p_course_id: courseId });
    if (error) {
        throw error;
    }
}

export async function completeLesson(courseId: string, modulePosition: number): Promise<void> {
    if (!supabase) {
        return;
    }

    const { error } = await supabase.rpc("complete_lesson", {
        p_course_id: courseId,
        p_module_position: modulePosition,
    });
    if (error) {
        throw error;
    }
}

export type ExamQuestion = {
    id: string;
    prompt: string;
    options: string[];
};

export type Exam = {
    id: string;
    title: string;
    passing_score: number;
    questions: ExamQuestion[];
};

export async function fetchExam(
    courseId: string,
    kind: "checkpoint" | "final",
    topicEnd?: number,
): Promise<Exam | null> {
    if (!supabase) {
        return null;
    }

    let query = supabase
        .from("exams")
        .select("id,title,passing_score,exam_questions(id,prompt,options)")
        .eq("course_id", courseId)
        .eq("kind", kind);

    if (topicEnd !== undefined) {
        query = query.eq("topic_end", topicEnd);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
        throw error;
    }
    if (!data) {
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        passing_score: data.passing_score,
        questions: (data.exam_questions ?? []).map((question) => ({
            id: question.id,
            prompt: question.prompt,
            options: question.options,
        })),
    };
}

export async function submitExam(
    examId: string,
    answers: Record<string, number>,
): Promise<{ passed: boolean; score: number }> {
    if (!supabase) {
        throw new Error("Supabase is not configured.");
    }

    const { data, error } = await supabase.rpc("submit_exam", {
        p_exam_id: examId,
        p_answers: answers,
    });
    if (error) {
        throw error;
    }

    return data as { passed: boolean; score: number };
}

export async function fetchPassedExamKeys(): Promise<string[]> {
    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from("exam_attempts")
        .select("status,exams(course_id,kind,topic_end)")
        .eq("status", "passed");

    if (error) {
        throw error;
    }

    return (data ?? []).flatMap((attempt) => {
        const examRelation = attempt.exams;
        const exam = (Array.isArray(examRelation) ? examRelation[0] : examRelation) as
            | { course_id: string; kind: "checkpoint" | "final"; topic_end: number | null }
            | null;
        if (!exam) {
            return [];
        }
        return [exam.kind === "final"
            ? `${exam.course_id}:final`
            : `${exam.course_id}:checkpoint:${exam.topic_end}`];
    });
}
