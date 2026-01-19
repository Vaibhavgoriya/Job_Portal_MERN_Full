import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const MyApplications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/applications/my", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchMyApplications();
  }, []);

  const serverBase = "http://localhost:5000";

  return (
    <div style={{
      maxWidth: 700,
      margin: "48px auto",
      background: "rgba(255,255,255,0.96)",
      borderRadius: 22,
      boxShadow: "0 8px 32px rgba(60,72,88,0.13)",
      padding: 38,
      border: "1.5px solid #e0e7ef",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}>
      <h2 style={{ textAlign: "center", color: "#1e293b", fontWeight: 900, fontSize: 30, marginBottom: 24, letterSpacing: 0.5, textShadow: "0 2px 8px rgba(99,102,241,0.10)" }}>My Applications</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && items.length === 0 && <p>No applications found.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {items.map((a) => (
          <div
            key={a._id}
            style={{
              background: "rgba(245,247,255,0.98)",
              border: "1.5px solid #e0e7ef",
              borderRadius: 16,
              padding: 22,
              boxShadow: "0 4px 16px rgba(99,102,241,0.10)",
              marginBottom: 2,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ fontWeight: 900, color: "#1e293b", fontSize: 18, letterSpacing: 0.5 }}>{a.job?.title || "-"}</div>
            <div style={{ color: "#334155", fontWeight: 700, fontSize: 15 }}>{a.job?.company || "-"}</div>
            <div style={{ marginTop: 6, fontSize: 15, color: "#475569", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontWeight: 700 }}>Status:</span>
              <span style={{
                textTransform: "capitalize",
                fontWeight: 800,
                fontSize: 16,
                color:
                  a.status === "approved"
                    ? "#22c55e"
                    : a.status === "rejected"
                    ? "#ef4444"
                    : "#f59e42",
                letterSpacing: 0.5,
              }}>{a.status || "pending"}</span>
              {a.status === "approved" && <span style={{ fontSize: 20, color: "#22c55e" }}>✔️</span>}
              {a.status === "rejected" && <span style={{ fontSize: 20, color: "#ef4444" }}>❌</span>}
              {(!a.status || a.status === "pending") && <span style={{ fontSize: 20, color: "#f59e42" }}>⏳</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
