import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your admin email address");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/admin/forgot-password", { email });
      toast.success("OTP has been sent to your admin email");
      navigate("/admin/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendOtp();
    }
  };

  return (
    <div className="admin-forgot-password-container">
      <div className="admin-forgot-password-card">
        <div className="admin-forgot-password-header">
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
          
          <h2>Reset Admin Password</h2>
          <p className="subtitle">
            Enter your admin email address to receive a password reset OTP.
          </p>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label htmlFor="admin-forgot-email">Admin Email Address</label>
            <input
              id="admin-forgot-email"
              type="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={loading}
            />
            <p className="helper-text">
              Enter the email address associated with your admin account.
            </p>
          </div>

          <div className="security-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              For security reasons, OTPs are only sent to verified admin emails.
              This action will be logged in the admin audit trail.
            </div>
          </div>

          <button
            onClick={sendOtp}
            className="send-otp-button"
            disabled={!email || loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Sending OTP...
              </span>
            ) : (
              "Send Admin OTP"
            )}
          </button>

          <div className="divider">
            <span>Remember your password?</span>
          </div>

          <button
            onClick={() => navigate("/admin/login")}
            className="back-to-login-button"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Back to Admin Login
          </button>

          <div className="admin-forgot-password-footer">
            <p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Admin password resets require additional security verification.
            </p>
            <div className="footer-links">
              <button onClick={() => {/* Add security page */}}>Security Policy</button>
              <span>•</span>
              <button onClick={() => {/* Add support page */}}>Admin Support</button>
              <span>•</span>
              <button onClick={() => {/* Add audit page */}}>Audit Log</button>
            </div>
            <p className="copyright">© {new Date().getFullYear()} CompanyName Admin Portal</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-forgot-password-container {
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

        .admin-forgot-password-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #dc2626 0%, #7c2d12 100%);
        }

        .admin-forgot-password-card {
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

        .admin-forgot-password-header {
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

        .admin-forgot-password-header h2 {
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

        .helper-text {
          color: #94a3b8;
          font-size: 13px;
          margin: 8px 0 0;
          font-weight: 400;
        }

        .security-note {
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

        .security-note svg {
          flex-shrink: 0;
          color: #f87171;
          margin-top: 2px;
        }

        .send-otp-button {
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

        .send-otp-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
        }

        .send-otp-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .send-otp-button:disabled {
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

        .back-to-login-button {
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

        .back-to-login-button:hover:not(:disabled) {
          background: rgba(220, 38, 38, 0.1);
          border-color: #dc2626;
          color: #fca5a5;
          transform: translateY(-1px);
        }

        .back-to-login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .back-to-login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .admin-forgot-password-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          text-align: center;
        }

        .admin-forgot-password-footer p {
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

        .admin-forgot-password-footer p svg {
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
          .admin-forgot-password-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .admin-forgot-password-header h2 {
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
          
          .security-note {
            padding: 14px;
            font-size: 12px;
          }
        }

        @media (max-width: 360px) {
          .admin-forgot-password-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .admin-forgot-password-header h2 {
            font-size: 22px;
          }
          
          .subtitle {
            font-size: 14px;
          }
          
          .admin-forgot-password-footer p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminForgotPassword;