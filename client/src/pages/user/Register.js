import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/register", { name, email, password });
      toast.success("User registered successfully");
      navigate("/user/login");
    } catch (error) {
      const msg = error?.response?.data?.message;
      if (msg && msg.toLowerCase().includes("already")) {
        toast.info("You are Already Registered. Please Login.");
        navigate("/user/login");
        return;
      }
      toast.error(msg || "User register failed");
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ padding: 20 }}>
      <h2>User Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", padding: "10px", marginBottom: "10px", border: "1px solid #ccc", borderRadius: 4 }}
      />
      <button
        type="submit"
        style={{ padding: "10px 20px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
      >
        Register
      </button>
      <button
        type="button"
        onClick={() => navigate("/user/login")}
        style={{ padding: "10px 20px", background: "#43a047", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", marginLeft: "10px" }}
      >
        Already registered? Please login
      </button>
    </form>
  );
}

export default Register;
