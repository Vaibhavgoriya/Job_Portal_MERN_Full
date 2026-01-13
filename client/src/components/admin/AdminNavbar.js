import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <nav>
      <Link to="/admin/dashboard">Dashboard</Link>
      <Link to="/admin/add-job">Add Job</Link>
      <Link to="/admin/applications">Applications</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default AdminNavbar;
