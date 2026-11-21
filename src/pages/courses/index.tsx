import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiAward, FiBookOpen, FiCheckCircle, FiClock, FiUser, FiX } from "react-icons/fi";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { courses, LEARNING_PROGRESS_KEY, type Course, type LearningProgress } from "../../data/courses";
import { supabase } from "../../lib/supabase";
import {
    completeLesson,
    enrollInCourse,
    fetchAllLessonProgress,
    fetchExam,
    submitExam,
    fetchPassedExamKeys,
    fetchEnrollments,
    type Exam,
} from "../../services/learning";
import { getCurrentUserId } from "../../auth";
import "./style.css";

function readProgress(): LearningProgress {
    const savedProgress = window.localStorage.getItem(LEARNING_PROGRESS_KEY);
    if (!savedProgress) {
        return {};
    }

    try {
        const parsed: unknown = JSON.parse(savedProgress);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            throw new Error("Saved course progress has an unexpected format.");
        }

        return Object.fromEntries(
            Object.entries(parsed).filter(
                (entry): entry is [string, string[]] =>
                    Array.isArray(entry[1]) && entry[1].every((lessonId) => typeof lessonId === "string"),
            ),
        );
    } catch (error) {
        console.error("Unable to read saved course progress.", error);
        return {};
    }
}

function getCompletedLessons(course: Course, progress: LearningProgress) {
    const completedIds = new Set(progress[course.id] ?? []);
    return course.lessons.filter((_, index) => completedIds.has(`lesson-${index + 1}`)).length;
}

function getLessonExample(courseId: string) {
    switch (courseId) {
        case "react-native":
            return "const styles = StyleSheet.create({\n  screen: { flex: 1, padding: 16 },\n});";
        case "frontend-development":
            return "<main>\n  <h1>Welcome</h1>\n  <p>Build a clear page structure.</p>\n</main>";
        case "html-css":
            return '<main class="page">\n  <h1>Welcome</h1>\n</main>';
        case "javascript-essentials":
            return 'const isComplete = true;\nif (isComplete) {\n  console.log("Well done");\n}';
        case "python":
            return 'for topic in topics:\n    print(topic)';
        default:
            return "User need  →  clear action  →  helpful feedback";
    }
}

function getLessonExplanation(courseId: string, lesson: string) {
    const topic = lesson.toLowerCase();
    switch (courseId) {
        case "react-native":
            return `React Native combines reusable React components with native mobile controls. In ${topic}, focus on how this concept affects the screen, then test the result on a small device-sized layout.`;
        case "frontend-development":
            return `A web page combines meaningful HTML, visual CSS, and interactive JavaScript. In ${topic}, consider how each layer contributes to a page that is clear, responsive, and usable.`;
        case "html-css":
            return `HTML gives page content structure and meaning; CSS controls how that content is presented. In ${topic}, build on semantic markup and check that the result remains readable at different screen sizes.`;
        case "javascript-essentials":
            return `JavaScript adds logic and interaction to a page. In ${topic}, work with small inputs and outputs first, then check how the browser responds when the values or user actions change.`;
        case "python":
            return `Python uses readable, structured instructions to work with data and solve problems. In ${topic}, break the task into simple steps and run a small example to verify each result.`;
        default:
            return `Good user experiences begin with a clear understanding of what people need to do. In ${topic}, consider how layout, visual hierarchy, and feedback can make that task easier.`;
    }
}

