import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const PartnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Login
        </button>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="text-purple-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800">Coming Soon</h1>
          
          <p className="text-gray-600">
            We're working hard to bring you an amazing experience. This feature will be available soon!
          </p>
          
          <div className="pt-4">
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full animate-pulse" 
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;