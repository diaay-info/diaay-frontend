import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import Layout from "./Layout";

function Logout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      setError("No refresh token found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://e-service-v2s8.onrender.com/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to log out. Please try again.");
      }

      // Clear user data and redirect to login page
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex min-h-screen">
        <main className="flex-1 p-2">
          <div className="flex flex-col items-center justify-center h-screen bg-white shadow-md rounded-lg mt-4">
            <div className="mb-2 bg-gray-400 rounded-full flex items-center p-4">
              <CiLogout className="text-black" />
            </div>
            <p className="text-base">Log out</p>
            <p className="text-sm text-black mb-4">Are you sure you want to log out?</p>
            {error && <p className="text-red-500">{error}</p>}
            <button 
              onClick={handleLogout} 
              className="bg-purple-600 text-white p-2 rounded-2xl w-60"
              disabled={loading}
            >
              {loading ? "Logging out..." : "Log out"}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="border p-2 w-60 mt-3 rounded-2xl text-black"
            >
              Cancel
            </button>
          </div>
        </main>
      </div>
    </Layout>
  );
}

export default Logout;
