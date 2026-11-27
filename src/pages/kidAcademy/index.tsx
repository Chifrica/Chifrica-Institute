import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowRight,
    FiAward,
    FiCheck,
    FiChevronDown,
    FiCode,
    FiCpu,
    FiGrid,
    FiGlobe,
    FiPlay,
    FiStar,
    FiUsers,
} from "react-icons/fi";
import "./style.css";

const ageGroups = [
    {
        id: "explorers",
        ages: "Ages 5–8",
        title: "Little Explorers",
        description: "Build curiosity through stories, games, colours and simple problem-solving.",
        icon: FiStar,
        accent: "yellow",
        courses: ["Creative Coding", "Logic Games", "Digital Storytelling"],
    },
    {
        id: "coders",
        ages: "Ages 9–12",
        title: "Young Coders",
        description: "Create games, websites and animations with guided, hands-on projects.",
        icon: FiCode,
        accent: "mint",
        courses: ["Scratch", "Python Starter", "Web Basics"],
    },
    {
        id: "innovators",
        ages: "Ages 13–17",
        title: "Future Innovators",
        description: "Explore real-world technology, robotics, AI and independent creation.",
        icon: FiCpu,
        accent: "blue",
        courses: ["Python", "AI Foundations", "Robotics"],
    },
];

const learningPaths = [
    {
        title: "Scratch & Game Design",
        description: "Turn imagination into animated stories and playable games.",
        icon: FiGrid,
        level: "Beginner",
        accent: "yellow",
    },
    {
        title: "Web Creators",
        description: "Design colourful websites and publish a first project.",
        icon: FiGlobe,
        level: "Beginner",
        accent: "mint",
    },
    {
        title: "Python Explorers",
        description: "Learn real coding while solving fun, practical challenges.",
        icon: FiCode,
        level: "Intermediate",
        accent: "blue",
    },
    {
        title: "Robotics Studio",
        description: "Build, test and programme intelligent machines.",
        icon: FiCpu,
        level: "Advanced",
        accent: "purple",
    },
];

