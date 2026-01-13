import { useState } from "react";
import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

const UserResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const [password, setPassword] = useState("");

  const resetPassword = async () => {
    try {
      await axios.post("/users/reset-password", {
        email,
        newPassword: password,
      });
      alert("User password updated");
      navigate("/user/login");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Reset Password</h2>
      <input
        type="password"
        placeholder="Enter your new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button onClick={resetPassword} disabled={!password}>
        Reset
      </button>
    </div>
  );
};

export default UserResetPassword;
