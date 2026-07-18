import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaWhatsapp,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaArrowRight,
} from "react-icons/fa";

import "./style.css";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* Left */}

                <div className="footer-about">

                    <h2>Chifrica Institute</h2>

                    <p>
                        Chifrica Institute is a technology academy 
                        dedicated to empowering children, university students,
                        professionals and tech enthusiasts with world-class
                        digital skills.
                    </p>

                    <div className="social-icons">

                        <a href="https://www.facebook.com/share/17kQ31yK5U/">
                            <FaFacebookF />
                        </a>

                        <a href="#">
                            <FaInstagram />
                        </a>

                        <a href="#">
                            <FaLinkedinIn />
                        </a>

                        <a href="#">
                            <FaYoutube />
                        </a>

                        <a href="https://wa.me/2347040311071">
                            <FaWhatsapp />
                        </a>

                    </div>

                </div>

                {/* Quick Links */}

                <div className="footer-links">

                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>

                    <Link to="/about">About</Link>

                    <Link to="/courses">Courses</Link>

                    <Link to="/kids-academy">Kids Academy</Link>

                    <Link to="/blog">Blog</Link>

                    <Link to="/contact">Contact</Link>

                </div>

                {/* Courses */}

                <div className="footer-links">

                    <h3>Popular Courses</h3>

                    <Link to="#">Web Development</Link>

                    <Link to="#">React Development</Link>

                    <Link to="#">React Native</Link>

                    <Link to="#">Artificial Intelligence</Link>

                    <Link to="#">UI/UX Design</Link>

                    <Link to="#">Python Programming</Link>

                </div>

                {/* Contact */}

                <div className="footer-contact">

                    <h3>Contact Us</h3>

                    <p>
                        <FaMapMarkerAlt />
                        Enugu, Nigeria
                    </p>

                    <p>
                        <FaPhoneAlt />
                        +234 704 031 1071
                    </p>

                    <p>
                        <FaPhoneAlt />
                        +234 901 407 4161
                    </p>

                    <p>
                        <FaEnvelope />
                        chifricanetwork@gmail.com
                    </p>

                </div>

            </div>

            {/* Newsletter */}

            <div className="newsletter">

                <div>

                    <h2>
                        Subscribe to Our Newsletter
                    </h2>

                    <p>
                        Receive updates on new courses,
                        scholarships and coding events.
                    </p>

                </div>

                <div className="newsletter-form">

                    <input
                        type="email"
                        placeholder="Enter your email"
                    />

                    <button>

                        Subscribe

                        <FaArrowRight />

                    </button>

                </div>

            </div>

            {/* Bottom */}

            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} Chifrica Institute.
                    All Rights Reserved.
                </p>

            </div>

        </footer>
    );
};

export default Footer;