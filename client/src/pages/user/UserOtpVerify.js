import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function UserOtpVerify() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendActive, setResendActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setResendActive(true);
    }
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/users/verify-otp", { email, otp });
      toast.success("OTP verified successfully!");
      navigate("/user/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post("/users/forgot-password", { email });
      toast.success("New OTP has been sent to your email!");
      setTimer(60);
      setResendActive(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify(e);
    }
  };

  return (
    <div className="otp-verify-container">
      <div className="otp-verify-card">
        <div className="otp-verify-header">
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
              <path d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3m-1 5h8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2>Verify OTP</h2>
          <p className="subtitle">
            We've sent a 6-digit code to <strong>{email}</strong>. Enter it below to continue.
          </p>
        </div>

        <form onSubmit={handleVerify} className="otp-form">
          <div className="form-group">
            <label htmlFor="otp-input">Enter OTP Code</label>
            <input
              id="otp-input"
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyPress={handleKeyPress}
              className="otp-input"
              disabled={loading}
              maxLength="6"
              pattern="\d*"
              inputMode="numeric"
              required
            />
            <p className="helper-text">
              Enter the 6-digit verification code sent to your email
            </p>
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={!otp || otp.length !== 6 || loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Verifying...
              </span>
            ) : (
              "Verify OTP"
            )}
          </button>

          <div className="timer-section">
            {resendActive ? (
              <button
                onClick={handleResend}
                className="resend-button"
                disabled={loading}
              >
                Resend OTP
              </button>
            ) : (
              <div className="timer-display">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>Resend OTP in <span className="timer-count">{timer}</span> seconds</span>
              </div>
            )}
          </div>

          <div className="divider">
            <span>Need help?</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/user/forgot-password")}
            className="back-button"
            disabled={loading}
          >
            Try another email
          </button>

          <div className="otp-footer">
            <p>© {new Date().getFullYear()} CompanyName. All rights reserved.</p>
            <div className="footer-links">
              <button onClick={() => navigate("/help")}>Help Center</button>
              <span>•</span>
              <button onClick={() => navigate("/contact")}>Contact Us</button>
              <span>•</span>
              <button onClick={() => navigate("/support")}>Support</button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .otp-verify-container {
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

        .otp-verify-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .otp-verify-card {
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

        .otp-verify-header {
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

        .otp-verify-header h2 {
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

        .subtitle strong {
          color: #334155;
          font-weight: 600;
        }

        .otp-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 28px;
          text-align: center;
        }

        .form-group label {
          display: block;
          color: #334155;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          letter-spacing: -0.2px;
        }

        .otp-input {
          width: 280px;
          padding: 18px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 12px;
          text-align: center;
          transition: all 0.25s ease;
          background: #ffffff;
          color: #1e293b;
          font-family: monospace;
          display: block;
          margin: 0 auto;
        }

        .otp-input::placeholder {
          color: #cbd5e1;
          letter-spacing: 12px;
        }

        .otp-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
        }

        .otp-input:disabled {
          background-color: #f8fafc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .helper-text {
          color: #64748b;
          font-size: 13px;
          margin: 12px 0 0;
          font-weight: 400;
        }

        .verify-button {
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

        .verify-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.25);
        }

        .verify-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .verify-button:disabled {
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

        .timer-section {
          margin: 24px 0;
          text-align: center;
        }

        .resend-button {
          padding: 14px 32px;
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-block;
        }

        .resend-button:hover:not(:disabled) {
          background: #f8fafc;
          transform: translateY(-1px);
        }

        .resend-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .timer-display {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #64748b;
          font-size: 15px;
          font-weight: 500;
          padding: 12px 24px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .timer-display svg {
          color: #94a3b8;
        }

        .timer-count {
          color: #667eea;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
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

        .back-button {
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

        .back-button:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #475569;
        }

        .back-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .otp-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }

        .otp-footer p {
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
          .otp-verify-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .otp-verify-header h2 {
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
          
          .otp-input {
            width: 100%;
            max-width: 280px;
            font-size: 28px;
            padding: 16px;
          }
        }

        @media (max-width: 360px) {
          .otp-verify-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .otp-verify-header h2 {
            font-size: 22px;
          }
          
          .subtitle {
            font-size: 14px;
          }
          
          .otp-input {
            font-size: 24px;
            letter-spacing: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default UserOtpVerify;