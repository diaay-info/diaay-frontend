import React, { useState } from "react";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { useNavigate } from "react-router-dom";

function AdminResetPassword() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.userId.trim()) {
      setError("User ID is required");
      return;
    }

    if (!formData.newPassword) {
      setError("New password is required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Reset error state
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/auth/admin-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: formData.userId,
            newPassword: formData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      // Success
      setSuccess(true);
      setFormData({
        userId: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/users");
      }, 2000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err.message || "An error occurred while resetting the password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />
        <main className="flex-1 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-md p-6 rounded-xl space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Reset User Password
              </h2>
              <p className="text-gray-600">
                Use this form to reset a user's password. The user will need to
                use this password for their next login.
              </p>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                  Password has been reset successfully. Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="userId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    User ID
                  </label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter user ID"
                    disabled={loading || success}
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password"
                    disabled={loading || success}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="border py-2 px-4 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                    disabled={loading || success}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white text-sm rounded-lg w-full 
                      ${
                        loading || success
                          ? "bg-purple-400 cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700"
                      }`}
                    disabled={loading || success}
                  >
                    {loading ? "Processing..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminResetPassword;
