import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../../components/hero";
import Statistics from "../statistics";
import { getCourseOverviewPath, type Course } from "../../data/courses";
import { fetchPublishedCourses } from "../../services/learning";
import "./style.css";


const Home = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [coursesError, setCoursesError] = useState("");

    useEffect(() => {
        let cancelled = false;
        void fetchPublishedCourses()
            .then((publishedCourses) => {
                if (!cancelled) {
                    setCourses(publishedCourses);
                }
            })
            .catch((error: unknown) => {
                console.error("Unable to load courses for the home page.", error);
                if (!cancelled) {
                    setCoursesError(error instanceof Error ? error.message : "Courses could not be loaded.");
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setCoursesLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            {/* <Navbar /> */}

            <main className="home">

                <Hero />

                <Statistics />

                {/* Popular Courses Section */}
                <section className="courses-preview">

                    <div className="section-title">
                        <h2>Popular Courses</h2>

                        <p>
                            Start learning with our most popular technology courses
                            designed for beginners and professionals.
                        </p>
                    </div>

                    {coursesLoading ? (
                        <p className="home-courses-state" role="status">Loading courses...</p>
                    ) : coursesError ? (
                        <p className="home-courses-state" role="alert">Courses are temporarily unavailable.</p>
                    ) : courses.length ? (
                        <div className="course-grid">
                            {courses.map((course) => (
                                <article className="course-card" key={course.id}>
                                    <img src={course.image} alt="" loading="lazy" />
                                    <div className="course-content">
                                        <span className="category">{course.difficulty} · {course.duration}</span>
                                        <h3>{course.title}</h3>
                                        <p>{course.description}</p>
                                        <div className="course-footer">
                                            <span>{course.instructor}</span>
                                            <Link className="course-view-button" to={getCourseOverviewPath(course)}>
                                                View course
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="home-courses-state">No published courses are available right now.</p>
                    )}

                </section>

                {/* Why Choose Us */}

                <section className="why-us">

                    <div className="section-title">
                        <h2>Why Choose Chifrica Institute?</h2>
                    </div>

                    <div className="why-grid">

                        <div className="why-card">
                            💻
                            <h3>Hands-on Projects</h3>
                            <p>
                                Build real applications while learning.
                            </p>
                        </div>

                        <div className="why-card">
                            👨‍🏫
                            <h3>Expert Tutors</h3>
                            <p>
                                Learn from experienced software engineers.
                            </p>
                        </div>

                        <div className="why-card">
                            📜
                            <h3>Certificates</h3>
                            <p>
                                Receive certificates after completing courses.
                            </p>
                        </div>

                        <div className="why-card">
                            🌍
                            <h3>Study Anywhere</h3>
                            <p>
                                Learn anytime from your laptop or smartphone.
                            </p>
                        </div>

                    </div>

                </section>

                {/* Call To Action */}

                <section className="cta">

                    <h2>Ready to Start Your Tech Journey?</h2>

                    <p>
                        Join thousands of students learning programming with
                        Chifrica Institute.
                    </p>

                    <Link to="/login">
                        <button>Get Started Today</button>
                    </Link>

                </section>

            </main>
        </>
    );
};

export default Home;