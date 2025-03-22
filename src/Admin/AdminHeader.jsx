import React from "react";
import { FaBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

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
    } else if (path.includes("support")) {
      return "Support Request";
    } else if (path.includes("settings")) {
      return "Settings";
    } else if (path.includes("logout")) {
      return "Logout";
    } else {
      return "Welcome"; // Default title
    }
  };

  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-md w-full">
      {/* Page Title - Shows on all screens */}
      <h2 className="text-lg md:text-xl font-semibold ml-10 lg:ml-0">{getPageTitle()}</h2>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4">
        {/* Notification Icon - Visible on all screens */}
        <FaBell className="text-gray-600 text-lg cursor-pointer" />

        {/* User Profile - Hidden on very small screens */}
        <div className="flex items-center">
          <span className="mr-2 hidden sm:block text-sm md:text-base">
            Taiwo Omotola
          </span>
          {/* <img
            src="/profile.png"
            alt="User"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;