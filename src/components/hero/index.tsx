import "./style.css";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="hero">

            <div className="hero-left">

                <span className="hero-badge">
                    🚀 Learn. Build. Innovate.
                </span>

                <h1>
                    Learn Tech Skills That
                    <span> Build Your Future</span>
                </h1>

                <p>
                    Chifrica Institute is a technology academy  where
                    students, children, and aspiring developers can learn
                    Programming, Web Development, Mobile App Development,
                    Artificial Intelligence, UI/UX Design, Data Science,
                    Cybersecurity and more through interactive courses,
                    live classes and real-world projects.
                </p>

                <div className="hero-buttons">
                    <Link to="/register">
                        <button className="primary-btn">
                            Get Started
                        </button>
                    </Link>
                    <Link to="/courses">
                        <button className="secondary-btn">
                            Explore Courses
                        </button>
                    </Link>
                </div>

                <div className="hero-stats">

                    <div className="stat-box">
                        <h2>500+</h2>
                        <p>Students</p>
                    </div>

                    <div className="stat-box">
                        <h2>12+</h2>
                        <p>Courses</p>
                    </div>

                    <div className="stat-box">
                        <h2>98%</h2>
                        <p>Success Rate</p>
                    </div>

                </div>

            </div>

            <div className="hero-right">

                <div className="image-card">

                    <img
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700"
                        alt="Students Learning"
                    />

                    <div className="floating-card one">
                        💻 Web Development
                    </div>

                    <div className="floating-card two">
                        🤖 Artificial Intelligence
                    </div>

                    <div className="floating-card three">
                        📱 Mobile Development
                    </div>

                </div>

            </div>

        </section>
    );
};

export default Hero;