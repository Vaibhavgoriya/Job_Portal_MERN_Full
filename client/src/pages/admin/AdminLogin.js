import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function AdminLogin() {
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
      const res = await axios.post("/admin/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);
      toast.success("Admin login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed. Please check your credentials.");
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
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#dc2626" />
              <path d="M20 12L28 20L20 28L12 20L20 12Z" fill="white" />
              <circle cx="20" cy="20" r="4" fill="#7c2d12" />
            </svg>
            <h1>Company<span>Admin</span></h1>
          </div>
          
          <div className="icon-wrapper">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4m8 0H6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2>Admin Portal</h2>
          <p className="admin-login-subtitle">Secure administrative access</p>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Admin Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={loading}
            />
            <div className="forgot-password-container">
              <button
                onClick={() => navigate("/admin/forgot-password")}
                className="forgot-password-link"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div className="security-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
            <span>This is a secure admin portal. All activities are logged.</span>
          </div>

          <button
            onClick={handleLogin}
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Authenticating...
              </span>
            ) : (
              "Sign In as Admin"
            )}
          </button>

          <div className="divider">
            <span>Don't have an admin account?</span>
          </div>

          <button
            onClick={() => navigate("/admin/register")}
            className="admin-register-button"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
            Register New Admin
          </button>

          <div className="admin-login-footer">
            <p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              For security reasons, please log out after your session.
            </p>
            <div className="footer-links">
              <button onClick={() => {/* Add security page */}}>Security</button>
              <span>•</span>
              <button onClick={() => {/* Add audit page */}}>Audit Log</button>
              <span>•</span>
              <button onClick={() => {/* Add support page */}}>Support</button>
            </div>
            <p className="copyright">© {new Date().getFullYear()} CompanyName Admin Portal v2.0</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            135deg,
            #0f172a 0%,
            #1e293b 100%
          );
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .admin-login-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #dc2626 0%, #7c2d12 100%);
        }

        .admin-login-container::after {
          content: '';
          position: absolute;
          top: 20%;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, rgba(124, 45, 18, 0) 70%);
          border-radius: 50%;
        }

        .admin-login-card {
          background: linear-gradient(
            145deg,
            rgba(30, 41, 59, 0.95) 0%,
            rgba(15, 23, 42, 0.95) 100%
          );
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 460px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          z-index: 1;
          backdrop-filter: blur(10px);
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
          color: #f8fafc;
          margin: 0;
        }

        .logo h1 span {
          color: #dc2626;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(124, 45, 18, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #dc2626;
        }

        .admin-login-header h2 {
          color: #f8fafc;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
        }

        .admin-login-subtitle {
          color: #94a3b8;
          font-size: 15px;
          margin: 0;
          font-weight: 400;
        }

        .form-container {
          width: 100%;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.2px;
        }

        .form-input {
          width: 100%;
          padding: 15px 16px;
          background: rgba(15, 23, 42, 0.7);
          border: 1.5px solid #334155;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.25s ease;
          box-sizing: border-box;
          color: #f8fafc;
          font-family: inherit;
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .form-input:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        }

        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .forgot-password-container {
          display: flex;
          justify-content: flex-end;
          margin-top: 8px;
        }

        .forgot-password-link {
          background: none;
          border: none;
          color: #f87171;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
          text-decoration: none;
        }

        .forgot-password-link:hover {
          color: #ef4444;
          text-decoration: underline;
        }

        .security-note {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 8px;
          margin: 24px 0;
          color: #fca5a5;
          font-size: 13px;
          font-weight: 500;
        }

        .security-note svg {
          flex-shrink: 0;
          color: #f87171;
        }

        .admin-login-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #dc2626 0%, #7c2d12 100%);
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
          margin-top: 8px;
        }

        .admin-login-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        .admin-login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-login-button:disabled {
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
          color: #64748b;
          font-size: 14px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #334155;
        }

        .divider span {
          padding: 0 16px;
          font-weight: 500;
        }

        .admin-register-button {
          width: 100%;
          padding: 16px;
          background: rgba(30, 41, 59, 0.7);
          color: #cbd5e1;
          border: 1.5px solid #475569;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .admin-register-button:hover:not(:disabled) {
          background: rgba(220, 38, 38, 0.1);
          border-color: #dc2626;
          color: #fca5a5;
          transform: translateY(-1px);
        }

        .admin-register-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-register-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .admin-login-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          text-align: center;
        }

        .admin-login-footer p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0 0 16px 0;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .admin-login-footer p svg {
          color: #64748b;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .footer-links button {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          font-weight: 400;
          transition: color 0.2s;
        }

        .footer-links button:hover {
          color: #f8fafc;
          text-decoration: underline;
        }

        .footer-links span {
          color: #475569;
          font-size: 12px;
        }

        .copyright {
          color: #64748b;
          font-size: 12px;
          font-weight: 300;
          opacity: 0.8;
        }

        /* Responsive design */
        @media (max-width: 480px) {
          .admin-login-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .admin-login-header h2 {
            font-size: 24px;
          }
          
          .logo h1 {
            font-size: 20px;
          }
          
          .icon-wrapper {
            width: 70px;
            height: 70px;
          }
          
          .icon-wrapper svg {
            width: 48px;
            height: 48px;
          }
        }

        @media (max-width: 360px) {
          .admin-login-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .admin-login-header h2 {
            font-size: 22px;
          }
          
          .admin-login-footer p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminLogin;