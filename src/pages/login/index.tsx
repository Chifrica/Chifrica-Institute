import  { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-page">

            <div className="login-left">
                <div className="overlay">
                    <h1>Welcome Back!</h1>

                    <p>
                        Continue your learning journey with
                        <strong> Chifrica Institute.</strong>
                    </p>

                    <ul>
                        <li>✔ Learn Programming</li>
                        <li>✔ AI & Machine Learning</li>
                        <li>✔ Web Development</li>
                        <li>✔ Mobile App Development</li>
                        <li>✔ UI/UX Design</li>
                    </ul>
                </div>
            </div>

            <div className="login-right">

                <div className="login-card">

                    <h2>Login</h2>

                    <p>Sign in to your account</p>

                    <form>

                        <div className="input-group">
                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                            />

                        </div>

                        <div className="options">

                            <label>

                                <input type="checkbox" />

                                Remember Me

                            </label>

                            <Link to="/forgot-password">
                                Forgot Password?
                            </Link>

                        </div>

                        <button className="login-btn">
                            Login
                        </button>

                    </form>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button className="google-btn">
                        Continue with Google
                    </button>

                    <p className="register-link">
                        Don't have an account?

                        <Link to="/register">
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;