import "./style.css";

const Contact = () => {
    return (
        <div className="contact-page">

            {/* Hero Section */}
            <section className="contact-hero">
                <div className="hero-content">
                    <h1>Contact Chifrica Institute</h1>
                    <p>
                        We'd love to hear from you. Whether you have questions about our
                        courses, admissions, partnerships, or technical support, our team
                        is here to help.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-container">

                <div className="contact-info">

                    <h2>Get In Touch</h2>

                    <div className="info-box">
                        <h4>📍 Address</h4>
                        <p>Enugu, Nigeria</p>
                    </div>

                    <div className="info-box">
                        <h4>📞 Phone</h4>
                        <p>+234 704 031 1071</p>
                        {/* <p>+234 708 402 6544</p> */}
                    </div>

                    <div className="info-box">
                        <h4>📧 Email</h4>
                        <p>chifricanetwork@gmail.com</p>
                    </div>

                    <div className="info-box">
                        <h4>🕒 Physical Working Hours</h4>
                        <p>Monday - Saturday</p>
                        <p>8:00 AM - 6:00 PM</p>
                    </div>

                </div>

                <div className="contact-form">

                    <h2>Send Us a Message</h2>

                    <form>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
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
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                rows={6}
                                placeholder="Write your message..."
                            ></textarea>
                        </div>

                        <button type="submit">
                            Send Message
                        </button>

                    </form>

                </div>

            </section>

            {/* FAQ */}
            <section className="faq">

                <h2>Frequently Asked Questions</h2>

                <div className="faq-grid">

                    <div className="faq-card">
                        <h3>Do I receive a certificate?</h3>
                        <p>
                            Yes. Students receive certificates after completing eligible
                            courses.
                        </p>
                    </div>

                    <div className="faq-card">
                        <h3>Can beginners enroll?</h3>
                        <p>
                            Absolutely! We have beginner, intermediate and advanced courses.
                        </p>
                    </div>

                    <div className="faq-card">
                        <h3>Do you offer live classes?</h3>
                        <p>
                            Yes. We provide live physical classes, online classes and recorded lessons.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
};

export default Contact;