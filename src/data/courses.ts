export type Course = {
    id: string;
    title: string;
    instructor: string;
    duration: string;
    difficulty: string;
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
