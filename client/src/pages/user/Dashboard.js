import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import ApplyJobModal from "../../components/user/ApplyJobModal";

// --- MODERN COMPANY-LEVEL STYLES ---
const page = {
  minHeight: '100vh',
  background: '#f9fafb',
  padding: '0',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
};

const userNavWrap = {
  width: '100%',
  background: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 100%)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 48px',
  boxShadow: '0 4px 20px rgba(30, 58, 138, 0.15)',
  marginBottom: 40,
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const userNavTitle = {
  fontSize: '28px',
  fontWeight: '800',
  color: '#ffffff',
  letterSpacing: '-0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const userNavTitleIcon = {
  fontSize: '24px',
  background: 'rgba(255, 255, 255, 0.15)',
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const navButtonsContainer = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginRight: '80px', // Increase space between nav buttons and logout
};

const userNavBtn = {
  padding: '12px 24px',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
};

const userNavBtnHover = {
  background: 'rgba(255, 255, 255, 0.2)',
  transform: 'translateY(-1px)',
};

const userLogoutBtn = {
  padding: '12px 24px',
  background: '#dc2626',
  color: '#ffffff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginLeft: '32px', // Add more space to the left
};

const userLogoutBtnHover = {
  background: '#b91c1c',
  transform: 'translateY(-1px)',
};

const container = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 24px',
};

const pageHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  padding: '24px 0',
  borderBottom: '1px solid #e5e7eb',
};

const pageTitle = {
  fontSize: '32px',
  fontWeight: '800',
  color: '#111827',
  letterSpacing: '-0.5px',
};

const pageSubtitle = {
  fontSize: '16px',
  color: '#6b7280',
  marginTop: '8px',
  fontWeight: '500',
};

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '24px',
  marginBottom: '32px',
};

const statCard = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s ease',
};

const statCardHover = {
  transform: 'translateY(-4px)',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
};

const statValue = {
  fontSize: '32px',
  fontWeight: '800',
  color: '#111827',
  marginBottom: '8px',
};

const statLabel = {
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const filtersContainer = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '32px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
};

const filtersTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#111827',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const filtersGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
};

const filterGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const filterLabel = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
};

const filterSelect = {
  padding: '12px 16px',
  borderRadius: '8px',
  border: '2px solid #e5e7eb',
  background: '#ffffff',
  fontSize: '15px',
  fontWeight: '500',
  color: '#111827',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
};

const filterSelectFocus = {
  borderColor: '#2563eb',
  boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
  outline: 'none',
};

const jobsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
  gap: '30px', // Consistent gap
  marginBottom: '48px',
  padding: '20px 0',
};

const jobCard = {
  background: '#ffffff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  margin: '0', // Remove margin to use grid gap only
};

const jobCardHover = {
  transform: 'translateY(-4px)',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
  borderColor: '#2563eb',
};

const jobHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '20px',
  gap: '16px',
};

const jobTitleSection = {
  flex: 1,
};

const jobTitle = {
  fontSize: '20px',
  fontWeight: '800',
  color: '#111827',
  marginBottom: '6px',
  lineHeight: '1.3',
};

const jobCompany = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#2563eb',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px',
};

const jobBadges = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '8px',
  minWidth: '130px',
};

const salaryBadge = {
  background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  color: '#ffffff',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '800',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

const locationBadge = {
  background: '#f3f4f6',
  color: '#374151',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: '700',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

const jobDetailsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '16px',
  marginBottom: '16px', // Reduced from 24px
  background: '#f9fafb',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
};

const detailItem = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const detailLabel = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const detailValue = {
  fontSize: '15px',
  fontWeight: '800',
  color: '#111827',
};

const jobDescription = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#4b5563',
  marginBottom: '16px', // Reduced from 28px
  flex: 1,
  minHeight: '40px',
  maxHeight: '60px',
  overflow: 'hidden',
};

const jobActions = {
  display: 'flex',
  gap: '12px',
  marginTop: '8px', // Reduced from auto
  paddingTop: '12px',
  borderTop: '1px solid #f0f0f0',
};

const primaryButton = {
  flex: 1,
  padding: '12px 20px', // Reduced padding
  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  height: '48px', // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const primaryButtonHover = {
  background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
  transform: 'translateY(-1px)',
  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
};

