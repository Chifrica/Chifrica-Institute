import { useEffect, useRef, useState, type FocusEvent } from "react";
import "./style.css";
import { Link, useNavigate } from "react-router-dom";
import { FiAward, FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { AUTH_SESSION_KEY, clearAuthSession } from "../../auth";
import { supabase } from "../../lib/supabase";

const courseLinks = [
    { label: "Web & Software Development", category: "Programming" },
    { label: "Programming Languages", category: "Programming" },
    { label: "AI & Emerging Technologies", category: "AI & Emerging Tech" },
    { label: "Design & Professional Skills", category: "Design" },
    { label: "Upcoming Classes", category: "Upcoming Classes" },
    { label: "Self-Paced Learning", category: "Self-Paced Learning" },
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
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    const [logoutSuccessOpen, setLogoutSuccessOpen] = useState(false);
    const [authenticated, setAuthenticated] = useState(
        () => window.localStorage.getItem(AUTH_SESSION_KEY) !== null,
    );
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const syncAuthentication = () => {
            setAuthenticated(window.localStorage.getItem(AUTH_SESSION_KEY) !== null);
        };
        const closeOverlays = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setUserMenuOpen(false);
                setLogoutConfirmOpen(false);
            }
        };
        window.addEventListener("storage", syncAuthentication);
        window.addEventListener("keydown", closeOverlays);
        return () => {
            window.removeEventListener("storage", syncAuthentication);
            window.removeEventListener("keydown", closeOverlays);
        };
    }, []);

    const closeNavigation = () => {
        setMenuOpen(false);
        setOpenDropdown(null);
        setUserMenuOpen(false);
    };

    const confirmLogOut = () => {
        clearAuthSession();
        if (supabase) {
            void supabase.auth.signOut();
        }
        setAuthenticated(false);
        setLogoutConfirmOpen(false);
        setLogoutSuccessOpen(true);
        closeNavigation();
        navigate("/");
        window.setTimeout(() => setLogoutSuccessOpen(false), 2600);
    };

    const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
            setOpenDropdown(null);
        }
    };

    return (
        <>
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
                {authenticated && <Link to="/my-learning" onClick={closeNavigation}>My Learner</Link>}

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
                        onClick={() => {
                            closeNavigation();
                            navigate("/courses");
                        }}
                        onFocus={() => setOpenDropdown("courses")}
                    >
                        Courses <FiChevronDown aria-hidden="true" />
                    </button>
                    <div className="nav-dropdown-menu" id="courses-dropdown">
                        <p className="nav-dropdown-heading">Explore courses</p>
                        <div className="nav-dropdown-grid">
                            {courseLinks.map(({ label, category }) => (
                                <Link
                                    key={label}
                                    to={`/courses?category=${encodeURIComponent(category)}`}
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
                {authenticated && (
                    <div className="nav-mobile-account">
                        <button type="button" onClick={() => { closeNavigation(); navigate("/profile"); }}>
                            Profile
                        </button>
                        <button type="button" onClick={() => { closeNavigation(); navigate("/my-learning#achievements"); }}>
                            Achievements
                        </button>
                        <button type="button" onClick={() => { closeNavigation(); navigate("/my-learning#certificates"); }}>
                            Certificates
                        </button>
                        <button type="button" onClick={() => { setMenuOpen(false); setLogoutConfirmOpen(true); }}>
                            Logout
                        </button>
                    </div>
                )}
            </nav>

            <div className="nav-buttons">
                {authenticated ? (
                    <div className={`nav-user-dropdown${userMenuOpen ? " is-open" : ""}`}>
                        <button
                            className="nav-user-trigger"
                            type="button"
                            aria-expanded={userMenuOpen}
                            aria-controls="user-account-menu"
                            onClick={() => setUserMenuOpen((open) => !open)}
                        >
                            <span className="nav-user-avatar"><FiUser aria-hidden="true" /></span>
                            <span>User</span>
                            <FiChevronDown aria-hidden="true" />
                        </button>
                        <div className="nav-user-menu" id="user-account-menu">
                            <button type="button" onClick={() => { closeNavigation(); navigate("/profile"); }}>
                                <FiUser aria-hidden="true" />
                                <span><strong>Profile</strong><small>View your account</small></span>
                            </button>
                            <button type="button" onClick={() => { closeNavigation(); navigate("/my-learning#achievements"); }}>
                                <FiAward aria-hidden="true" />
                                <span><strong>Achievements</strong><small>Completed learning</small></span>
                            </button>
                            <button type="button" onClick={() => { closeNavigation(); navigate("/my-learning#certificates"); }}>
                                <FiAward aria-hidden="true" />
                                <span><strong>Certificates</strong><small>View earned certificates</small></span>
                            </button>
                            <button className="nav-user-logout" type="button" onClick={() => { setUserMenuOpen(false); setLogoutConfirmOpen(true); }}>
                                <FiLogOut aria-hidden="true" />
                                <span><strong>Logout</strong><small>End this session</small></span>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Link to="/login" onClick={closeNavigation}>
                            <button className="login-btn">Login</button>
                        </Link>

                        <Link to="/register" onClick={closeNavigation}>
                            <button className="register-btn">Get Started</button>
                        </Link>
                    </>
                )}
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

        {logoutConfirmOpen && (
            <div className="nav-modal-backdrop" role="presentation" onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    setLogoutConfirmOpen(false);
                }
            }}>
                <section className="nav-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="logout-confirm-title">
                    <span className="nav-confirm-icon"><FiLogOut aria-hidden="true" /></span>
                    <h2 id="logout-confirm-title">Log out of Chifrica?</h2>
                    <p>You will need to sign in again to continue your learning journey.</p>
                    <div className="nav-confirm-actions">
                        <button type="button" className="nav-confirm-cancel" onClick={() => setLogoutConfirmOpen(false)}>
                            Cancel
                        </button>
                        <button type="button" className="nav-confirm-yes" onClick={confirmLogOut}>
                            Yes, log out
                        </button>
                    </div>
                </section>
            </div>
        )}

        {logoutSuccessOpen && (
            <div className="nav-success-toast" role="status" aria-live="polite">
                <span><FiLogOut aria-hidden="true" /></span>
                <div>
                    <strong>Successfully logged out</strong>
                    <small>See you again soon.</small>
                </div>
            </div>
        )}
        </>
    );
};

export default Navbar;