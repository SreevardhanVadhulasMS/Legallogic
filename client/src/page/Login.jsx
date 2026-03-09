import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/axios";
import "../styles/Auth.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Legal<span>Logic</span>
        </h1>

        <p className="auth-subtitle">Welcome back</p>

        {error && <p className="auth-error">{error}</p>}

        <div className="input-group">
          <input
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Email</label>
        </div>

        <div className="password-field">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await api.post("/auth/google", {
                credential: credentialResponse.credential,
              });

              localStorage.setItem("token", res.data.token);
              navigate("/dashboard");
            } catch (error) {
              setError("Google login failed");
            }
          }}
          onError={() => {
            setError("Google login failed");
          }}
        />

        <p className="auth-switch">
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
