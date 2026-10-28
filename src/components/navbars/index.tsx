import { useRef, useState, type FocusEvent } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

const courseLinks = [
    "Web & Software Development",
    "Programming Languages",
    "AI & Emerging Technologies",
    "Design & Professional Skills",
    "Upcoming Classes",
    "Self-Paced Learning",
];

const kidsAcademyLinks = [
    "Little Explorers (5–8)",
    "Young Coders (9–12)",
    "Future Innovators (13–17)",
    "Kids' Courses",
    "Coding Games & Challenges",
    "Projects & Achievements",
    "Parents & Guardians",
    "Explore Kids Academy",
];

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);

    const closeNavigation = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
    };

    const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
            setOpenDropdown(null);
        }
    };

    return (
        <header className="navbar">
            <div className="logo">
                <span className="logo-green">Chifrica</span>
                <span className="logo-dark"> Institute</span>
            </div>

            <nav
                className={menuOpen ? "nav-links active" : "nav-links"}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        if (openDropdown) {
                            const trigger = event.currentTarget.querySelector<HTMLButtonElement>(
                                ".nav-dropdown.is-open .nav-dropdown-trigger",
                            );
                            setOpenDropdown(null);
                            trigger?.focus();
                        } else if (menuOpen) {
                            setMenuOpen(false);
                            hamburgerRef.current?.focus();
                        }
                    }
                }}
            >
                <Link to="/" onClick={closeNavigation}>Home</Link>
                <Link to="/about" onClick={closeNavigation}>About</Link>

                <div
                    className={`nav-dropdown${openDropdown === "courses" ? " is-open" : ""}`}
                    onMouseEnter={() => setOpenDropdown("courses")}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onBlur={handleDropdownBlur}
                >
                    <button
                        className="nav-dropdown-trigger"
                        type="button"
                        aria-expanded={openDropdown === "courses"}
                        aria-controls="courses-dropdown"
                        onClick={() => setOpenDropdown(openDropdown === "courses" ? null : "courses")}
                        onFocus={() => setOpenDropdown("courses")}
                    >
                        Courses <FiChevronDown aria-hidden="true" />
                    </button>
                    <div className="nav-dropdown-menu" id="courses-dropdown">
                        <p className="nav-dropdown-heading">Explore courses</p>
                        <div className="nav-dropdown-grid">
                            {courseLinks.map((label) => (
                                <Link
                                    key={label}
                                    to="/courses"
                                    onClick={closeNavigation}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className={`nav-dropdown${openDropdown === "kids" ? " is-open" : ""}`}
                    onMouseEnter={() => setOpenDropdown("kids")}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onBlur={handleDropdownBlur}
                >
                    <button
                        className="nav-dropdown-trigger"
                        type="button"
                        aria-expanded={openDropdown === "kids"}
                        aria-controls="kids-dropdown"
                        onClick={() => setOpenDropdown(openDropdown === "kids" ? null : "kids")}
                        onFocus={() => setOpenDropdown("kids")}
                    >
                        Kids Academy <FiChevronDown aria-hidden="true" />
                    </button>
                    <div className="nav-dropdown-menu" id="kids-dropdown">
                        <p className="nav-dropdown-heading">Ages 5–17</p>
                        <div className="nav-dropdown-grid">
                            {kidsAcademyLinks.map((label) => (
                                <Link
                                    key={label}
                                    to="/kidAcademy"
                                    onClick={closeNavigation}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <Link to="/blog" onClick={closeNavigation}>Blog</Link>
                <Link to="/contact" onClick={closeNavigation}>Contact</Link>
            </nav>

            <div className="nav-buttons">
                <Link to="/login" onClick={closeNavigation}>
                    <button className="login-btn">Login</button>
                </Link>

                <Link to="/register" onClick={closeNavigation}>
                    <button className="register-btn">Get Started</button>
                </Link>
            </div>

            <button
                ref={hamburgerRef}
                className="hamburger"
                type="button"
                aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((isOpen) => !isOpen)}
            >
                ☰
            </button>
        </header>
    );
};

export default Navbar;