import { useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiClock, FiSearch, FiShare2 } from "react-icons/fi";
import "./style.css";

type Article = {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    slug: string;
    author: string;
};

const articleContent: Record<number, { intro: string; sections: Array<{ heading: string; paragraphs: string[] }> }> = {
    1: {
        intro: "Technology education is most powerful when it moves beyond theory and gives learners the confidence to solve meaningful problems.",
        sections: [
            { heading: "Learning by building", paragraphs: ["Our emerging technology programme combines guided instruction with practical studio work. Learners explore artificial intelligence, data, and modern digital tools through projects that reflect real professional situations.", "Instead of focusing only on definitions and demonstrations, students are challenged to test ideas, examine limitations, and communicate what they discover."] },
            { heading: "Responsible innovation", paragraphs: ["Responsible use is central to the programme. Students discuss privacy, fairness, accessibility, and the consequences that technology can have for individuals and communities.", "By asking not only whether a solution works, but whether it should be used, learners develop judgement alongside technical ability."] },
            { heading: "What comes next", paragraphs: ["Graduates leave with a portfolio of practical work, a stronger understanding of emerging tools, and the confidence to keep learning as the industry changes."] },
        ],
    },
    2: {
        intro: "The first role in software development requires more than a familiar programming language.",
        sections: [
            { heading: "Communication is a technical skill", paragraphs: ["Employers value developers who can explain decisions, ask useful questions, and document their work clearly. Strong communication helps teams reduce misunderstandings and build better products."] },
            { heading: "Know how to investigate", paragraphs: ["Entry-level developers are expected to reason through a problem, use available resources, test assumptions, and learn independently. Curiosity is often as valuable as prior experience."] },
            { heading: "Present your process", paragraphs: ["A strong portfolio shows the journey behind an outcome: the problem, the constraints, the implementation choices, and the lessons learned. This gives employers a clearer picture of how you work."] },
        ],
    },
    3: {
        intro: "Every confident creator begins by making the first imperfect project.",
        sections: [
            { heading: "Start with a small problem", paragraphs: ["Our students learn to narrow an idea into a realistic first build. Working at a manageable scale creates momentum and makes feedback easier to apply.", "Their early projects also teach an important lesson: progress is built through repetition, reflection, and revision."] },
            { heading: "Feedback creates growth", paragraphs: ["Peer reviews and instructor feedback help students see their work with fresh eyes. They learn to distinguish personal preference from user needs and to explain the reasons behind their choices."] },
            { heading: "Confidence through evidence", paragraphs: ["As work becomes more polished, confidence becomes evidence-based. Each completed project proves that uncertainty can be moved through, not avoided."] },
        ],
    },
    4: {
        intro: "Human-centred design begins with the belief that learning environments should serve people, not merely deliver information.",
        sections: [
            { heading: "Empathy before features", paragraphs: ["Understanding a learner's goals, frustrations, and context leads to better decisions. It also prevents institutions from designing around assumptions rather than experience."] },
            { heading: "Design for access", paragraphs: ["Clear language, adaptable interfaces, usable materials, and multiple ways to participate make education more inclusive. Accessibility is a foundation, not a final checklist."] },
            { heading: "Listen and improve", paragraphs: ["A human-centred institution treats feedback as a continuous design tool. Small observations can lead to more thoughtful lessons and a stronger learning experience."] },
        ],
    },
    5: {
        intro: "Chifrica Innovation Week created a shared space for practical learning, honest conversation, and ambitious ideas.",
        sections: [
            { heading: "Ideas became demonstrations", paragraphs: ["Students and instructors presented projects across disciplines, turning concepts into examples that could be seen, discussed, and tested.", "The week encouraged participants to explain not just what they built, but why it mattered."] },
            { heading: "A wider community", paragraphs: ["Industry guests brought professional perspective to the programme. Their questions challenged learners to consider scalability, usability, teamwork, and long-term impact."] },
            { heading: "Celebrating the process", paragraphs: ["The event highlighted persistence as much as achievement. Every useful prototype began with questions, experiments, and revised assumptions."] },
        ],
    },
    6: {
        intro: "A portfolio is not simply a gallery of completed work. It is a clear record of how you think, build, and improve.",
        sections: [
            { heading: "Choose quality and range", paragraphs: ["Select projects that demonstrate relevant skills without filling the portfolio with unfinished work. A small number of thoughtful examples is often stronger than a long list."] },
            { heading: "Explain your decisions", paragraphs: ["Describe the problem, your role, the tools used, and the trade-offs you considered. Outcomes give a project value, but context shows how you reached them."] },
            { heading: "Keep improving it", paragraphs: ["Review older projects regularly, update details, and add reflections. A portfolio grows most naturally when it remains connected to the work you are doing now."] },
        ],
    },
};

