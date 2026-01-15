// ...existing code...
//       setToast("Error adding/updating job");
//     }
//   };

//   const startEdit = (j) => {
//     setEditingId(j._id);
//     setJob({ title: j.title, company: j.company, location: j.location, salary: j.salary, description: j.description });
//   };

//   const deleteJob = async (id) => {
//     if (!window.confirm("Delete this job?")) return;
//     try {
//       const token = localStorage.getItem("token");
//       await API.delete(`/admin/jobs/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       setJobs((prev) => prev.filter((j) => j._id !== id));
//       setToast("Job deleted");
//     } catch (err) {
//       console.error(err);
//       setToast("Error deleting job");
//     }
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: 12 }}>
//         <input value={job.title} placeholder="Title" onChange={(e) => setJob({ ...job, title: e.target.value })} />
//         <input value={job.company} placeholder="Company" onChange={(e) => setJob({ ...job, company: e.target.value })} />
//         <input value={job.location} placeholder="Location" onChange={(e) => setJob({ ...job, location: e.target.value })} />
//         <input value={job.salary} placeholder="Salary" onChange={(e) => setJob({ ...job, salary: e.target.value })} />
//         <textarea value={job.description} placeholder="Description" onChange={(e) => setJob({ ...job, description: e.target.value })} />
//         <button onClick={submit}>{editingId ? "Update" : "Add"}</button>
//         {editingId && <button onClick={() => { setEditingId(null); setJob({ title: "", company: "", location: "", salary: "", description: "" }); }} style={{ marginLeft: 8 }}>Cancel</button>}
//       </div>

//       <div>
//         <h4>All Jobs</h4>
//         {jobs.length === 0 && <p>No jobs</p>}
//         {jobs.map((j) => (
//           <div key={j._1d ? j._1d : j._id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 6 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <div>
//                 <div><b>{j.title}</b> — {j.company}</div>
//                 <div style={{ fontSize: 12, color: "#555" }}>{j.location} • {j.salary || 'Not specified'}</div>
//               </div>

//               <button onClick={() => deleteJob(j._id)} style={{ padding: "12px 12px", background: "#e53935", color: "#fff", border: "none", borderRadius: 4 }}>Delete</button>
//             </div>

