// import React, { useState } from "react";
// import axios from "axios";

// function AdminRegister() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();

//     try {
//   const res = await axios.post(
//     "http://localhost:5000/api/admin/auth/register",
//     { name, email, password }
//   );

//   toast.success(res.data.message);
// } catch (error) {
//   toast.error(error.response.data.message);
// }

//   };

//   return (
//     <form onSubmit={handleRegister}>
//       <h2>Admin Register</h2>

//       <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
//       <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button type="submit">Register</button>
//     </form>
//   );
// }

// export default AdminRegister;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";

function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/admin/register",
        { name, email, password }
      );
      toast.success("Admin registered successfully");
      navigate("/admin/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.toLowerCase().includes("already")
      ) {
        toast.info("You are Already Registered. Please Login.");
        navigate("/admin/login");
      } else {
        toast.error("Admin register failed");
      }
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ padding: 20 }}>
      <h2>Admin Register</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
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
        required
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <button type="submit"
        style={{
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Register
      </button>
      <button
        type="button"
        onClick={() => navigate("/admin/login")}
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
        Already registered? Please login
      </button>
    </form>
  );
}

export default AdminRegister;
