export type Course = {
    id: string;
    title: string;
    instructor: string;
    duration: string;
    difficulty: string;
    category: string;
    image: string;
    description: string;
};

export type CourseModule = {
    course_id: string;
    position: number;
    title: string;
    content: string;
    image_url: string | null;
};

export type CourseOverview = {
    course_id: string;
    summary: string;
    outcomes: string[];
    syllabus: Array<{ position: number; title: string }>;
};

export type LearningProgress = Record<string, string[]>;

export const getCourseSlug = (title: string) =>
    title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const getCourseOverviewPath = (course: Pick<Course, "title">) =>
    `/courses/${getCourseSlug(course.title)}/overview`;