const categories = ["All Stories", "Campus Life", "Technology", "Careers", "Student Voices"];

const articles: Article[] = [
    {
        id: 1,
        title: "Inside Our New AI and Emerging Technology Programme",
        excerpt: "How practical projects, expert mentorship, and responsible innovation are preparing the next generation of African technology leaders.",
        category: "Technology",
        date: "November 18, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
        slug: "inside-our-new-ai-and-emerging-technology-programme",
        author: "Chifrica Editorial Team",
    },
    {
        id: 2,
        title: "Five Skills Employers Look for in Entry-Level Developers",
        excerpt: "Beyond writing code: the professional habits that help graduates stand out in a competitive digital workforce.",
        category: "Careers",
        date: "November 12, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
        slug: "five-skills-employers-look-for-in-entry-level-developers",
        author: "Career Development Team",
    },
    {
        id: 3,
        title: "From First Project to Confident Creator",
        excerpt: "Meet a group of students who transformed curiosity into polished digital products through project-based learning.",
        category: "Student Voices",
        date: "November 5, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85",
        slug: "from-first-project-to-confident-creator",
        author: "Student Success Team",
    },
    {
        id: 4,
        title: "Why Human-Centred Design Matters in Education",
        excerpt: "A closer look at empathy, accessibility, and inclusive thinking in modern teaching and learning.",
        category: "Technology",
        date: "October 29, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85",
        slug: "why-human-centred-design-matters-in-education",
        author: "Learning Design Team",
    },
    {
        id: 5,
        title: "A Week of Ideas at Chifrica Innovation Week",
        excerpt: "Students, instructors, and industry guests came together to learn, build, share, and celebrate progress.",
        category: "Campus Life",
        date: "October 21, 2026",
        readTime: "3 min read",
        image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=85",
        slug: "a-week-of-ideas-at-chifrica-innovation-week",
        author: "Campus Community",
    },
    {
        id: 6,
        title: "Building a Strong Portfolio Before Graduation",
        excerpt: "A practical guide to documenting your work, explaining decisions, and presenting outcomes with confidence.",
        category: "Careers",
        date: "October 14, 2026",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85",
        slug: "building-a-strong-portfolio-before-graduation",
        author: "Career Development Team",
    },
];

