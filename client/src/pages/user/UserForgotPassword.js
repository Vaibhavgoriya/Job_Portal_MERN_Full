
import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post("/users/forgot-password", { email });
      toast.success("OTP sent to your email");
      navigate("/user/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', width: 370, maxWidth: '95vw', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#003366', fontWeight: 900, fontSize: 30, marginBottom: 18, letterSpacing: 0.5, textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Forgot Password?</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: 18, border: '1px solid #e0e0e0', borderRadius: 7, fontSize: 15, background: '#f9fafb', outline: 'none' }}
        />
        <button
          onClick={sendOtp}
          disabled={!email}
          style={{ width: '100%', padding: '15px', background: !email ? '#5c8ae6' : 'linear-gradient(90deg, #003366 0%, #0052cc 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 900, fontSize: 18, letterSpacing: 0.5, cursor: !email ? 'not-allowed' : 'pointer', opacity: !email ? 0.7 : 1, boxShadow: '0 4px 16px rgba(0, 51, 102, 0.10)', textTransform: 'uppercase' }}
        >
          Send OTP
        </button>
      </div>
    </div>
  );
};

export default UserForgotPassword;