const secondaryButton = {
  padding: '12px 20px', // Reduced padding
  background: '#f3f4f6',
  color: '#374151',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  minWidth: '120px',
  height: '48px', // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const secondaryButtonHover = {
  background: '#e5e7eb',
  transform: 'translateY(-1px)',
};

const loadingContainer = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  textAlign: 'center',
};

const loadingSpinner = {
  width: '50px',
  height: '50px',
  border: '4px solid #e5e7eb',
  borderTopColor: '#2563eb',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '20px',
};

const emptyState = {
  gridColumn: '1 / -1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 24px',
  textAlign: 'center',
};

const emptyStateIcon = {
  fontSize: '48px',
  color: '#9ca3af',
  marginBottom: '20px',
};

const emptyStateTitle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '8px',
};

const emptyStateText = {
  fontSize: '15px',
  color: '#6b7280',
  maxWidth: '400px',
  lineHeight: '1.6',
};

const errorContainer = {
  gridColumn: '1 / -1',
  background: '#fee2e2',
  border: '1px solid #fecaca',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center',
};

const errorIcon = {
  fontSize: '32px',
  color: '#dc2626',
  marginBottom: '16px',
};

const errorText = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#991b1b',
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
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
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Get unique locations
  const mainCities = [
    "Ahmedabad", "Bangalore", "Chennai", "Delhi", "Gurgaon", "Hyderabad", 
    "Kolkata", "Mumbai", "Noida", "Pune", "Surat", "Vadodara", "Rajkot", 
    "Gandhinagar", "Bhavnagar", "Jamnagar", "Morbi", "Anand", "Nadiad", 
    "Mehsana", "Navsari", "Bharuch", "Vapi", "Remote"
  ];
  const jobCities = Array.from(new Set(jobs.map(j => j.location).filter(l => l && mainCities.includes(l))));
  const locationOptions = Array.from(new Set(["", "Remote", ...jobCities]));

  // Get unique technologies from jobs
  const allTechs = Array.from(new Set(jobs.flatMap(j => 
    Array.isArray(j.technology) ? j.technology : 
    (typeof j.technology === "string" ? j.technology.split(",").map(t => t.trim()) : [])
  ))).filter(Boolean);
  const filteredTechs = allTechs.filter(t => t.toLowerCase() !== "mern");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("role");
    navigate("/user/login");
  };

  const handleJobs = () => {
    navigate("/user/dashboard");
  };
  
  const handleProfile = () => {
    navigate("/user/profile");
  };
  
  const handleSavedJobs = () => {
    navigate("/user/saved-jobs");
  };

  // Fetch saved jobs from backend on mount
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await axios.get("/users/saved-jobs");
        setSavedJobs(Array.isArray(res.data) ? res.data.map(j => j._id) : []);
      } catch (err) {
        console.error("Failed to fetch saved jobs");
      }
    };
    fetchSaved();
  }, []);

  // Save/unsave job using backend
  const handleSaveJob = async (job) => {
    try {
      const res = await axios.post(
        "/users/toggle-save-job",
        { jobId: job._id }
      );
      if (res.data && Array.isArray(res.data.savedJobs)) {
        setSavedJobs(res.data.savedJobs.map(j => (typeof j === 'object' ? j._id : j)));
      }
    } catch (err) {
      console.error("Failed to save job");
    }
  };

  const cards = useMemo(() => {
    const filteredJobs = jobs.filter(job => {
      // Location filter
      if (locationFilter && job.location !== locationFilter) return false;
      // Technology filter
      const techArr = Array.isArray(job.technology) ? job.technology : 
                     (typeof job.technology === "string" ? job.technology.split(",").map(t => t.trim()) : []);
      if (techFilter && !techArr.includes(techFilter)) return false;
      return true;
    });

    return filteredJobs.map((job, index) => {
      const tech = job.Technology ?? job.technology ?? job.technologyName ?? "-";
      const exp = job.Experience ?? job.experience ?? job.experienceValue ?? "-";
      const salary = job.salary ? (typeof job.salary === 'string' && job.salary.includes('LPA') ? job.salary : `₹ ${job.salary} LPA`) : "Negotiable";
      const isSaved = savedJobs.includes(job._id);
      const isHovered = hoveredCard === job._id;

      return (
        <div 
          key={job._id} 
          style={{
            ...jobCard,
            ...(isHovered && jobCardHover),
            borderColor: isHovered ? '#2563eb' : '#e5e7eb',
            // Ensure all cards have same styling
            height: 'auto',
            minHeight: '380px'
          }}
          onMouseEnter={() => setHoveredCard(job._id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div style={jobHeader}>
            <div style={jobTitleSection}>
              <div style={jobTitle}>{job.title}</div>
              <div style={jobCompany}>
                <span>🏢</span>
                {job.company}
              </div>
            </div>
            <div style={jobBadges}>
              <div style={salaryBadge}>{salary}</div>
              <div style={locationBadge}>{job.location || "Remote"}</div>
            </div>
          </div>
          
          <div style={jobDetailsGrid}>
            <div style={detailItem}>
              <div style={detailLabel}>Technology</div>
              <div style={detailValue}>
                {Array.isArray(tech) ? tech.join(", ") : tech}
              </div>
            </div>
            <div style={detailItem}>
              <div style={detailLabel}>Experience</div>
              <div style={detailValue}>{exp}</div>
            </div>
            <div style={detailItem}>
              <div style={detailLabel}>Type</div>
              <div style={detailValue}>{job.jobType || "Full-time"}</div>
            </div>
            <div style={detailItem}>
              <div style={detailLabel}>Posted</div>
              <div style={detailValue}>
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently"}
              </div>
            </div>
          </div>
          
          <div style={jobDescription}>
            {job.description ? (
              job.description.length > 100 ? 
              `${job.description.substring(0, 100)}...` : 
              job.description
            ) : "No description available"}
          </div>
          
          <div style={jobActions}>
            <button
              style={{
                ...primaryButton,
                ...(hoveredButton === `apply-${job._id}` && primaryButtonHover)
              }}
              onMouseEnter={() => setHoveredButton(`apply-${job._id}`)}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => setSelectedJob(job)}
            >
              Apply Now
            </button>
            <button
              style={{
                ...secondaryButton,
                ...(hoveredButton === `save-${job._id}` && secondaryButtonHover),
                background: isSaved ? '#fef3c7' : '#f3f4f6',
                color: isSaved ? '#92400e' : '#374151'
              }}
              onMouseEnter={() => setHoveredButton(`save-${job._id}`)}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={() => handleSaveJob(job)}
            >
              {isSaved ? '⭐ Saved' : '💾 Save Job'}
            </button>
          </div>
        </div>
      );
    });
  }, [jobs, locationFilter, techFilter, savedJobs, hoveredCard, hoveredButton]);

  const totalJobs = jobs.length;
  const filteredJobsCount = cards.length;
  const savedJobsCount = savedJobs.length;

  return (
    <div style={page}>
      {/* Navigation Bar */}
      <div style={userNavWrap}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={userNavTitle}>
            <span style={userNavTitleIcon}>💼</span>
            Job Portal
          </div>
        </div>
        
        <div style={navButtonsContainer}>
          <button 
            onClick={handleJobs}
            style={{
              ...userNavBtn,
              background: window.location.pathname === '/user/dashboard' ? 'rgba(255, 255, 255, 0.2)' : userNavBtn.background
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, userNavBtnHover)}
            onMouseLeave={e => {
              e.currentTarget.style.background = window.location.pathname === '/user/dashboard' ? 
                'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            📋 Job Board
          </button>
          <button 
            onClick={handleSavedJobs}
            style={userNavBtn}
            onMouseEnter={e => Object.assign(e.currentTarget.style, userNavBtnHover)}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            ⭐ Saved ({savedJobsCount})
          </button>
          <button 
            onClick={handleApplications}
            style={userNavBtn}
            onMouseEnter={e => Object.assign(e.currentTarget.style, userNavBtnHover)}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            📄 Applications
          </button>
          <button 
            onClick={handleProfile}
            style={userNavBtn}
            onMouseEnter={e => Object.assign(e.currentTarget.style, userNavBtnHover)}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            👤 Profile
          </button>
          <button 
            onClick={handleLogout}
            style={{
              ...userLogoutBtn,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => Object.assign(e.currentTarget.style, userLogoutBtnHover)}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'none';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={container}>
        {/* Page Header */}
        <div style={pageHeader}>
          <div>
            <div style={pageTitle}>Find Your Dream Job</div>
            <div style={pageSubtitle}>
              Discover {totalJobs} opportunities from top companies
            </div>
          </div>
          <div style={{ fontSize: '15px', color: '#6b7280', fontWeight: '500' }}>
            Showing {filteredJobsCount} of {totalJobs} jobs
          </div>
        </div>

        {/* Stats Cards */}
        <div style={statsGrid}>
          <div 
            style={statCard}
            onMouseEnter={e => Object.assign(e.currentTarget.style, statCardHover)}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={statValue}>{totalJobs}</div>
            <div style={statLabel}>Total Jobs</div>
          </div>
          <div 
            style={statCard}
            onMouseEnter={e => Object.assign(e.currentTarget.style, statCardHover)}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={statValue}>{filteredJobsCount}</div>
            <div style={statLabel}>Filtered Jobs</div>
          </div>
          <div 
            style={statCard}
            onMouseEnter={e => Object.assign(e.currentTarget.style, statCardHover)}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={statValue}>{savedJobsCount}</div>
            <div style={statLabel}>Saved Jobs</div>
          </div>
        </div>

        {/* Filters Section */}
        <div style={filtersContainer}>
          <div style={filtersTitle}>
            <span>🔍</span>
            Filter Jobs
          </div>
          <div style={filtersGrid}>
            <div style={filterGroup}>
              <label style={filterLabel}>Location</label>
              <select 
                value={locationFilter} 
                onChange={e => setLocationFilter(e.target.value)}
                style={filterSelect}
                onFocus={e => Object.assign(e.currentTarget.style, filterSelectFocus)}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">All Locations</option>
                {locationOptions.map(loc => (
                  <option key={loc} value={loc}>{loc || "All Locations"}</option>
                ))}
              </select>
            </div>
            <div style={filterGroup}>
              <label style={filterLabel}>Technology</label>
              <select 
                value={techFilter} 
                onChange={e => setTechFilter(e.target.value)}
                style={filterSelect}
                onFocus={e => Object.assign(e.currentTarget.style, filterSelectFocus)}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">All Technologies</option>
                {filteredTechs.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>
            <div style={filterGroup}>
              <label style={filterLabel}>Actions</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  style={{
                    ...secondaryButton,
                    padding: '12px 20px',
                    background: '#e5e7eb',
                    minWidth: 'auto'
                  }}
                  onClick={() => {
                    setLocationFilter("");
                    setTechFilter("");
                  }}
                >
                  Clear Filters
                </button>
                <button
                  style={{
                    ...secondaryButton,
                    padding: '12px 20px',
                    background: '#dbeafe',
                    color: '#2563eb',
                    minWidth: 'auto'
                  }}
                  onClick={() => {
                    const remoteJobs = jobs.filter(j => j.location === 'Remote');
                    if (remoteJobs.length > 0) {
                      setLocationFilter('Remote');
                    }
                  }}
                >
                  Remote Only
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div style={loadingContainer}>
            <div style={loadingSpinner}></div>
            <div style={{ fontSize: '16px', color: '#6b7280', fontWeight: '600' }}>
              Loading job opportunities...
            </div>
          </div>
        ) : error ? (
          <div style={errorContainer}>
            <div style={errorIcon}>⚠️</div>
            <div style={errorText}>{error}</div>
          </div>
        ) : (
          <div style={jobsGrid}>
            {cards.length > 0 ? cards : (
              <div style={emptyState}>
                <div style={emptyStateIcon}>🔍</div>
                <div style={emptyStateTitle}>No jobs found</div>
                <div style={emptyStateText}>
                  {locationFilter || techFilter 
                    ? "Try adjusting your filters to find more opportunities." 
                    : "No job opportunities are currently available. Please check back later."}
                </div>
                {(locationFilter || techFilter) && (
                  <button
                    style={{
                      ...primaryButton,
                      marginTop: '20px',
                      maxWidth: '200px'
                    }}
                    onClick={() => {
                      setLocationFilter("");
                      setTechFilter("");
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Job Modal */}
      <ApplyJobModal
        job={selectedJob}
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default Dashboard;