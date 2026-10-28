import { Link } from "react-router-dom";
import "../auth.css";
import "./style.css";

const Login = () => {
    return (
        <main className="auth-page login-page">
            <section className="auth-brand" aria-label="Chifrica Institute">
                <div className="auth-brand-logo">
                    Chifrica <span>Institute</span>
                </div>

                <div className="auth-brand-copy">
                    <p className="auth-eyebrow">YOUR LEARNING JOURNEY</p>
                    <h1>Learn today.<br />Build tomorrow.</h1>
                    <p className="auth-brand-description">
                        Continue building the skills and confidence to shape your future.
                    </p>
                </div>

                <p className="auth-brand-note">Practical skills. Brighter futures.</p>
            </section>

            <section className="auth-panel">
                <div className="auth-card login-card">
                    <Link className="auth-back" to="/">← Back to home</Link>
                    <h2>Welcome back</h2>
                    <p className="auth-subtitle">Sign in to your account to continue.</p>

                    <form className="auth-form">
                        <div className="auth-field">
                            <label className="auth-visually-hidden" htmlFor="login-email">
                                Email address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="Email address"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label className="auth-visually-hidden" htmlFor="login-password">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <div className="auth-options">
                            <label className="auth-remember">
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <Link className="auth-text-link" to="/forgot-password">
                                Forgot password?
                            </Link>
                        </div>

                        <button className="auth-primary" type="submit">Log in</button>
                    </form>

                    <p className="auth-switch">
                        New to Chifrica?
                        <Link to="/register">Create account</Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;