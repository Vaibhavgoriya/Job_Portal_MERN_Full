import { Navigate } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default AdminPrivateRoute;
