import React, { useState, useEffect } from "react";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import { useLocation, NavLink } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Assuming token is stored in localStorage

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Including the token in the headers
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes("dashboard")) {
      return "Dashboard";
    } else if (path.includes("users")) {
      return "User Management";
    } else if (path.includes("ads")) {
      return "Ads Management";
    } else if (path.includes("finance")) {
      return "Finance Management";
    } else if (path.includes("notifications")) {
      return "Notifications";
    } else if (path.includes("reset")) {
      return "Reset Password";
    } else if (path.includes("settings")) {
      return "Settings";
    } else if (path.includes("logout")) {
      return "Logout";
    } else {
      return "Welcome"; // Default title
    }
  };

  const isActiveLink = (path) => {
    return location.pathname.includes(path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md w-full relative">
      <div className="flex justify-between items-center p-4">
        {/* Mobile Menu Toggle Button */}
        <button className="text-gray-600 lg:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Page Title - Shows on all screens */}
        <h2 className="text-lg md:text-xl font-semibold ml-4 lg:ml-10">
          {getPageTitle()}
        </h2>

        {/* Profile & Notifications */}
        <div className="flex items-center gap-4">
          {/* User Profile - Hidden on very small screens */}
          <div className="flex items-center">
            <span className="mr-2 hidden sm:block text-sm md:text-base font-bold">
              {loading ? "Loading..." : user.fullName || "Admin"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Only visible on mobile when toggled */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 transition-all duration-300 ${
          mobileMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col">
          <NavLink
            to="/"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("home")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Home{" "}
          </NavLink>
          <NavLink
            to="/admin/dashboard"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("dashboard")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("users")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            User Management
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("categories")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Category Management
          </NavLink>
          <NavLink
            to="/admin/ads"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("ads")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Ads Management
          </NavLink>
          <NavLink
            to="/admin/finance"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("finance")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Financial Management
          </NavLink>
          {/* <NavLink
            to="/admin/notifications"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("notifications")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Notifications
          </NavLink> */}
          {/* <NavLink
            to="/admin/reset-password"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("resetpassword")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
           Reset Password
          </NavLink> */}
          <NavLink
            to="/admin/settings"
            className={`flex items-center p-3 border-b text-sm ${
              isActiveLink("settings")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Settings
          </NavLink>
          <NavLink
            to="/admin/logout"
            className={`flex items-center p-3 text-sm ${
              isActiveLink("logout")
                ? "bg-purple-100 text-purple-700 font-medium"
                : "text-gray-700"
            }`}
            onClick={toggleMobileMenu}
          >
            Logout
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
