import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../auth.css";
import "./style.css";

const passwordMeetsRequirements = (password: string) =>
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
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
        const { name, value } = e.target;
        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
        if (name === "password" || name === "confirmPassword") {
            setPasswordError("");
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!passwordMeetsRequirements(formData.password)) {
            setPasswordError("Password must include at least one uppercase letter, one number, and one symbol.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        setPasswordError("");
        setPasswordError("");
        alert("Registration Successful!");
    };

    const isPasswordInvalid = Boolean(passwordError && !passwordMeetsRequirements(formData.password));
    const isConfirmPasswordInvalid = passwordError === "Passwords do not match.";

    return (
        <div className="auth-page register-page">
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
                                <div className="auth-password-input">
                                    <input
                                        id="register-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        aria-describedby={isPasswordInvalid
                                            ? "register-password-hint register-password-error"
                                            : "register-password-hint"}
                                        aria-invalid={isPasswordInvalid}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        className="auth-password-toggle"
                                        type="button"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        aria-pressed={showPassword}
                                        onClick={() => setShowPassword((visible) => !visible)}
                                    >
                                        {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>

                            <div className="auth-field">
                                <label className="auth-visually-hidden" htmlFor="register-confirm-password">
                                    Confirm password
                                </label>
                                <div className="auth-password-input">
                                    <input
                                        id="register-confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        aria-describedby={isConfirmPasswordInvalid ? "register-password-error" : undefined}
                                        aria-invalid={isConfirmPasswordInvalid}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        className="auth-password-toggle"
                                        type="button"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        aria-pressed={showConfirmPassword}
                                        onClick={() => setShowConfirmPassword((visible) => !visible)}
                                    >
                                        {showConfirmPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p id="register-password-hint" className="auth-password-hint">
                            Use at least one uppercase letter, one number, and one symbol.
                        </p>
                        {passwordError && (
                            <p id="register-password-error" className="auth-password-error" role="alert">
                                {passwordError}
                            </p>
                        )}

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
        </div>
    );
};

export default Register;