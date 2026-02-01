import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function AddJob({ onAdded }) {
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    technology: "",
    experience: "",
  });
  const [jobs, setJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Load jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        setToast("Error loading jobs");
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  /* ===============================
     ADD / UPDATE JOB
  ================================ */
  const submit = async () => {
    // Validation
    if (!job.title.trim() || !job.company.trim() || !job.location.trim()) {
      setToast("Please fill in required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      const jobData = {
        ...job,
        technology:
          typeof job.technology === "string"
            ? job.technology
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        experience: String(job.experience || ""),
      };

      if (editingId) {
        const res = await API.put(`/admin/jobs/${editingId}`, jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobs((prev) =>
          prev.map((j) => (j._id === editingId ? res.data : j)),
        );

        setPopupMsg("Job Updated Successfully!");
        setEditingId(null);
      } else {
        const res = await API.post("/admin/jobs", jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setJobs((prev) => [res.data, ...prev]);
        setPopupMsg("Job Added Successfully!");
      }

      onAdded?.();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2200);

      // Reset form
      setJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        technology: "",
        experience: "",
      });
    } catch (err) {
      console.error(err);
      setToast(err.response?.data?.message || "Error adding/updating job");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     START EDIT
  ================================ */
  const startEdit = (j) => {
    setEditingId(j._id);
    setJob({
      title: j.title,
      company: j.company,
      location: j.location,
      salary: j.salary,
      description: j.description,
      technology: Array.isArray(j.technology) ? j.technology.join(", ") : "",
      experience: j.experience || "",
    });
  };

  /* ===============================
     DELETE JOB
  ================================ */
  const deleteJob = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      setLoading(true);

      await API.delete(`/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prev) => prev.filter((j) => j._id !== id));

      setPopupMsg("Job Deleted Successfully!");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2200);
    } catch (err) {
      console.error(err);
      setToast("Error deleting job");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setJob({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      technology: "",
      experience: "",
    });
  };

  return (
    <div className="add-job-container">
      {/* ================= FORM SECTION ================= */}
      <div className="form-section">
        <h3 className="form-title">
          {editingId ? "Edit Job" : "Create New Job"}
        </h3>
        <p className="form-subtitle">
          Fill in the details below to {editingId ? "update" : "create"} a job
          posting
        </p>

        <div className="form-grid">
          <div className="form-group">
            <label>
              Job Title *
              <input
                type="text"
                placeholder="e.g., Senior Frontend Developer"
                value={job.title}
                onChange={(e) => setJob({ ...job, title: e.target.value })}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Company Name *
              <input
                type="text"
                placeholder="e.g., TechCorp Inc."
                value={job.company}
                onChange={(e) => setJob({ ...job, company: e.target.value })}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Technologies
              <input
                type="text"
                placeholder="e.g., React, Node.js, MongoDB"
                value={job.technology}
                onChange={(e) => setJob({ ...job, technology: e.target.value })}
                className="form-input"
              />
              <span className="input-hint">Separate with commas</span>
            </label>
          </div>

          <div className="form-group">
            <label>
              Experience Required
              <input
                type="text"
                placeholder="e.g., 3-5 years"
                value={job.experience}
                onChange={(e) => setJob({ ...job, experience: e.target.value })}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Location *
              <input
                type="text"
                placeholder="e.g., Remote, New York, London"
                value={job.location}
                onChange={(e) => setJob({ ...job, location: e.target.value })}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Salary Range
              <input
                type="text"
                placeholder="e.g., $80,000 - $120,000"
                value={job.salary}
                onChange={(e) => setJob({ ...job, salary: e.target.value })}
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group full-width">
            <label>
              Job Description
              <textarea
                placeholder="Describe the role, responsibilities, and requirements..."
                value={job.description}
                onChange={(e) =>
                  setJob({ ...job, description: e.target.value })
                }
                className="form-textarea"
                rows={5}
              />
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            onClick={submit}
            className={`action-btn primary ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loader"></span>
            ) : editingId ? (
              "Update Job"
            ) : (
              "Create Job"
            )}
          </button>

          {editingId && (
            <button
              onClick={cancelEdit}
              className="action-btn secondary"
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* ================= JOBS LIST SECTION ================= */}
      <div className="jobs-section">
        <div className="section-header">
          <h3>All Job Listings</h3>
          <p className="section-subtitle">
            {loading ? "Loading..." : `${jobs.length} jobs listed`}
          </p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <svg viewBox="0 0 100 100" fill="none">
                <path
                  d="M30 40L50 60L70 40"
                  stroke="#667eea"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="20"
                  y="20"
                  width="60"
                  height="60"
                  rx="8"
                  stroke="#667eea"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h4>No jobs posted yet</h4>
            <p>Create your first job posting to get started</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((j) => (
              <div key={j._id} className="job-card">
                <div className="job-card-header">
                  <div className="job-title-section">
                    <h4 className="job-title">{j.title}</h4>
                    <div className="job-company">{j.company}</div>
                  </div>
                  {editingId === j._id && (
                    <span className="editing-badge">Editing</span>
                  )}
                </div>

                <div className="job-card-body">
                  <div className="job-details">
                    <div className="detail-item">
                      <span className="detail-label">Location</span>
                      <span className="detail-value">{j.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Salary</span>
                      <span className="detail-value">
                        {j.salary || "Not specified"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience</span>
                      <span className="detail-value">
                        {j.experience || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {Array.isArray(j.technology) && j.technology.length > 0 && (
                    <div className="tech-tags">
                      {j.technology.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                      {j.technology.length > 3 && (
                        <span className="tech-tag more">
                          +{j.technology.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {j.description && (
                    <div className="job-description">
                      <p>
                        {j.description.length > 150
                          ? `${j.description.substring(0, 150)}...`
                          : j.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="job-card-actions">
                  <button
                    onClick={() => startEdit(j)}
                    className="action-btn small"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteJob(j._id)}
                    className="action-btn small danger"
                  >
                    <svg viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 6h18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= TOAST NOTIFICATION ================= */}
      {toast && (
        <div className="toast-notification">
          <div className="toast-content">
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8v4M12 16h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* ================= SUCCESS POPUP ================= */}
      {showPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="popup-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="popup-title">{popupMsg}</h3>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ====== CONTAINER ====== */
        .add-job-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* ====== FORM SECTION ====== */
        .form-section {
          background: white;
          border-radius: var(--border-radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--gray-200);
          animation: slideUp 0.4s ease-out;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
        }

        .form-subtitle {
          font-size: 0.9375rem;
          color: var(--gray-600);
          margin-bottom: 2rem;
          font-weight: 400;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-700);
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-group label::after {
          content: " *";
          color: var(--danger-color);
          opacity: 0;
        }

        .form-group:has(.form-input[required]) label::after {
          opacity: 1;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--border-radius-lg);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-800);
          background: white;
          transition: all var(--transition-base);
          outline: none;
        }

        .form-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .form-input::placeholder {
          color: var(--gray-400);
        }

        .form-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--border-radius-lg);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--gray-800);
          background: white;
          transition: all var(--transition-base);
          outline: none;
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }

        .form-textarea:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }

        .input-hint {
          font-size: 0.75rem;
          color: var(--gray-500);
          margin-top: 0.375rem;
          font-weight: 400;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        /* ====== BUTTONS ====== */
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-width: 140px;
        }

        .action-btn.primary {
          background: linear-gradient(
            135deg,
            var(--primary-color) 0%,
            var(--primary-dark) 100%
          );
          color: white;
          border: none;
        }

        .action-btn.primary:hover:not(:disabled) {
          background: linear-gradient(
            135deg,
            var(--primary-dark) 0%,
            #1e40af 100%
          );
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-btn.primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .action-btn.primary.loading {
          opacity: 0.8;
          cursor: wait;
        }

        .action-btn.secondary {
          background: white;
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }

        .action-btn.secondary:hover:not(:disabled) {
          background: var(--gray-50);
          border-color: var(--gray-400);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-btn.small {
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          min-width: auto;
        }

        .action-btn.danger {
          background: linear-gradient(
            135deg,
            var(--danger-color) 0%,
            #dc2626 100%
          );
          color: white;
          border: none;
        }

        .action-btn.danger:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .action-btn svg {
          width: 1rem;
          height: 1rem;
        }

        .btn-loader {
          width: 1.125rem;
          height: 1.125rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* ====== JOBS SECTION ====== */
        .jobs-section {
          background: white;
          border-radius: var(--border-radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--gray-200);
        }

        .section-header {
          margin-bottom: 2rem;
        }

        .section-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
        }

        .section-subtitle {
          font-size: 0.9375rem;
          color: var(--gray-600);
          font-weight: 400;
        }

        /* Loading State */
        .loading-state {
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
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
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .empty-illustration {
          margin: 0 auto 1.5rem;
          width: 8rem;
          height: 8rem;
          color: var(--primary-color);
          opacity: 0.7;
        }

        .empty-state h4 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--gray-600);
          font-size: 0.9375rem;
          max-width: 300px;
          font-weight: 400;
          line-height: 1.5;
        }

        /* Jobs Grid */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }

        .job-card {
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
          background: white;
        }

        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
          border-color: var(--primary-light);
        }

        .job-card-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .job-title-section {
          flex: 1;
          min-width: 0;
        }

        .job-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--dark-color);
          margin-bottom: 0.375rem;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .job-company {
          font-size: 0.9375rem;
          color: var(--primary-color);
          font-weight: 500;
        }

        .editing-badge {
          padding: 0.375rem 0.75rem;
          background: linear-gradient(
            135deg,
            var(--warning-color) 0%,
            #d97706 100%
          );
          color: white;
          border-radius: var(--border-radius-md);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .job-card-body {
          padding: 1.5rem;
        }

        .job-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 480px) {
          .job-details {
            grid-template-columns: 1fr;
          }
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-label {
          font-size: 0.75rem;
          color: var(--gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .detail-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gray-800);
        }

        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .tech-tag {
          padding: 0.375rem 0.75rem;
          background: var(--gray-100);
          color: var(--gray-700);
          border-radius: var(--border-radius-md);
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--gray-200);
        }

        .tech-tag.more {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .job-description {
          padding-top: 1rem;
          border-top: 1px solid var(--gray-200);
        }

        .job-description p {
          font-size: 0.875rem;
          color: var(--gray-600);
          line-height: 1.6;
          margin: 0;
        }

        .job-card-actions {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid var(--gray-200);
          display: flex;
          gap: 0.75rem;
          background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
        }

        /* ====== TOAST NOTIFICATION ====== */
        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-lg);
          font-weight: 500;
        }

        .toast-content svg {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        /* ====== SUCCESS POPUP ====== */
        .success-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
          backdrop-filter: blur(8px);
        }

        .success-popup {
          background: white;
          border-radius: var(--border-radius-xl);
          padding: 3rem;
          text-align: center;
          max-width: 400px;
          width: 90%;
          animation: popupScale 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: var(--shadow-2xl);
          border: 1px solid var(--gray-200);
        }

        @keyframes popupScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .popup-icon {
          margin: 0 auto 1.5rem;
          width: 4rem;
          height: 4rem;
          color: var(--success-color);
        }

        .popup-icon svg {
          width: 100%;
          height: 100%;
        }

        .popup-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--dark-color);
          margin: 0;
        }

        /* ====== ANIMATIONS ====== */
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* ====== DARK MODE SUPPORT ====== */
        @media (prefers-color-scheme: dark) {
          .form-section,
          .jobs-section,
          .job-card,
          .success-popup {
            background: #1e293b;
            border-color: #334155;
          }

          .job-card-header,
          .job-card-actions {
            background: #334155;
            border-color: #475569;
          }

          .form-input,
          .form-textarea {
            background: #334155;
            border-color: #475569;
            color: #f1f5f9;
          }

          .form-input::placeholder,
          .form-textarea::placeholder {
            color: #64748b;
          }

          .tech-tag {
            background: #475569;
            color: #e2e8f0;
            border-color: #64748b;
          }

          .job-title,
          .popup-title {
            color: #f8fafc;
          }

          .form-subtitle,
          .section-subtitle,
          .detail-label,
          .job-description p {
            color: #94a3b8;
          }

          .detail-value {
            color: #e2e8f0;
          }

          .action-btn.secondary {
            background: #334155;
            color: #e2e8f0;
            border-color: #475569;
          }

          .action-btn.secondary:hover:not(:disabled) {
            background: #475569;
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

        /* Focus styles */
        :focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
