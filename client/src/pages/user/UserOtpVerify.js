import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

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
    }
    setResendActive(true);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/users/verify-otp", { email, otp });
      alert("OTP verified");
      navigate("/user/reset-password", { state: { email } });
    } catch (err) {
      alert("Invalid OTP");
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post("/users/forgot-password", { email });
      alert("OTP resent to your email");
      setTimer(60);
      setResendActive(false);
    } catch (err) {
      alert("Failed to resend OTP");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        {resendActive ? (
          <button onClick={handleResend} disabled={loading}>
            Resend OTP
          </button>
        ) : (
          <span>Resend OTP in {timer} sec</span>
        )}
      </div>
    </div>
  );
}

export default UserOtpVerify;
