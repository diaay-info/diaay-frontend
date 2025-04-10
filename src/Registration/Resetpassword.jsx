import React, { useState } from "react";
import { Link } from "react-router-dom"; // For navigation
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import visibility icons

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // Toggle for new password
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggle for confirm password
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Retrieve the reset token (ensure it's stored after verification)
    const token = localStorage.getItem("resetToken"); // Adjust if stored elsewhere

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    // Validate passwords
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      console.log("Submitting new password...");

      // Call the reset password endpoint
      const response = await fetch(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setSuccess("Password reset successful! You can now log in.");
      setNewPassword("");
      setConfirmPassword("");

      // Optionally redirect to login after a delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred.");
    }
  };

  return (
    <div className=" lg:flex p-2 justify-center items-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-white rounded-lg lg:shadow-lg">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="https://via.placeholder.com/150x50" // Replace with your logo URL
            alt="Logo"
            className="h-12"
          />
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-600 mt-2">
            Enter your new password to reset your account.
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type={newPasswordVisible ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter new password"
              required
            />
            {/* Toggle Visibility Icon */}
            <span
              onClick={() => setNewPasswordVisible(!newPasswordVisible)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {newPasswordVisible ? (
                <FaEyeSlash className="text-gray-600" />
              ) : (
                <FaEye className="text-gray-600" />
              )}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Confirm new password"
              required
            />
            {/* Toggle Visibility Icon */}
            <span
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {confirmPasswordVisible ? (
                <FaEyeSlash className="text-gray-600" />
              ) : (
                <FaEye className="text-gray-600" />
              )}
            </span>
          </div>

          {/* Error or Success Message */}
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm mt-2 text-center">{success}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded w-full"
          >
            Reset Password
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-purple-500 underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
