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

            {/* ================= FEATURED COURSES ================= */}

            <section className="featured-courses">

                <div className="section-title">

                    <h2>Featured Coding Courses</h2>

                    <p>
                        Start with one of our most popular technology courses
                        specially designed for young learners.
                    </p>

                </div>

                <div className="courses-grid">

                    <div className="course-card">

                        <img
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                            alt="Scratch Programming"
                        />

                        <div className="course-info">

                            <span className="level beginner">
                                Beginner
                            </span>

                            <h3>Scratch Programming</h3>

                            <p>
                                Learn coding through games, animations and
                                storytelling.
                            </p>

                            <div className="course-footer">

                                <span>⭐ 4.9</span>

                                <span>👦 320 Students</span>

                            </div>

                            <button>
                                Start Learning
                            </button>

                        </div>

                    </div>

                    <div className="course-card">

                        <img
                            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"
                            alt="Python"
                        />

                        <div className="course-info">

                            <span className="level intermediate">
                                Intermediate
                            </span>

                            <h3>Python for Kids</h3>

                            <p>
                                Build exciting mini projects while learning Python.
                            </p>

                            <div className="course-footer">

                                <span>⭐ 4.8</span>

                                <span>👦 172 Students</span>

                            </div>

                            <button>
                                Start Learning
                            </button>

                        </div>

                    </div>

                    <div className="course-card">

                        <img
                            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800"
                            alt="Robotics"
                        />

                        <div className="course-info">

                            <span className="level advanced">
                                Advanced
                            </span>

                            <h3>Robotics for Kids</h3>

                            <p>
                                Design, build and program your own smart robots.
                            </p>

                            <div className="course-footer">

                                <span>⭐ 5.0</span>

                                <span>👦 70 Students</span>

                            </div>

                            <button>
                                Join Class
                            </button>

                        </div>

                    </div>

                </div>

            </section>

            {/* ================= ACHIEVEMENT BADGES ================= */}

            <section className="achievement-section">

                <div className="section-title">

                    <h2>Earn Amazing Rewards</h2>

                    <p>
                        Every lesson completed brings you closer to exciting
                        achievements.
                    </p>

                </div>

                <div className="badge-grid">

                    <div className="badge-card">

                        <div className="badge-icon">
                            🥇
                        </div>

                        <h3>Gold Coder</h3>

                        <p>
                            Complete 20 coding lessons.
                        </p>

                    </div>

                    <div className="badge-card">

                        <div className="badge-icon">
                            🚀
                        </div>

                        <h3>Rocket Builder</h3>

                        <p>
                            Finish your first programming project.
                        </p>

                    </div>

                    <div className="badge-card">

                        <div className="badge-icon">
                            🤖
                        </div>

                        <h3>Robot Master</h3>

                        <p>
                            Successfully complete the Robotics pathway.
                        </p>

                    </div>

                    <div className="badge-card">

                        <div className="badge-icon">
                            👑
                        </div>

                        <h3>Coding Champion</h3>

                        <p>
                            Finish every beginner course.
                        </p>

                    </div>

                </div>

            </section>

            {/* ================= WEEKLY CHALLENGE ================= */}

            <section className="weekly-challenge">

                <div className="challenge-content">

                    <div>

                        <h2>
                            🎯 Weekly Coding Challenge
                        </h2>

                        <p>
                            Build a simple game this week and win exciting
                            digital badges and certificates.
                        </p>

                    </div>

                    <button>
                        Join Challenge
                    </button>

                </div>

            </section>

            {/* ================= STUDENT LEADERBOARD ================= */}

            <section className="leaderboard">

                <div className="section-title">

                    <h2>🏆 Top Young Coders</h2>

                    <p>
                        Celebrate students who are making amazing progress.
                    </p>

                </div>

                <div className="leaderboard-grid">

                    <div className="leader-card">

                        <div className="rank">🥇</div>

                        <img
                            src="https://randomuser.me/api/portraits/girls/44.jpg"
                            alt="Student"
                        />

                        <h3>Sarah Johnson</h3>

                        <span>Python Explorer</span>

                        <h4>4,950 XP</h4>

                    </div>

                    <div className="leader-card">

                        <div className="rank">🥈</div>

                        <img
                            src="https://randomuser.me/api/portraits/boys/41.jpg"
                            alt="Student"
                        />

                        <h3>Daniel Smith</h3>

                        <span>Scratch Champion</span>

                        <h4>4,600 XP</h4>

                    </div>

                    <div className="leader-card">

                        <div className="rank">🥉</div>

                        <img
                            src="https://randomuser.me/api/portraits/girls/52.jpg"
                            alt="Student"
                        />

                        <h3>Grace Williams</h3>

                        <span>Web Designer</span>

                        <h4>4,350 XP</h4>

                    </div>

                </div>

            </section>

            {/* ================= PARENTS TESTIMONIALS ================= */}

            <section className="parents-section">

                <div className="section-title">

                    <h2>❤️ Parents Love Chifrica</h2>

                    <p>
                        Hear what parents are saying about their children's
                        learning experience.
                    </p>

                </div>

                <div className="testimonial-grid">

                    <div className="testimonial-card">

                        <p>
                            "My son now builds simple games on his own.
                            Chifrica made coding exciting and easy."
                        </p>

                        <h4>— Mrs. Okafor</h4>

                    </div>

                    <div className="testimonial-card">

                        <p>
                            "The teachers are patient and supportive.
                            My daughter looks forward to every lesson."
                        </p>

                        <h4>— Mr. Bello</h4>

                    </div>

                    <div className="testimonial-card">

                        <p>
                            "The weekly coding challenges keep my children
                            motivated to continue learning."
                        </p>

                        <h4>— Mrs. Ibrahim</h4>

                    </div>

                </div>

            </section>

            {/* ================= STUDENT PROJECT GALLERY ================= */}

            <section className="project-gallery">

                <div className="section-title">

                    <h2>🎨 Student Project Gallery</h2>

                    <p>
                        Amazing projects created by our young programmers.
                    </p>

                </div>

                <div className="gallery-grid">

                    <div className="gallery-card">

                        <img
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900"
                            alt="Project"
                        />

                        <h3>Drawing App</h3>

                    </div>

                    <div className="gallery-card">

                        <img
                            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900"
                            alt="Project"
                        />

                        <h3>Mini Game</h3>

                    </div>

                    <div className="gallery-card">

                        <img
                            src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=900"
                            alt="Project"
                        />

                        <h3>Robot Controller</h3>

                    </div>

                </div>

            </section>

            {/* ================= CALL TO ACTION ================= */}

            <section className="kids-cta">

                <div className="cta-box">

                    <h2>
                        🚀 Ready to Start Coding?
                    </h2>

                    <p>
                        Join thousands of children learning programming,
                        robotics, AI and web development with Chifrica
                        Institution.
                    </p>

                    <div className="cta-buttons">

                        <button className="join-btn">
                            Enroll Today
                        </button>

                        <button className="contact-btn">
                            Talk To An Advisor
                        </button>

                    </div>

                </div>

            </section>
        </div>
    );
};

export default KidsAcademy;