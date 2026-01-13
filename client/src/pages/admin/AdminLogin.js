// import axios from "../../api/axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function AdminLogin() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await axios.post("/admin/login", {
//         email,
//         password,
//       });

//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("role", "admin");
//       localStorage.setItem("admin", JSON.stringify(res.data.admin));
//       localStorage.setItem("adminToken", res.data.token);

//       alert("Login successful");
//       navigate("/admin/dashboard");
//     } catch (err) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Admin Login</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         style={{ width: "100%", padding: 10, marginBottom: 10 }}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         style={{ width: "100%", padding: 10, marginBottom: 10 }}
//       />

//       <button onClick={handleLogin}>Admin Login</button>
//     </div>
//   );
// }

// export default AdminLogin;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/admin/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);
      alert("Login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Admin Login
      </button>
      <button
        onClick={() => navigate("/admin/register")}
        style={{
          padding: "10px 20px",
          background: "#43a047",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginLeft: "10px",
        }}
      >
        New admin? Please register
      </button>
      <button
        onClick={() => navigate("/admin/forgot-password")}
        style={{
          padding: "10px 20px",
          background: "#fbc02d",
          color: "#000",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginLeft: "10px",
        }}
      >
        Forgot password?
      </button>
    </div>
  );
}

export default AdminLogin;
