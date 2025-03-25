import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+229"); // Default country code
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const countryCodes = [
    { code: "+229", name: "Benin" },
    { code: "+234", name: "Nigeria" },
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+233", name: "Ghana" },
    { code: "+254", name: "Kenya" },
    { code: "+27", name: "South Africa" },
  ];

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    if (!phoneNumber || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    setLoading(true);
    try {
      const response = await fetch(
        "https://e-service-v2s8.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: fullPhoneNumber,
            password,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      // Extract the needed user details
      const {
        accessToken,
        refreshToken,
        user: { id, email, role, phoneVerified },
      } = data;

      // Store the details in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", id);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userPhoneVerified", phoneVerified);

      // Role-based navigation
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "vendor") {
        navigate("/dashboard");
      } else if (role === "partner") {
        navigate("/partner-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl lg:shadow-lg">
        <div className="text-center space-y-6 mb-10">
          <img src="/logo.png" className="w-[4rem] mx-auto" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mt-4">
              Welcome back to Diaay
            </h2>
            <p className="text-gray-600 text-sm">
              Provide your details to continue
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="mt-1 px-3 py-2 border rounded-l-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 border-gray-300"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className="flex-1 mt-1 px-4 py-2 border-t border-b border-r rounded-r-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 border-gray-300"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 border-gray-300"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 focus:outline-none"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2 focus:ring-purple-500 text-purple-500"
              />
              Remember me
            </label>
            <Link
              to="/password"
              className="text-sm text-purple-500 hover:underline"
            >
              Forgot Password
            </Link>
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
              "Login"
            )}
          </button>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          <div className="mb-6">
            <button
              type="button"
              className="w-full py-2 flex items-center justify-center border rounded-lg shadow-sm text-gray-700 hover:bg-gray-100"
            >
              <img
                src="/google.png"
                alt="Google logo"
                className="w-7 h-7 mr-2"
              />
              Login with Google
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/start" className="text-purple-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
