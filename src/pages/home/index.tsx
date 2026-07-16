import React from "react";
import Navbar from "../../components/navbars";
import Hero from "../../components/hero";
import Statistics from "../statistics";
import "./style.css";


const Home = () => {
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

                    <div className="course-grid">

                        <div className="course-card">
                            <img
                                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                                alt="Web Development"
                            />

                            <div className="course-content">
                                <span className="category">Web Development</span>

                                <h3>Complete HTML, CSS & JavaScript</h3>

                                <p>
                                    Learn to build responsive websites from scratch.
                                </p>

                                <div className="course-footer">
                                    <span>⭐⭐⭐⭐⭐</span>

                                    <button>Enroll Now</button>
                                </div>
                            </div>
                        </div>

                        <div className="course-card">
                            <img
                                src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600"
                                alt="React Native"
                            />

                            <div className="course-content">
                                <span className="category">
                                    Mobile Development
                                </span>

                                <h3>React Native and Flutter Bootcamp</h3>

                                <p>
                                    Build Android and iOS apps using React Native and Flutter.
                                </p>

                                <div className="course-footer">
                                    <span>⭐⭐⭐⭐⭐</span>

                                    <button>Enroll Now</button>
                                </div>
                            </div>
                        </div>

                        <div className="course-card">
                            <img
                                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600"
                                alt="Artificial Intelligence"
                            />

                            <div className="course-content">
                                <span className="category">
                                    Artificial Intelligence
                                </span>

                                <h3>AI & Prompt Engineering</h3>

                                <p>
                                    Learn how to build and use modern AI tools.
                                </p>

                                <div className="course-footer">
                                    <span>⭐⭐⭐⭐⭐</span>

                                    <button>Enroll Now</button>
                                </div>
                            </div>
                        </div>

                    </div>

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

                    <button>Get Started Today</button>

                </section>

            </main>
        </>
    );
};

export default Home;