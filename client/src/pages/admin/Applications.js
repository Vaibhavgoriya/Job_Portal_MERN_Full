import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Applications() {
    const handleApprove = async (application) => {
      const token = localStorage.getItem("token");
      try {
        await API.post(
          "/admin/applications/approve",
          { applicationId: application._id, userEmail: application.user.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Mail sent successfully.");
      } catch (err) {
        console.error(err);
        alert("Failed to send mail.");
      }
    };

    const handleReject = async (application) => {
      const token = localStorage.getItem("token");
      try {
        await API.post(
          "/admin/applications/reject",
          { applicationId: application._id, userEmail: application.user.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Mail sent successfully.");
      } catch (err) {
        console.error(err);
        alert("Failed to send mail.");
      }
    };
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    API.get("/admin/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApps(res.data))
      .catch(err => { console.error(err); alert("Error loading applications"); });
  }, []);

  return (
    <div>
      <h2>Applications</h2>
      {apps.map((a) => (
        <div key={a._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <p><b>User:</b> {a.user.name} ({a.user.email})</p>
          <p><b>Job:</b> {a.job.title} — {a.job.company}</p>
          <p><b>Applied At:</b> {new Date(a.createdAt).toLocaleString()}</p>
          <a href={`http://localhost:5000${a.resumeUrl}`} target="_blank" rel="noreferrer">View / Download Resume</a>
          <div style={{ marginTop: 10 }}>
            <button onClick={() => handleApprove(a)} style={{ marginRight: 8, background: '#4caf50', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}>Approve</button>
            <button onClick={() => handleReject(a)} style={{ background: '#f44336', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
