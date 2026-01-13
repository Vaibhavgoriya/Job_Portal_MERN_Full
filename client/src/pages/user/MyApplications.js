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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h2>My Applications</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && items.length === 0 && <p>No applications found.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((a) => (
          <div
            key={a._id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 14,
              boxShadow: "0 8px 22px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ fontWeight: 900, color: "#0f172a" }}>{a.job?.title || "-"}</div>
            <div style={{ marginTop: 4, color: "#334155", fontWeight: 700 }}>
              {a.job?.company || "-"}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
              Status: <b style={{ textTransform: "capitalize" }}>{a.status || "pending"}</b>
            </div>
            {a.resumeUrl && (
              <div style={{ marginTop: 10 }}>
                <a
                  href={`${serverBase}${a.resumeUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1d4ed8", fontWeight: 800 }}
                >
                  View Resume
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