const Courses = () => {
    const [progress, setProgress] = useState<LearningProgress>(readProgress);
    const [storageError, setStorageError] = useState("");
    const [serverError, setServerError] = useState("");
    const [exam, setExam] = useState<Exam | null>(null);
    const [examOpen, setExamOpen] = useState(false);
    const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
    const [examResult, setExamResult] = useState<{ passed: boolean; score: number } | null>(null);
    const [examSubmitting, setExamSubmitting] = useState(false);
    const [passedExams, setPassedExams] = useState<Set<string>>(new Set());
    const [activeExamKind, setActiveExamKind] = useState<"checkpoint" | "final">("checkpoint");
    const { courseId, lessonNumber } = useParams<{ courseId: string; lessonNumber?: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            window.localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(progress));
        } catch (error) {
            console.error("Unable to save course progress.", error);
            queueMicrotask(() => {
                setStorageError("Your progress could not be saved on this device. Check your browser storage settings.");
            });
        }
    }, [progress]);

    useEffect(() => {
        if (!supabase) {
            return;
        }

        let cancelled = false;
        const syncServerProgress = async () => {
            try {
                const userId = await getCurrentUserId();
                if (!userId || cancelled) {
                    return;
                }
                const serverProgress = await fetchAllLessonProgress(userId);
                const enrollments = await fetchEnrollments(userId);
                if (!cancelled) {
                    const enrollmentProgress = enrollments.reduce<LearningProgress>((result, enrollment) => {
                        result[enrollment.course_id] = serverProgress[enrollment.course_id] ?? [];
                        return result;
                    }, {});
                    setProgress((current) => ({ ...serverProgress, ...enrollmentProgress, ...current }));
                }
                const passedExamKeys = await fetchPassedExamKeys();
                if (!cancelled) {
                    setPassedExams(new Set(passedExamKeys));
                }
            } catch (error) {
                console.error("Unable to load learning progress.", error);
                if (!cancelled) {
                    setServerError("Live course progress could not be loaded. Local demo progress is still available.");
                }
            }
        };

        void syncServerProgress();
        return () => {
            cancelled = true;
        };
    }, []);

    const enrolledCourses = courses.filter((course) =>
        Object.prototype.hasOwnProperty.call(progress, course.id),
    );
    const completedCourses = enrolledCourses.filter(
        (course) => getCompletedLessons(course, progress) === course.lessons.length,
    );
    const inProgressCourses = enrolledCourses.filter((course) => {
        const completedLessons = getCompletedLessons(course, progress);
        return completedLessons > 0 && completedLessons < course.lessons.length;
    });
    const currentCourses = enrolledCourses.filter(
        (course) => getCompletedLessons(course, progress) < course.lessons.length,
    );
    const availableCourses = courses.filter(
        (course) => !Object.prototype.hasOwnProperty.call(progress, course.id),
    );
    const activeCourse = courses.find((course) => course.id === courseId);
    const isCourseOverview = lessonNumber === "overview";
    const isCourseEnrolled = Boolean(
        activeCourse && Object.prototype.hasOwnProperty.call(progress, activeCourse.id),
    );
    const requestedLessonIndex = Number(lessonNumber) - 1;
    const firstIncompleteLessonIndex = activeCourse
        ? activeCourse.lessons.findIndex((_, index) => !(progress[activeCourse.id] ?? []).includes(`lesson-${index + 1}`))
        : -1;
    const activeLessonIndex = activeCourse
        ? lessonNumber && Number.isInteger(requestedLessonIndex) && requestedLessonIndex >= 0 && requestedLessonIndex < activeCourse.lessons.length
            ? firstIncompleteLessonIndex >= 0
                ? Math.min(requestedLessonIndex, firstIncompleteLessonIndex)
                : requestedLessonIndex
            : firstIncompleteLessonIndex >= 0 ? firstIncompleteLessonIndex : 0
        : 0;
    const completedLessonIds = activeCourse ? new Set(progress[activeCourse.id] ?? []) : new Set<string>();
    const isActiveLessonComplete = Boolean(activeCourse && completedLessonIds.has(`lesson-${activeLessonIndex + 1}`));

    const enroll = (courseId: string) => {
        setProgress((current) => ({ ...current, [courseId]: [] }));
        navigate(`/courses/${courseId}/1`);
        if (supabase) {
            void enrollInCourse(courseId).catch((error) => {
                console.error("Unable to enrol in course.", error);
                setServerError("Enrolment could not be saved. Please try again.");
            });
        }
    };

    const openCourse = (course: Course) => {
        const doneLessons = new Set(progress[course.id] ?? []);
        const firstIncomplete = course.lessons.findIndex((_, index) => !doneLessons.has(`lesson-${index + 1}`));
        navigate(`/courses/${course.id}/${firstIncomplete < 0 ? 1 : firstIncomplete + 1}`);
    };

    const openLesson = (index: number) => {
        if (activeCourse) {
            navigate(`/courses/${activeCourse.id}/${index + 1}`);
        }
    };

    const openCourseOverview = (course: Course) => {
        navigate(`/courses/${course.id}/overview`);
    };

    const completeActiveLesson = () => {
        if (!activeCourse || isActiveLessonComplete) {
            return;
        }

        const lessonId = `lesson-${activeLessonIndex + 1}`;
        setProgress((current) => ({
            ...current,
            [activeCourse.id]: [...new Set([...(current[activeCourse.id] ?? []), lessonId])],
        }));
        if (supabase) {
            void completeLesson(activeCourse.id, activeLessonIndex + 1).catch((error) => {
                console.error("Unable to save lesson completion.", error);
                setServerError(error instanceof Error ? error.message : "Lesson completion could not be saved.");
                setProgress((current) => ({
                    ...current,
                    [activeCourse.id]: (current[activeCourse.id] ?? []).filter((id) => id !== lessonId),
                }));
            });
        }
    };

    const openExam = async (kind: "checkpoint" | "final") => {
        if (!activeCourse) {
            return;
        }

        setActiveExamKind(kind);
        setExamAnswers({});
        setExamResult(null);
        setExamOpen(true);

        if (!supabase) {
            setExam({
                id: "",
                title: kind === "final"
                    ? `${activeCourse.title} - Final Exam`
                    : `${activeCourse.title} - Checkpoint Exam`,
                passing_score: 70,
                questions: [
                    {
                        id: "demo-1",
                        prompt: "What is the best way to confirm that you understand a topic?",
                        options: ["Practise and explain it", "Skip the examples", "Read the heading only"],
                    },
                    {
                        id: "demo-2",
                        prompt: "When a practical example fails, what should you do?",
                        options: ["Ignore the result", "Review each step and debug", "Stop learning"],
                    },
                    {
                        id: "demo-3",
                        prompt: "Why are course assessments included?",
                        options: ["To verify understanding", "To reset progress", "To remove course modules"],
                    },
                ],
            });
            return;
        }

        try {
            const loadedExam = await fetchExam(
                activeCourse.id,
                kind,
                kind === "checkpoint" ? activeLessonIndex + 1 : undefined,
            );
            setExam(loadedExam);
            if (!loadedExam) {
                setServerError("This exam is not available yet.");
            }
        } catch (error) {
            console.error("Unable to load exam.", error);
            setServerError("The exam could not be loaded.");
        }
    };

    const answerExam = (questionId: string, optionIndex: number) => {
        setExamAnswers((current) => ({ ...current, [questionId]: optionIndex }));
    };

    const submitActiveExam = async () => {
        if (!exam) {
            return;
        }
        if (exam.questions.some((question) => examAnswers[question.id] === undefined)) {
            setExamResult({ passed: false, score: 0 });
            setServerError("Answer every question before submitting.");
            return;
        }

        setExamSubmitting(true);
        setServerError("");
        try {
            if (!supabase || !exam.id) {
                const correctAnswers: Record<string, number> = {
                    "demo-1": 0,
                    "demo-2": 1,
                    "demo-3": 0,
                };
                const correctCount = exam.questions.filter(
                    (question) => examAnswers[question.id] === correctAnswers[question.id],
                ).length;
                const score = exam.questions.length
                    ? Math.round(correctCount * 100 / exam.questions.length)
                    : 0;
                const result = { passed: score >= exam.passing_score, score };
                setExamResult(result);
                if (result.passed && activeCourse) {
                    const key = activeExamKind === "final"
                        ? `${activeCourse.id}:final`
                        : `${activeCourse.id}:checkpoint:${activeLessonIndex + 1}`;
                    setPassedExams((current) => new Set(current).add(key));
                }
            } else {
                const result = await submitExam(exam.id, examAnswers);
                setExamResult(result);
                if (result.passed && activeCourse) {
                    const key = activeExamKind === "final"
                        ? `${activeCourse.id}:final`
                        : `${activeCourse.id}:checkpoint:${activeLessonIndex + 1}`;
                    setPassedExams((current) => new Set(current).add(key));
                }
            }
        } catch (error) {
            console.error("Unable to submit exam.", error);
            setServerError(error instanceof Error ? error.message : "The exam could not be submitted.");
        } finally {
            setExamSubmitting(false);
        }
    };

    const renderCourseCard = (course: Course, featured = false) => {
        const completedLessons = getCompletedLessons(course, progress);
        const percentage = Math.round((completedLessons / course.lessons.length) * 100);
        const isComplete = percentage === 100;

        return (
            <article className={`learning-course-card${featured ? " learning-course-card--featured" : ""}`} key={course.id}>
                <div className="learning-course-image">
                    <img src={course.image} alt="" loading="lazy" />
                    <span className={`learning-course-status${isComplete ? " learning-course-status--complete" : ""}`}>
                        {isComplete ? <><FiCheckCircle aria-hidden="true" /> Completed</> : percentage ? "In progress" : "Ready to start"}
                    </span>
                </div>
                <div className="learning-course-content">
                    <div className="learning-course-heading">
                        <div>
                            <p className="learning-course-kicker">{course.difficulty} <span aria-hidden="true">·</span> {course.duration}</p>
                            <h3>{course.title}</h3>
                        </div>
                        {isComplete && <span className="learning-certificate" aria-label="Certificate available"><FiAward aria-hidden="true" /></span>}
                    </div>
                    <p className="learning-course-description">{course.description}</p>
                    <div className="learning-course-meta">
                        <span><FiUser aria-hidden="true" /> {course.instructor}</span>
                        <span><FiBookOpen aria-hidden="true" /> {course.lessons.length} lessons</span>
                    </div>

                    {isComplete ? (
                        <div className="learning-completion-copy">
                            <FiCheckCircle aria-hidden="true" />
                            <span>100% completed · Certificate available</span>
                        </div>
                    ) : (
                        <>
                            <div className="learning-progress-label">
                                <span>Course progress</span>
                                <strong>{percentage}%</strong>
                            </div>
                            <div
                                className="learning-progress-track"
                                role="progressbar"
                                aria-label={`${course.title} progress`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={percentage}
                            >
                                <span style={{ width: `${percentage}%` }} />
                            </div>
                            <p className="learning-lesson-count">
                                {completedLessons} of {course.lessons.length} lessons completed
                            </p>
                        </>
                    )}

                    <button
                        className={isComplete ? "learning-secondary-button" : "learning-primary-button"}
                        type="button"
                        onClick={() => openCourse(course)}
                    >
                        {isComplete ? "Review course" : percentage ? "Continue learning" : "Start learning"}
                    </button>
                </div>
            </article>
        );
    };

    const renderCourseReader = (course: Course) => (
        <section className="learning-reader" aria-label={`${course.title} lesson reader`}>
            <header className="learning-reader-header">
                <div>
                    <p className="learning-eyebrow">Course modules</p>
                    <h2>{course.title}</h2>
                </div>
                <button
                    className="learning-reader-close"
                    type="button"
                    onClick={() => navigate("/courses")}
                    aria-label="Return to My Learning"
                >
                    <FiX aria-hidden="true" />
                </button>
            </header>

            <div className="learning-reader-layout">
                <nav className="learning-module-list" aria-label="Course topics">
                    <p className="learning-module-list-heading">Topics <span>{course.lessons.length}</span></p>
                    {course.lessons.map((lesson, index) => {
                        const isComplete = completedLessonIds.has(`lesson-${index + 1}`);
                        const firstIncomplete = course.lessons.findIndex(
                            (_, lessonIndex) => !completedLessonIds.has(`lesson-${lessonIndex + 1}`),
                        );
                        const isLocked = firstIncomplete >= 0 && index > firstIncomplete;
                        return (
                            <button
                                className={`learning-module-item${index === activeLessonIndex ? " is-active" : ""}${isComplete ? " is-complete" : ""}`}
                                type="button"
                                key={lesson}
                                disabled={isLocked}
                                onClick={() => openLesson(index)}
                            >
                                <span className="learning-module-number">
                                    {isComplete ? <FiCheckCircle aria-hidden="true" /> : String(index + 1).padStart(2, "0")}
                                </span>
                                <span>{lesson}</span>
                            </button>
                        );
                    })}
                </nav>

                <article className="learning-topic">
                    <div className="learning-topic-heading">
                        <p className="learning-eyebrow">
                            Topic {activeLessonIndex + 1} of {course.lessons.length}
                        </p>
                        <h1 id="learning-topic-title">{course.lessons[activeLessonIndex]}</h1>
                    </div>
                    <figure className="learning-topic-visual">
                        <img src={course.image} alt={`${course.title} course visual`} />
                        <figcaption>{course.title} · {course.instructor}</figcaption>
                    </figure>

                    <div className="learning-topic-content">
                        <p>{getLessonExplanation(course.id, course.lessons[activeLessonIndex])}</p>
                        <h2>Put it into practice</h2>
                        <p>
                            Start with one clear goal, break the work into manageable steps, and check the result as you go.
                            Revisit earlier topics whenever you need a refresher.
                        </p>
                        <pre className="learning-topic-example"><code>{getLessonExample(course.id)}</code></pre>
                        <aside className="learning-topic-tip">
                            <strong>Key takeaway</strong>
                            <p>Understand the purpose first, practise the concept, and review your result before moving on.</p>
                        </aside>
                    </div>

                    <div className="learning-question">
                        <label htmlFor="learning-question-input">Questions about this topic?</label>
                        <textarea
                            id="learning-question-input"
                            rows={3}
                            placeholder="Write a question or note for yourself..."
                        />
                    </div>

                    {examOpen && (
                        <section className="learning-exam" aria-labelledby="learning-exam-title">
                            <div className="learning-exam-header">
                                <div>
                                    <p className="learning-eyebrow">Knowledge check</p>
                                    <h2 id="learning-exam-title">{exam?.title ?? "Loading exam..."}</h2>
                                </div>
                                {exam && <span>{exam.passing_score}% to pass</span>}
                            </div>

                            {exam?.questions.map((question, questionIndex) => (
                                <fieldset className="learning-exam-question" key={question.id}>
                                    <legend>{questionIndex + 1}. {question.prompt}</legend>
                                    <div className="learning-exam-options">
                                        {question.options.map((option, optionIndex) => (
                                            <label key={option}>
                                                <input
                                                    type="radio"
                                                    name={question.id}
                                                    checked={examAnswers[question.id] === optionIndex}
                                                    onChange={() => answerExam(question.id, optionIndex)}
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            ))}

                            {examResult && (
                                <p className={`learning-exam-result${examResult.passed ? " is-passed" : " is-failed"}`} role="status">
                                    {examResult.passed
                                        ? `Passed — ${examResult.score}%`
                                        : `Not passed — ${examResult.score}%. Review the topics and try again.`}
                                </p>
                            )}

                            <div className="learning-exam-actions">
                                <button
                                    className="learning-secondary-button"
                                    type="button"
                                    onClick={() => setExamOpen(false)}
                                >
                                    Close exam
                                </button>
                                <button
                                    className="learning-primary-button"
                                    type="button"
                                    disabled={examSubmitting || !exam}
                                    onClick={() => void submitActiveExam()}
                                >
                                    {examSubmitting ? "Submitting..." : "Submit exam"}
                                </button>
                            </div>
                        </section>
                    )}

                    <div className="learning-topic-actions">
                        <button
                            className="learning-secondary-button"
                            type="button"
                            disabled={activeLessonIndex === 0}
                            onClick={() => openLesson(activeLessonIndex - 1)}
                        >
                            <FiArrowLeft aria-hidden="true" /> Previous topic
                        </button>
                        <div className="learning-topic-forward">
                            {!isActiveLessonComplete && (
                                <button className="learning-primary-button" type="button" onClick={completeActiveLesson}>
                                    Mark topic complete
                                </button>
                            )}
                            {isActiveLessonComplete
                                && ((activeLessonIndex + 1) % 2 === 0 && activeLessonIndex + 1 < course.lessons.length)
                                && !passedExams.has(`${course.id}:checkpoint:${activeLessonIndex + 1}`)
                                && (
                                    <button
                                        className="learning-primary-button"
                                        type="button"
                                        onClick={() => void openExam("checkpoint")}
                                    >
                                        Take checkpoint exam
                                    </button>
                                )}
                            {isActiveLessonComplete
                                && activeLessonIndex === course.lessons.length - 1
                                && !passedExams.has(`${course.id}:final`)
                                && (
                                    <button
                                        className="learning-primary-button"
                                        type="button"
                                        onClick={() => void openExam("final")}
                                    >
                                        Take final exam
                                    </button>
                                )}
                            <button
                                className="learning-primary-button"
                                type="button"
                                disabled={
                                    !isActiveLessonComplete
                                    || activeLessonIndex === course.lessons.length - 1
                                    || (
                                        (activeLessonIndex + 1) % 2 === 0
                                        && !passedExams.has(`${course.id}:checkpoint:${activeLessonIndex + 1}`)
                                    )
                                }
                                onClick={() => openLesson(activeLessonIndex + 1)}
                            >
                                {activeLessonIndex === course.lessons.length - 1 ? "Course complete" : "Next topic"}
                                {activeLessonIndex < course.lessons.length - 1 && <FiArrowRight aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );

    if (courseId) {
        if (!activeCourse) {
            return <Navigate to="/courses" replace />;
        }

        if (isCourseOverview) {
            if (isCourseEnrolled) {
                return <Navigate to={`/courses/${activeCourse.id}/1`} replace />;
            }

            return (
                <div className="learning-dashboard learning-dashboard--reader">
                    <div className="learning-dashboard-inner">
                        <section className="learning-reader learning-course-overview" aria-labelledby="course-overview-title">
                            <header className="learning-reader-header">
                                <div>
                                    <p className="learning-eyebrow">Course overview</p>
                                    <h2>{activeCourse.title}</h2>
                                </div>
                                <button
                                    className="learning-reader-close"
                                    type="button"
                                    onClick={() => navigate("/courses")}
                                    aria-label="Return to My Learning"
                                >
                                    <FiX aria-hidden="true" />
                                </button>
                            </header>

                            <div className="learning-overview-content">
                                <img className="learning-overview-image" src={activeCourse.image} alt={`${activeCourse.title} course`} />
                                <div className="learning-overview-details">
                                    <p className="learning-eyebrow">{activeCourse.difficulty} · {activeCourse.duration}</p>
                                    <h1 id="course-overview-title">{activeCourse.title}</h1>
                                    <p className="learning-overview-description">{activeCourse.description}</p>
                                    <div className="learning-course-meta">
                                        <span><FiUser aria-hidden="true" /> {activeCourse.instructor}</span>
                                        <span><FiBookOpen aria-hidden="true" /> {activeCourse.lessons.length} modules</span>
                                    </div>
                                    <button
                                        className="learning-primary-button"
                                        type="button"
                                        onClick={() => enroll(activeCourse.id)}
                                    >
                                        Enrol and start learning
                                        <FiArrowRight aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            <div className="learning-overview-modules">
                                <div>
                                    <p className="learning-eyebrow">Your learning path</p>
                                    <h2>Modules covered</h2>
                                    <p>Preview the topics included. Enrol to unlock the full lessons and learning materials.</p>
                                </div>
                                <ol>
                                    {activeCourse.lessons.map((lesson, index) => (
                                        <li key={lesson}>
                                            <span>{String(index + 1).padStart(2, "0")}</span>
                                            <strong>{lesson}</strong>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </section>
                    </div>
                </div>
            );
        }

        if (!isCourseEnrolled) {
            return <Navigate to={`/courses/${activeCourse.id}/overview`} replace />;
        }

        return (
            <div className="learning-dashboard learning-dashboard--reader">
                <div className="learning-dashboard-inner">
                    {(storageError || serverError) && (
                        <p className="learning-storage-error" role="alert">
                            {serverError || storageError}
                        </p>
                    )}
                    {renderCourseReader(activeCourse)}
                </div>
            </div>
        );
    }

    return (
        <div className="learning-dashboard">
            <div className="learning-dashboard-inner">
                <header className="learning-welcome" id="profile">
                    <div>
                        <p className="learning-eyebrow">Student dashboard</p>
                        <h1>My Learning</h1>
                        <p className="learning-welcome-copy">Welcome back! Continue learning where you stopped.</p>
                    </div>
                </header>

                {storageError && <p className="learning-storage-error" role="alert">{storageError}</p>}
                {serverError && <p className="learning-storage-error" role="alert">{serverError}</p>}

                <section className="learning-stats" aria-label="Learning summary">
                    <div className="learning-stat">
                        <span className="learning-stat-icon"><FiBookOpen aria-hidden="true" /></span>
                        <div><strong>{String(enrolledCourses.length).padStart(2, "0")}</strong><span>Enrolled</span></div>
                    </div>
                    <div className="learning-stat">
                        <span className="learning-stat-icon"><FiClock aria-hidden="true" /></span>
                        <div><strong>{String(inProgressCourses.length).padStart(2, "0")}</strong><span>In progress</span></div>
                    </div>
                    <div className="learning-stat">
                        <span className="learning-stat-icon"><FiCheckCircle aria-hidden="true" /></span>
                        <div><strong>{String(completedCourses.length).padStart(2, "0")}</strong><span>Completed</span></div>
                    </div>
                </section>

                <section className="learning-section" aria-labelledby="enrolled-heading">
                    <div className="learning-section-heading">
                        <div>
                            <p className="learning-eyebrow">Pick up where you left off</p>
                            <h2 id="enrolled-heading">My Enrolled Courses</h2>
                        </div>
                        <span>{currentCourses.length} {currentCourses.length === 1 ? "course" : "courses"}</span>
                    </div>
                    {currentCourses.length ? (
                        <div className="learning-course-grid">
                            {currentCourses.map((course, index) => renderCourseCard(course, index === 0))}
                        </div>
                    ) : (
                        <div className="learning-empty-state">
                            <FiBookOpen aria-hidden="true" />
                            <h3>Your learning journey starts here</h3>
                            <p>Explore the courses below and enrol in one to get started.</p>
                        </div>
                    )}

                </section>

                <section className="learning-section learning-section--completed" id="certificates" aria-labelledby="completed-heading">
                    <div className="learning-section-heading">
                        <div>
                            <p className="learning-eyebrow">Your achievements</p>
                            <h2 id="achievements"><span id="completed-heading">Completed Courses</span></h2>
                        </div>
                        <span>{completedCourses.length} completed</span>
                    </div>
                    {completedCourses.length ? (
                        <div className="learning-completed-list">
                            {completedCourses.map((course) => (
                                <button
                                    className="learning-completed-item"
                                    key={course.id}
                                    type="button"
                                    aria-label={`View completed modules in ${course.title}`}
                                    onClick={() => openCourse(course)}
                                >
                                    <img src={course.image} alt="" loading="lazy" />
                                    <div>
                                        <h3>{course.title}</h3>
                                        <p>100% completed · Certificate available · View modules</p>
                                    </div>
                                    <FiCheckCircle className="learning-completed-check" aria-label="Completed" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="learning-section-empty">Finish all lessons in a course to earn your first certificate.</p>
                    )}
                </section>

                <section className="learning-section learning-section--explore" aria-labelledby="explore-heading">
                    <div className="learning-section-heading">
                        <div>
                            <p className="learning-eyebrow">Keep growing</p>
                            <h2 id="explore-heading">Explore More Courses</h2>
                            <p>Discover new skills and enrol in another course.</p>
                        </div>
                    </div>
                    {availableCourses.length ? (
                        <div className="learning-course-grid learning-course-grid--explore">
                            {availableCourses.map((course) => (
                                <article className="learning-explore-card" key={course.id}>
                                    <button
                                        className="learning-explore-image-button"
                                        type="button"
                                        onClick={() => openCourseOverview(course)}
                                        aria-label={`View ${course.title} course overview`}
                                    >
                                        <img src={course.image} alt="" loading="lazy" />
                                    </button>
                                    <div className="learning-explore-content">
                                        <p className="learning-course-kicker">{course.difficulty} <span aria-hidden="true">·</span> {course.duration}</p>
                                        <button className="learning-explore-title" type="button" onClick={() => openCourseOverview(course)}>
                                            {course.title}
                                        </button>
                                        <p className="learning-course-description">{course.description}</p>
                                        <div className="learning-explore-meta">
                                            <span><FiUser aria-hidden="true" /> {course.instructor}</span>
                                            <span><FiBookOpen aria-hidden="true" /> {course.lessons.length} lessons</span>
                                        </div>
                                        <button className="learning-secondary-button" type="button" onClick={() => openCourseOverview(course)}>
                                            View course
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="learning-empty-state learning-empty-state--compact">
                            <FiCheckCircle aria-hidden="true" />
                            <p>You are enrolled in every available course. Check back soon for more.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Courses;
