import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    education: "",
    experience: "",
    skills: "",
    profilePic: "",
    resume: "",
  });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    // Fetch user profile (replace with actual API endpoint)
    axios.get("/users/profile").then((res) => {
      setProfile(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePicChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleResumeChange = (e) => {
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
        const res = await axios.post("/users/upload-profile-pic", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        profilePicUrl = res.data.url;
      }
      if (resumeFile) {
        const formData = new FormData();
        formData.append("resume", resumeFile);
        const res = await axios.post("/users/upload-resume", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resumeUrl = res.data.url;
      }
      await axios.put("/users/profile", {
        ...profile,
        profilePic: profilePicUrl,
        resume: resumeUrl,
      });
      setEdit(false);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Failed to update profile");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        padding: 32,
      }}
    >
      <h2 style={{ textAlign: "center", color: "#003366", fontWeight: 900 }}>
        My Profile
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <img
          src={
            profile.profilePic ||
            "https://ui-avatars.com/api/?name=" + profile.name
          }
          alt="Profile"
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: 12,
          }}
        />
        {edit && (
          <input type="file" accept="image/*" onChange={handlePicChange} />
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Name</label>
        <input
          name="name"
          value={profile.name}
          onChange={handleChange}
          disabled={!edit}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Email</label>
        <input
          name="email"
          value={profile.email}
          disabled
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 8,
            background: "#f3f3f3",
          }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Phone</label>
        <input
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          disabled={!edit}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Address</label>
        <input
          name="address"
          value={profile.address}
          onChange={handleChange}
          disabled={!edit}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Education</label>
        <input
          name="education"
          value={profile.education}
          onChange={handleChange}
          disabled={!edit}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Experience</label>
        <input
          name="experience"
          value={profile.experience}
          onChange={handleChange}
          disabled={!edit}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Skills</label>
        <input
          name="skills"
          value={profile.skills}
          onChange={handleChange}
          disabled={!edit}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Resume</label>
        {profile.resume && (
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
        )}
        {edit && (
          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeChange}
          />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
        {!edit ? (
          <button
            onClick={() => setEdit(true)}
            style={{
              padding: "10px 24px",
              background: "#003366",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                padding: "10px 24px",
                background: loading ? "#5c8ae6" : "#0052cc",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
              }}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEdit(false)}
              style={{
                padding: "10px 24px",
                background: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
