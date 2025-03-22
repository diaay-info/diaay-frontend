import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUserCog,
  FaAd,
  FaMoneyBillWave,
  FaBell,
  FaQuestionCircle,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Check if the current URL contains a specific text
  const isActiveLink = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <>
      {/* 🔥 Stylish Menu Button - Hidden when sidebar is open */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg p-4 w-64 transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform lg:translate-x-0 lg:w-64 z-40 overflow-y-auto`}
      >
        {/* Logo and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <img src="/llogo.png" className="w-[8rem]" />
          {/* Close Icon for Mobile */}
          <button
            className="lg:hidden text-gray-600 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("dashboard")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaThLarge className="mr-3" /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("users")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaUserCog className="mr-3" /> User Management
          </NavLink>
          <NavLink
            to="/admin/ads"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("ads")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaAd className="mr-3" /> Ads Management
          </NavLink>
          <NavLink
            to="/admin/finance"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("finance")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaMoneyBillWave className="mr-3" /> Financial Management
          </NavLink>
          <NavLink
            to="/admin/notifications"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("notifications")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaBell className="mr-3" /> Notifications
          </NavLink>
          <NavLink
            to="/admin/support"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("support")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaQuestionCircle className="mr-3" /> Support Requests
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("settings")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaCogs className="mr-3" /> Settings
          </NavLink>
          <NavLink
            to="/admin/logout"
            className={`flex items-center p-3 rounded-lg text-sm ${
              isActiveLink("logout")
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </NavLink>
        </nav>
      </div>

      {/* Overlay when Sidebar is Open on Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
