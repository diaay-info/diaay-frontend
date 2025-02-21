import React, { useState, useEffect } from "react";

function Header() {
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-4 py-[0.6rem] border border-gray-400">
      {/* Left Section: Greeting */}
      <h2 className="text-lg font-bold">Good morning, Omotola!</h2>

      {/* Middle Section: Centered Search Bar */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 border rounded-lg w-full max-w-md"
        />
      </div>

      {/* Right Section: Notification & Profile */}
      <div className="flex items-center space-x-6">
        <span className="text-gray-600">🔔</span>
        <div className="flex items-center space-x-2">
          <img
            src={avatar || "https://via.placeholder.com/40"} // Show stored avatar or default placeholder
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold">Taiwo Omotola</p>
            <span className="text-green-500 text-sm">✔ Verified</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
