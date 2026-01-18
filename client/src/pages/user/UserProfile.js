import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    skills: "",
    profilePic: "",
    resume: ""
  });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    axios.get("/users/profile")
      .then(res => {
        setProfile(res.data);
      })
      .catch(err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem("userToken");
          localStorage.removeItem("token");
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePicChange = e => {
    setFile(e.target.files[0]);
  };

  const handleResumeChange = e => {
    setResumeFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let profilePicUrl = profile.profilePic;
      let resumeUrl = profile.resume;
      if (file) {
        const formData = new FormData();
        formData.append("profilePic", file);
        const res = await axios.post("/users/upload-profile-pic", formData, { headers: { "Content-Type": "multipart/form-data" } });
        profilePicUrl = res.data.url;
      }
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        const res = await axios.post("/users/upload-resume", formData, { headers: { "Content-Type": "multipart/form-data" } });
        resumeUrl = res.data.url;
      }
      await axios.put("/users/profile", { ...profile, profilePic: profilePicUrl, resume: resumeUrl });
      // Fetch updated profile after save
      const updated = await axios.get("/users/profile");
      setProfile(updated.data);
      setEdit(false);
      alert("Profile updated");
    } catch (err) {
      alert("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 480,
      margin: "48px auto",
      background: "rgba(255,255,255,0.92)",
      borderRadius: 22,
      boxShadow: "0 8px 32px rgba(60,72,88,0.13)",
      padding: 38,
      border: "1.5px solid #e0e7ef",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
    }}>
      <h2 style={{
        textAlign: "center",
        color: "#1e293b",
        fontWeight: 900,
        fontSize: 32,
        letterSpacing: 0.5,
        marginBottom: 18,
        textShadow: "0 2px 8px rgba(99,102,241,0.10)",
      }}>My Profile</h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
        <img
          src={profile.profilePic ? `http://localhost:5000${profile.profilePic}` : "https://ui-avatars.com/api/?name=" + profile.name}
          alt="Profile"
          style={{
            width: 110,
            height: 110,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 14,
            boxShadow: "0 4px 16px rgba(99,102,241,0.13)",
            border: "3px solid #e0e7ef",
            background: "#f3f6fa",
          }}
        />
        {edit && <input type="file" accept="image/*" onChange={handlePicChange} style={{ marginTop: 6 }} />}
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Name</label>
        <input name="name" value={profile.name} onChange={handleChange} disabled={!edit} style={{ width: "100%", padding: 12, marginBottom: 4, borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 16, background: edit ? "#fff" : "#f3f3f3" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Email</label>
        <input name="email" value={profile.email} disabled style={{ width: "100%", padding: 12, marginBottom: 4, borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 16, background: "#f3f3f3" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Phone</label>
        <input name="phone" value={profile.phone} onChange={handleChange} disabled={!edit} style={{ width: "100%", padding: 12, marginBottom: 4, borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 16, background: edit ? "#fff" : "#f3f3f3" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Address</label>
        <input name="address" value={profile.address} onChange={handleChange} disabled={!edit} style={{ width: "100%", padding: 12, marginBottom: 4, borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 16, background: edit ? "#fff" : "#f3f3f3" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Education</label>
        <input name="education" value={profile.education} onChange={handleChange} disabled={!edit} style={{ width: "100%", padding: 12, marginBottom: 4, borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 16, background: edit ? "#fff" : "#f3f3f3" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Experience</label>
        <input name="experience" value={profile.experience} onChange={handleChange} disabled={!edit} style={{ width: "100%", padding: 12, marginBottom: 4, borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 16, background: edit ? "#fff" : "#f3f3f3" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Skills</label>
        <input name="skills" value={profile.skills} onChange={handleChange} disabled={!edit} style={{ width: "100%", padding: 12, marginBottom: 4, borderRadius: 8, border: "1.5px solid #e0e7ef", fontSize: 16, background: edit ? "#fff" : "#f3f3f3" }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontWeight: 700, color: "#334155", marginBottom: 4, display: "block" }}>Resume</label>
        {profile.resume && (
          <a
            href={`http://localhost:5000${profile.resume}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "8px 18px",
              background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
              color: "#fff",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              marginTop: 4,
              boxShadow: "0 2px 8px rgba(99,102,241,0.13)",
            }}
          >
            View Resume
          </a>
        )}
        {edit && <input type="file" accept="application/pdf" onChange={handleResumeChange} style={{ marginTop: 6 }} />}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 18 }}>
        {!edit ? (
          <button onClick={() => setEdit(true)} style={{
            padding: "12px 28px",
            background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 800,
            fontSize: 17,
            letterSpacing: 0.5,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(99,102,241,0.13)",
            textTransform: "uppercase",
            transition: "background 0.2s, box-shadow 0.2s",
          }}>Edit</button>
        ) : (
          <>
            <button onClick={handleSave} disabled={loading} style={{
              padding: "12px 28px",
              background: loading ? "#5c8ae6" : "#0052cc",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: 0.5,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(99,102,241,0.13)",
              textTransform: "uppercase",
              transition: "background 0.2s, box-shadow 0.2s",
            }}>{loading ? "Saving..." : "Save"}</button>
            <button onClick={() => setEdit(false)} style={{
              padding: "12px 28px",
              background: "linear-gradient(90deg, #e53935 0%, #ff7043 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: 0.5,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(229,57,53,0.13)",
              textTransform: "uppercase",
              transition: "background 0.2s, box-shadow 0.2s",
            }}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
