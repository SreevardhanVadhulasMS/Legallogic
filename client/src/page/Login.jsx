import React, { useState, useEffect } from "react";
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
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    console.log("[Login] Mounted. Current token:", localStorage.getItem("token"));
  }, []);

  const handleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      console.log("[Login] Attempting login for:", email);
      const res = await api.post("/auth/login", {
        email,
        password,
      }); 

      localStorage.setItem("token", res.data.token);
      console.log("[Login] Login successful, token set:", res.data.token);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("[Login] Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Legal<span>Logic</span>
        </h1>

        <p className="auth-subtitle">Sign in to your account</p>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <div className="password-field">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button className="auth-btn" onClick={handleLogin} disabled={loading || success}>
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="google-container">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setGoogleLoading(true);
              setError("");
              try {
                const res = await api.post("/auth/google", {
                  credential: credentialResponse.credential,
                });

                localStorage.setItem("token", res.data.token);
                navigate("/dashboard");
              } catch (error) {
                console.error("Google login error:", error);
                setError(error.response?.data?.message || "Google login failed");
              } finally {
                setGoogleLoading(false);
              }
            }}
            onError={() => {
              setError("Google login failed");
              setGoogleLoading(false);
            }}
          />
          {googleLoading && (
            <div className="loading-overlay">
              Logging in with Google...
            </div>
          )}
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

