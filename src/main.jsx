import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import About from "./About.jsx";
import Signup1 from "./Registration/Signup1.jsx";
import Verify from "./Registration/Verify.jsx";
import Login from "./Registration/Login.jsx";
import Forgotpassword from "./Registration/Forgotpassword.jsx";
import Recovery from "./Registration/Recovery.jsx";
import ResetPassword from "./Registration/Resetpassword.jsx";
import VendorDashboard from "./Vendor/Dashboard.jsx";
import Products from "./Vendor/Products.jsx";
import Ads from "./Vendor/Ads.jsx";
import Credit from "./Vendor/Credit.jsx";
import Settings from "./Vendor/Settings.jsx";
import Logout from "./Vendor/Logout.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import AdminUsermanagement from "./Admin/AdminUsermanagement.jsx";
import UserDetails from "./Admin/UserDetails.jsx";
import AdminAds from "./Admin/AdminAds.jsx";
import AdminSettings from "./Admin/AdminSettings.jsx";
import AdminLogout from "./Admin/AdminLogout.jsx";
import SelectProductForAd from "./Vendor/SelectProductForAd.jsx";
import CreateAd from "./Vendor/CreateAd.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/start" element={<Signup1 />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password" element={<Forgotpassword />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="selectedads" element={<SelectProductForAd />} />
        <Route path="/create-ad/:productId" element={<CreateAd />} />
        <Route path="/credits" element={<Credit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsermanagement />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/admin/ads" element={<AdminAds />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/logout" element={<AdminLogout />} />
      </Routes>
    </Router>
  </StrictMode>
);
