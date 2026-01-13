import React, { useRef, useState } from "react";
import axios from "../../api/axios";

const ApplyJobModal = ({ job, open, onClose, onSuccess }) => {
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Please select a PDF resume");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("jobId", job._id);
    formData.append("resume", file);
    try {
      await axios.post("/applications/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      onSuccess && onSuccess();
      onClose();
      alert("Application submitted successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Apply for {job.title}</h3>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="application/pdf" ref={fileRef} required style={input} />
          <button type="submit" style={button} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <button onClick={onClose} style={closeBtn}>Close</button>
      </div>
    </div>
  );
};


const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(30, 41, 59, 0.18)",
  backdropFilter: "blur(2.5px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};
const modal = {
  background: "rgba(255,255,255,0.95)",
  borderRadius: 18,
  boxShadow: "0 8px 32px rgba(60,72,88,0.18)",
  padding: 38,
  minWidth: 340,
  maxWidth: 420,
  width: "100%",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};
const input = {
  marginBottom: 18,
  width: "100%",
  padding: 12,
  borderRadius: 7,
  border: "1.5px solid #e0e0e0",
  fontSize: 15,
  background: "#f9fafb",
  outline: "none",
};
const button = {
  background: "linear-gradient(90deg, #1976d2 0%, #43a047 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 7,
  padding: "12px 28px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 16,
  marginRight: 10,
  marginTop: 8,
  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.10)",
  transition: "background 0.2s, box-shadow 0.2s",
};
const closeBtn = {
  background: "#f3f4f6",
  color: "#333",
  border: "none",
  borderRadius: 7,
  padding: "10px 22px",
  cursor: "pointer",
  marginTop: 18,
  fontWeight: 600,
  fontSize: 15,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
};

export default ApplyJobModal;
