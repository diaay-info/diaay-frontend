import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaAd,
  FaMoneyBillWave,
  FaBell,
  FaQuestionCircle,
  FaCogs,
  FaSignOutAlt,
  FaThLarge,
  FaBox,
} from "react-icons/fa";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu Button (Hidden when Sidebar is Open) */}
      {!isOpen && (
        <button
          className="lg:hidden fixed top-4 right-4 z-50 text-2xl text-gray-700"
          onClick={() => setIsOpen(true)}
        >
          <FaBars />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 right-0 h-screen bg-white border-r border-gray-300 p-5 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 w-64 lg:w-64 z-40`}
      >
        {/* Close Button (Mobile) */}
        <button
          className="lg:hidden absolute top-4 right-4 text-gray-700 text-2xl"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes />
        </button>

        {/* Navigation Links */}
        <div className="h-full overflow-y-auto">
          <img src="/llogo.png" className="w-[8rem] mb-6" />
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
        </div>
      </aside>

      {/* Overlay (When Sidebar is Open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
