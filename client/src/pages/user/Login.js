import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "user");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.token);
      alert("Login successful");
      navigate("/user/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        User Login
      </button>
      <button
        onClick={() => navigate("/user/register")}
        style={{ padding: "10px 20px", background: "#43a047", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: "10px" }}
      >
        New user? Please register
      </button>
      <button
        onClick={() => navigate("/user/forgot-password")}
        style={{ padding: "10px 20px", background: "#fbc02d", color: "#000", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: "10px" }}
      >
        Forgot password?
      </button>
    </div>
  );
}

export default Login;
