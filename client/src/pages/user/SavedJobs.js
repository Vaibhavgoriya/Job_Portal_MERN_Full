
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get("/users/saved-jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // Unsave job handler
  const handleUnsave = async (jobId) => {
    try {
      await axios.post("/users/toggle-save-job", { jobId });
      // Refresh saved jobs after unsaving
      fetchSavedJobs();
    } catch (err) {
      setError("Failed to unsave job");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "48px auto", background: "rgba(255,255,255,0.96)", borderRadius: 22, boxShadow: "0 8px 32px rgba(60,72,88,0.13)", padding: 38, border: "1.5px solid #e0e7ef", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
      <h2 style={{ textAlign: "center", color: "#1e293b", fontWeight: 900, fontSize: 30, marginBottom: 24, letterSpacing: 0.5, textShadow: "0 2px 8px rgba(99,102,241,0.10)" }}>Saved Jobs</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && jobs.length === 0 && <p>No saved jobs found.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {jobs.map((job) => (
          <div key={job._id} style={{ background: "rgba(245,247,255,0.98)", border: "1.5px solid #e0e7ef", borderRadius: 16, padding: 22, boxShadow: "0 4px 16px rgba(99,102,241,0.10)", marginBottom: 2, display: "flex", flexDirection: "column", gap: 8, position: 'relative' }}>
            <div style={{ fontWeight: 900, color: "#1e293b", fontSize: 18, letterSpacing: 0.5 }}>{job.title || "-"}</div>
            <div style={{ color: "#334155", fontWeight: 700, fontSize: 15 }}>{job.company || "-"}</div>
            <div style={{ marginTop: 6, fontSize: 15, color: "#475569" }}>
              <span style={{ fontWeight: 700 }}>Location:</span> {job.location || "-"}
            </div>
            <div style={{ fontSize: 15, color: "#475569" }}>
              <span style={{ fontWeight: 700 }}>Technology:</span> {Array.isArray(job.technology) ? job.technology.join(", ") : job.technology || "-"}
            </div>
            <div style={{ fontSize: 15, color: "#475569" }}>
              <span style={{ fontWeight: 700 }}>Salary:</span> ₹ {job.salary || "Not specified"}
            </div>
            <div style={{ fontSize: 15, color: "#475569" }}>
              <span style={{ fontWeight: 700 }}>Experience:</span> {job.experience || "-"}
            </div>
            <div style={{ fontSize: 15, color: "#475569" }}>
              <span style={{ fontWeight: 700 }}>Description:</span> {job.description || "-"}
            </div>
            <button
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: 'linear-gradient(90deg, #ef4444 0%, #fbbf24 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239,68,68,0.10)',
                zIndex: 1,
              }}
              onClick={() => handleUnsave(job._id)}
            >
              Unsave
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
