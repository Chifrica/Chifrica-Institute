import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../auth.css";
import "./style.css";
import { AUTH_SESSION_KEY } from "../../auth";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const requestedReturnPath = new URLSearchParams(location.search).get("returnTo");
    const returnPath = requestedReturnPath?.startsWith("/courses/") && !requestedReturnPath.startsWith("//")
        ? requestedReturnPath
        : "/my-learning";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isSupabaseConfigured || !supabase) {
            setError("Supabase is not configured. Please contact the site administrator.");
            return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });
        if (signInError) {
            setError(signInError.message);
            return;
        }
        window.localStorage.setItem(AUTH_SESSION_KEY, "supabase");
        try {
            navigate(returnPath, { replace: true });
        } catch (navigationError) {
            console.error("Unable to open the courses page.", navigationError);
            setError("Signed in, but unable to open the requested page.");
        }
    };

    return (
        <div className="auth-page login-page">
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
                    <p className="auth-subtitle">
                        {isSupabaseConfigured
                            ? "Sign in with the email and password you used to create your account."
                            : "Sign in to your account to continue."}
                    </p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-visually-hidden" htmlFor="login-email">
                                Email address or username
                            </label>
                            <input
                                id="login-email"
                                type="text"
                                placeholder="Email address or username"
                                autoComplete="username"
                                required
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    setError("");
                                }}
                            />
                        </div>

                        <div className="auth-field">
                            <label className="auth-visually-hidden" htmlFor="login-password">
                                Password
                            </label>
                            <div className="auth-password-input">
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        setError("");
                                    }}
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

                        <div className="auth-options">
                            <label className="auth-remember">
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <Link className="auth-text-link" to="/forgot-password">
                                Forgot password?
                            </Link>
                        </div>

                        {error && <p className="login-error" role="alert">{error}</p>}
                        <button className="auth-primary" type="submit">Log in</button>
                    </form>

                    <p className="auth-switch">
                        New to Chifrica?
                        <Link to={`/register${location.search}`}>Create account</Link>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Login;