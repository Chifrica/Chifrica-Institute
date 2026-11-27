import { useState, type FormEvent } from "react";
import {
    FiArrowRight,
    FiClock,
    FiMail,
    FiMapPin,
    FiPhone,
    FiSend,
} from "react-icons/fi";
import "./style.css";

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);

    const submitForm = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
        event.currentTarget.reset();
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="hero-content">
                    <p className="contact-eyebrow">LET'S START A CONVERSATION</p>
                    <h1>Contact Chifrica Institute</h1>
                    <p>
                        We'd love to hear from you. Whether you have questions about our
                        courses, admissions, partnerships, or technical support, our team
                        is here to help.
                    </p>
                </div>
            </section>

            <section className="contact-container">
                <div className="contact-info">
                    <h2>Get In Touch</h2>
                    <p className="contact-info-intro">
                        Speak with our admissions and support team for clear, practical guidance.
                    </p>

                    <div className="info-box">
                        <span className="info-icon"><FiMapPin aria-hidden="true" /></span>
                        <div>
                            <h4>Visit Us</h4>
                            <p>Enugu, Nigeria</p>
                        </div>
                    </div>

                    <div className="info-box">
                        <span className="info-icon"><FiPhone aria-hidden="true" /></span>
                        <div>
                            <h4>Call Us</h4>
                            <a href="tel:+2347040311071">+234 704 031 1071</a>
                        </div>
                    </div>

                    <div className="info-box">
                        <span className="info-icon"><FiMail aria-hidden="true" /></span>
                        <div>
                            <h4>Email Us</h4>
                            <a href="mailto:chifricanetwork@gmail.com">chifricanetwork@gmail.com</a>
                        </div>
                    </div>

                    <div className="info-box">
                        <span className="info-icon"><FiClock aria-hidden="true" /></span>
                        <div>
                            <h4>Working Hours</h4>
                            <p>Monday - Saturday</p>
                            <p>8:00 AM - 6:00 PM</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form">
                    <h2>Send Us a Message</h2>
                    <p>Share a few details and a member of our team will get back to you.</p>
                    {submitted && (
                        <div className="contact-success" role="status">
                            Thank you. Your message has been received.
                        </div>
                    )}
                    <form onSubmit={submitForm}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                placeholder="Subject"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                rows={6}
                                placeholder="Write your message..."
                                required
                            ></textarea>
                        </div>
                        <button type="submit">
                            <FiSend aria-hidden="true" />
                            Send Message
                            <FiArrowRight aria-hidden="true" />
                        </button>
                    </form>
                </div>
            </section>
            <section className="faq">
                <p className="faq-eyebrow">NEED QUICK ANSWERS?</p>
                <h2>Frequently Asked Questions</h2>
                <div className="faq-grid">
                    <details className="faq-card" open>
                        <summary>Do I receive a certificate?</summary>
                        <p>Yes. Students receive certificates after completing eligible courses and meeting the required assessment standards.</p>
                    </details>
                    <details className="faq-card">
                        <summary>Can beginners enroll?</summary>
                        <p>Absolutely. We offer beginner, intermediate, and advanced learning paths for different levels of experience.</p>
                    </details>
                    <details className="faq-card">
                        <summary>Do you offer live classes?</summary>
                        <p>Yes. We provide live physical classes, online sessions, and selected recorded lessons.</p>
                    </details>
                </div>
            </section>
        </div>
    );
};

export default Contact;