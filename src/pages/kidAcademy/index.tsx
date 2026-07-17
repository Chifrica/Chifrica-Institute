import React from "react";
import "./style.css";

const KidsAcademy = () => {
    return (
        <div className="kids-page">

            {/* ================= HERO ================= */}

            <section className="kids-hero">

                <div className="kids-content">

                    <span className="hero-tag">
                        🌟 Welcome to Chifrica Kids Academy
                    </span>

                    <h1>
                        Learn Programming
                        <br />
                        Through Fun,
                        <span> Creativity </span>
                        & Adventure
                    </h1>

                    <p>
                        Coding isn't just for adults! Our fun and interactive
                        technology courses help children build confidence,
                        creativity, problem-solving skills and digital knowledge
                        from an early age.
                    </p>

                    <div className="hero-buttons">

                        <button className="explore-btn">
                            Explore Courses
                        </button>

                        <button className="watch-btn">
                            ▶ Watch Demo
                        </button>

                    </div>

                </div>

                <div className="kids-image">

                    <img
                        src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900"
                        alt="Kids Learning"
                    />

                    <div className="floating-card card1">
                        🚀 Fun Coding
                    </div>

                    <div className="floating-card card2">
                        🤖 Robotics
                    </div>

                    <div className="floating-card card3">
                        🎮 Coding Games
                    </div>

                </div>

            </section>

            {/* ================= AGE GROUPS ================= */}

            <section className="age-section">

                <div className="section-title">

                    <h2>Choose Your Learning Level</h2>

                    <p>
                        Every child learns differently. Select the perfect age
                        group to begin the journey.
                    </p>

                </div>

                <div className="age-grid">

                    <div className="age-card">

                        <div className="emoji">
                            🧸
                        </div>

                        <h3>Little Explorers</h3>

                        <h4>Ages 5 - 8</h4>

                        <p>
                            Learn through games, puzzles,
                            storytelling and colorful activities.
                        </p>

                        <button>
                            Start Learning
                        </button>

                    </div>

                    <div className="age-card">

                        <div className="emoji">
                            💻
                        </div>

                        <h3>Young Coders</h3>

                        <h4>Ages 9 - 12</h4>

                        <p>
                            Build websites, coding games,
                            animations and fun applications.
                        </p>

                        <button>
                            View Courses
                        </button>

                    </div>

                    <div className="age-card">

                        <div className="emoji">
                            🚀
                        </div>

                        <h3>Future Innovators</h3>

                        <h4>Ages 13 - 17</h4>

                        <p>
                            Learn Python, AI,
                            Mobile Apps, Web Development
                            and Robotics.
                        </p>

                        <button>
                            Enroll Now
                        </button>

                    </div>

                </div>

            </section>

            {/* ================= WHY KIDS LOVE CHIFRICA ================= */}

            <section className="why-kids">

                <div className="section-title">

                    <h2>Why Kids Love Chifrica</h2>

                    <p>
                        We make learning exciting through hands-on projects,
                        fun activities, games and creative challenges.
                    </p>

                </div>

                <div className="why-grid">

                    <div className="why-card">

                        <div className="why-icon">🎮</div>

                        <h3>Game-Based Learning</h3>

                        <p>
                            Every lesson feels like a game, making learning
                            programming enjoyable and engaging.
                        </p>

                    </div>

                    <div className="why-card">

                        <div className="why-icon">🏆</div>

                        <h3>Earn Rewards</h3>

                        <p>
                            Collect stars, badges and certificates as you complete
                            exciting coding challenges.
                        </p>

                    </div>

                    <div className="why-card">

                        <div className="why-icon">👩‍🏫</div>

                        <h3>Friendly Teachers</h3>

                        <p>
                            Learn from experienced instructors who make technology
                            simple and fun for every child.
                        </p>

                    </div>

                    <div className="why-card">

                        <div className="why-icon">🤝</div>

                        <h3>Team Projects</h3>

                        <p>
                            Work together with friends on exciting coding and
                            robotics projects.
                        </p>

                    </div>

                </div>

            </section>

            {/* ================= LEARNING PATHS ================= */}

            <section className="learning-paths">

                <div className="section-title">

                    <h2>Popular Learning Paths</h2>

                    <p>
                        Choose a learning adventure and grow your digital skills
                        step by step.
                    </p>

                </div>

                <div className="paths-grid">

                    <div className="path-card">

                        <span className="course-icon">🎨</span>

                        <h3>Scratch Programming</h3>

                        <p>
                            Create animations, stories and games using drag-and-drop
                            programming.
                        </p>

                        <button>Learn More</button>

                    </div>

                    <div className="path-card">

                        <span className="course-icon">🐍</span>

                        <h3>Python for Kids</h3>

                        <p>
                            Learn one of the world's most popular programming
                            languages in a fun way.
                        </p>

                        <button>Learn More</button>

                    </div>

                    <div className="path-card">

                        <span className="course-icon">🌐</span>

                        <h3>Web Development</h3>

                        <p>
                            Build beautiful websites with HTML, CSS and JavaScript.
                        </p>

                        <button>Learn More</button>

                    </div>

                    <div className="path-card">

                        <span className="course-icon">🤖</span>

                        <h3>Robotics</h3>

                        <p>
                            Discover how robots work through practical projects and
                            exciting experiments.
                        </p>

                        <button>Learn More</button>

                    </div>

                    <div className="path-card">

                        <span className="course-icon">🧠</span>

                        <h3>Artificial Intelligence</h3>

                        <p>
                            Explore the amazing world of AI with beginner-friendly
                            activities.
                        </p>

                        <button>Learn More</button>

                    </div>

                    <div className="path-card">

                        <span className="course-icon">📱</span>

                        <h3>Mobile App Development</h3>

                        <p>
                            Design and build your very first Android applications.
                        </p>

                        <button>Learn More</button>

                    </div>

                </div>

            </section>
        </div>
    );
};

export default KidsAcademy;