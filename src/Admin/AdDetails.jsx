import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { IoIosArrowRoundBack } from "react-icons/io";

// Ad Images Component
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AdImages = ({ images }) => {
    console.log ("images:", images)
  if (!images || images.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div>
      <p>
        <strong>Images:</strong>
      </p>
      <div className="grid grid-cols-2 gap-4">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Ad Image ${index + 1}`}
            className="w-full h-auto rounded-lg border"
            onError={(e) => (e.target.style.display = "none")} // Hide broken images
          />
        ))}
      </div>
    </div>
  );
};

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => navigate("/admin/ads");

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/adverts/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ad details");
        }

        const data = await response.json();
        setAd(data.data);
      } catch (error) {
        setError("There was an error fetching the ad details.");
        console.error("Error fetching ad details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ads/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update ad status.");
      }

      setAd((prevAd) => ({
        ...prevAd,
        status: newStatus,
        duration: newStatus === "active" ? prevAd.duration : prevAd.duration, // Reset duration if renewed
      }));
    } catch (error) {
      console.error("Error updating Ad status:", error);
      alert("Failed to update status.");
    }
  };

  const calculateRemainingDays = (createdAt, duration) => {
    if (!createdAt || !duration) return "N/A";
    const endDate = new Date(createdAt);
    endDate.setDate(endDate.getDate() + duration);
    const today = new Date();
    const diff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading ad details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!ad) return <p className="text-center text-red-500">Ad not found.</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        <div className="bg-white p-4 rounded-lg shadow-md my-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <IoIosArrowRoundBack size={30} /> <span className="ml-2">Back</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row lg:justify-between min-h-screen w-full space-y-4 md:space-x-4">
          {/* Left Section */}
          <div className="bg-white p-6 space-y-4 md:w-1/2 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Ad Overview</h2>
            <hr />
            <p>
              <strong>Email:</strong> {ad.userId?.email || "N/A"}
            </p>
            <hr />
            <p>
              <strong>Product Name:</strong> {ad.productId?.name || "N/A"}
            </p>
            <hr />
            <p>
              <strong>Date Submitted:</strong>{" "}
              {ad.createdAt
                ? new Date(ad.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <hr />
            <p>
              <strong>Ad Duration:</strong> {ad.duration || "N/A"} days
            </p>
            <hr />
            <p>
              <strong>Date Remaining:</strong>{" "}
              {calculateRemainingDays(ad.createdAt, ad.duration)} days
            </p>
            <hr />
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded ${
                  ad.status === "active"
                    ? "bg-green-500 text-white"
                    : ad.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : ad.status === "rejected"
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {ad.status || "Unknown"}
              </span>
            </p>
          </div>

          {/* Right Section */}
          <div className="bg-white p-6 space-y-4 md:w-1/2 rounded-lg shadow">
            {/* Status-based Buttons */}
            <div className="flex gap-4">
              {ad.status === "rejected" && (
                <button
                  onClick={() => updateStatus("active")}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Approve Ad
                </button>
              )}

              {ad.status === "active" && (
                <button
                  onClick={() => updateStatus("expired")}
                  className="px-4 py-2 border border-black text-black rounded"
                >
                  Deactivate Ad
                </button>
              )}

              {ad.status === "expired" && (
                <button
                  onClick={() => updateStatus("active")}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Renew Ad
                </button>
              )}

              {ad.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus("rejected")}
                    className="px-4 py-2 border border-black text-black rounded"
                  >
                    Reject Ad
                  </button>
                  <button
                    onClick={() => updateStatus("active")}
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    Approve Ad
                  </button>
                </>
              )}
            </div>

            <hr />
            <p>
              <strong>Description:</strong> {ad.productId?.description || "N/A"}
            </p>
            <hr />
            {/* Display Images */}
            <AdImages images={ad.productId?.images} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
