import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/users/forgot-password", { email });
      toast.success("OTP has been sent to your email");
      navigate("/user/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
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
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <div className="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#667eea" />
              <path d="M20 12L28 20L20 28L12 20L20 12Z" fill="white" />
              <circle cx="20" cy="20" r="4" fill="#764ba2" />
            </svg>
            <h1>Company<span>Name</span></h1>
          </div>
          
          <div className="icon-wrapper">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4m8 0H6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2>Reset Your Password</h2>
          <p className="subtitle">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label htmlFor="forgot-email">Email Address</label>
            <input
              id="forgot-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-input"
              disabled={loading}
            />
            <p className="helper-text">
              Enter the email address associated with your account.
            </p>
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
              "Send OTP"
            )}
          </button>

          <div className="divider">
            <span>Remember your password?</span>
          </div>

          <button
            onClick={() => navigate("/user/login")}
            className="back-to-login-button"
            disabled={loading}
          >
            Back to Login
          </button>

          <div className="forgot-password-footer">
            <p>© {new Date().getFullYear()} CompanyName. All rights reserved.</p>
            <div className="footer-links">
              <button onClick={() => navigate("/help")}>Help</button>
              <span>•</span>
              <button onClick={() => navigate("/contact")}>Contact</button>
              <span>•</span>
              <button onClick={() => navigate("/support")}>Support</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-container {
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

        .forgot-password-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .forgot-password-card {
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

        .forgot-password-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #667eea;
        }

        .forgot-password-header h2 {
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .subtitle {
          color: #64748b;
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

        .helper-text {
          color: #64748b;
          font-size: 13px;
          margin: 8px 0 0;
          font-weight: 400;
        }

        .send-otp-button {
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
          margin-top: 8px;
        }

        .send-otp-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
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

        .back-to-login-button {
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

        .back-to-login-button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .back-to-login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .forgot-password-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }

        .forgot-password-footer p {
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
          .forgot-password-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .forgot-password-header h2 {
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
          .forgot-password-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .forgot-password-header h2 {
            font-size: 22px;
          }
          
          .subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserForgotPassword;