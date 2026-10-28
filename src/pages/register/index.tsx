import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import "../auth.css";
import "./style.css";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        course: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        alert("Registration Successful!");
    };

    return (
        <main className="auth-page register-page">
            <section className="auth-brand" aria-label="Chifrica Institute">
                <div className="auth-brand-logo">
                    Chifrica <span>Institute</span>
                </div>

                <div className="auth-brand-copy">
                    <p className="auth-eyebrow">START SOMETHING NEW</p>
                    <h1>Make your next move count.</h1>
                    <p className="auth-brand-description">
                        Join a community learning practical skills for a changing world.
                    </p>
                </div>

                <p className="auth-brand-note">Practical skills. Brighter futures.</p>
            </section>

            <section className="auth-panel">
                <div className="auth-card register-card">
                    <Link className="auth-back" to="/">← Back to home</Link>
                    <h2>Create your account</h2>
                    <p className="auth-subtitle">Get started on your learning journey.</p>

                    <form className="auth-form register-form" onSubmit={handleSubmit}>
                        <div className="register-fields">
                            <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-name">
                                    Full name
                                </label>
                                <input
                                    id="register-name"
                                    type="text"
                                    name="fullName"
                                    placeholder="Full name"
                                    autoComplete="name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-email">
                                    Email address
                                </label>
                                <input
                                    id="register-email"
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    autoComplete="email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-phone">
                                    Phone number
                                </label>
                                <input
                                    id="register-phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone number"
                                    autoComplete="tel"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-country">
                                    Country
                                </label>
                                <input
                                    id="register-country"
                                    type="text"
                                    name="country"
                                    placeholder="Country (optional)"
                                    autoComplete="country-name"
                                    onChange={handleChange}
                                />
                            </div> */}

                            <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-course">
                                    Course interested in
                                </label>
                                <select
                                    id="register-course"
                                    name="course"
                                    onChange={handleChange}
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a course</option>
                                    <option>Web Development</option>
                                    <option>React Development</option>
                                    <option>React Native</option>
                                    <option>Artificial Intelligence</option>
                                    <option>Python Programming</option>
                                    <option>Java Programming</option>
                                    <option>UI/UX Design</option>
                                    <option>Flutter</option>
                                    <option>Cybersecurity</option>
                                </select>
                            </div>

                            <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-password">
                                    Password
                                </label>
                                <input
                                    id="register-password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-confirm-password">
                                    Confirm password
                                </label>
                                <input
                                    id="register-confirm-password"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <label className="auth-terms register-terms">
                            <input type="checkbox" required />
                            I agree to the Terms &amp; Conditions
                        </label>

                        <button className="auth-primary" type="submit">
                            Create account
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?
                        <Link to="/login">Log in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Register;