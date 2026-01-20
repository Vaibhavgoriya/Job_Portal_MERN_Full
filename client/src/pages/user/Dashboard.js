import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import ApplyJobModal from "../../components/user/ApplyJobModal";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  
  const handleApplications = () => {
    navigate("/user/my-applications");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/jobs");
        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Get unique locations (main IT cities in India)
  const mainCities = [
    "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", "Kolkata", "Mumbai", "Noida", "Pune", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Morbi", "Anand", "Nadiad", "Mehsana", "Navsari", "Bharuch", "Vapi", "Remote"
  ];
  const jobCities = Array.from(new Set(jobs.map(j => j.location).filter(l => l && mainCities.includes(l))));
  const locationOptions = Array.from(new Set(["Remote", ...jobCities]));

  // Get unique technologies from jobs
  const allTechs = Array.from(new Set(jobs.flatMap(j => Array.isArray(j.technology) ? j.technology : (typeof j.technology === "string" ? j.technology.split(",").map(t => t.trim()) : [])))).filter(Boolean);
  // Remove 'MERN' from technology list if present
  const filteredTechs = allTechs.filter(t => t.toLowerCase() !== "mern");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    navigate("/user/login");
  };

  // New: Handlers for navbar buttons
  const handleJobs = () => {
    navigate("/user/dashboard");
  };
  const handleProfile = () => {
    navigate("/user/profile"); // Change route as per your app
  };

  const cards = useMemo(() => {
    return jobs
      .filter(job => {
        // Location filter
        if (locationFilter && job.location !== locationFilter) return false;
        // Technology filter
        const techArr = Array.isArray(job.technology) ? job.technology : (typeof job.technology === "string" ? job.technology.split(",").map(t => t.trim()) : []);
        if (techFilter && !techArr.includes(techFilter)) return false;
        return true;
      })
      .map((job) => {
        const tech = job.Technology ?? job.technology ?? job.technologyName ?? "-";
        const exp = job.Experience ?? job.experience ?? job.experienceValue ?? "-";
        return (
          <div key={job._id} style={card}>
            <div style={cardTop}>
              <div>
                <div style={role}>{job.title}</div>
                <div style={company}>{job.company}</div>
              </div>
              <div style={pillRow}>
                <span style={pill}>₹ {job.salary || "Not specified"}</span>
                <span style={pillSecondary}>{job.location || "-"}</span>
              </div>
            </div>

            <div style={metaGrid}>
              <div>
                <div style={metaLabel}>Technology</div>
                <div style={metaValue}>{Array.isArray(tech) ? tech.join(", ") : tech}</div>
              </div>
              <div>
                <div style={metaLabel}>Experience</div>
                <div style={metaValue}>{exp}</div>
              </div>
            </div>

            <div style={desc}>{job.description || ""}</div>

            <div style={actions}>
              <button style={applyBtn} onClick={() => setSelectedJob(job)}>
                Apply Now
              </button>
            </div>
          </div>
        );
      });
  }, [jobs, locationFilter, techFilter]);

  return (
    <div style={page}>
      <div style={userNavWrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={userNavTitle}>User Dashboard</span>
          <button onClick={handleJobs} style={userNavBtn} onMouseOver={e => e.currentTarget.style.background = userNavBtnHover.background} onMouseOut={e => e.currentTarget.style.background = userNavBtn.background}>
            Jobs
          </button>
          <button onClick={handleProfile} style={userNavBtn} onMouseOver={e => e.currentTarget.style.background = userNavBtnHover.background} onMouseOut={e => e.currentTarget.style.background = userNavBtn.background}>
            My Profile
          </button>
            <button onClick={handleApplications} style={userNavBtn} onMouseOver={e => e.currentTarget.style.background = userNavBtnHover.background} onMouseOut={e => e.currentTarget.style.background = userNavBtn.background}>
              My Applications
            </button>
        </div>
        <button onClick={handleLogout} style={userLogoutBtn} onMouseOver={e => e.currentTarget.style.background = userLogoutBtnHover.background} onMouseOut={e => e.currentTarget.style.background = userLogoutBtn.background}>
          Logout
        </button>
      </div>

      {loading && <div style={info}>Loading...</div>}
      {error && <div style={{ ...info, color: "#b91c1c" }}>{error}</div>}
      {!loading && !error && jobs.length === 0 && <div style={info}>No jobs found.</div>}

      {/* Filters */}
      <div style={{ maxWidth: 1100, margin: "0 auto 18px", display: "flex", gap: 18 }}>
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e6eaf2", fontWeight: 700 }}>
          <option value="">All Locations</option>
          {locationOptions.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <select value={techFilter} onChange={e => setTechFilter(e.target.value)} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #e6eaf2", fontWeight: 700 }}>
          <option value="">All Technologies</option>
          {filteredTechs.map(tech => (
            <option key={tech} value={tech}>{tech}</option>
          ))}
        </select>
      </div>
      <div style={{paddingTop: 0, paddingBottom: 40}}>
        <div style={grid}>
          {cards}
          {Array.from({ length: Math.max(0, 3 - cards.length) }).map((_, i) => (
            <div key={"empty-" + i} style={{ visibility: "hidden" }} />
          ))}
        </div>
      </div>

      <ApplyJobModal
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onSuccess={() => {}}
      />
    </div>
  );
};

const page = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f6f8fc 0%, #eef2ff 100%)",
  padding: "28px 16px 40px",
  fontFamily: "Segoe UI, Arial, sans-serif",
};

