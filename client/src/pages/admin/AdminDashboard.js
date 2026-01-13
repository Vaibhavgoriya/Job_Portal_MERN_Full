// import axios from "../../api/axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
// import AddJob from "./AddJob";

// function AdminDashboard() {
//   const [apps, setApps] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return alert("Please login as admin");

//     let socket;

//     axios
//       .get("/admin/applications", { headers: { Authorization: `Bearer ${token}` } })
//       .then((res) => setApps(res.data))
//       .catch((err) => {
//         console.error(err);
//         alert("Error loading applications");
//       })
//       .finally(() => {
//         // connect socket after initial load and send admin token for auth
//         const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
//         const adminToken = localStorage.getItem("token");
//         socket = io(serverUrl, { auth: { token: adminToken } });

//         socket.on("connect", () => {
//           console.log("Socket connected", socket.id);
//         });

//         socket.on("newApplication", (newApp) => {
//           console.log("New application received", newApp);
//           setApps((prev) => [newApp, ...prev]);
//         });

//         socket.on("disconnect", () => {
//           console.log("Socket disconnected");
//         });
//       });

//     return () => {
//       if (socket) socket.disconnect();
//     };
//   }, []);

//   const navigate = useNavigate();

//   const [view, setView] = useState("add"); // 'add' | 'applications'
//   const [selectedApp, setSelectedApp] = useState(null);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("admin");
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("role");
//     navigate("/admin/login");
//   };

//   const handleJobAdded = (job) => {
//     console.log("Job added by admin", job);
//     alert("Job added successfully");
//   };

//   const openAppDetails = (app) => setSelectedApp(app);
//   const closeAppDetails = () => setSelectedApp(null);

//   return (
//     <div>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
//         <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
//         <button onClick={logout} style={{ padding: "8px 12px", background: "#e53935", color: "#fff", border: "none", borderRadius: 4 }}>Logout</button>
//       </div>

//       <div style={{ marginBottom: 12 }}>
//         <button onClick={() => setView("add")} style={{ marginRight: 8, padding: "8px 12px", background: view === "add" ? "#1976d2" : "#eee", color: view === "add" ? "#fff" : "#000", border: "none", borderRadius: 4 }}>Add Jobs</button>
//         <button onClick={() => setView("applications")} style={{ padding: "8px 12px", background: view === "applications" ? "#1976d2" : "#eee", color: view === "applications" ? "#fff" : "#000", border: "none", borderRadius: 4 }}>View Applications</button>
//       </div>

//       {view === "add" && (
//         <div style={{ border: "1px solid #ddd", padding: 16 }}>
//           <AddJob onAdded={handleJobAdded} />
//         </div>
//       )}

//       {view === "applications" && (
//         <div style={{ border: "1px solid #ddd", padding: 16 }}>
//           <h3>Applications</h3>

//           {apps.length === 0 && <p>No applications found</p>}

//           {apps.map((app) => (
//             <div key={app._id} onClick={() => openAppDetails(app)} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10, cursor: "pointer" }}>
//               <p><b>User:</b> {app.user?.name ?? "Unknown"} ({app.user?.email ?? "-"})</p>
//               <p><b>Job:</b> {app.job?.title ?? "Unknown"} — {app.job?.company ?? "-"}</p>
//               <p style={{ color: "#666", fontSize: 12 }}>{app.createdAt ? new Date(app.createdAt).toLocaleString() : "Unknown"}</p>
//             </div>
//           ))}

//           {selectedApp && (
//             <div style={{ marginTop: 16, padding: 12, border: "1px solid #bbb", borderRadius: 6, background: "#fafafa" }}>
//               <h4>Application Details</h4>
//               <p><b>User:</b> {selectedApp.user?.name ?? "Unknown"} ({selectedApp.user?.email ?? "-"})</p>
//               <p><b>Job:</b> {selectedApp.job?.title ?? "Unknown"} — {selectedApp.job?.company ?? "-"}</p>
//               <p><b>Applied At:</b> {selectedApp.createdAt ? new Date(selectedApp.createdAt).toLocaleString() : "Unknown"}</p>
//               {selectedApp.resumeUrl ? (
//                 <p><a href={`${process.env.REACT_APP_SERVER_URL || "http://localhost:5000"}${selectedApp.resumeUrl}`} target="_blank" rel="noreferrer">View / Download Resume</a></p>
//               ) : (
//                 <p>No resume available</p>
//               )}

