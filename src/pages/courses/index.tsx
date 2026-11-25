import { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiAward, FiBookOpen, FiCheckCircle, FiClock, FiUser, FiX } from "react-icons/fi";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { getCourseOverviewPath, getCourseSlug, type Course, type CourseModule, type CourseOverview, type LearningProgress } from "../../data/courses";
import { supabase } from "../../lib/supabase";
import {
    completeLesson,
    enrollInCourse,
    fetchAllLessonProgress,
    fetchCourseModules,
    fetchCourseOverviews,
    fetchPublishedCourses,
    fetchExam,
    submitExam,
    fetchPassedExamKeys,
    fetchEnrollments,
    type Exam,
} from "../../services/learning";
import { getCurrentProfileName, getCurrentUserId } from "../../auth";
import "./style.css";

const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [courseOverviews, setCourseOverviews] = useState<Record<string, CourseOverview>>({});
    const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
    const [progress, setProgress] = useState<LearningProgress>({});
    const [completedCourseIds, setCompletedCourseIds] = useState<Set<string>>(new Set());
    const [serverError, setServerError] = useState("");
    const [catalogError, setCatalogError] = useState("");
    const [overviewError, setOverviewError] = useState("");
    const [exam, setExam] = useState<Exam | null>(null);
    const [examOpen, setExamOpen] = useState(false);
    const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
    const [examResult, setExamResult] = useState<{ passed: boolean; score: number } | null>(null);
    const [examSubmitting, setExamSubmitting] = useState(false);
    const [passedExams, setPassedExams] = useState<Set<string>>(new Set());
    const [activeExamKind, setActiveExamKind] = useState<"checkpoint" | "final">("checkpoint");
    const [displayName, setDisplayName] = useState("Student");
    const [studentAuthenticated, setStudentAuthenticated] = useState(false);
    const [catalogLoading, setCatalogLoading] = useState(true);
    const [learningLoading, setLearningLoading] = useState(true);
    const [loadedModulesCourseId, setLoadedModulesCourseId] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);
    const { courseSlug, lessonNumber } = useParams<{ courseSlug: string; lessonNumber?: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let cancelled = false;
        const loadCatalog = async () => {
            try {
                if (!supabase) {
                    throw new Error("Supabase is not configured. Course data cannot be loaded.");
                }
                const publishedCourses = await fetchPublishedCourses();
                if (cancelled) {
                    return;
                }
                setCourses(publishedCourses);

                try {
                    const overviews = await fetchCourseOverviews();
                    if (!cancelled) {
                        setCourseOverviews(Object.fromEntries(overviews.map((overview) => [overview.course_id, overview])));
                    }
                } catch (error) {
                    console.error("Unable to load course overviews.", error);
                    if (!cancelled) {
                        setOverviewError(error instanceof Error ? error.message : "Course previews could not be loaded.");
                    }
                }
            } catch (error) {
                console.error("Unable to load course catalogue.", error);
                if (!cancelled) {
                    setCatalogError(error instanceof Error ? error.message : "Course data could not be loaded from Supabase.");
                }
            } finally {
                if (!cancelled) {
                    setCatalogLoading(false);
                }
            }
        };

        void loadCatalog();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const loadStudentLearning = async () => {
            try {
                if (!supabase) {
                    throw new Error("Supabase is not configured. Learning data cannot be loaded.");
                }
                const userId = await getCurrentUserId();
                if (!userId) {
                    if (!cancelled) {
                        setStudentAuthenticated(false);
                    }
                    return;
                }
                setStudentAuthenticated(true);
                const profileName = await getCurrentProfileName();
                const [serverProgress, enrollments, passedExamKeys] = await Promise.all([
                    fetchAllLessonProgress(userId),
                    fetchEnrollments(userId),
                    fetchPassedExamKeys(),
                ]);
                if (!cancelled) {
                    const enrollmentProgress = enrollments.reduce<LearningProgress>((result, enrollment) => {
                        result[enrollment.course_id] = serverProgress[enrollment.course_id] ?? [];
                        return result;
                    }, {});
                    setDisplayName(profileName);
                    setProgress(enrollmentProgress);
                    setCompletedCourseIds(new Set(
                        enrollments.filter((enrollment) => enrollment.status === "completed").map((enrollment) => enrollment.course_id),
                    ));
                    setPassedExams(new Set(passedExamKeys));
                }
            } catch (error) {
                console.error("Unable to load learning progress.", error);
                if (!cancelled) {
                    setServerError(error instanceof Error ? error.message : "Learning data could not be loaded from Supabase.");
                }
            } finally {
                if (!cancelled) {
                    setLearningLoading(false);
                }
            }
        };

        void loadStudentLearning();
        return () => {
            cancelled = true;
        };
    }, []);

    const activeCourse = courses.find(
        (course) => course.id === courseSlug || getCourseSlug(course.title) === courseSlug,
    );
    const isCourseOverview = lessonNumber === "overview";
    const isCourseEnrolled = Boolean(
        activeCourse && Object.prototype.hasOwnProperty.call(progress, activeCourse.id),
    );
    const getModuleCount = (course: Course) => courseOverviews[course.id]?.syllabus.length ?? 0;
    const getCompletedLessons = (course: Course) => {
        const completedIds = new Set(progress[course.id] ?? []);
        return Array.from({ length: getModuleCount(course) }, (_, index) =>
            completedIds.has(`lesson-${index + 1}`),
        ).filter(Boolean).length;
    };
    const enrolledCourses = courses.filter((course) =>
        Object.prototype.hasOwnProperty.call(progress, course.id),
    );
    const completedCourses = enrolledCourses.filter((course) => completedCourseIds.has(course.id));
    const currentCourses = enrolledCourses.filter((course) => !completedCourseIds.has(course.id));
    const inProgressCourses = currentCourses.filter((course) => getCompletedLessons(course) > 0);
    const activeOverview = activeCourse ? courseOverviews[activeCourse.id] : undefined;
    const moduleCount = activeCourse ? getModuleCount(activeCourse) : 0;
    const requestedLessonIndex = Number(lessonNumber) - 1;
    const firstIncompleteLessonIndex = activeCourse
        ? Array.from({ length: moduleCount }, (_, index) => index)
            .findIndex((index) => !(progress[activeCourse.id] ?? []).includes(`lesson-${index + 1}`))
        : -1;
    const activeLessonIndex = activeCourse
        ? lessonNumber && Number.isInteger(requestedLessonIndex) && requestedLessonIndex >= 0 && requestedLessonIndex < moduleCount
            ? firstIncompleteLessonIndex >= 0
                ? Math.min(requestedLessonIndex, firstIncompleteLessonIndex)
                : requestedLessonIndex
            : firstIncompleteLessonIndex >= 0 ? firstIncompleteLessonIndex : 0
        : 0;
    const activeModule = courseModules.find(
        (module) => module.course_id === activeCourse?.id && module.position === activeLessonIndex + 1,
    );
    const completedLessonIds = activeCourse ? new Set(progress[activeCourse.id] ?? []) : new Set<string>();
    const isActiveLessonComplete = Boolean(activeCourse && completedLessonIds.has(`lesson-${activeLessonIndex + 1}`));

    useEffect(() => {
        if (!courseSlug || learningLoading || !activeCourse || isCourseOverview || !isCourseEnrolled) {
            return;
        }

        let cancelled = false;
        void fetchCourseModules(activeCourse.id)
            .then((modules) => {
                if (!cancelled) {
                    setCourseModules(modules);
                }
            })
            .catch((error: unknown) => {
                console.error("Unable to load course modules.", error);
                if (!cancelled) {
                    setServerError(error instanceof Error ? error.message : "Course modules could not be loaded.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoadedModulesCourseId(activeCourse.id);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [courseSlug, learningLoading, activeCourse, isCourseOverview, isCourseEnrolled]);

    const enroll = async (targetCourseId: string) => {
        const course = courses.find((item) => item.id === targetCourseId);
        if (!course) {
            setServerError("The selected course is no longer available.");
            return;
        }
        if (!studentAuthenticated) {
            const returnTo = encodeURIComponent(getCourseOverviewPath(course));
            navigate(`/login?returnTo=${returnTo}`);
            return;
        }

        setEnrolling(true);
        setServerError("");
        try {
            await enrollInCourse(targetCourseId);
            setProgress((current) => ({ ...current, [targetCourseId]: [] }));
            navigate(`/courses/${getCourseSlug(course.title)}/1`);
        } catch (error) {
            console.error("Unable to enrol in course.", error);
            setServerError(error instanceof Error ? error.message : "Enrolment could not be saved.");
        } finally {
            setEnrolling(false);
        }
    };

    const openCourse = (course: Course) => {
        const doneLessons = new Set(progress[course.id] ?? []);
        const firstIncomplete = Array.from({ length: getModuleCount(course) }, (_, index) =>
            !doneLessons.has(`lesson-${index + 1}`),
        ).findIndex(Boolean);
        navigate(`/courses/${getCourseSlug(course.title)}/${firstIncomplete < 0 ? 1 : firstIncomplete + 1}`);
    };

    const openLesson = (index: number) => {
        if (activeCourse) {
            navigate(`/courses/${getCourseSlug(activeCourse.title)}/${index + 1}`);
        }
    };

    const completeActiveLesson = () => {
        if (!activeCourse || isActiveLessonComplete) {
            return;
        }

        void completeLesson(activeCourse.id, activeLessonIndex + 1)
            .then(() => {
                setProgress((current) => ({
                    ...current,
                    [activeCourse.id]: [...new Set([...(current[activeCourse.id] ?? []), `lesson-${activeLessonIndex + 1}`])],
                }));
            })
            .catch((error: unknown) => {
                console.error("Unable to save lesson completion.", error);
                setServerError(error instanceof Error ? error.message : "Lesson completion could not be saved.");
            });
    };

    const openExam = async (kind: "checkpoint" | "final") => {
        if (!activeCourse) {
            return;
        }

        setActiveExamKind(kind);
        setExamAnswers({});
        setExamResult(null);
        setExamOpen(true);

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
            const result = await submitExam(exam.id, examAnswers);
            setExamResult(result);
            if (result.passed && activeCourse) {
                const key = activeExamKind === "final"
                    ? `${activeCourse.id}:final`
                    : `${activeCourse.id}:checkpoint:${activeLessonIndex + 1}`;
                setPassedExams((current) => new Set(current).add(key));
                if (activeExamKind === "final") {
                    setCompletedCourseIds((current) => new Set(current).add(activeCourse.id));
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
        const lessonCount = getModuleCount(course);
        const completedLessons = getCompletedLessons(course);
        const percentage = lessonCount ? Math.round((completedLessons / lessonCount) * 100) : 0;
        const isComplete = lessonCount > 0 && percentage === 100;

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
                        <span><FiBookOpen aria-hidden="true" /> {lessonCount} lessons</span>
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
                                {completedLessons} of {lessonCount} lessons completed
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
                    <p className="learning-module-list-heading">Topics <span>{moduleCount}</span></p>
                    {Array.from({ length: moduleCount }, (_, index) => {
                        const lesson = activeOverview?.syllabus[index]?.title ?? `Module ${index + 1}`;
                        const isComplete = completedLessonIds.has(`lesson-${index + 1}`);
                        const firstIncomplete = Array.from({ length: moduleCount }, (__, lessonIndex) =>
                            !completedLessonIds.has(`lesson-${lessonIndex + 1}`),
                        ).findIndex(Boolean);
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
                            Topic {activeLessonIndex + 1} of {moduleCount}
                        </p>
                        <h1 id="learning-topic-title">{activeModule?.title ?? activeOverview?.syllabus[activeLessonIndex]?.title}</h1>
                    </div>
                    <figure className="learning-topic-visual">
                        <img src={activeModule?.image_url || course.image} alt={`${course.title} course visual`} />
                        <figcaption>{course.title} · {course.instructor}</figcaption>
                    </figure>

                    <div className="learning-topic-content">
                        {loadedModulesCourseId !== course.id ? (
                            <p role="status">Loading module content...</p>
                        ) : activeModule?.content ? (
                            <p>{activeModule.content}</p>
                        ) : (
                            <p role="status">Learning content for this module has not been added yet.</p>
                        )}
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
                                && ((activeLessonIndex + 1) % 2 === 0 && activeLessonIndex + 1 < moduleCount)
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
                                && activeLessonIndex === moduleCount - 1
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
                                    || activeLessonIndex === moduleCount - 1
                                    || (
                                        (activeLessonIndex + 1) % 2 === 0
                                        && !passedExams.has(`${course.id}:checkpoint:${activeLessonIndex + 1}`)
                                    )
                                }
                                onClick={() => openLesson(activeLessonIndex + 1)}
                            >
                                {activeLessonIndex === moduleCount - 1 ? "Course complete" : "Next topic"}
                                {activeLessonIndex < moduleCount - 1 && <FiArrowRight aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </section>
    );

    if (courseSlug) {
        if (catalogLoading) {
            return (
                <div className="learning-dashboard learning-dashboard--reader">
                    <div className="learning-dashboard-inner">
                        <div className="learning-loading" role="status" aria-live="polite">
                            <span /><p>Loading course preview...</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (!activeCourse) {
            return (
                <div className="learning-dashboard learning-dashboard--reader">
                    <div className="learning-dashboard-inner">
                        <p className="learning-storage-error" role="alert">
                            {catalogError || "This course could not be found in the published course catalogue."}
                        </p>
                        <button className="learning-secondary-button" type="button" onClick={() => navigate("/courses")}>
                            Return to course catalogue
                        </button>
                    </div>
                </div>
            );
        }

        const canonicalCourseSlug = getCourseSlug(activeCourse.title);
        if (courseSlug !== canonicalCourseSlug) {
            return (
                <Navigate
                    to={`/courses/${canonicalCourseSlug}/${lessonNumber ?? "1"}`}
                    replace
                />
            );
        }

        if (isCourseOverview) {
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
                                    <p className="learning-overview-description">{activeOverview?.summary ?? activeCourse.description}</p>
                                    <div className="learning-course-meta">
                                        <span><FiUser aria-hidden="true" /> {activeCourse.instructor}</span>
                                        <span><FiBookOpen aria-hidden="true" /> {activeOverview?.syllabus.length ?? 0} modules</span>
                                    </div>

                                    <button
                                        className="learning-primary-button"
                                        type="button"
                                        disabled={enrolling || learningLoading}
                                        onClick={() => {
                                            if (isCourseEnrolled) {
                                                navigate(`/courses/${canonicalCourseSlug}/1`);
                                            } else {
                                                void enroll(activeCourse.id);
                                            }
                                        }}
                                    >
                                        {learningLoading
                                            ? "Loading your learning status..."
                                            : enrolling
                                                ? "Enrolling..."
                                                : isCourseEnrolled
                                                    ? "Continue learning"
                                                    : "Enrol and start learning"}
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
                                {activeOverview?.syllabus.length ? <ol>
                                    {activeOverview.syllabus.map((module) => (
                                        <li key={module.position}>
                                            <span>{String(module.position).padStart(2, "0")}</span>
                                            <strong>{module.title}</strong>
                                        </li>
                                    ))}
                                </ol> : (
                                    <p className="learning-section-empty" role={overviewError ? "alert" : undefined}>
                                        {overviewError || "The course outline is not available yet."}
                                    </p>
                                )}
                            </div>

                            {!!activeOverview?.outcomes.length && (
                                <section className="learning-overview-outcomes" aria-labelledby="course-outcomes-title">
                                    <h2 id="course-outcomes-title">What you’ll learn</h2>
                                    <ul className="learning-overview-outcomes-list">
                                        {activeOverview.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                                    </ul>
                                </section>
                            )}
                            <div className="learning-overview-feedback">
                                {overviewError && <p className="learning-storage-error" role="alert">{overviewError}</p>}
                            </div>
                        </section>
                    </div>
                </div>
            );
        }

        if (learningLoading) {
            return (
                <div className="learning-dashboard learning-dashboard--reader">
                    <div className="learning-dashboard-inner">
                        <div className="learning-loading" role="status" aria-live="polite">
                            <span /><p>Loading your course...</p>
                        </div>
                    </div>
                </div>
            );
        }

        if (!studentAuthenticated) {
            return (
                <Navigate
                    to={`/login?returnTo=${encodeURIComponent(location.pathname)}`}
                    replace
                />
            );
        }

        if (!isCourseEnrolled) {
            return <Navigate to={`/courses/${canonicalCourseSlug}/overview`} replace />;
        }

        return (
            <div className="learning-dashboard learning-dashboard--reader">
                <div className="learning-dashboard-inner">
                    {serverError && <p className="learning-storage-error" role="alert">{serverError}</p>}
                    {renderCourseReader(activeCourse)}
                </div>
            </div>
        );
    }

    if (learningLoading) {
        return (
            <div className="learning-dashboard">
                <div className="learning-dashboard-inner">
                    <div className="learning-loading" role="status" aria-live="polite">
                        <span />
                        <p>Loading your learning dashboard...</p>
                    </div>
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
                        <p className="learning-welcome-copy">Welcome {displayName}! Continue learning where you stopped.</p>
                    </div>
                </header>

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

            </div>
        </div>
    );
};

export default Courses;