//             <div style={{ marginTop: 6 }}>
//               <button onClick={() => startEdit(j)} style={{ marginRight: 8 }}>Edit</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {toast && (
//         <div style={{ position: "fixed", bottom: 20, right: 20, background: "#333", color: "#fff", padding: "8px 12px", borderRadius: 6 }}>{toast}</div>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import API from "../../api/axios";
import { io } from "socket.io-client";

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
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

  // auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const serverUrl =
      process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");

    // load jobs
    API.get("/jobs")
      .then((res) => setJobs(res.data))
      .catch(console.error);

    // socket
    const socket = io(serverUrl, { auth: { token } });

    socket.on("newJob", (newJob) => {
      setJobs((prev) => [newJob, ...prev]);
    });

    socket.on("updateJob", (updatedJob) => {
      setJobs((prev) =>
        prev.map((j) => (j._id === updatedJob._id ? updatedJob : j))
      );

      if (editingId === updatedJob._id) {
        setJob({
          title: updatedJob.title,
          company: updatedJob.company,
          location: updatedJob.location,
          salary: updatedJob.salary,
          description: updatedJob.description,
          technology: updatedJob.technology || "",
          experience: updatedJob.experience || "",
        });
      }
    });

    return () => socket.disconnect();
  }, [editingId]);

  const submit = async () => {
    try {
      const token = localStorage.getItem("token");
      // Always save technology as array, experience as string
      const jobData = {
        ...job,
        technology: typeof job.technology === "string" ? job.technology.split(",").map(t => t.trim()).filter(Boolean) : [],
        experience: String(job.experience || "")
      };
      if (editingId) {
        const res = await API.put(`/admin/jobs/${editingId}`, jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
        onAdded?.(res.data);
        setPopupMsg("Job Updated Successfully!");
        setShowEditPopup(true);
        setToast("");
        setTimeout(() => setShowEditPopup(false), 2200);
      } else {
        const res = await API.post("/admin/jobs", jobData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onAdded?.(res.data);
        setPopupMsg("Job Added Successfully!");
        setShowEditPopup(true);
        setTimeout(() => setShowEditPopup(false), 2200);
      }
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
      setToast("Error adding/updating job");
    }
  };

  const startEdit = (j) => {
    setEditingId(j._id);
    setJob({
      title: j.title,
      company: j.company,
      location: j.location,
      salary: j.salary,
      description: j.description,
      technology: Array.isArray(j.technology) ? j.technology.join(", ") : (j.technology || ""),
      experience: j.experience || "",
    });
  };

  const deleteJob = async (id) => {
    // Custom confirm dialog with Yes/Cancel
    const confirmed = await new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = 0;
      modal.style.left = 0;
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.18)';
      modal.style.display = 'flex';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.zIndex = 10000;
      modal.innerHTML = `
        <div style="background: #fff; border-radius: 14px; box-shadow: 0 4px 24px rgba(60,72,88,0.18); padding: 32px 36px; min-width: 320px; display: flex; flex-direction: column; align-items: center; gap: 18px;">
          <div style="font-size: 20px; color: #003366; font-weight: 700; margin-bottom: 8px;">Are you sure you want to delete this job?</div>
          <div style="display: flex; gap: 18px; margin-top: 10px;">
            <button id="yesBtn" style="padding: 10px 28px; background: linear-gradient(90deg, #e53935 0%, #ff7043 100%); color: #fff; border: none; border-radius: 7px; font-weight: 700; font-size: 16px; cursor: pointer;">Yes</button>
            <button id="cancelBtn" style="padding: 10px 28px; background: #e0e0e0; color: #333; border: none; border-radius: 7px; font-weight: 700; font-size: 16px; cursor: pointer;">Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('#yesBtn').onclick = () => { document.body.removeChild(modal); resolve(true); };
      modal.querySelector('#cancelBtn').onclick = () => { document.body.removeChild(modal); resolve(false); };
    });
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((j) => j._id !== id));
      setPopupMsg("Job Deleted Successfully!");
      setShowEditPopup(true);
      setTimeout(() => setShowEditPopup(false), 2200);
    } catch (err) {
      console.error(err);
      setToast("Error deleting job");
    }
  };

  return (
    <div>
      {/* Add / Edit Form */}
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Title"
          value={job.title}
          onChange={(e) => setJob({ ...job, title: e.target.value })}
        />
        <input
          placeholder="Company"
          value={job.company}
          onChange={(e) => setJob({ ...job, company: e.target.value })}
        />
        <input
          placeholder="Technology"
          value={job.technology}
          onChange={(e) => setJob({ ...job, technology: e.target.value })}
        />
        <input
          placeholder="Experience"
          value={job.experience}
          onChange={(e) => setJob({ ...job, experience: e.target.value })}
        />
        <input
          placeholder="Location"
          value={job.location}
          onChange={(e) => setJob({ ...job, location: e.target.value })}
        />
        <input
          placeholder="Salary"
          value={job.salary}
          onChange={(e) => setJob({ ...job, salary: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={job.description}
          onChange={(e) => setJob({ ...job, description: e.target.value })}
        />
        {/* ...removed Technology and Experience fields... */}
        <button onClick={submit}>
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={() => {
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
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Job List */}
      <div>
        <h4>All Jobs</h4>
        {jobs.length === 0 && <p>No jobs</p>}

        {jobs.map((j) => (
          <div
            key={j._id}
            style={{
              border: "1px solid #ddd",
              padding: 8,
              marginBottom: 6,
            }}
          >
            <div>
              <b>{j.title}</b> — {j.company}
              <div style={{ fontSize: 12, color: "#555" }}>
                {j.location} • {j.salary || "Not specified"}
              </div>
              <div style={{ fontSize: 12, color: "#555" }}>
                <b>Technology:</b> {Array.isArray(j.technology) ? j.technology.join(", ") : j.technology || "-"}
              </div>
              <div style={{ fontSize: 12, color: "#555" }}>
                <b>Experience:</b> {j.experience || "-"}
              </div>
            </div>
            {/* ✅ Edit & Delete side by side */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 8,
              }}
            >
              <button onClick={() => startEdit(j)}>Edit</button>
              <button
                onClick={() => deleteJob(j._id)}
                style={{
                  background: "#e53935",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 4,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#333",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 6,
            zIndex: 9999,
          }}
        >
          {toast}
        </div>
      )}

      {/* Modern Animated Popup for Add/Update/Delete */}
      {showEditPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          animation: 'fadeIn 0.2s',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(60,72,88,0.18)',
            padding: '38px 48px',
            minWidth: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            border: '2px solid #003366',
            animation: 'popIn 0.3s',
          }}>
            <span style={{ fontSize: 38, color: '#003366', marginBottom: 8 }}>✔️</span>
            <div style={{ color: '#003366', fontWeight: 900, fontSize: 22, textAlign: 'center', marginBottom: 4 }}>{popupMsg}</div>
            <div style={{ color: '#1565c0', fontWeight: 500, fontSize: 16, textAlign: 'center' }}>
              {popupMsg === 'Job Updated Successfully!' ? 'Your changes have been saved.' : popupMsg === 'Job Added Successfully!' ? 'New job has been added.' : popupMsg === 'Job Deleted Successfully!' ? 'The job has been deleted.' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
