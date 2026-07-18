import "./style.css";

const statistics = [
    {
        number: "500+",
        title: "Active Students",
        icon: "🎓",
    },
    {
        number: "5+",
        title: "Professional Courses",
        icon: "📚",
    },
    {
        number: "6+",
        title: "Expert Instructors",
        icon: "👨‍🏫",
    },
    {
        number: "98%",
        title: "Success Rate",
        icon: "🏆",
    },
];

const Statistics = () => {
    return (
        <section className="statistics">
            <div className="stats-header">
                <h2>Our Impact</h2>
                <p>
                    Hundreds of students are learning and building successful
                    careers through Chifrica Institute.
                </p>
            </div>

            <div className="stats-grid">
                {statistics.map((item, index) => (
                    <div className="stat-card" key={index}>
                        <div className="stat-icon">{item.icon}</div>

                        <h3>{item.number}</h3>

                        <p>{item.title}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Statistics;