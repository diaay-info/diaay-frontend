import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

const Header = () => {
  return (
    <header className="flex items-center bg-white p-4 shadow-md w-full">
      <h2 className="text-xl font-semibold hidden lg:block">Dashboard</h2>

      {/* Profile & Notifications */}
      <div className="flex items-center gap-4 ml-4">
        <FaBell className="text-gray-600 text-lg cursor-pointer" />
        <div className="flex items-center">
          <span className="mr-2 hidden sm:block">Taiwo Omotola</span>
          <img src="/profile.png" alt="User" className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
