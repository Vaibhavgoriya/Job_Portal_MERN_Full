import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/users/register", { name, email, password });
      toast.success("Registration successful! Please login.");
      navigate("/user/login");
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg && msg.toLowerCase().includes("already")) {
        toast.info("You are already registered. Please login.");
        navigate("/user/login");
        return;
      }
      toast.error(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.type !== "submit") {
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#667eea" />
              <path d="M20 12L28 20L20 28L12 20L20 12Z" fill="white" />
              <circle cx="20" cy="20" r="4" fill="#764ba2" />
            </svg>
            <h1>Company<span>Name</span></h1>
          </div>
          <h2>Create Account</h2>
          <p className="register-subtitle">Join our platform to get started</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={loading}
              required
            />
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
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={loading}
              required
            />
            <div className="password-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12" y2="16"></line>
              </svg>
              Use at least 8 characters with letters and numbers
            </div>
          </div>

          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the{" "}
              <Link to="/terms" className="terms-link">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </label>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="divider">
            <span>Already have an account?</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/user/login")}
            className="login-button"
            disabled={loading}
          >
            Sign in to your account
          </button>

          <div className="register-footer">
            <p>© {new Date().getFullYear()} CompanyName. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/help">Help</Link>
              <span>•</span>
              <Link to="/privacy">Privacy</Link>
              <span>•</span>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .register-container {
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

        .register-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .register-card {
          background: white;
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 460px;
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

        .register-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .register-header h2 {
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .register-subtitle {
          color: #64748b;
          font-size: 15px;
          margin: 0;
          font-weight: 400;
        }

        .register-form {
          width: 100%;
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
          font-family: inherit;
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

        .password-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          color: #64748b;
          font-size: 13px;
          font-weight: 400;
        }

        .password-hint svg {
          color: #94a3b8;
          flex-shrink: 0;
        }

        .terms-agreement {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 32px 0 24px;
          padding: 16px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .terms-agreement input[type="checkbox"] {
          margin-top: 2px;
          accent-color: #667eea;
          cursor: pointer;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .terms-agreement label {
          color: #475569;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.5;
          margin: 0;
          cursor: pointer;
        }

        .terms-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .terms-link:hover {
          color: #5a67d8;
          text-decoration: underline;
        }

        .register-button {
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
          letter-spacing: 0.2px;
          position: relative;
          overflow: hidden;
        }

        .register-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
        }

        .register-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .register-button:disabled {
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

        .login-button {
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

        .login-button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .register-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }

        .register-footer p {
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

        .footer-links a {
          color: #64748b;
          font-size: 13px;
          text-decoration: none;
          font-weight: 400;
          transition: color 0.2s;
        }

        .footer-links a:hover {
          color: #334155;
          text-decoration: underline;
        }

        .footer-links span {
          color: #cbd5e1;
          font-size: 12px;
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .register-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .register-header h2 {
            font-size: 24px;
          }
          
          .logo h1 {
            font-size: 20px;
          }
          
          .terms-agreement {
            padding: 14px;
          }
        }

        @media (max-width: 360px) {
          .register-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .terms-agreement {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .terms-agreement input[type="checkbox"] {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default Register;