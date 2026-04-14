import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "../styles/Auth.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    try {
      setError(""); // Clear previous errors
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setSuccess("Account created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Legal<span>Logic</span>
        </h1>

        <p className="auth-subtitle">Create your account</p>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        {/* Full Name Input */}
        <div className="input-group">
          <input
            type="text"
            required
            placeholder=" "
            onChange={(e) => setName(e.target.value)}
          />
          <label>Full Name</label>
        </div>

        {/* Email Input */}
        <div className="input-group">
          <input
            type="email"
            required
            placeholder=" "
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Email Address</label>
        </div>

        {/* Password Input */}
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder=" "
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Password</label>
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button 
          className="auth-btn" 
          onClick={handleSignup} 
          disabled={success}
        >
          {success ? "Success!" : "Create Account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;