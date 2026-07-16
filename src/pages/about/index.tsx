import "./style.css";

const About = () => {
    return (
        <div className="about-page">

            {/* Hero Section */}

            <section className="about-hero">

                <div className="about-overlay">

                    <h1>About Chifrica Institute</h1>

                    <p>
                        Empowering Africa through technology education,
                        innovation, creativity and practical learning.
                    </p>

                </div>

            </section>

            {/* About */}

            <section className="about-section">

                <div className="about-image">

                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
                        alt="Students"
                    />

                </div>

                <div className="about-content">

                    <h2>Who We Are</h2>

                    <p>
                        Chifrica Institute is a technology academy
                        dedicated to equipping students, graduates, children,
                        entrepreneurs and professionals with practical digital
                        skills.
                    </p>

                    <p>
                        Our courses are designed to help learners become
                        confident software developers, designers,
                        AI specialists and digital innovators through
                        project-based learning.
                    </p>

                    <button>
                        Explore Courses
                    </button>

                </div>

            </section>

            {/* Mission */}

            <section className="mission">

                <div className="card">

                    <h2>🎯 Our Mission</h2>

                    <p>
                        To provide affordable, accessible and high-quality
                        technology education for everyone regardless of
                        background.
                    </p>

                </div>

                <div className="card">

                    <h2>🚀 Our Vision</h2>

                    <p>
                        To become Africa's leading technology Institute,
                        producing globally competitive software engineers
                        and innovators.
                    </p>

                </div>

            </section>

            {/* Why Choose */}

            <section className="why-us">

                <h2>Why Choose Chifrica Institute?</h2>

                <div className="features">

                    <div className="feature">
                        💻
                        <h3>Practical Learning</h3>
                        <p>
                            Build real-world applications while learning.
                        </p>
                    </div>

                    <div className="feature">
                        👨‍🏫
                        <h3>Expert Mentors</h3>
                        <p>
                            Learn directly from experienced professionals.
                        </p>
                    </div>

                    <div className="feature">
                        🌍
                        <h3>Learn Anywhere</h3>
                        <p>
                            Study from any device at your own pace.
                        </p>
                    </div>

                    <div className="feature">
                        📜
                        <h3>Certificates</h3>
                        <p>
                            Receive certificates after completing courses.
                        </p>
                    </div>

                </div>

            </section>

            {/* Statistics */}

            <section className="about-stats">

                <div className="stat">

                    <h1>20K+</h1>

                    <p>Students</p>

                </div>

                <div className="stat">

                    <h1>150+</h1>

                    <p>Courses</p>

                </div>

                <div className="stat">

                    <h1>80+</h1>

                    <p>Professional Tutors</p>

                </div>

                <div className="stat">

                    <h1>98%</h1>

                    <p>Success Rate</p>

                </div>

            </section>

            {/* CTA */}

            <section className="about-cta">

                <h2>
                    Ready to Begin Your Tech Journey?
                </h2>

                <p>
                    Join thousands of learners building the future with
                    Chifrica Institute.
                </p>

                <button>
                    Start Learning
                </button>

            </section>

        </div>
    );
};

export default About;