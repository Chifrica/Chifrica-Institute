export type Course = {
    id: string;
    title: string;
    instructor: string;
    duration: string;
    difficulty: string;
    image: string;
    description: string;
    lessons: string[];
};

export type LearningProgress = Record<string, string[]>;

function completedLessonIds(courseId: string, count?: number) {
    const course = courses.find((item) => item.id === courseId);
    if (!course) {
        throw new Error(`Unknown course in demo progress: ${courseId}`);
    }

    return course.lessons.slice(0, count).map((_, index) => `lesson-${index + 1}`);
}

export const courses: Course[] = [
    {
        id: "react-native",
        title: "React Native Development",
        instructor: "Ada Okafor",
        duration: "10 weeks",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=85",
        description: "Design and build polished mobile apps for Android and iOS.",
        lessons: [
            "Getting started with React Native",
            "Your first mobile screen",
            "Components and props",
            "Styling mobile interfaces",
            "Working with state",
            "Handling user input",
            "Navigation fundamentals",
            "Building reusable components",
            "Lists and scroll views",
            "Fetching data from an API",
            "Forms and validation",
            "Saving data on device",
            "Images and media",
            "Device features",
            "Working with animations",
            "Testing your application",
            "Performance best practices",
            "Preparing for release",
            "Publishing to app stores",
            "Final mobile app project",
        ],
    },
    {
        id: "frontend-development",
        title: "Frontend Web Development",
        instructor: "Chidi Nwosu",
        duration: "8 weeks",
        difficulty: "Beginner",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=85",
        description: "Create responsive websites with HTML, CSS, and JavaScript.",
        lessons: [
            "How the web works",
            "Semantic HTML",
            "CSS selectors and layout",
            "Responsive design",
            "JavaScript essentials",
            "DOM interactions",
            "Forms and accessibility",
            "Working with APIs",
            "Reusable page components",
            "Version control with Git",
            "Deploying a website",
            "Portfolio project",
        ],
    },
    {
        id: "html-css",
        title: "HTML & CSS Fundamentals",
        instructor: "Ada Okafor",
        duration: "5 weeks",
        difficulty: "Beginner",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=85",
        description: "Build your first accessible, responsive web pages from scratch.",
        lessons: [
            "How websites are structured",
            "HTML document essentials",
            "Text, links, and images",
            "Forms and semantic elements",
            "CSS foundations",
            "Color and typography",
            "The box model",
            "Flexible layouts",
            "Responsive page design",
            "Build and publish a web page",
        ],
    },
    {
        id: "javascript-essentials",
        title: "JavaScript Essentials",
        instructor: "Chidi Nwosu",
        duration: "6 weeks",
        difficulty: "Beginner",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=900&auto=format&fit=crop&q=85",
        description: "Learn the core JavaScript skills behind interactive websites.",
        lessons: [
            "Values and variables",
            "Strings and numbers",
            "Conditions and comparisons",
            "Loops and iteration",
            "Functions",
            "Arrays and objects",
            "Working with the DOM",
            "Create an interactive project",
        ],
    },
    {
        id: "python",
        title: "Python Programming",
        instructor: "Ngozi Eze",
        duration: "8 weeks",
        difficulty: "Beginner",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=900&auto=format&fit=crop&q=85",
        description: "Start coding with Python through practical, beginner-friendly projects.",
        lessons: [
            "Your first Python program",
            "Variables and data types",
            "Working with strings",
            "Making decisions",
            "Loops and collections",
            "Functions and modules",
            "Reading and writing files",
            "A practical Python project",
        ],
    },
    {
        id: "ui-ux",
        title: "UI/UX Design",
        instructor: "Amara Ude",
        duration: "6 weeks",
        difficulty: "Beginner",
        image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=900&auto=format&fit=crop&q=85",
        description: "Turn user needs into clear, thoughtful digital experiences.",
        lessons: [
            "What makes a good user experience",
            "Researching user needs",
            "Mapping user journeys",
            "Wireframes and layout",
            "Color, type, and visual hierarchy",
            "Prototyping an interface",
        ],
    },
];

export const DEMO_LEARNING_PROGRESS: LearningProgress = {
    "react-native": completedLessonIds("react-native", 13),
    "frontend-development": completedLessonIds("frontend-development", 7),
    "html-css": completedLessonIds("html-css"),
    "javascript-essentials": completedLessonIds("javascript-essentials"),
};

export const LEARNING_PROGRESS_KEY = "chifrica.learning-progress";
