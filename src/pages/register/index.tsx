import  { useState } from"react";
import { Link } from "react-router-dom";
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        alert("Registration Successful!");
    };

    return (
        <div className="register-page">

            <div className="register-left">
                <div className="overlay">
                    <h1>Join Chifrica Institute</h1>

                    <p>
                        Learn programming, Artificial Intelligence,
                        Mobile App Development, UI/UX Design and many more.
                    </p>

                    <ul>
                        <li>🎓 Professional Courses</li>
                        <li>💻 Live Coding Classes</li>
                        <li>📱 Mobile Learning</li>
                        <li>🏆 Certificates</li>
                        <li>🌍 Global Community</li>
                    </ul>
                </div>
            </div>

            <div className="register-right">

                <div className="register-card">

                    <h2>Create Account</h2>

                    <p>Start your learning journey today.</p>

                    <form onSubmit={handleSubmit}>

                        <div className="input-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter full name"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Country</label>
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Course Interested In</label>

                            <select
                                name="course"
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Course</option>
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

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="checkbox">
                            <input type="checkbox" required />
                            <span>
                                I agree to the Terms & Conditions
                            </span>
                        </div>

                        <button className="register-btn">
                            Create Account
                        </button>

                    </form>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button className="google-btn">
                        Continue with Google
                    </button>

                    <p className="login-link">
                        Already have an account?

                        <Link to="/login">
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Register;