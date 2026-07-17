import React, { useState } from "react";
import "./style.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="logo">
                <span className="logo-green">Chifrica</span>
                <span className="logo-dark"> Institute</span>
            </div>

            <nav className={menuOpen ? "nav-links active" : "nav-links"}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/kidAcademy">Kids Academy</Link>
                <Link to="/blog">Blog</Link>
                <Link to="/contact">Contact</Link>
            </nav>

            <div className="nav-buttons">
                <Link to="/login">
                    <button className="login-btn">Login</button>
                </Link>

                <Link to="/register">
                    <button className="register-btn">Get Started</button>
                </Link>
            </div>

            <div
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                ☰
            </div>
        </header>
    );
};

export default Navbar;