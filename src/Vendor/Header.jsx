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
    <header className="flex items-center justify-between bg-white px-4 py-[0.6rem] border border-gray-400 w-full">
      {/* Left Section: Greeting */}
      <h2 className="text-lg font-bold whitespace-nowrap">Good morning!</h2>

      {/* Right Section: Profile */}
      <div className="lg:flex items-center space-x-6 hidden">
        <div className="flex items-center space-x-2">
          <img
            src={avatar}
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
