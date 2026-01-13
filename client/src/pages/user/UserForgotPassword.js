import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const UserForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      await axios.post("/users/forgot-password", { email });
      alert("OTP sent to user email");
      navigate("/user/verify-otp", { state: { email } });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button onClick={sendOtp} disabled={!email}>
        Send OTP
      </button>
    </div>
  );
};

export default UserForgotPassword;