const userNavWrap = {
  maxWidth: 1200,
  margin: '0 auto 36px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'linear-gradient(90deg, #f3f6fd 0%, #e0e7ef 100%)',
  border: '1.5px solid #d1d5db',
  borderRadius: 24,
  padding: '20px 44px',
  boxShadow: '0 8px 32px rgba(60,72,88,0.10)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
};

const userNavTitle = {
  fontSize: 32,
  fontWeight: 900,
  color: '#0f172a',
  letterSpacing: 0.5,
  textShadow: '0 2px 8px rgba(99,102,241,0.10)',
  marginRight: 22,
  padding: '0 14px',
  borderRadius: 10,
  background: 'rgba(236,245,255,0.7)',
};

const userNavBtn = {
  padding: '12px 28px',
  background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  fontWeight: 800,
  fontSize: 17,
  letterSpacing: 0.5,
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(99,102,241,0.13)',
  marginLeft: 0,
  marginRight: 0,
  textTransform: 'uppercase',
  transition: 'background 0.2s, box-shadow 0.2s',
};
// You can further tweak button hover and logout button styles as needed
const userNavBtnHover = {
  background: 'linear-gradient(90deg, #4f46e5 0%, #2563eb 100%)',
};

const userLogoutBtn = {
  padding: '12px 28px',
  background: 'linear-gradient(90deg, #e53935 0%, #ff7043 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontWeight: 800,
  fontSize: 17,
  letterSpacing: 0.5,
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(229,57,53,0.13)',
  textTransform: 'uppercase',
  transition: 'background 0.2s, box-shadow 0.2s',
};
const userLogoutBtnHover = {
  background: 'linear-gradient(90deg, #b91c1c 0%, #f87171 100%)',
};

const title = { fontSize: 22, fontWeight: 900, color: "#0f172a" };


const logoutBtn = {
  padding: "10px 14px",
  background: "linear-gradient(90deg, #e53935 0%, #ff7043 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 6px 16px rgba(229,57,53,0.22)",
};

// New: navBtn style for navbar buttons
const navBtn = {
  padding: "8px 18px",
  background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 15,
  boxShadow: "0 4px 12px rgba(99,102,241,0.13)",
};

const info = {
  maxWidth: 1100,
  margin: "0 auto 16px",
  padding: "12px 14px",
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e6eaf2",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
  color: "#0f172a",
};

const grid = {
  maxWidth: 1100,
  margin: "32px auto 40px auto",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  columnGap: 24,
  rowGap: 64,
  alignItems: "start",
  minHeight: 0,
  height: "auto",
};

const card = {
  background: "rgba(255,255,255,0.98)",
  borderRadius: 18,
  border: "1px solid #e6eaf2",
  padding: "18px 18px 2px 18px", // reduced bottom padding
  boxShadow: "0 12px 34px rgba(15, 23, 42, 0.10)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
  minHeight: 260,
  height: "100%",
  marginBottom: 10, // reduce if needed
};

const cardTop = { display: "flex", justifyContent: "space-between", gap: 12 };
const role = { fontSize: 18, fontWeight: 900, color: "#0f172a" };
const company = { marginTop: 4, fontSize: 14, fontWeight: 700, color: "#334155" };

const pillRow = { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 };

const pill = {
  fontSize: 12,
  fontWeight: 900,
  color: "#0f172a",
  background: "#eef2ff",
  border: "1px solid #c7d2fe",
  padding: "6px 10px",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

const pillSecondary = {
  fontSize: 12,
  fontWeight: 800,
  color: "#0f172a",
  background: "#ecfeff",
  border: "1px solid #a5f3fc",
  padding: "6px 10px",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

const metaGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: 12,
};

const metaLabel = { fontSize: 11, fontWeight: 900, color: "#64748b", letterSpacing: 0.6, textTransform: "uppercase" };
const metaValue = { marginTop: 4, fontSize: 14, fontWeight: 800, color: "#0f172a" };

const desc = {
  color: "#334155",
  fontSize: 13,
  lineHeight: 1.45,
  minHeight: 40,
};

const actions = { display: "flex", justifyContent: "flex-end" };

const applyBtn = {
  padding: "10px 14px",
  background: "linear-gradient(90deg, #003366 0%, #0052cc 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 10px 22px rgba(0,82,204,0.18)",
};

export default Dashboard;