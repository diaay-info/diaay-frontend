import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

function Header({ toggleMobileSidebar }) {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-300 w-full">
      {/* Left Section: Greeting */}
      <h2 className="text-lg font-bold whitespace-nowrap">Good morning!</h2>

      {/* Right Section: Mobile Menu Button and Profile */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button (only visible on mobile) */}
        <button
          className="lg:hidden text-xl text-gray-700"
          onClick={toggleMobileSidebar}
        >
          <FaBars />
        </button>

        {/* Profile (hidden on smallest screens) */}
        <div className="hidden md:flex items-center space-x-2">
          <img
            src={avatar || "/placeholder-avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold">Taiwo Omotola</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
