import React, { useState, useEffect } from "react";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

function Settings() {
  const [vendorData, setVendorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    userId: "",
    userRole: "",
    avatar: localStorage.getItem("userAvatar") || "",
  });
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setVendorData((prev) => ({ ...prev, avatar: imageUrl }));
        localStorage.setItem("userAvatar", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const storedData = {
      fullName: localStorage.getItem("fullName") || "",
      email: localStorage.getItem("userEmail") || "",
      phone: localStorage.getItem("phoneNumber") || "",
      userId: localStorage.getItem("userId") || "",
      userRole: localStorage.getItem("userRole") || "",
    };
    setVendorData((prev) => ({ ...prev, ...storedData }));
  }, []);

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("fullName", vendorData.fullName);
    localStorage.setItem("userEmail", vendorData.email);
    localStorage.setItem("phoneNumber", vendorData.phone);
    localStorage.setItem("userRole", vendorData.userRole);
    alert("Changes saved successfully!");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />
        <main className="flex-1 p-4">
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white shadow-md p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-semibold">Account Settings</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={vendorData.fullName}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={vendorData.email}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={vendorData.phone}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={vendorData.currentPassword}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={vendorData.newPassword}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={vendorData.confirmPassword}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-2xl hover:bg-purple-700 w-full sm:w-auto"
              >
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
