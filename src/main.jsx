import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import About from "./About.jsx";
import AdDetailss from "./AdDetails.jsx";
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
import AdminFinance from "./Admin/AdminFinance.jsx";
import SelectProductForAd from "./Vendor/SelectProductForAd.jsx";
import CreateAd from "./Vendor/CreateAd.jsx";
import FinanceDetails from "./Admin/FinanceDetails.jsx";
import CreditDetails from "./Admin/CreditDetails.jsx";
import AdDetails from "./Admin/AdDetails.jsx";
import AdminNotification from "./Admin/AdminNotification.jsx";
import Favorites from "./Favorites.jsx";
import AdminCreateAdvert from "./Admin/AdminCreateAdvert.jsx";
import CategoryPage from "./CategoryPage.jsx";
import CategoryManagement from "./Admin/AdminCategory.jsx";
import PartnerDashboard from "./Partner/PartnerDashboard.jsx";
import NotFound from "./Component/NotFound.jsx";
import ProfilePage from "./ProfilePage.jsx";
import ProductDetails from "./Vendor/productDetails.jsx";
import TermsAndConditions from "./Component/TermsAndConditions.jsx";
import PrivacyPolicy from "./Component/PrivacyPolicy.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ScrollToTop/>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/categories/:categoryName" element={<CategoryPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/rules" element={<TermsAndConditions />} /> 
          <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
          <Route path="/start" element={<Signup1 />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password" element={<Forgotpassword />} />
          <Route path="/ads/:adId/active" element={<AdDetailss />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/ads" element={<Ads />} />
          <Route path="selectedads" element={<SelectProductForAd />} />
          <Route path="/create-ad/:productId" element={<CreateAd />} />
          <Route path="/credits" element={<Credit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/users" element={<AdminUsermanagement />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/admin/ads" element={<AdminAds />} />
          <Route path="/create-ads" element={<AdminCreateAdvert />} />
          <Route path="/ads-management/:id" element={<AdDetails />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/finance/:type" element={<FinanceDetails />} />
          <Route path="/admin/finance/credit/:id" element={<CreditDetails />} />
          <Route path="/admin/notifications" element={<AdminNotification />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/logout" element={<AdminLogout />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="*" element={<NotFound />} />


        </Routes>
    </Router>
  </StrictMode>
);
