import { useState } from "react";
import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;

  const [password, setPassword] = useState("");


  const resetPassword = async () => {
    try {
      await axios.post("/admin/reset-password", {
        email,
        newPassword: password,
      });
      toast.success("Admin password updated");
      navigate("/admin/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Segoe UI, Arial, sans-serif' }}>
      <div style={{
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 8px 32px rgba(60,72,88,0.12)',
        width: 420,
        maxWidth: '95vw',
        padding: '48px 40px 40px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'box-shadow 0.2s',
      }}>
        <h2 style={{
          color: '#003366',
          fontWeight: 900,
          fontSize: 30,
          marginBottom: 28,
          letterSpacing: 0.5,
          textAlign: 'center',
          fontFamily: 'inherit',
          textShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          Admin Reset Password
        </h2>
        <input
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '16px',
            marginBottom: 24,
            border: '1.5px solid #dbeafe',
            borderRadius: 8,
            fontSize: 17,
            background: '#f8fafc',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border 0.2s',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={resetPassword}
          disabled={!password}
          style={{
            width: '100%',
            padding: '15px',
            background: !password ? '#5c8ae6' : 'linear-gradient(90deg, #003366 0%, #0052cc 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: 0.5,
            cursor: !password ? 'not-allowed' : 'pointer',
            opacity: !password ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(0, 51, 102, 0.10)',
            fontFamily: 'inherit',
            transition: 'background 0.2s',
            textTransform: 'uppercase',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default AdminResetPassword;
