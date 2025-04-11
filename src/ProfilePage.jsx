import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaEdit, FaSignOutAlt } from "react-icons/fa";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Get user data from localStorage
  const userData = {
    name: localStorage.getItem("Name") || "User",
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("phoneNumber") || "",
    business: localStorage.getItem("BusinessName") || "",
    location: localStorage.getItem("location") || "",
    role: localStorage.getItem("userRole") || "customer",
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="bg-primary py-6 px-6 text-white">
              <div className="flex items-center space-x-4">
                <FaUserCircle className="text-5xl" />
                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-primary-100 capitalize">{userData.role}</p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Full Name
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Email Address
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Phone Number
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {userData.role === "vendor" && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Business Name
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {userData.business}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Location
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {userData.location}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Account Type
                    </h3>
                    <p className="mt-1 text-sm text-gray-900 capitalize">
                      {userData.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FaEdit className="mr-2" /> Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
