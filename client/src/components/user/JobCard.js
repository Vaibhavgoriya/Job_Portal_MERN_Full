
import React from "react";

const JobCard = ({ job, onApply, onSave, isSaved }) => {
  // Support both lowercase and capitalized fields for robustness
  const tech = job.technology || job.Technology || [];
  const exp = job.experience || job.Experience || "-";
  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>{job.title}</h4>
        {onSave && (
          <button
            onClick={() => onSave(job)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 22,
              color: isSaved ? '#f59e42' : '#64748b',
              marginLeft: 8,
              outline: 'none',
              padding: 0,
            }}
            title={isSaved ? 'Unsave Job' : 'Save Job'}
          >
            {isSaved ? '★' : '☆'}
          </button>
        )}
      </div>
      <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>
        {job.company} • {job.location} • {job.salary || 'Not specified'}
      </div>
      <p><b>Technology:</b> {Array.isArray(tech) ? tech.join(', ') : tech || '-'}</p>
      <p><b>Experience:</b> {exp}</p>
      <p>{job.description?.slice(0, 120)}...</p>
      {onApply && (
        <button
          onClick={() => onApply(job._id)}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            padding: "8px 18px",
            cursor: "pointer",
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Apply
        </button>
      )}
    </div>
  );
};


const card = {
  background: "#fff",
  borderRadius: 14,
  boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
  padding: 28,
  marginBottom: 0,
  transition: "box-shadow 0.2s, transform 0.2s",
  border: "1.5px solid #e3e8ee",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  minHeight: 210,
};

export default JobCard;
