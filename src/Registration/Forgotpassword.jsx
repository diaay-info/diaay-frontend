import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Please enter your phone number.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://e-service-v2s8.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset link.");
      }

      setSuccessMessage("Password reset link has been sent to your email.");
      setTimeout(() => {
        // Navigate to the recovery page
        navigate("/recovery");
      }, 2000); // Delay to show success message before navigation
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center space-y-6 mb-10">
          <h1 className="text-2xl font-bold">LOGO</h1>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mt-4">Reset Your Password</h2>
            <p className="text-gray-600 text-sm">
              Enter your registered phone number to receive a password reset
              link.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-sm text-green-500 text-center">
              {successMessage}
            </div>
          )}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 border-gray-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="w-5 h-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : (
              "Submit"
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <a href="/login" className="text-purple-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