//               <button onClick={closeAppDetails} style={{ marginTop: 8 }}>Close</button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;
import axios from "../../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import AddJob from "./AddJob";

function AdminDashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login as admin");

    let socket;

    axios
      .get("/admin/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setApps(res.data))
      .catch((err) => {
        console.error(err);
        alert("Error loading applications");
      })
      .finally(() => {
        const serverUrl = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
        const adminToken = localStorage.getItem("token");
        socket = io(serverUrl, { auth: { token: adminToken } });

        socket.on("connect", () => {
          console.log("Socket connected", socket.id);
        });

        socket.on("newApplication", (newApp) => {
          console.log("New application received", newApp);
          setApps((prev) => [newApp, ...prev]);
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
        });
      });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const navigate = useNavigate();

  const [view, setView] = useState("add"); // 'add' | 'applications'
  const [selectedApp, setSelectedApp] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/admin/login");
  };

  const handleJobAdded = (job) => {
    console.log("Job added by admin", job);
    // Removed alert. Only show popup/toast from AddJob.js
  };

  const openAppDetails = (app) => setSelectedApp(app);
  const closeAppDetails = () => setSelectedApp(null);

  // ------------------- New Function -------------------
  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      let url = "";
      let msg = "";
      let email = arguments.length === 3 ? arguments[2] : selectedApp?.user?.email;
      if (status === "Approved") {
        url = "/admin/applications/approve";
        msg = "Mail sent successfully.";
      } else if (status === "Rejected") {
        url = "/admin/applications/reject";
        msg = "Mail sent successfully.";
      } else {
        alert("Invalid status");
        return;
      }
      await axios.post(url, { applicationId: id, userEmail: email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(msg);
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
      alert("Failed to send mail.");
    }
  };
  // ------------------------------------------------------

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', fontFamily: 'Segoe UI, Arial, sans-serif', padding: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ margin: 0, color: '#003366', fontWeight: 900, fontSize: 32, letterSpacing: 0.5, textShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>Admin Dashboard</h2>
          <button onClick={logout} style={{ padding: '12px 24px', background: 'linear-gradient(90deg, #e53935 0%, #ff7043 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, letterSpacing: 0.5, cursor: 'pointer', boxShadow: '0 2px 8px rgba(229,57,53,0.10)', textTransform: 'uppercase' }}>Logout</button>
        </div>

        <div style={{ marginBottom: 18 }}>
          <button onClick={() => setView('add')} style={{ marginRight: 8, padding: '12px 24px', background: view === 'add' ? 'linear-gradient(90deg, #003366 0%, #0052cc 100%)' : '#eee', color: view === 'add' ? '#fff' : '#003366', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, letterSpacing: 0.5, cursor: 'pointer', boxShadow: view === 'add' ? '0 2px 8px rgba(0, 51, 102, 0.10)' : 'none', textTransform: 'uppercase' }}>Add Jobs</button>
          <button onClick={() => setView('applications')} style={{ padding: '12px 24px', background: view === 'applications' ? 'linear-gradient(90deg, #003366 0%, #0052cc 100%)' : '#eee', color: view === 'applications' ? '#fff' : '#003366', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, letterSpacing: 0.5, cursor: 'pointer', boxShadow: view === 'applications' ? '0 2px 8px rgba(0, 51, 102, 0.10)' : 'none', textTransform: 'uppercase' }}>View Applications</button>
        </div>

        {view === 'add' && (
          <div style={{ border: '1px solid #ddd', borderRadius: 14, boxShadow: '0 4px 24px rgba(60,72,88,0.10)', padding: 28, background: '#fff' }}>
            <AddJob onAdded={handleJobAdded} />
          </div>
        )}

        {view === 'applications' && (
          <div style={{ border: '1px solid #ddd', borderRadius: 14, boxShadow: '0 4px 24px rgba(60,72,88,0.10)', padding: 28, background: '#fff' }}>
            <h3 style={{ color: '#1565c0', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Applications</h3>

            {apps.length === 0 && <p>No applications found</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'stretch' }}>
              {apps.map((app) => (
                <div key={app._id} onClick={() => openAppDetails(app)} style={{ background: '#f9fafb', borderRadius: 12, boxShadow: '0 2px 8px rgba(60,72,88,0.08)', padding: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 180, border: '1px solid #e0e0e0', transition: 'box-shadow 0.2s' }}>
                  <p style={{ fontWeight: 700, color: '#003366', fontSize: 18, marginBottom: 4 }}><b>User:</b> {app.user?.name ?? 'Unknown'} <span style={{ fontWeight: 400, color: '#333', fontSize: 15 }}>({app.user?.email ?? '-'})</span></p>
                  <p><b>Job:</b> {app.job?.title ?? 'Unknown'} — {app.job?.company ?? '-'}</p>
                  <p style={{ color: '#666', fontSize: 13 }}>
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleString('en-US', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true,
                          timeZone: 'Asia/Kolkata'
                        })
                      : 'Unknown'}
                  </p>
                  <p><b>Status:</b> {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}</p>
                  <div style={{ flexGrow: 1 }}></div>
                </div>
              ))}
            </div>

            {selectedApp && (
              <div style={{ marginTop: 32, padding: 32, border: '1px solid #bbb', borderRadius: 16, background: '#f5f7fa', boxShadow: '0 4px 24px rgba(60,72,88,0.10)', maxWidth: 480, width: '100%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <h4 style={{ color: '#003366', fontWeight: 800, fontSize: 22, marginBottom: 10 }}>Application Details</h4>
                <p><b>User:</b> {selectedApp.user?.name ?? 'Unknown'} ({selectedApp.user?.email ?? '-'})</p>
                <p><b>Job:</b> {selectedApp.job?.title ?? 'Unknown'} — {selectedApp.job?.company ?? '-'}</p>
                <p><b>Applied At:</b> {selectedApp.createdAt
                  ? new Date(selectedApp.createdAt).toLocaleString('en-US', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: true,
                      timeZone: 'Asia/Kolkata'
                    })
                  : 'Unknown'}
                </p>
                <p><b>Status:</b> {selectedApp.status ? selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1) : 'Pending'}</p>
                {selectedApp.resumeUrl ? (
                  <p><a href={`${process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'}${selectedApp.resumeUrl}`} target="_blank" rel="noreferrer" style={{ color: '#1565c0', fontWeight: 700 }}>View / Download Resume</a></p>
                ) : (
                  <p>No resume available</p>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                  {selectedApp.status !== 'Approved' && (
                    <button onClick={() => handleStatus(selectedApp._id, 'Approved', selectedApp.user?.email)} style={{ flex: 1, padding: '12px 0', background: 'linear-gradient(90deg, #003366 0%, #0052cc 100%)', color: '#fff', border: 'none', borderRadius: 7, fontWeight: 900, fontSize: 16, letterSpacing: 0.5, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 51, 102, 0.10)', textTransform: 'uppercase' }}>✅ Approve</button>
                  )}
                  {selectedApp.status !== 'Rejected' && (
                    <button onClick={() => handleStatus(selectedApp._id, 'Rejected', selectedApp.user?.email)} style={{ flex: 1, padding: '12px 0', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 16, letterSpacing: 0.5, cursor: 'pointer', textTransform: 'uppercase' }}>❌ Reject</button>
                  )}
                  <button onClick={closeAppDetails} style={{ flex: 1, padding: '12px 0', background: '#fff', color: '#003366', border: '1px solid #003366', borderRadius: 7, fontWeight: 700, fontSize: 16, letterSpacing: 0.5, cursor: 'pointer', textTransform: 'uppercase' }}>Close</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
