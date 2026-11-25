import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiBookOpen, FiClock, FiSearch } from "react-icons/fi";
import { getCourseOverviewPath, type Course } from "../../data/courses";
import { fetchPublishedCourses } from "../../services/learning";
import "./style.css";

const standardCategories = [
    "Popular",
    "Programming",
    "Design",
    "AI & Emerging Tech",
    "Professional Skills",
];

const getCategoryLabel = (category: string) => {
    const normalized = category.trim().toLowerCase();
    if (normalized.includes("program") || normalized.includes("development") || normalized === "web") {
        return "Programming";
    }
    if (normalized.includes("design")) {
        return "Design";
    }
    if (normalized.includes("ai") || normalized.includes("emerging") || normalized.includes("technology")) {
        return "AI & Emerging Tech";
    }
    if (normalized.includes("professional") || normalized.includes("business") || normalized.includes("career")) {
        return "Professional Skills";
    }
    return category.trim() || "Popular";
};

const CourseCatalog = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCategory = new URLSearchParams(location.search).get("category") ?? "All courses";

    useEffect(() => {
        let cancelled = false;
        void fetchPublishedCourses()
            .then((publishedCourses) => {
                if (!cancelled) {
                    setCourses(publishedCourses);
                }
            })
            .catch((loadError: unknown) => {
                console.error("Unable to load the course catalogue.", loadError);
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Courses could not be loaded.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const categories = useMemo(() => {
        const fromCourses = courses.map((course) => getCategoryLabel(course.category));
        return [...new Set([...standardCategories, ...fromCourses])];
    }, [courses]);

    const visibleCourses = useMemo(() => {
        const query = search.trim().toLowerCase();
        return courses.filter((course) => {
            const matchesCategory = selectedCategory === "All courses"
                || (selectedCategory === "Popular"
                    ? getCategoryLabel(course.category) === "Popular"
                    : getCategoryLabel(course.category) === selectedCategory);
            const matchesSearch = !query
                || `${course.title} ${course.description} ${course.instructor}`.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [courses, search, selectedCategory]);

    const chooseCategory = (category: string) => {
        navigate(category === "All courses" ? "/courses" : `/courses?category=${encodeURIComponent(category)}`);
    };

    return (
        <main className="course-catalog">
            <header className="course-catalog-hero">
                <p className="course-catalog-eyebrow">LEARN SOMETHING NEW</p>
                <h1>Explore courses</h1>
                <p>Find practical courses in programming, design, emerging technology, and more.</p>
                <label className="course-catalog-search">
                    <FiSearch aria-hidden="true" />
                    <span className="course-catalog-visually-hidden">Search courses</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search courses, skills, or instructors"
                    />
                </label>
            </header>

            <section className="course-catalog-content" aria-label="Course catalogue">
                <div className="course-catalog-tabs" aria-label="Filter by course category">
                    {["All courses", ...categories].map((category) => (
                        <button
                            key={category}
                            type="button"
                            className={selectedCategory === category ? "is-active" : ""}
                            aria-pressed={selectedCategory === category}
                            onClick={() => chooseCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="course-catalog-heading">
                    <div>
                        <p className="course-catalog-eyebrow">COURSE LIBRARY</p>
                        <h2>{selectedCategory === "All courses" ? "All courses" : selectedCategory}</h2>
                    </div>
                    {!loading && !error && (
                        <span>{visibleCourses.length} {visibleCourses.length === 1 ? "course" : "courses"}</span>
                    )}
                </div>

                {loading ? (
                    <p className="course-catalog-state" role="status">Loading courses...</p>
                ) : error ? (
                    <p className="course-catalog-state" role="alert">Courses are temporarily unavailable.</p>
                ) : visibleCourses.length ? (
                    <div className="course-catalog-grid">
                        {visibleCourses.map((course) => (
                            <article className="course-catalog-card" key={course.id}>
                                <Link
                                    className="course-catalog-image"
                                    to={getCourseOverviewPath(course)}
                                    aria-label={`View ${course.title}`}
                                >
                                    {course.image ? <img src={course.image} alt="" loading="lazy" /> : <FiBookOpen aria-hidden="true" />}
                                    <span>{getCategoryLabel(course.category)}</span>
                                </Link>
                                <div className="course-catalog-card-body">
                                    <div className="course-catalog-meta">
                                        <span>{course.difficulty}</span>
                                        <span><FiClock aria-hidden="true" />{course.duration}</span>
                                    </div>
                                    <h3><Link to={getCourseOverviewPath(course)}>{course.title}</Link></h3>
                                    <p>{course.description}</p>
                                    <div className="course-catalog-card-footer">
                                        <span>{course.instructor}</span>
                                        <Link to={getCourseOverviewPath(course)}>View course</Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="course-catalog-empty">
                        <FiBookOpen aria-hidden="true" />
                        <h3>No matching courses</h3>
                        <p>Try another category or search term.</p>
                    </div>
                )}
            </section>
        </main>
    );
};

export default CourseCatalog;
