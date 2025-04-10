import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaAd,
  FaMoneyBillWave,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
  FaBox,
} from "react-icons/fa";

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-white border-r border-gray-300 p-5 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 w-64 z-40`}
      >
        {/* Close Button (Mobile) and Logo */}
        <div className="flex justify-between items-center mb-6">
          <img src="/llogo.png" alt="Logo" className="w-32" />
          <button
            className="lg:hidden text-gray-700 text-2xl"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-sm ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            <FaThLarge className="mr-3" /> Dashboard
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-sm ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            <FaBox className="mr-3" /> Products
          </NavLink>
          <NavLink
            to="/ads"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-sm ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            <FaAd className="mr-3" /> Ads Management
          </NavLink>
          <NavLink
            to="/credits"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-sm ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            <FaMoneyBillWave className="mr-3" /> Credit Management
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-sm ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            <FaCogs className="mr-3" /> Settings
          </NavLink>
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg text-sm ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
            onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </NavLink>
        </nav>

        {/* Promo Section */}
        <div className="mt-8 bg-purple-500 text-white p-4 rounded-lg text-center">
          <p>Promote your products with targeted ads.</p>
          <button className="mt-2 bg-white text-purple-500 px-4 py-2 rounded-lg">
            Advertise now
          </button>
        </div>
      </aside>

      {/* Overlay (When Sidebar is Open on Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
