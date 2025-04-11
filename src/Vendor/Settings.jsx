import React, { useState, useEffect } from "react";
import Layout from "./Layout";

function Settings() {
  const [vendorData, setVendorData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    userId: "",
    userRole: "",
    avatar: "",
    businessName: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming you store your auth token in localStorage
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setVendorData({
          fullName: userData.fullName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          userId: userData.id || "",
          userRole: userData.role || "",
          avatar: userData.avatar || "",
          businessName: userData.businessName || "",
          location: userData.location || "",
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setVendorData((prev) => ({ ...prev, avatar: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(vendorData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      alert("Changes saved successfully!");
      setLoading(false);
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-screen p-2 justify-center items-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex min-h-screen p-2 justify-center items-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex min-h-screen p-2">
        <main className="flex-1 ">
          <div className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white shadow-md p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-semibold">Personal Information</h2>

              <div className="flex flex-col items-center">
                <img
                  src={vendorData.avatar || "logo.png"}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border"
                  alt="Profile"
                />

                <input
                  type="file"
                  accept="image/*"
                  id="avatarUpload"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <label
                  htmlFor="avatarUpload"
                  className="mt-2 text-[#7C0DEA] text-sm cursor-pointer"
                >
                  Upload or Change Profile Picture
                </label>
              </div>

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
                    value={vendorData.phoneNumber}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-2xl hover:bg-purple-700 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Business Information */}
            <div className="bg-white shadow-md p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-semibold">Business Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={vendorData.businessName}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={vendorData.location}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <input
                    type="text"
                    name="userRole"
                    value={vendorData.userRole}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    readOnly
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-2xl hover:bg-purple-700 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Security Settings */}
            <div className="bg-white shadow-md p-6 rounded-xl space-y-6">
              <h2 className="text-lg font-semibold">Security Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={vendorData.currentPassword || ""}
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
                    value={vendorData.newPassword || ""}
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
                    value={vendorData.confirmPassword || ""}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white text-sm rounded-2xl hover:bg-purple-700 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Settings;
