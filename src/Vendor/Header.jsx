import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";

function Header({ toggleMobileSidebar }) {
  const [userData, setUserData] = useState({
    fullName: "",
    avatar: "",
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // Function to fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData({
          fullName: data.fullName || "User",
          avatar: data.avatar || "/placeholder-avatar.png",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to localStorage if API fails
        const storedAvatar = localStorage.getItem("userAvatar");
        setUserData((prev) => ({
          ...prev,
          avatar: storedAvatar || "/placeholder-avatar.png",
        }));
      }
    };

    fetchUserData();

    // Set up an event listener to detect changes to user data
    window.addEventListener("userDataUpdated", fetchUserData);

    return () => {
      window.removeEventListener("userDataUpdated", fetchUserData);
    };
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-300 w-full">
      {/* Left Section: Greeting */}
      <h2 className="text-lg font-bold whitespace-nowrap">
        Hello{userData.fullName ? `, ${userData.fullName.split(" ")[0]}` : "!"}
      </h2>

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
        {/* <div className="hidden md:flex items-center space-x-2">
          <img
            src={userData.avatar || "/placeholder-avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
         
        </div> */}
      </div>
    </header>
  );
}

export default Header;
