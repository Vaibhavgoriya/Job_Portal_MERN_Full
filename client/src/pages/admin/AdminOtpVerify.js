import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function AdminOtpVerify() {
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
      await axios.post("/admin/verify-otp", { email, otp });
      toast.success("Admin OTP verified successfully!");
      navigate("/admin/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post("/admin/forgot-password", { email });
      toast.success("New OTP has been sent to your admin email!");
      setTimer(60);
      setResendActive(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify(e);
    }
  };

  return (
    <div className="admin-otp-verify-container">
      <div className="admin-otp-verify-card">
        <div className="admin-otp-verify-header">
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
              <path d="M15 7h3a5 5 0 015 5 5 5 0 01-5 5h-3m-6 0H6a5 5 0 01-5-5 5 5 0 015-5h3m-1 5h8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2>Verify Admin OTP</h2>
          <p className="subtitle">
            We've sent a 6-digit security code to <strong>{email}</strong>.
            Enter it below to continue with password reset.
          </p>
        </div>

        <form onSubmit={handleVerify} className="admin-otp-form">
          <div className="form-group">
            <label htmlFor="admin-otp-input">Enter Security Code</label>
            <input
              id="admin-otp-input"
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
              Enter the 6-digit verification code sent to your admin email
            </p>
          </div>

          <div className="security-note">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Security Notice:</strong> This OTP is valid for 10 minutes only.
              All verification attempts are logged in the admin audit trail.
            </div>
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={!otp || otp.length !== 6 || loading}
          >
            {loading ? (
              <span className="loading-spinner">
                <span className="spinner"></span>
                Verifying OTP...
              </span>
            ) : (
              "Verify Admin OTP"
            )}
          </button>

          <div className="timer-section">
            {resendActive ? (
              <button
                onClick={handleResend}
                className="resend-button"
                disabled={loading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"></path>
                </svg>
                Resend Admin OTP
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
            <span>Need assistance?</span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/forgot-password")}
            className="back-button"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Try different admin email
          </button>

          <div className="admin-otp-footer">
            <p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Admin OTP verification includes additional security checks.
            </p>
            <div className="footer-links">
              <button onClick={() => {/* Add security page */}}>Security</button>
              <span>•</span>
              <button onClick={() => {/* Add audit page */}}>Audit Log</button>
              <span>•</span>
              <button onClick={() => {/* Add support page */}}>Admin Support</button>
            </div>
            <p className="copyright">© {new Date().getFullYear()} CompanyName Admin Portal</p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-otp-verify-container {
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

        .admin-otp-verify-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #dc2626 0%, #7c2d12 100%);
        }

        .admin-otp-verify-card {
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

        .admin-otp-verify-header {
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

        .admin-otp-verify-header h2 {
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

        .subtitle strong {
          color: #f8fafc;
          font-weight: 600;
        }

        .admin-otp-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 28px;
          text-align: center;
        }

        .form-group label {
          display: block;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
          letter-spacing: -0.2px;
        }

        .otp-input {
          width: 280px;
          padding: 18px;
          background: rgba(15, 23, 42, 0.7);
          border: 2px solid #334155;
          border-radius: 12px;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 12px;
          text-align: center;
          transition: all 0.25s ease;
          color: #f8fafc;
          font-family: monospace;
          display: block;
          margin: 0 auto;
        }

        .otp-input::placeholder {
          color: #475569;
          letter-spacing: 12px;
        }

        .otp-input:focus {
          outline: none;
          border-color: #dc2626;
          box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
        }

        .otp-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .helper-text {
          color: #94a3b8;
          font-size: 13px;
          margin: 12px 0 0;
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

        .security-note strong {
          color: #f8fafc;
          font-weight: 600;
        }

        .verify-button {
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

        .verify-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
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
          background: rgba(30, 41, 59, 0.7);
          color: #cbd5e1;
          border: 1.5px solid #475569;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .resend-button:hover:not(:disabled) {
          background: rgba(220, 38, 38, 0.1);
          border-color: #dc2626;
          color: #fca5a5;
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
          color: #94a3b8;
          font-size: 15px;
          font-weight: 500;
          padding: 12px 24px;
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
          border: 1px solid #334155;
        }

        .timer-display svg {
          color: #64748b;
        }

        .timer-count {
          color: #dc2626;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
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

        .back-button {
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

        .back-button:hover:not(:disabled) {
          background: rgba(220, 38, 38, 0.1);
          border-color: #dc2626;
          color: #fca5a5;
          transform: translateY(-1px);
        }

        .back-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .admin-otp-footer {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #334155;
          text-align: center;
        }

        .admin-otp-footer p {
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

        .admin-otp-footer p svg {
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
          .admin-otp-verify-card {
            padding: 40px 24px;
            border-radius: 12px;
          }
          
          .admin-otp-verify-header h2 {
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
          
          .security-note {
            padding: 14px;
            font-size: 12px;
          }
        }

        @media (max-width: 360px) {
          .admin-otp-verify-card {
            padding: 32px 20px;
          }
          
          .logo {
            flex-direction: column;
            gap: 8px;
          }
          
          .admin-otp-verify-header h2 {
            font-size: 22px;
          }
          
          .subtitle {
            font-size: 14px;
          }
          
          .otp-input {
            font-size: 24px;
            letter-spacing: 8px;
          }
          
          .admin-otp-footer p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminOtpVerify;