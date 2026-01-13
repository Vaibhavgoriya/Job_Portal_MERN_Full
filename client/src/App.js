import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// USER PAGES
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Dashboard from "./pages/user/Dashboard";
import Jobs from "./pages/user/Jobs";
import MyApplications from "./pages/user/MyApplications";
import UserForgotPassword from "./pages/user/UserForgotPassword";
import UserOtpVerify from "./pages/user/UserOtpVerify";
import UserResetPassword from "./pages/user/UserResetPassword";
// ADMIN PAGES
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddJob from "./pages/admin/AddJob";
import Applications from "./pages/admin/Applications";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminOtpVerify from "./pages/admin/AdminOtpVerify";
import AdminResetPassword from "./pages/admin/AdminResetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/user/login" />} />
        {/* USER ROUTES */}
        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/jobs" element={<Jobs />} />
        <Route path="/user/my-applications" element={<MyApplications />} />
        <Route path="/user/forgot-password" element={<UserForgotPassword />} />
        <Route path="/user/verify-otp" element={<UserOtpVerify />} />
        <Route path="/user/reset-password" element={<UserResetPassword />} />
        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-job" element={<AddJob />} />
        <Route path="/admin/applications" element={<Applications />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/verify-otp" element={<AdminOtpVerify />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;