const ArticlePage = ({ article }: { article: Article }) => {
    const content = articleContent[article.id];
    const related = articles.filter((item) => item.id !== article.id).slice(0, 3);

    const shareArticle = async () => {
        if (navigator.share) {
            await navigator.share({ title: article.title, url: window.location.href });
        } else {
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <main className="blog-article-page">
            <header className="blog-article-hero">
                <div>
                    <Link className="blog-back-link" to="/blog"><FiArrowLeft aria-hidden="true" /> Back to journal</Link>
                    <p className="blog-eyebrow">{article.category}</p>
                    <h1>{article.title}</h1>
                    <p className="blog-article-deck">{article.excerpt}</p>
                    <div className="blog-article-meta">
                        <span>By {article.author}</span>
                        <span><FiCalendar aria-hidden="true" />{article.date}</span>
                        <span><FiClock aria-hidden="true" />{article.readTime}</span>
                        <button type="button" onClick={() => void shareArticle()} aria-label="Share article">
                            <FiShare2 aria-hidden="true" /> Share
                        </button>
                    </div>
                </div>
            </header>

            <article className="blog-article">
                <img className="blog-article-cover" src={article.image} alt="" />
                <div className="blog-article-body">
                    <p className="blog-article-intro">{content.intro}</p>
                    {content.sections.map((section) => (
                        <section key={section.heading}>
                            <h2>{section.heading}</h2>
                            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </section>
                    ))}
                </div>
            </article>

            <aside className="blog-related" aria-label="Related articles">
                <p className="blog-eyebrow">CONTINUE READING</p>
                <h2>More from the journal</h2>
                <div className="blog-related-grid">
                    {related.map((item) => (
                        <Link className="blog-related-card" to={`/blog/${item.slug}`} key={item.id}>
                            <img src={item.image} alt="" />
                            <div>
                                <span>{item.category}</span>
                                <h3>{item.title}</h3>
                                <p>{item.readTime}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </aside>
        </main>
    );
};

const Blog = () => {
    const { slug } = useParams<{ slug?: string }>();
    const [activeCategory, setActiveCategory] = useState("All Stories");
    const [search, setSearch] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    if (slug) {
        const article = articles.find((item) => item.slug === slug);
        return article
            ? <ArticlePage article={article} />
            : (
                <main className="blog-empty blog-article-missing">
                    <h1>Story not found</h1>
                    <Link className="blog-back-link" to="/blog"><FiArrowLeft aria-hidden="true" /> Return to journal</Link>
                </main>
            );
    }

    const visibleArticles = useMemo(() => {
        const query = search.trim().toLowerCase();
        return articles.filter((article) => {
            const matchesCategory = activeCategory === "All Stories" || article.category === activeCategory;
            const matchesSearch = !query
                || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, search]);

    const featuredArticle = articles[0];
    const remainingArticles = visibleArticles.filter((article) => article.id !== featuredArticle.id);

    const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubscribed(true);
    };

    return (
        <main className="institution-blog">
            <header className="blog-hero">
                <div className="blog-hero-inner">
                    <p className="blog-eyebrow">CHIFRICA JOURNAL</p>
                    <h1>Ideas, stories &amp; progress</h1>
                    <p>Insights from our community of educators, innovators, and lifelong learners.</p>
                    <label className="blog-search">
                        <FiSearch aria-hidden="true" />
                        <span className="blog-visually-hidden">Search articles</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search the journal"
                        />
                    </label>
                </div>
            </header>

            <div className="blog-layout">
                <section className="blog-main" aria-label="Latest articles">
                    {!search && activeCategory === "All Stories" && (
                        <article className="blog-featured">
                            <Link to={`/blog/${featuredArticle.slug}`} className="blog-featured-image" aria-label={`Read ${featuredArticle.title}`}>
                                <img src={featuredArticle.image} alt="" />
                            </Link>
                            <div className="blog-featured-content">
                                <span className="blog-category">{featuredArticle.category}</span>
                                <h2><Link to={`/blog/${featuredArticle.slug}`}>{featuredArticle.title}</Link></h2>
                                <p>{featuredArticle.excerpt}</p>
                                <div className="blog-meta">
                                    <span><FiCalendar aria-hidden="true" />{featuredArticle.date}</span>
                                    <span><FiClock aria-hidden="true" />{featuredArticle.readTime}</span>
                                </div>
                                <Link className="blog-read-link" to={`/blog/${featuredArticle.slug}`}>
                                    Read story <FiArrowRight aria-hidden="true" />
                                </Link>
                            </div>
                        </article>
                    )}

                    <div className="blog-filters" aria-label="Filter articles">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                className={activeCategory === category ? "is-active" : ""}
                                aria-pressed={activeCategory === category}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {visibleArticles.length ? (
                        <div className="blog-grid">
                            {(search || activeCategory !== "All Stories" ? visibleArticles : remainingArticles).map((article) => (
                                <article className="blog-card" id={`article-${article.id}`} key={article.id}>
                                    <Link className="blog-card-image" to={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}>
                                        <img src={article.image} alt="" loading="lazy" />
                                        <span>{article.category}</span>
                                    </Link>
                                    <div className="blog-card-body">
                                        <div className="blog-meta">
                                            <span><FiCalendar aria-hidden="true" />{article.date}</span>
                                            <span>{article.readTime}</span>
                                        </div>
                                        <h3><Link to={`/blog/${article.slug}`}>{article.title}</Link></h3>
                                        <p>{article.excerpt}</p>
                                        <Link className="blog-card-link" to={`/blog/${article.slug}`}>
                                            Read article <FiArrowRight aria-hidden="true" />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="blog-empty">
                            <h2>No stories found</h2>
                            <p>Try another category or search term.</p>
                        </div>
                    )}
                </section>

                <aside className="blog-sidebar" aria-label="Blog information">
                    <section className="blog-newsletter">
                        <p className="blog-eyebrow">THE WEEKLY EDIT</p>
                        <h2>Stay curious.</h2>
                        <p>Get new stories, course updates, and learning resources delivered to your inbox.</p>
                        {subscribed ? (
                            <p className="blog-subscribed" role="status">Thank you for subscribing.</p>
                        ) : (
                            <form onSubmit={submitNewsletter}>
                                <label className="blog-visually-hidden" htmlFor="blog-email">Email address</label>
                                <input id="blog-email" type="email" placeholder="Email address" required />
                                <button type="submit">Subscribe <FiArrowRight aria-hidden="true" /></button>
                            </form>
                        )}
                    </section>

                    <section className="blog-popular">
                        <h2>Popular this month</h2>
                        {articles.slice(1, 4).map((article, index) => (
                            <Link to={`/blog/${article.slug}`} className="blog-popular-item" key={article.id}>
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                <div>
                                    <p>{article.category}</p>
                                    <h3>{article.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </section>

                    <section className="blog-quote">
                        <span aria-hidden="true">“</span>
                        <blockquote>Education is the bridge from possibility to purpose.</blockquote>
                        <p>Chifrica Institute</p>
                    </section>
                </aside>
            </div>
        </main>
    );
};

export default Blog;
