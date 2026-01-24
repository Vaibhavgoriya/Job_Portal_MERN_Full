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

  // Status colors and icons
  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        color: "#10b981",
        bgColor: "#d1fae5",
        borderColor: "#a7f3d0",
        icon: "✅",
        label: "Approved",
        fontWeight: 800
      },
      rejected: {
        color: "#ef4444",
        bgColor: "#fee2e2",
        borderColor: "#fecaca",
        icon: "❌",
        label: "Rejected",
        fontWeight: 800
      },
      pending: {
        color: "#f59e0b",
        bgColor: "#fef3c7",
        borderColor: "#fde68a",
        icon: "⏳",
        label: "Pending",
        fontWeight: 700
      },
      default: {
        color: "#6b7280",
        bgColor: "#f3f4f6",
        borderColor: "#e5e7eb",
        icon: "📝",
        label: "Applied",
        fontWeight: 600
      }
    };
    
    return configs[status] || configs.default;
  };

  // Calculate stats
  const approvedCount = items.filter(item => item.status === "approved").length;
  const pendingCount = items.filter(item => !item.status || item.status === "pending").length;
  const rejectedCount = items.filter(item => item.status === "rejected").length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      padding: '0',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    }}>
      {/* Navigation Bar */}
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
              window.location.href = "/user/login";
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
            onClick={() => window.location.href = "/user/dashboard"}
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

      {/* Main Container */}
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
              My Applications
            </div>
            <div style={{
              fontSize: '16px',
              color: '#6b7280',
              fontWeight: '500',
            }}>
              Track all your job applications in one place
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
            Total Applications: <span style={{ fontWeight: '800', color: '#111827' }}>{items.length}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          marginBottom: '40px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#10b981',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              {approvedCount}
              <span style={{ fontSize: '28px' }}>✅</span>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Approved
            </div>
          </div>
          
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#f59e0b',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              {pendingCount}
              <span style={{ fontSize: '28px' }}>⏳</span>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Pending
            </div>
          </div>
          
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            transition: 'all 0.3s ease',
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              color: '#ef4444',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              {rejectedCount}
              <span style={{ fontSize: '28px' }}>❌</span>
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Rejected
            </div>
          </div>
        </div>

        {/* Applications List */}
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
              Loading your applications...
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
        ) : items.length === 0 ? (
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
            }}>📄</div>
            <div style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px',
            }}>
              No applications yet
            </div>
            <div style={{
              fontSize: '15px',
              color: '#6b7280',
              maxWidth: '400px',
              lineHeight: '1.6',
              marginBottom: '24px',
            }}>
              You haven't applied to any jobs yet. Browse available positions and apply to start tracking your applications.
            </div>
            <button
              onClick={() => window.location.href = "/user/dashboard"}
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
            gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {items.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              
              return (
                <div
                  key={application._id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '28px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: `1px solid ${statusConfig.borderColor}`,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#111827',
                        marginBottom: '6px',
                        lineHeight: '1.3',
                      }}>
                        {application.job?.title || "No Title"}
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}>
                        <span>🏢</span>
                        {application.job?.company || "Unknown Company"}
                      </div>
                    </div>
                    
                    <div style={{
                      background: statusConfig.bgColor,
                      border: `1px solid ${statusConfig.borderColor}`,
                      borderRadius: '12px',
                      padding: '12px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      minWidth: '120px',
                    }}>
                      <div style={{
                        fontSize: '24px',
                      }}>
                        {statusConfig.icon}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: statusConfig.fontWeight,
                        color: statusConfig.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {statusConfig.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default MyApplications;