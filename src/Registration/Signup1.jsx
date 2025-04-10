import React, { useState } from "react";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { FaHandshake, FaEye, FaEyeSlash } from "react-icons/fa"; // Added eye icons

const SignUpForm = () => {
  const [selectedRole, setSelectedRole] = useState("vendor");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    location: "",
    role: "", 
    termsAndConditions: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Update role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData((prevData) => ({
      ...prevData,
      role, // Update the role in formData
    }));
  };

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    if (!formData.fullName) {
      formErrors.fullName = "Full Name is required.";
      isValid = false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!formData.email) {
      formErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      formErrors.email = "Invalid email format.";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{7,15}$/; // Validate just the number part
    if (!formData.phoneNumber) {
      formErrors.phoneNumber = "Phone Number is required.";
      isValid = false;
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      formErrors.phoneNumber = "Invalid phone number format (7-15 digits).";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required.";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!formData.termsAndConditions) {
      formErrors.termsAndConditions =
        "You must agree to the terms and conditions.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };
  const countryCodes = [
    { code: "+229", name: "Benin" },
    { code: "+234", name: "Nigeria" },
    { code: "+1", name: "USA" },
    { code: "+44", name: "UK" },
    { code: "+221", name: "Ghana" },
    { code: "+254", name: "Kenya" },
    { code: "+27", name: "South Africa" },
  ];
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const fullPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`;
        const existingUsers = ["1234567890"]; // Example list of registered users
        if (existingUsers.includes(formData.phoneNumber)) {
          setUserExists(true);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            phoneNumber: fullPhoneNumber,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Store user data in localStorage
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("Name", data.user.fullName);
          localStorage.setItem("location", data.user.location);
          localStorage.setItem("BusinessName", data.user.businessName);
          localStorage.setItem("userEmail", data.user.email);
          localStorage.setItem("userRole", data.user.role);
          localStorage.setItem("userPhoneVerified", data.user.phoneVerified);

          // Navigate based on role
          switch (data.user.role) {
            case "vendor":
              navigate("/vendor/dashboard");
              break;
            case "partner":
              navigate("/partner/dashboard");
              break;
            case "customer":
              navigate("/customer/dashboard");
              break;
            default:
              navigate("/dashboard"); // Fallback for unknown roles
          }
        } else {
          console.log("Form submission failed");
        }
      } catch (error) {
        console.error("Error during form submission:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      {/* Left Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 lg:p-8 w-full lg:w-2/5 mb-6 lg:mb-0">
        <div className="mb-6 flex justify-center">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </div>

        <div className="text-center space-y-3 mb-8">
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-gray-600">Choose your role to get started</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          {["vendor", "partner", "customer"].map((role) => (
            <button
              key={role}
              className={`flex items-center justify-between border-2 font-medium py-3 px-4 sm:px-6 rounded-xl w-full ${
                selectedRole === role
                  ? "border-purple-500 text-black"
                  : "border-gray-200 text-black"
              }`}
              onClick={() => handleRoleSelect(role)} // Call handleRoleSelect on click
            >
              <div className="flex items-center space-x-3">
                {role === "vendor" || role === "customer" ? (
                  <HiMiniShoppingBag size={30} />
                ) : (
                  <FaHandshake size={30} />
                )}
                <div>
                  <p>
                    Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
                  </p>
                  <p className="text-sm mt-1 text-gray-500">
                    {role === "vendor"
                      ? "Advertise your products and services easily."
                      : role === "partner"
                      ? "Earn commissions by referring customers."
                      : "Enjoy access to amazing products and services."}
                  </p>
                </div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedRole === role
                    ? "bg-purple-500 border-purple-500"
                    : "border-gray-600"
                }`}
              ></div>
            </button>
          ))}
        </div>

        <Link to="/login">
          <div className="mt-5 text-center">
            Already have an account?{" "}
            <span className="text-primary">Log in</span>
          </div>
        </Link>
      </div>

      {/* Right Section */}
      <div className="p-6 lg:p-8 w-full shadow-md lg:w-3/5 bg-[#ffffe]">
        <div className="mb-10 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Sign Up as a{" "}
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </h2>
          <p className="text-gray-600">Provide your details to continue.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 font-bold">
              Full Name*
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="border rounded py-2 px-3 w-full"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {selectedRole === "vendor" && (
            <div>
              <label
                htmlFor="businessName"
                className="block text-gray-700 font-bold"
              >
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="border rounded py-2 px-3 w-full"
                placeholder="Enter your business name"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-bold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded py-2 px-3 w-full"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 font-bold"
              >
                Phone Number*
              </label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="border rounded-l py-2 px-2 w-20"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="border rounded-r py-2 px-3 w-full"
                  placeholder="Phone number"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold"
              >
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border rounded py-2 px-3 w-full pr-10"
                  placeholder="Choose a password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-bold"
              >
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border rounded py-2 px-3 w-full pr-10"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              id="termsAndConditions"
              name="termsAndConditions"
              checked={formData.termsAndConditions}
              onChange={handleChange}
              className="mt-1"
            />
            <label htmlFor="termsAndConditions" className="text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-purple-500 hover:underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-500 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
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
              "Get Started"
            )}
          </button>
          {userExists && (
            <p className="text-red-500 text-sm mt-2">
              User already exists. Please log in.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
