import React, { useState, useEffect } from "react";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

function Settings() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vendorData, setVendorData] = useState({
    fullName: "",
    email: "",
    phone: "",
    userId: "",
    userRole: "",
    avatar: localStorage.getItem("userAvatar") || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();

        // Update state with fetched data
        setVendorData((prev) => ({
          ...prev,
          fullName: userData.name || userData.fullName || "",
          email: userData.email || "",
          phone: userData.phoneNumber || userData.phone || "",
          userId: userData._id || userData.userId || "",
          userRole: userData.role || userData.userRole || "",
        }));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

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

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Validate passwords if the user is trying to change them
      if (vendorData.newPassword) {
        if (!vendorData.currentPassword) {
          alert("Please enter your current password");
          return;
        }

        if (vendorData.newPassword !== vendorData.confirmPassword) {
          alert("New passwords don't match");
          return;
        }
      }

      // Prepare data for API
      const updateData = {
        fullName: vendorData.fullName,
        email: vendorData.email,
        phoneNumber: vendorData.phone,
      };

      // Add password fields if the user is updating password
      if (vendorData.newPassword) {
        updateData.currentPassword = vendorData.currentPassword;
        updateData.newPassword = vendorData.newPassword;
      }

      // Save data to API
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      // Clear password fields
      setVendorData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      alert("Changes saved successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert(`Failed to save changes: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
          <Header />
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
          <Header />
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

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
                    placeholder="Enter current password to change"
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
                    placeholder="Leave blank to keep current"
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
                    placeholder="Confirm new password"
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
