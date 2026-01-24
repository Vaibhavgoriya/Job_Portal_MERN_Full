import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          {/* Back to Jobs button - now comes second (right side of right section) */}
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

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
      }}>
        {/* Page Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '32px 0',
          borderBottom: '1px solid #e5e7eb',
        }}>
          <div>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#111827',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}>
              Saved Jobs
            </div>
            <div style={{
              fontSize: '16px',
              color: '#6b7280',
              fontWeight: '500',
            }}>
              All jobs you've saved for later
            </div>
          </div>
          <div style={{
            fontSize: '15px',
            color: '#6b7280',
            fontWeight: '500',
            background: '#ffffff',
            padding: '12px 24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}>
            Total Saved: <span style={{ fontWeight: '800', color: '#111827' }}>{jobs.length}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #e5e7eb',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px',
            }}></div>
            <div style={{
              fontSize: '16px',
              color: '#6b7280',
              fontWeight: '600',
            }}>
              Loading your saved jobs...
            </div>
          </div>
        ) : error ? (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            marginBottom: '32px',
          }}>
            <div style={{
              fontSize: '32px',
              color: '#dc2626',
              marginBottom: '16px',
            }}>⚠️</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#991b1b',
              marginBottom: '12px',
            }}>
              {error}
            </div>
            <div style={{
              fontSize: '15px',
              color: '#b91c1c',
            }}>
              Please try again later
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 24px',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{
              fontSize: '48px',
              color: '#9ca3af',
              marginBottom: '20px',
            }}>📋</div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px',
            }}>
              No saved jobs yet
            </div>
            <div style={{
              fontSize: '15px',
              color: '#6b7280',
              maxWidth: '400px',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              You haven't saved any jobs yet. Browse available positions and save your favorites.
            </div>
            <button
              onClick={() => navigate("/user/dashboard")}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(550px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {jobs.map((job) => (
              <div 
                key={job._id} 
                style={{ 
                  background: '#ffffff', 
                  border: '1.5px solid #e0e7ef', 
                  borderRadius: '16px', 
                  padding: '28px', 
                  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.10)', 
                  marginBottom: '2px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px', 
                  position: 'relative',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.10)';
                }}
              >
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '20px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ 
                      fontWeight: 900, 
                      color: '#1e293b', 
                      fontSize: '20px', 
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                      lineHeight: '1.3'
                    }}>{job.title || "-"}</div>
                    <div style={{ 
                      color: '#2563eb', 
                      fontWeight: 700, 
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <span>🏢</span>
                      {job.company || "-"}
                    </div>
                  </div>
                  
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 22px',
                      fontWeight: 700,
                      fontSize: '15px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                      zIndex: 1,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => handleUnsave(job._id)}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    ❌ Unsave
                  </button>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginTop: '8px'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px', 
                    color: '#475569',
                    background: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>📍</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#64748b' }}>Location</div>
                      <div>{job.location || "-"}</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px', 
                    color: '#475569',
                    background: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>💰</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#64748b' }}>Salary</div>
                      <div>₹ {job.salary || "Not specified"}</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px', 
                    color: '#475569',
                    background: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>📈</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#64748b' }}>Experience</div>
                      <div>{job.experience || "-"}</div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px', 
                    color: '#475569',
                    background: '#f8fafc',
                    padding: '10px 14px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontSize: '18px' }}>💻</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#64748b' }}>Technology</div>
                      <div>{Array.isArray(job.technology) ? job.technology.join(", ") : job.technology || "-"}</div>
                    </div>
                  </div>
                </div>
                
                {job.description && (
                  <div style={{ 
                    marginTop: '16px',
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '10px',
                    borderLeft: '4px solid #2563eb'
                  }}>
                    <div style={{ 
                      fontWeight: 700, 
                      color: '#334155', 
                      marginBottom: '8px',
                      fontSize: '14px'
                    }}>Description:</div>
                    <div style={{ 
                      fontSize: '15px', 
                      color: '#475569',
                      lineHeight: '1.6'
                    }}>
                      {job.description.length > 200 ? `${job.description.substring(0, 200)}...` : job.description}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add CSS animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SavedJobs;