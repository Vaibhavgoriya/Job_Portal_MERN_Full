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
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    }}>
      {/* Navigation Bar - My Application જેવી જ */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0px', // Minimum horizontal padding
        boxShadow: '0 4px 20px rgba(30, 58, 138, 0.15)',
        marginBottom: 40,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Job Portal title on left side */}
        <div style={{
          fontSize: '28px',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginLeft: '64px', // Move Job Portal title even further right
        }}>
          <span style={{
            fontSize: '24px',
            background: 'rgba(255, 255, 255, 0.15)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>📄</span>
          Job Portal
        </div>
        {/* Both buttons on right side */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '18px', // More space between buttons
          flexDirection: 'row-reverse', // Reverse the order so logout is leftmost
          marginLeft: '12px', // Push button group closer to the left edge
        }}>
          {/* Logout button - now comes first (left side of right section) */}
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              localStorage.removeItem("userToken");
              localStorage.removeItem("role");
              navigate("/login");
            }}
            style={{
              flex: 1, // Make button take equal space
              padding: '12px 20px',
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 2px 12px rgba(220,38,38,0.18)',
              letterSpacing: '0.5px',
              minWidth: '140px', // Minimum width
              whiteSpace: 'nowrap', // Prevent text wrapping
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#b91c1c';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'none';
            }}
          >
            🚪 <span style={{fontWeight:800}}>Logout</span>
          </button>
          {/* Back to Dashboard button - now comes second (right side of right section) */}
          <button 
            onClick={() => navigate("/user/dashboard")}
            style={{
              flex: 1, // Make button take equal space
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              minWidth: '140px', // Minimum width
              whiteSpace: 'nowrap', // Prevent text wrapping
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            📋 Back to Jobs
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div style={{
          maxWidth: '650px',
          width: '100%',
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "24px",
          boxShadow: "0 25px 50px rgba(99, 102, 241, 0.1), 0 5px 15px rgba(0, 0, 0, 0.05)",
          padding: "50px",
          border: "1px solid rgba(224, 231, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}>
          <h2 style={{
            textAlign: "center",
            color: "#1e293b",
            fontWeight: 900,
            fontSize: "36px",
            letterSpacing: "-0.5px",
            marginBottom: "8px",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          }}>
            <span style={{
              color: "#6366f1",
              display: 'block',
              marginBottom: '4px'
            }}>My Profile</span>
            <div style={{
              fontSize: '16px',
              fontWeight: 500,
              color: '#64748b',
              marginTop: '8px'
            }}>
              Manage your personal information
            </div>
          </h2>
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            marginBottom: "40px",
            marginTop: "30px"
          }}>
            <div style={{
              position: 'relative',
              marginBottom: '12px'
            }}>
              <img
                src={profile.profilePic && profile.profilePic !== "" ? `http://localhost:5000${profile.profilePic}` : "https://ui-avatars.com/api/?background=6366f1&color=ffffff&bold=true&name=" + encodeURIComponent(profile.name || "User")}
                alt="Profile"
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)",
                  border: "4px solid #ffffff",
                  background: "#f3f6fa",
                }}
              />
              {edit && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
                  border: '2px solid white'
                }}>
                  <label style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    fontSize: '20px'
                  }}>
                    📷
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePicChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              )}
            </div>
            {edit && (
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                marginTop: '10px',
                fontWeight: 500
              }}>
                Click camera icon to change photo
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ 
                fontWeight: 700, 
                color: "#334155", 
                marginBottom: "8px", 
                display: "block",
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Name</label>
              <input 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
                disabled={!edit} 
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  border: edit ? "2px solid #6366f1" : "2px solid #e2e8f0", 
                  fontSize: "16px", 
                  background: edit ? "#ffffff" : "#f8fafc",
                  color: edit ? "#1e293b" : "#64748b",
                  fontWeight: edit ? 600 : 500,
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  outline: 'none'
                }} 
              />
            </div>
            
            <div>
              <label style={{ 
                fontWeight: 700, 
                color: "#334155", 
                marginBottom: "8px", 
                display: "block",
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Email</label>
              <input 
                name="email" 
                value={profile.email} 
                disabled 
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  border: "2px solid #e2e8f0", 
                  fontSize: "16px", 
                  background: "#f8fafc",
                  color: "#64748b",
                  fontWeight: 500,
                  boxSizing: 'border-box'
                }} 
              />
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ 
                fontWeight: 700, 
                color: "#334155", 
                marginBottom: "8px", 
                display: "block",
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Phone</label>
              <input 
                name="phone" 
                value={profile.phone} 
                onChange={handleChange} 
                disabled={!edit} 
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  border: edit ? "2px solid #6366f1" : "2px solid #e2e8f0", 
                  fontSize: "16px", 
                  background: edit ? "#ffffff" : "#f8fafc",
                  color: edit ? "#1e293b" : "#64748b",
                  fontWeight: edit ? 600 : 500,
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  outline: 'none'
                }} 
              />
            </div>
            
            <div>
              <label style={{ 
                fontWeight: 700, 
                color: "#334155", 
                marginBottom: "8px", 
                display: "block",
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Address</label>
              <input 
                name="address" 
                value={profile.address} 
                onChange={handleChange} 
                disabled={!edit} 
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  border: edit ? "2px solid #6366f1" : "2px solid #e2e8f0", 
                  fontSize: "16px", 
                  background: edit ? "#ffffff" : "#f8fafc",
                  color: edit ? "#1e293b" : "#64748b",
                  fontWeight: edit ? 600 : 500,
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                  outline: 'none'
                }} 
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ 
              fontWeight: 700, 
              color: "#334155", 
              marginBottom: "8px", 
              display: "block",
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Education</label>
            <input 
              name="education" 
              value={profile.education} 
              onChange={handleChange} 
              disabled={!edit} 
              style={{ 
                width: "100%", 
                padding: "16px", 
                borderRadius: "12px", 
                border: edit ? "2px solid #6366f1" : "2px solid #e2e8f0", 
                fontSize: "16px", 
                background: edit ? "#ffffff" : "#f8fafc",
                color: edit ? "#1e293b" : "#64748b",
                fontWeight: edit ? 600 : 500,
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                outline: 'none'
              }} 
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ 
              fontWeight: 700, 
              color: "#334155", 
              marginBottom: "8px", 
              display: "block",
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Experience</label>
            <input 
              name="experience" 
              value={profile.experience} 
              onChange={handleChange} 
              disabled={!edit} 
              style={{ 
                width: "100%", 
                padding: "16px", 
                borderRadius: "12px", 
                border: edit ? "2px solid #6366f1" : "2px solid #e2e8f0", 
                fontSize: "16px", 
                background: edit ? "#ffffff" : "#f8fafc",
                color: edit ? "#1e293b" : "#64748b",
                fontWeight: edit ? 600 : 500,
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                outline: 'none'
              }} 
            />
          </div>

          <div style={{ 
            marginBottom: "32px",
            padding: '24px',
            background: '#f8fafc',
            borderRadius: '16px',
            border: '2px solid #e2e8f0'
          }}>
            <label style={{ 
              fontWeight: 700, 
              color: "#334155", 
              marginBottom: "8px", 
              display: "block",
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>Skills</label>
            <input 
              name="skills" 
              value={profile.skills} 
              onChange={handleChange} 
              disabled={!edit} 
              style={{ 
                width: "100%", 
                padding: "16px", 
                borderRadius: "12px", 
                border: edit ? "2px solid #6366f1" : "2px solid #e2e8f0", 
                fontSize: "16px", 
                background: edit ? "#ffffff" : "#f8fafc",
                color: edit ? "#1e293b" : "#64748b",
                fontWeight: edit ? 600 : 500,
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                outline: 'none',
                marginBottom: '20px'
              }} 
            />
            
            <div>
              <label style={{ 
                fontWeight: 700, 
                color: "#334155", 
                marginBottom: "12px", 
                display: "block",
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Resume</label>
              
              {profile.resume && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: edit ? '16px' : '0'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}>
                    📄
                  </div>
                  <a
                    href={`http://localhost:5000${profile.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#6366f1",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "16px",
                      padding: "14px 24px",
                      background: "#ffffff",
                      borderRadius: "12px",
                      border: "2px solid #e2e8f0",
                      display: "inline-block",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "#6366f1";
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(99, 102, 241, 0.3)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "#ffffff";
                      e.currentTarget.style.color = "#6366f1";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    View Resume
                  </a>
                </div>
              )}
              
              {edit && (
                <div style={{
                  marginTop: '20px'
                }}>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: "14px 28px",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#fff",
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
                    transition: "all 0.3s ease",
                    border: "none",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(99, 102, 241, 0.3)";
                  }}
                  >
                    📁 Upload Resume (PDF)
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handleResumeChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <div style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginTop: '10px',
                    fontWeight: 500
                  }}>
                    Upload PDF file (Max 5MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: "20px", 
            marginTop: "40px"
          }}>
            {!edit ? (
              <button 
                onClick={() => setEdit(true)} 
                style={{
                  padding: "18px 48px",
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "17px",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 16px 32px rgba(99, 102, 241, 0.4)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.3)";
                }}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={handleSave} 
                  disabled={loading}
                  style={{
                    padding: "18px 48px",
                    background: loading ? "#94a3b8" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 800,
                    fontSize: "17px",
                    letterSpacing: "0.5px",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 8px 24px rgba(16, 185, 129, 0.3)",
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: '180px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 16px 32px rgba(16, 185, 129, 0.4)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!loading) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.3)";
                    }
                  }}
                >
                  {loading ? "⏳ Saving..." : "💾 Save Changes"}
                </button>
                
                <button 
                  onClick={() => setEdit(false)}
                  style={{
                    padding: "18px 48px",
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 800,
                    fontSize: "17px",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(239, 68, 68, 0.3)",
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minWidth: '180px',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 16px 32px rgba(239, 68, 68, 0.4)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.3)";
                  }}
                >
                  ❌ Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;