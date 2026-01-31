import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AddJob from "./AddJob";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [view, setView] = useState("applications");
  const [selectedApp, setSelectedApp] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }

    let socket;

    setLoading(true);
    axios
      .get("/admin/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setApps(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error loading applications");
      })
      .finally(() => {
        setLoading(false);
        const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
        const adminToken = localStorage.getItem("token");
        socket = io(serverUrl, { 
          auth: { token: adminToken },
          transports: ['websocket', 'polling']
        });

        socket.on("connect", () => {
          console.log("Socket connected", socket.id);
          setSocketConnected(true);
          toast.info("Real-time updates connected");
        });

        socket.on("newApplication", (newApp) => {
          console.log("New application received", newApp);
          toast.info(`New application from ${newApp.user?.name || "User"}`);
          setApps((prev) => [newApp, ...prev]);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          setSocketConnected(false);
          toast.warning("Real-time updates disconnected");
        });

        socket.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
          toast.error("Real-time connection failed");
        });
      });

    return () => {
      if (socket) {
        socket.disconnect();
        setSocketConnected(false);
      }
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const handleJobAdded = () => {
    // Toast will be shown from AddJob component
  };

  const openAppDetails = (app) => setSelectedApp(app);
  const closeAppDetails = () => setSelectedApp(null);

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      let url = "";
      let msg = "";
      const email = arguments.length === 3 ? arguments[2] : selectedApp?.user?.email;
      
      if (status === "approved") {
        url = "/admin/applications/approve";
        msg = "Application approved and email sent successfully";
      } else if (status === "rejected") {
        url = "/admin/applications/reject";
        msg = "Application rejected and email sent successfully";
      } else {
        toast.error("Invalid status");
        return;
      }
      
      await axios.post(url, { 
        applicationId: id, 
        userEmail: email 
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success(msg);
      setApps((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        )
      );
      
      if (selectedApp?._id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update application status");
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return '✓';
      case 'rejected': return '✗';
      default: return '⟳';
    }
  };

  // Filter applications based on search and status
  const filteredApps = apps.filter(app => {
    const matchesSearch = app.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'pending' && (!app.status || app.status.toLowerCase() === 'pending')) ||
                         (statusFilter === 'approved' && app.status?.toLowerCase() === 'approved') ||
                         (statusFilter === 'rejected' && app.status?.toLowerCase() === 'rejected');
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const pendingCount = apps.filter(app => !app.status || app.status.toLowerCase() === 'pending').length;
  const approvedCount = apps.filter(app => app.status?.toLowerCase() === 'approved').length;
  const rejectedCount = apps.filter(app => app.status?.toLowerCase() === 'rejected').length;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 7H16M8 12H16M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="logo-text">
                <h1>Recruit<span>Flow</span></h1>
                <p className="tagline">Enterprise Recruitment Platform</p>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className={`connection-indicator ${socketConnected ? 'connected' : 'disconnected'}`}>
              <div className="indicator-dot"></div>
              <span>{socketConnected ? 'Live' : 'Offline'}</span>
            </div>
            
            <div className="user-menu">
              <div className="user-avatar">
                <span>A</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-container">
        <div className="sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-title">Navigation</h3>
              <button 
                className={`nav-item ${view === "applications" ? 'active' : ''}`}
                onClick={() => setView("applications")}
              >
                <span className="nav-icon">📋</span>
                <span className="nav-label">Applications</span>
                <span className="nav-badge">{apps.length}</span>
              </button>
              <button 
                className={`nav-item ${view === "add" ? 'active' : ''}`}
                onClick={() => setView("add")}
              >
                <span className="nav-icon">+</span>
                <span className="nav-label">Post Job</span>
              </button>
            </div>
            
            <div className="nav-section">
              <h3 className="nav-title">Quick Stats</h3>
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-number">{pendingCount}</span>
                  <span className="stat-label">Pending</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{approvedCount}</span>
                  <span className="stat-label">Approved</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{rejectedCount}</span>
                  <span className="stat-label">Rejected</span>
                </div>
              </div>
            </div>
            
            <div className="nav-footer">
              <p className="version">v2.1.0</p>
              <p className="copyright">© 2024 RecruitFlow</p>
            </div>
          </nav>
        </div>

        <div className="main-content">
          {view === "add" ? (
            <div className="content-section">
              <div className="section-header">
                <h2>Post New Job</h2>
                <p className="section-description">Create and publish new job opportunities</p>
              </div>
              <AddJob onAdded={handleJobAdded} />
            </div>
          ) : (
            <div className="content-section">
              <div className="section-header">
                <div className="header-main">
                  <h2>Applications</h2>
                  <p className="section-description">
                    {loading ? 'Loading...' : `${filteredApps.length} applications found`}
                  </p>
                </div>
                <div className="header-actions">
                  <div className="search-box">
                    <svg viewBox="0 0 24 24" fill="none">
                      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search applications..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="filter-dropdown">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="all">All Applications</option>
                      <option value="pending">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading applications...</p>
                </div>
              ) : filteredApps.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-illustration">
                    <svg viewBox="0 0 100 100" fill="none">
                      <path d="M30 40L50 60L70 40" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="20" y="20" width="60" height="60" rx="8" stroke="#667eea" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>No applications found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  {searchQuery || statusFilter !== 'all' ? (
                    <button onClick={() => {setSearchQuery(''); setStatusFilter('all')}} className="primary-btn">
                      Clear Filters
                    </button>
                  ) : (
                    <button onClick={() => setView("add")} className="primary-btn">
                      Post Your First Job
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="stats-cards">
                    <div className="stat-card pending">
                      <span className="stat-card-count">{pendingCount}</span>
                      <span className="stat-card-label">Pending</span>
                    </div>
                    <div className="stat-card approved">
                      <span className="stat-card-count">{approvedCount}</span>
                      <span className="stat-card-label">Approved</span>
                    </div>
                    <div className="stat-card rejected">
                      <span className="stat-card-count">{rejectedCount}</span>
                      <span className="stat-card-label">Rejected</span>
                    </div>
                  </div>
                  
                  <div className="applications-grid">
                    {filteredApps.map((app) => (
                      <div 
                        key={app._id} 
                        className="application-card"
                        onClick={() => openAppDetails(app)}
                      >
                        <div className="card-header">
                          <div className="applicant-info">
                            <div className="applicant-avatar">
                              {app.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="applicant-details">
                              <h3 className="applicant-name">{app.user?.name || 'Candidate'}</h3>
                              <p className="applicant-email">{app.user?.email || 'No email'}</p>
                            </div>
                          </div>
                          <div 
                            className="application-status"
                            style={{ backgroundColor: getStatusColor(app.status) }}
                          >
                            {getStatusIcon(app.status)} {app.status || 'Pending'}
                          </div>
                        </div>
                        
                        <div className="card-body">
                          <h4 className="job-title">{app.job?.title || 'Position'}</h4>
                          <p className="job-company">{app.job?.company || 'Company'}</p>
                          
                          <div className="application-meta">
                            <div className="meta-item">
                              <span className="meta-label">Applied</span>
                              <span className="meta-value">
                                {app.createdAt
                                  ? new Date(app.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })
                                  : '--'}
                              </span>
                            </div>
                            {app.resumeUrl && (
                              <div className="meta-item">
                                <span className="meta-label">Resume</span>
                                <span className="meta-value available">Available</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="card-footer">
                          <span className="view-details">View Details →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={closeAppDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Application Review</h2>
                <p className="modal-subtitle">ID: {selectedApp._id?.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={closeAppDetails} className="modal-close">
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h3>Candidate Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <p>{selectedApp.user?.name || 'Not specified'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email Address</label>
                    <p>{selectedApp.user?.email || 'Not provided'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Contact</label>
                    <p>{selectedApp.user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-section">
                <h3>Job Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Position</label>
                    <p>{selectedApp.job?.title || 'Not specified'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Company</label>
                    <p>{selectedApp.job?.company || 'Not specified'}</p>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <p>{selectedApp.job?.location || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-section">
                <h3>Application Info</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Applied On</label>
                    <p>
                      {selectedApp.createdAt
                        ? new Date(selectedApp.createdAt).toLocaleString('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })
                        : 'Not available'}
                    </p>
                  </div>
                  <div className="detail-item">
                    <label>Current Status</label>
                    <div className="status-display">
                      <span 
                        className="status-indicator"
                        style={{ backgroundColor: getStatusColor(selectedApp.status) }}
                      ></span>
                      <span>{selectedApp.status || 'Pending Review'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedApp.resumeUrl && (
                <div className="modal-section">
                  <h3>Attachments</h3>
                  <div className="attachment-section">
                    <a 
                      href={`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}${selectedApp.resumeUrl}`}
                      target="_blank" 
                      rel="noreferrer" 
                      className="attachment-link"
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="10 9 9 9 8 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      View Resume
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <div className="modal-actions">
                <button 
                  onClick={closeAppDetails}
                  className="action-btn secondary"
                >
                  Close
                </button>
                <div className="primary-actions">
                  {/* PENDING STATUS */}
                  {(!selectedApp.status || selectedApp.status.toLowerCase() === 'pending') && (
                    <>
                      <button 
                        onClick={() => handleStatus(selectedApp._id, 'approved')}
                        className="action-btn success"
                      >
                        Approve Application
                      </button>
                      <button 
                        onClick={() => handleStatus(selectedApp._id, 'rejected')}
                        className="action-btn danger"
                      >
                        Reject Application
                      </button>
                    </>
                  )}
                  
                  {/* APPROVED STATUS */}
                  {selectedApp.status?.toLowerCase() === 'approved' && (
                    <button 
                      onClick={() => handleStatus(selectedApp._id, 'rejected')}
                      className="action-btn danger"
                    >
                      Reject Application
                    </button>
                  )}
                  
                  {/* REJECTED STATUS */}
                  {selectedApp.status?.toLowerCase() === 'rejected' && (
                    <button 
                      onClick={() => handleStatus(selectedApp._id, 'approved')}
                      className="action-btn success"
                    >
                      Approve Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ====== INDUSTRIAL-LEVEL CSS RESET & BASE ====== */
        :root {
          --primary-color: #2563eb;
          --primary-dark: #1d4ed8;
          --primary-light: #3b82f6;
          --secondary-color: #64748b;
          --success-color: #10b981;
          --warning-color: #f59e0b;
          --danger-color: #ef4444;
          --dark-color: #1e293b;
          --light-color: #f8fafc;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
          
          --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          
          --border-radius-sm: 0.375rem;
          --border-radius-md: 0.5rem;
          --border-radius-lg: 0.75rem;
          --border-radius-xl: 1rem;
          --border-radius-2xl: 1.5rem;
          
          --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
          --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
          --transition-slow: 500ms cubic-bezier(0.4, 0, 0.2, 1);
          
          --z-index-dropdown: 1000;
          --z-index-sticky: 1020;
          --z-index-modal: 1050;
          --z-index-popover: 1070;
          --z-index-tooltip: 1080;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-size: 16px;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.5;
          font-weight: 400;
          color: var(--gray-800);
          background-color: var(--gray-50);
          overflow-x: hidden;
        }

        /* ====== ADMIN DASHBOARD LAYOUT ====== */
        .admin-dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        /* ====== HEADER ====== */
        .header {
          background: linear-gradient(135deg, var(--dark-color) 0%, #0f172a 100%);
          color: white;
          padding: 0;
          box-shadow: var(--shadow-lg);
          position: sticky;
          top: 0;
          z-index: var(--z-index-sticky);
          backdrop-filter: blur(10px);
          background: rgba(30, 41, 59, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 4.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: transform var(--transition-base);
        }

        .logo:hover {
          transform: translateY(-1px);
        }

        .logo-icon {
          width: 2.5rem;
          height: 2.5rem;
          color: var(--primary-light);
          flex-shrink: 0;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-text h1 {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.2;
          color: white;
          margin: 0;
        }

        .logo-text h1 span {
          color: var(--primary-light);
          background: linear-gradient(135deg, var(--primary-light) 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tagline {
          font-size: 0.75rem;
          color: var(--gray-400);
          margin-top: 0.125rem;
          letter-spacing: 0.025em;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        /* Connection Indicator */
        .connection-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--border-radius-xl);
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          transition: all var(--transition-base);
          backdrop-filter: blur(4px);
        }

        .connection-indicator.connected {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .connection-indicator.disconnected {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .indicator-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          position: relative;
        }

        .connection-indicator.connected .indicator-dot {
          background: var(--success-color);
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
          animation: pulse 2s infinite;
        }

        .connection-indicator.disconnected .indicator-dot {
          background: var(--danger-color);
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
        }

        /* User Menu */
        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
          font-size: 1rem;
          box-shadow: var(--shadow-md);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all var(--transition-base);
        }

        .user-avatar:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-lg);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: var(--border-radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-md);
          letter-spacing: 0.025em;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        }

        .logout-btn:active {
          transform: translateY(0);
        }

        .logout-btn svg {
          width: 1rem;
          height: 1rem;
        }

        /* ====== MAIN CONTAINER ====== */
        .main-container {
          flex: 1;
          max-width: 1440px;
          margin: 2rem auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          width: 100%;
        }

        /* ====== SIDEBAR ====== */
        .sidebar {
          background: white;
          border-radius: var(--border-radius-xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          height: fit-content;
          position: sticky;
          top: 6.5rem;
          border: 1px solid var(--gray-200);
        }

        .sidebar-nav {
          padding: 1.5rem;
        }

        .nav-section {
          margin-bottom: 2rem;
        }

        .nav-section:last-child {
          margin-bottom: 0;
        }

        .nav-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          padding-left: 0.25rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.875rem 1rem;
          background: transparent;
          border: none;
          border-radius: var(--border-radius-lg);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-700);
          cursor: pointer;
          transition: all var(--transition-base);
          margin-bottom: 0.5rem;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--primary-color);
          transform: scaleY(0);
          transition: transform var(--transition-base);
        }

        .nav-item:hover {
          background: var(--gray-50);
          color: var(--gray-900);
          transform: translateX(4px);
        }

        .nav-item:hover::before {
          transform: scaleY(1);
        }

        .nav-item.active {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          box-shadow: var(--shadow-md);
        }

        .nav-item.active::before {
          transform: scaleY(1);
          background: white;
        }

        .nav-item.active:hover {
          background: linear-gradient(135deg, var(--primary-dark) 0%, #1e40af 100%);
          transform: translateX(4px);
        }

        .nav-icon {
          font-size: 1.125rem;
          width: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-label {
          flex: 1;
        }

        .nav-badge {
          background: var(--danger-color);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.625rem;
          border-radius: var(--border-radius-xl);
          min-width: 1.5rem;
          text-align: center;
          animation: pulse 2s infinite;
        }

        /* Stats */
        .stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1rem;
          background: var(--gray-50);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--gray-200);
          transition: all var(--transition-base);
        }

        .stat-item:hover {
          border-color: var(--primary-light);
          box-shadow: var(--shadow-sm);
          transform: translateY(-1px);
        }

        .stat-number {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--dark-color);
          font-variant-numeric: tabular-nums;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 500;
        }

        .nav-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--gray-200);
          text-align: center;
        }

        .version {
          font-size: 0.75rem;
          color: var(--gray-500);
          margin-bottom: 0.25rem;
        }

        .copyright {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        /* ====== MAIN CONTENT ====== */
        .main-content {
          min-height: calc(100vh - 8.5rem);
        }

        .content-section {
          background: white;
          border-radius: var(--border-radius-xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          border: 1px solid var(--gray-200);
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          padding: 2rem;
          border-bottom: 1px solid var(--gray-200);
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
        }

        .header-main h2 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
          letter-spacing: -0.025em;
          line-height: 1.2;
        }

        .section-description {
          font-size: 1rem;
          color: var(--gray-600);
          margin: 0;
          font-weight: 400;
        }

        .header-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        /* Search Box */
        .search-box {
          flex: 1;
          position: relative;
          max-width: 320px;
        }

        .search-box svg {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
          width: 1.125rem;
          height: 1.125rem;
          pointer-events: none;
        }

        .search-box input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--border-radius-lg);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-800);
          background: white;
          transition: all var(--transition-base);
          outline: none;
        }

        .search-box input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .search-box input::placeholder {
          color: var(--gray-400);
        }

        /* Filter Dropdown */
        .filter-dropdown {
          min-width: 200px;
        }

        .filter-dropdown select {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--border-radius-lg);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-800);
          background: white;
          cursor: pointer;
          transition: all var(--transition-base);
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.125rem;
          padding-right: 3rem;
        }

        .filter-dropdown select:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
          outline: none;
        }

        .filter-dropdown select:hover {
          border-color: var(--gray-300);
        }

        /* Loading State */
        .loading-state {
          padding: 6rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loading-spinner {
          width: 3.5rem;
          height: 3.5rem;
          border: 3px solid var(--gray-200);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          margin: 0 auto 1.5rem;
          animation: spin 1s linear infinite;
        }

        .loading-state p {
          color: var(--gray-600);
          font-size: 1rem;
          font-weight: 500;
        }

        /* Empty State */
        .empty-state {
          padding: 6rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .empty-illustration {
          margin: 0 auto 2rem;
          width: 10rem;
          height: 10rem;
          color: var(--primary-color);
          opacity: 0.7;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 0.75rem;
        }

        .empty-state p {
          color: var(--gray-600);
          font-size: 1rem;
          margin-bottom: 2rem;
          max-width: 400px;
          font-weight: 400;
          line-height: 1.6;
        }

        .primary-btn {
          padding: 0.875rem 2.5rem;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          border: none;
          border-radius: var(--border-radius-lg);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-md);
          letter-spacing: 0.025em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: linear-gradient(135deg, var(--primary-dark) 0%, #1e40af 100%);
        }

        .primary-btn:active {
          transform: translateY(0);
        }

        /* Stats Cards */
        .stats-cards {
          padding: 1.5rem 2rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
          border-bottom: 1px solid var(--gray-200);
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: var(--border-radius-lg);
          text-align: center;
          transition: all var(--transition-base);
          border: 1px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          transform: scaleX(0);
          transition: transform var(--transition-base);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-card.pending {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-color: #fbbf24;
        }

        .stat-card.pending::before {
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
        }

        .stat-card.approved {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-color: #34d399;
        }

        .stat-card.approved::before {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
        }

        .stat-card.rejected {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-color: #f87171;
        }

        .stat-card.rejected::before {
          background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
        }

        .stat-card-count {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }

        .stat-card.pending .stat-card-count {
          color: #d97706;
        }

        .stat-card.approved .stat-card-count {
          color: #059669;
        }

        .stat-card.rejected .stat-card-count {
          color: #dc2626;
        }

        .stat-card-label {
          font-size: 0.9375rem;
          color: var(--gray-600);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Applications Grid */
        .applications-grid {
          padding: 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1.5rem;
        }

        .application-card {
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
          cursor: pointer;
          background: white;
          position: relative;
        }

        .application-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-light) 100%);
          transform: scaleX(0);
          transition: transform var(--transition-base);
        }

        .application-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-light);
        }

        .application-card:hover::before {
          transform: scaleX(1);
        }

        .card-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
          border-bottom: 1px solid var(--gray-200);
        }

        .applicant-info {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          min-width: 0;
        }

        .applicant-avatar {
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
          color: white;
          border-radius: var(--border-radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1.125rem;
          flex-shrink: 0;
          box-shadow: var(--shadow-md);
          border: 2px solid white;
        }

        .applicant-details {
          flex: 1;
          min-width: 0;
        }

        .applicant-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--dark-color);
          margin-bottom: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .applicant-email {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin: 0;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .application-status {
          padding: 0.5rem 1rem;
          border-radius: var(--border-radius-xl);
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-body {
          padding: 1.5rem;
        }

        .job-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .job-company {
          font-size: 0.9375rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .application-meta {
          display: flex;
          gap: 2rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .meta-label {
          font-size: 0.75rem;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .meta-value {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-800);
        }

        .meta-value.available {
          color: var(--success-color);
          font-weight: 600;
        }

        .card-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid var(--gray-200);
          display: flex;
          justify-content: flex-end;
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
        }

        .view-details {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--primary-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-base);
        }

        .view-details::after {
          content: '→';
          transition: transform var(--transition-base);
        }

        .application-card:hover .view-details {
          color: var(--primary-dark);
        }

        .application-card:hover .view-details::after {
          transform: translateX(4px);
        }

        /* ====== MODAL ====== */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-index-modal);
          padding: 1rem;
          animation: fadeIn 0.3s ease-out;
          backdrop-filter: blur(8px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: var(--border-radius-xl);
          width: 100%;
          max-width: 48rem;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-2xl);
          border: 1px solid var(--gray-200);
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid var(--gray-200);
          background: linear-gradient(135deg, var(--dark-color) 0%, #0f172a 100%);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }

        .modal-subtitle {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          font-weight: 400;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
          padding: 0;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--border-radius-md);
          transition: all var(--transition-base);
          flex-shrink: 0;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .modal-section {
          margin-bottom: 2rem;
        }

        .modal-section:last-child {
          margin-bottom: 0;
        }

        .modal-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--dark-color);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid var(--gray-200);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.25rem;
          background: var(--gray-50);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--gray-200);
          transition: all var(--transition-base);
        }

        .detail-item:hover {
          border-color: var(--primary-light);
          background: white;
          box-shadow: var(--shadow-sm);
        }

        .detail-item label {
          font-size: 0.75rem;
          color: var(--gray-600);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .detail-item p {
          font-size: 1rem;
          color: var(--gray-900);
          margin: 0;
          font-weight: 500;
          line-height: 1.5;
        }

        .status-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: white;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--gray-200);
        }

        .status-indicator {
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }

        .attachment-section {
          padding: 1.5rem;
          background: var(--gray-50);
          border-radius: var(--border-radius-lg);
          border: 2px dashed var(--gray-300);
          text-align: center;
        }

        .attachment-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: white;
          color: var(--primary-color);
          text-decoration: none;
          border: 2px solid var(--primary-color);
          border-radius: var(--border-radius-lg);
          font-weight: 600;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
        }

        .attachment-link:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .attachment-link svg {
          width: 1.125rem;
          height: 1.125rem;
        }

        .modal-footer {
          padding: 2rem;
          border-top: 1px solid var(--gray-200);
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .primary-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          padding: 0.875rem 1.75rem;
          border: none;
          border-radius: var(--border-radius-lg);
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-sm);
          letter-spacing: 0.025em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-width: 140px;
        }

        .action-btn.secondary {
          background: white;
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }

        .action-btn.secondary:hover {
          background: var(--gray-50);
          border-color: var(--gray-400);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-btn.success {
          background: linear-gradient(135deg, var(--success-color) 0%, #059669 100%);
          color: white;
          border: none;
        }

        .action-btn.success:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-btn.danger {
          background: linear-gradient(135deg, var(--danger-color) 0%, #dc2626 100%);
          color: white;
          border: none;
        }

        .action-btn.danger:hover {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        /* ====== RESPONSIVE DESIGN ====== */
        @media (max-width: 1200px) {
          .main-container {
            grid-template-columns: 260px 1fr;
            gap: 1.5rem;
            padding: 0 1.5rem;
          }
          
          .applications-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          }
        }

        @media (max-width: 992px) {
          .main-container {
            grid-template-columns: 1fr;
            margin: 1rem auto;
            padding: 0 1rem;
          }
          
          .sidebar {
            position: static;
            margin-bottom: 1.5rem;
          }
          
          .header-actions {
            flex-direction: column;
          }
          
          .search-box,
          .filter-dropdown {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 1rem;
            height: auto;
            min-height: 4.5rem;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }
          
          .logo {
            justify-content: center;
            text-align: center;
          }
          
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
          
          .main-container {
            margin: 0.75rem auto;
            padding: 0.75rem;
          }
          
          .section-header {
            padding: 1.5rem;
          }
          
          .applications-grid {
            padding: 1.5rem;
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .stats-cards {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }
          
          .modal-content {
            max-height: 90vh;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .primary-actions {
            width: 100%;
          }
          
          .action-btn {
            flex: 1;
          }
        }

        @media (max-width: 640px) {
          .header-right {
            flex-direction: column;
            gap: 1rem;
          }
          
          .user-menu {
            width: 100%;
            justify-content: space-between;
          }
          
          .application-meta {
            flex-direction: column;
            gap: 1rem;
          }
          
          .modal-body {
            padding: 1.5rem;
          }
          
          .modal-header {
            padding: 1.5rem;
          }
          
          .modal-footer {
            padding: 1.5rem;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .logo h1 {
            font-size: 1.25rem;
          }
          
          .section-header h2 {
            font-size: 1.5rem;
          }
          
          .application-card {
            padding: 0;
          }
          
          .modal-content {
            border-radius: var(--border-radius-lg);
          }
          
          .action-btn {
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
          }
        }

        /* ====== DARK MODE SUPPORT ====== */
        @media (prefers-color-scheme: dark) {
          :root {
            --dark-color: #f8fafc;
            --light-color: #0f172a;
            --gray-50: #1e293b;
            --gray-100: #334155;
            --gray-200: #475569;
            --gray-300: #64748b;
            --gray-400: #94a3b8;
            --gray-500: #cbd5e1;
            --gray-600: #e2e8f0;
            --gray-700: #f1f5f9;
            --gray-800: #f8fafc;
            --gray-900: #ffffff;
          }
          
          .admin-dashboard {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }
          
          .header {
            background: rgba(15, 23, 42, 0.95);
          }
          
          .sidebar,
          .content-section,
          .modal-content {
            background: #1e293b;
            border-color: #334155;
          }
          
          .stat-item,
          .detail-item,
          .attachment-section {
            background: #334155;
            border-color: #475569;
          }
          
          .search-box input,
          .filter-dropdown select {
            background: #334155;
            border-color: #475569;
            color: #f1f5f9;
          }
          
          .search-box input::placeholder {
            color: #64748b;
          }
        }

        /* ====== PRINT STYLES ====== */
        @media print {
          .header,
          .sidebar,
          .header-actions,
          .card-footer,
          .modal-close {
            display: none !important;
          }
          
          .main-container {
            grid-template-columns: 1fr;
            margin: 0;
            padding: 0;
          }
          
          .content-section {
            box-shadow: none;
            border: none;
            border-radius: 0;
          }
          
          .application-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }

        /* ====== ACCESSIBILITY ====== */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus styles for keyboard navigation */
        :focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .nav-item.active {
            border: 2px solid var(--primary-color);
          }
          
          .stat-card {
            border: 2px solid currentColor;
          }
        }

        /* Reduce motion */
        @media (prefers-reduced-motion) {
          .logo-icon,
          .indicator-dot,
          .loading-spinner {
            animation: none;
          }
          
          .application-card:hover,
          .nav-item:hover,
          .primary-btn:hover,
          .logout-btn:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;