const KidsAcademy = () => {
    const navigate = useNavigate();
    const [activeAge, setActiveAge] = useState("coders");
    const [openFaq, setOpenFaq] = useState(0);
    const selectedAge = ageGroups.find((group) => group.id === activeAge) ?? ageGroups[1];

    return (
        <main className="kids-academy">
            <section className="kids-hero">
                <div className="kids-hero-copy">
                    <p className="kids-kicker"><span><FiStar aria-hidden="true" /></span> Chifrica Kids Academy</p>
                    <h1>Big ideas begin with a little <em>curiosity.</em></h1>
                    <p className="kids-hero-description">
                        A joyful, guided technology programme where children learn to code,
                        design, build and think confidently.
                    </p>
                    <div className="kids-hero-actions">
                        <button type="button" className="kids-primary-action" onClick={() => navigate("/courses")}>
                            Find a course <FiArrowRight aria-hidden="true" />
                        </button>
                        <button type="button" className="kids-video-action" onClick={() => document.querySelector(".kids-learning")?.scrollIntoView({ behavior: "smooth" })}>
                            <span><FiPlay aria-hidden="true" /></span> How we learn
                        </button>
                    </div>
                    <div className="kids-trust-row">
                        <span><FiUsers aria-hidden="true" /> 500+ young learners</span>
                        <span><FiAward aria-hidden="true" /> Project-based learning</span>
                    </div>
                </div>

                <div className="kids-hero-art" aria-label="A young learner discovering technology">
                    <div className="kids-art-dots" aria-hidden="true" />
                    <div className="kids-art-orbit orbit-one" aria-hidden="true" />
                    <div className="kids-art-orbit orbit-two" aria-hidden="true" />
                    <img
                        src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85"
                        alt="Children enjoying a classroom learning activity"
                    />
                    {/* <div className="kids-float-card kids-float-progress">
                        <span>Today's progress</span>
                        <strong>Game Builder</strong>
                        <div><i /></div>
                        <small>3 of 4 steps complete</small>
                    </div> */}
                    {/* <div className="kids-float-card kids-float-badge">
                        <FiAward aria-hidden="true" />
                        <div><strong>New badge!</strong><span>Creative Coder</span></div>
                    </div> */}
                </div>
            </section>

            <section className="kids-age-finder" aria-labelledby="kids-age-title">
                <div className="kids-section-heading">
                    <p>CHOOSE A LEARNING ADVENTURE</p>
                    <h2 id="kids-age-title">Made for every stage</h2>
                </div>
                <div className="kids-age-tabs" role="tablist" aria-label="Learning age groups">
                    {ageGroups.map((group) => {
                        const Icon = group.icon;
                        return (
                            <button
                                key={group.id}
                                type="button"
                                role="tab"
                                aria-selected={activeAge === group.id}
                                className={`${group.accent}${activeAge === group.id ? " is-active" : ""}`}
                                onClick={() => setActiveAge(group.id)}
                            >
                                <Icon aria-hidden="true" />
                                <span><small>{group.ages}</small><strong>{group.title}</strong></span>
                            </button>
                        );
                    })}
                </div>
                <div className="kids-age-result" role="tabpanel">
                    <div>
                        <p>{selectedAge.ages}</p>
                        <h3>{selectedAge.title}</h3>
                        <span>{selectedAge.description}</span>
                    </div>
                    <ul>
                        {selectedAge.courses.map((course) => (
                            <li key={course}><FiCheck aria-hidden="true" /> {course}</li>
                        ))}
                    </ul>
                    <button type="button" onClick={() => navigate("/courses")}>
                        Explore learning path <FiArrowRight aria-hidden="true" />
                    </button>
                </div>
            </section>

            <section className="kids-learning" aria-labelledby="kids-learning-title">
                <div className="kids-section-heading">
                    <p>POPULAR PROGRAMMES</p>
                    <h2 id="kids-learning-title">Where will curiosity take you?</h2>
                </div>
                <div className="kids-path-grid">
                    {learningPaths.map((path) => {
                        const Icon = path.icon;
                        return (
                            <article className={`kids-path-card ${path.accent}`} key={path.title}>
                                <div className="kids-path-icon"><Icon aria-hidden="true" /></div>
                                <div className="kids-path-meta">
                                    <span>{path.level}</span>
                                    <span>Self-paced</span>
                                </div>
                                <h3>{path.title}</h3>
                                <p>{path.description}</p>
                                <button type="button" onClick={() => navigate("/courses")} aria-label={`Explore ${path.title}`}>
                                    View programme <FiArrowRight aria-hidden="true" />
                                </button>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="kids-challenge">
                <div className="kids-challenge-copy">
                    <p>THIS WEEK'S CHALLENGE</p>
                    <h2>Can you build a <em>mini robot race?</em></h2>
                    <span>Join students across the academy and earn your Builder Badge.</span>
                </div>
                <div className="kids-challenge-board">
                    <div className="kids-challenge-number"><strong>48</strong><span>hours left</span></div>
                    <div className="kids-challenge-progress">
                        <span>Community progress</span>
                        <strong>72%</strong>
                        <div><i /></div>
                    </div>
                    <button type="button" onClick={() => navigate("/register")}>
                        Join the challenge <FiArrowRight aria-hidden="true" />
                    </button>
                </div>
            </section>

            <section className="kids-trust">
                <div className="kids-section-heading">
                    <p>WHY FAMILIES CHOOSE US</p>
                    <h2>Learning that feels exciting—and stays meaningful</h2>
                </div>
                <div className="kids-trust-grid">
                    <article>
                        <span><FiGrid aria-hidden="true" /></span>
                        <h3>Learn through play</h3>
                        <p>Lessons become adventures through games, challenges and creative projects.</p>
                    </article>
                    <article>
                        <span><FiUsers aria-hidden="true" /></span>
                        <h3>Supportive instructors</h3>
                        <p>Patient mentors guide every learner and celebrate progress at every stage.</p>
                    </article>
                    <article>
                        <span><FiAward aria-hidden="true" /></span>
                        <h3>Real achievements</h3>
                        <p>Complete projects, earn badges and build a portfolio children are proud to share.</p>
                    </article>
                </div>
            </section>

            <section className="kids-faq">
                <div className="kids-section-heading">
                    <p>PARENT QUESTIONS</p>
                    <h2>Everything you need to know</h2>
                </div>
                {[
                    ["Does my child need coding experience?", "No. Each programme begins with age-appropriate activities and introduces new concepts step by step."],
                    ["What does a typical class include?", "A lesson combines a short concept activity, guided practice, independent creation and a friendly progress review."],
                    ["Can I follow my child's progress?", "Yes. Families receive clear updates on completed work, achievements and the next recommended learning stage."],
                ].map(([question, answer], index) => (
                    <article className={openFaq === index ? "is-open" : ""} key={question}>
                        <button type="button" aria-expanded={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                            <span>{question}</span>
                            <FiChevronDown aria-hidden="true" />
                        </button>
                        {openFaq === index && <p>{answer}</p>}
                    </article>
                ))}
            </section>

            <section className="kids-final-cta">
                <div>
                    <p>THE NEXT BIG IDEA COULD BE THEIRS</p>
                    <h2>Ready for their technology journey?</h2>
                </div>
                <button type="button" onClick={() => navigate("/register")}>
                    Enrol a young learner <FiArrowRight aria-hidden="true" />
                </button>
            </section>
        </main>
    );
};

export default KidsAcademy;
