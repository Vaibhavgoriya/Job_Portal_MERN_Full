import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.token);
      toast.success("Login successful");
      navigate("/user/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#667eea" />
              <path d="M20 12L28 20L20 28L12 20L20 12Z" fill="white" />
              <circle cx="20" cy="20" r="4" fill="#764ba2" />
            </svg>
            <h1>Company<span>Name</span></h1>
          </div>
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue to your account</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="form-input"
            disabled={loading}
          />
          
          {/* Forgot Password moved to separate line */}
          <div className="forgot-password-container">
            <button
              onClick={() => navigate("/user/forgot-password")}
              className="forgot-password-link"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="login-button"
          disabled={loading}
        >
          {loading ? (
            <span className="loading-spinner">
              <span className="spinner"></span>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="divider">
          <span>New to our platform?</span>
        </div>

        <button
          onClick={() => navigate("/user/register")}
          className="register-button"
          disabled={loading}
        >
          Create an account
        </button>

        <div className="login-footer">
          <p>© {new Date().getFullYear()} CompanyName. All rights reserved.</p>
          <div className="footer-links">
            <button onClick={() => {/* Add help page */}}>Help</button>
            <span>•</span>
            <button onClick={() => {/* Add privacy page */}}>Privacy</button>
            <span>•</span>
            <button onClick={() => {/* Add terms page */}}>Terms</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            #f8fafc 0%,
            #f1f5f9 100%
          );
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .login-container::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0) 70%);
          border-radius: 50%;
        }

        .login-card {
          background: white;
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.05),
            0 2px 8px rgba(0, 0, 0, 0.02);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
          z-index: 1;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .logo h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .logo h1 span {
          color: #667eea;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-header h2 {
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0;
          font-weight: 400;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.2px;
        }

        .form-input {
          width: 100%;
          padding: 15px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.25s ease;
          box-sizing: border-box;
          background: #ffffff;
          color: #1e293b;
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
        }

        .form-input:disabled {
          background-color: #f8fafc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        /* Forgot Password Styling - Now on separate line */
        .forgot-password-container {
          margin-top: 8px;
          text-align: right;
        }

        .forgot-password-link {
          background: none;
          border: none;
          color: #667eea;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 0;
          transition: all 0.2s;
          text-decoration: none;
        }

        .forgot-password-link:hover {
          color: #5a67d8;
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
          letter-spacing: 0.2px;
          position: relative;
          overflow: hidden;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 32px 0;
          color: #94a3b8;
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .divider span {
          padding: 0 16px;
          font-weight: 500;
        }

        .register-button {
          width: 100%;
          padding: 16px;
          background: white;
          color: #64748b;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.2px;
        }

        .register-button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }

        .login-footer p {
          color: #64748b;
          font-size: 13px;
          margin: 0 0 12px 0;
          font-weight: 400;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          font-weight: 400;
          transition: color 0.2s;
        }

        .footer-links button:hover {
          color: #334155;
          text-decoration: underline;
        }

        .footer-links span {
          color: #cbd5e1;
          font-size: 12px;
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .login-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .login-header h2 {
            font-size: 24px;
          }
          
          .logo h1 {
            font-size: 20px;
          }
        }

        @media (max-width: 360px) {
          .login-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;