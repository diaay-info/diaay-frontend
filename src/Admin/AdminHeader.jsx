import React from "react";
import { FaBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  // Get page title based on current route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin/dashboard":
        return "Dashboard";
      case "/admin/users":
        return "User Management";
      case "/admin/ads":
        return "Ads Management";
      case "/admin/finance":
        return "Finance Management";
      case "/admin/notification":
        return "Notification";
      case "/admin/support":
        return "Support Request";
      case "/settings":
        return "Settings";
        case "/logout":
          return "Logout";
      // default:
      //   return "Logout";
    }
  };

  return (
    <header className="flex justify-between items-center bg-white p-4 shadow-md w-full">
      {/* Page Title - Shows on medium & large screens */}
      <h2 className="text-lg md:text-xl font-semibold">{getPageTitle()}</h2>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-600 text-lg cursor-pointer" />

        {/* User Profile - Hidden on very small screens */}
        <div className="flex items-center">
          <span className="mr-2 hidden sm:block text-sm md:text-base">
            Taiwo Omotola
          </span>
          <img
            src="/profile.png"
            alt="User"
            className="w-8 h-8 md:w-10 md:h-10 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
