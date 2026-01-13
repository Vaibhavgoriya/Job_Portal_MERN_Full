import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

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
    setLoading(true);
    try {
      await axios.post("/admin/verify-otp", { email, otp });
      alert("OTP verified");
      navigate("/admin/reset-password", { state: { email } });
    } catch (err) {
      alert("Invalid OTP");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post("/admin/forgot-password", { email });
      alert("OTP resent to your email");
      setTimer(60);
      setResendActive(false);
    } catch (err) {
      alert("Failed to resend OTP");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', width: 370, maxWidth: '95vw', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#003366', fontWeight: 900, fontSize: 30, marginBottom: 18, letterSpacing: 0.5, textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Verify OTP</h2>
        <form onSubmit={handleVerify} style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', marginBottom: 18, border: '1px solid #e0e0e0', borderRadius: 7, fontSize: 15, background: '#f9fafb', outline: 'none', textAlign: 'center', letterSpacing: 4 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: loading ? '#5c8ae6' : 'linear-gradient(90deg, #003366 0%, #0052cc 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 18, letterSpacing: 0.5, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px rgba(0, 51, 102, 0.10)', textTransform: 'uppercase' }}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <div style={{ marginTop: 16, width: '100%' }}>
          {resendActive ? (
            <button
              onClick={handleResend}
              disabled={loading}
              style={{ width: '100%', padding: '15px', background: loading ? '#81c784' : 'linear-gradient(90deg, #006400 0%, #43a047 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 18, letterSpacing: 0.5, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px rgba(0, 51, 102, 0.10)', textTransform: 'uppercase' }}
            >
              Resend OTP
            </button>
          ) : (
            <span style={{ color: '#888', fontSize: 15 }}>Resend OTP in {timer} sec</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOtpVerify;
