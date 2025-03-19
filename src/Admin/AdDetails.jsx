import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { IoIosArrowRoundBack } from "react-icons/io";

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
          `https://e-service-v2s8.onrender.com/api/admin/adverts/${id}`,
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

  if (loading) {
    return <p className="text-center text-gray-600">Loading ad details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!ad) {
    return <p className="text-center text-red-500">Ad not found.</p>;
  }

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

        <div className="p-6 bg-white min-h-screen space-y-4">
          <h2 className="text-2xl font-bold mb-4">Ad Overview</h2>
          <hr />
          <p>
            <strong>Vendor Name:</strong> {ad.user || "N/A"}
          </p>
          <hr />
          <p>
            <strong>Product Name:</strong> {ad.user || "N/A"}
          </p>{" "}
          <hr />
          <p>
            <strong>Date Submitted:</strong>{" "}
            {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "N/A"}
          </p>
          <hr />
          <p>
            <strong>Ad Duration:</strong> {ad.duration || "N/A"} days
          </p>
          <hr />
          <p>
            <strong>Date Remaining:</strong>{" "}
            {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : "N/A"}
          </p>
          <hr />
          <p>
            <strong>Status:</strong> {ad.status || "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
