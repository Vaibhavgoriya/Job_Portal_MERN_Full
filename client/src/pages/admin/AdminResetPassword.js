import { useState } from "react";
import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 12) {
      toast.error("Admin password must be at least 12 characters long");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/admin/reset-password", {
        email,
        newPassword: password,
      });
      toast.success("Admin password has been reset successfully!");
      navigate("/admin/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      resetPassword();
    }
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: "", color: "#475569" };
    
    let score = 0;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    const strengths = [
      { label: "Very Weak", color: "#ef4444" },
      { label: "Weak", color: "#f97316" },
      { label: "Fair", color: "#f59e0b" },
      { label: "Good", color: "#10b981" },
      { label: "Strong", color: "#22c55e" }
    ];
    
    return strengths[Math.min(score, strengths.length - 1)];
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="admin-reset-password-container">
      <div className="admin-reset-password-card">
        <div className="admin-reset-password-header">
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
          
          <h2>Set New Admin Password</h2>
          <p className="subtitle">
            Create a strong, new password for your admin account.
          </p>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label htmlFor="admin-new-password">New Admin Password</label>
            <div className="password-input-wrapper">
              <input
                id="admin-new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={loading}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            
            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${(getPasswordStrength(password).score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            
            <div className="password-requirements">
              <p>Admin password requirements:</p>
              <ul>
                <li className={password.length >= 12 ? "valid" : ""}>
                  Minimum 12 characters
                </li>
                <li className={/[A-Z]/.test(password) ? "valid" : ""}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? "valid" : ""}>
                  One lowercase letter
                </li>
                <li className={/[0-9]/.test(password) ? "valid" : ""}>
                  One number
                </li>
                <li className={/[^A-Za-z0-9]/.test(password) ? "valid" : ""}>
                  One special character
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-confirm-password">Confirm Admin Password</label>
            <div className="password-input-wrapper">
              <input
                id="admin-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new admin password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="form-input"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            
            {confirmPassword && password !== confirmPassword && (
              <p className="error-message">Passwords do not match</p>
            )}
            
            {confirmPassword && password === confirmPassword && password.length >= 12 && (
              <p className="success-message">Passwords match ✓</p>
            )}
          </div>

          <div className="security-disclaimer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Important:</strong> Admin passwords require higher security standards. 
              This password change will be logged in the admin audit trail.
            </div>
          </div>

          <button
            onClick={resetPassword}
            className="admin-reset-button"
            disabled={!password || !confirmPassword || password !== confirmPassword || loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Updating Admin Password...
              </span>
            ) : (
              "Update Admin Password"
            )}
          </button>

          <div className="divider">
            <span>Changed your mind?</span>
          </div>

          <button
            onClick={() => navigate("/admin/login")}
            className="cancel-button"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Back to Admin Login
          </button>

          <div className="admin-reset-footer">
            <p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Strong passwords protect sensitive admin operations and data.
            </p>
            <div className="footer-links">
              <button onClick={() => {/* Add security page */}}>Security Policy</button>
              <span>•</span>
              <button onClick={() => {/* Add audit page */}}>Audit Log</button>
              <span>•</span>
              <button onClick={() => {/* Add support page */}}>Admin Support</button>
            </div>
            <p className="copyright">© {new Date().getFullYear()} CompanyName Admin Portal</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-reset-password-container {
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

        .admin-reset-password-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #dc2626 0%, #7c2d12 100%);
        }

        .admin-reset-password-card {
          background: linear-gradient(
            145deg,
            rgba(30, 41, 59, 0.95) 0%,
            rgba(15, 23, 42, 0.95) 100%
          );
          border-radius: 16px;
          padding: 48px 40px;
          width: 100%;
          max-width: 500px;
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

        .admin-reset-password-header {
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

        .admin-reset-password-header h2 {
          color: #f8fafc;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.5;
          margin: 0;
          font-weight: 400;
          max-width: 320px;
          margin: 0 auto;
        }

        .form-container {
          width: 100%;
        }

        .form-group {
          margin-bottom: 28px;
        }

        .form-group label {
          display: block;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: -0.2px;
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 15px 16px;
          padding-right: 48px;
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

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .password-toggle:hover:not(:disabled) {
          color: #dc2626;
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .password-strength {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 12px;
        }

        .strength-bar {
          flex: 1;
          height: 6px;
          background: #334155;
          border-radius: 3px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        .strength-label {
          font-size: 12px;
          font-weight: 600;
          min-width: 70px;
          text-align: right;
          color: #94a3b8;
        }

        .password-requirements {
          margin-top: 16px;
          padding: 16px;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 8px;
          border: 1px solid #334155;
        }

        .password-requirements p {
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }

        .password-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .password-requirements li {
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
        }

        .password-requirements li:before {
          content: "○";
          margin-right: 8px;
          font-size: 8px;
          color: #64748b;
        }

        .password-requirements li.valid {
          color: #10b981;
        }

        .password-requirements li.valid:before {
          content: "✓";
          color: #10b981;
        }

        .error-message {
          color: #ef4444;
          font-size: 13px;
          margin: 8px 0 0;
          font-weight: 500;
        }

        .success-message {
          color: #10b981;
          font-size: 13px;
          margin: 8px 0 0;
          font-weight: 500;
        }

        .security-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 8px;
          margin: 24px 0;
          color: #fca5a5;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.5;
        }

        .security-disclaimer svg {
          flex-shrink: 0;
          color: #f87171;
          margin-top: 2px;
        }

        .security-disclaimer strong {
          color: #f8fafc;
          font-weight: 600;
        }

        .admin-reset-button {
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

        .admin-reset-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        .admin-reset-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-reset-button:disabled {
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

        .cancel-button {
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

        .cancel-button:hover:not(:disabled) {
          background: rgba(220, 38, 38, 0.1);
          border-color: #dc2626;
          color: #fca5a5;
          transform: translateY(-1px);
        }

        .cancel-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .admin-reset-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          text-align: center;
        }

        .admin-reset-footer p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0 0 16px 0;
          font-weight: 400;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: left;
        }

        .admin-reset-footer p svg {
          color: #64748b;
          flex-shrink: 0;
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
          .admin-reset-password-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .admin-reset-password-header h2 {
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
          
          .password-requirements {
            padding: 14px;
          }
          
          .security-disclaimer {
            padding: 14px;
            font-size: 12px;
          }
        }

        @media (max-width: 360px) {
          .admin-reset-password-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .admin-reset-password-header h2 {
            font-size: 22px;
          }
          
          .subtitle {
            font-size: 14px;
          }
          
          .admin-reset-footer p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminResetPassword;