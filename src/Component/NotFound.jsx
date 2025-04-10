import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          {/* You can replace this with your own logo or a 404 illustration */}
          <div className="text-primary text-9xl font-bold mb-2">404</div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h1>

        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* <Link
            to="/"
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Back to Home
          </Link> */}

          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
