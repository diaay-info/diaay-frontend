import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { IoIosArrowRoundBack } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdImages = ({ images }) => {
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
            loading="lazy"
            src={src}
            alt={`Ad Image ${index + 1}`}
            className="w-full h-auto rounded-lg border"
            onError={(e) => (e.target.style.display = "none")}
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
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch ad details");

        const data = await response.json();
        setAd(data); // Ensure this aligns with your API response structure
      } catch (error) {
        setError("There was an error fetching the ad details.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdDetails();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/admin/${id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ action: newStatus }),
        }
      );

      if (!response.ok) throw new Error();

      toast.success(`Ad status updated to ${newStatus}`);
      setAd((prev) => ({ ...prev, status: newStatus }));
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const deleteAd = async () => {
    const confirm = await Swal.fire({
      title: "Delete Ad?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error();

        toast.success("Ad deleted successfully.");
        navigate("/admin/ads");
      } catch {
        toast.error("Failed to delete ad.");
      }
    }
  };

  const calculateRemainingDays = (createdAt, duration) => {
    if (!createdAt || !duration) return 0;
    const end = new Date(createdAt);
    end.setDate(end.getDate() + duration);
    const today = new Date();
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) return <Skeleton height={400} />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!ad) return <p className="text-red-500">Ad not found.</p>;

  const totalDays = ad.duration || 1;
  const remainingDays = calculateRemainingDays(ad.createdAt, ad.duration);
  const progress = ((totalDays - remainingDays) / totalDays) * 100;

  return (
    <div className="flex">
      <Toaster />
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        <div className="bg-white p-4 rounded-lg shadow-md my-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <IoIosArrowRoundBack size={30} />
            <span className="ml-2">Back</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left */}
          <div className="bg-white p-6 space-y-4 md:w-1/2 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Ad Overview</h2>

            <p>
              <strong>Product Name:</strong> {ad.name || "N/A"}
            </p>
            <p>
              <strong>Description:</strong> {ad.description || "N/A"}
            </p>
            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(ad.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Duration:</strong> {ad.duration || "N/A"} days
            </p>
            <p>
              <strong>Remaining:</strong> {remainingDays} days
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-4 rounded overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${progress}%` }}
              />
            </div>

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
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {ad.status || "Unknown"}
              </span>
            </p>
          </div>

          {/* Right */}
          <div className="bg-white p-6 space-y-4 md:w-1/2 rounded-lg shadow">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {ad.status === "rejected" && (
                <button
                  onClick={() => updateStatus("approve")}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Approve Ad
                </button>
              )}

              {ad.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus("reject")}
                    className="px-4 py-2 border border-black rounded"
                  >
                    Reject Ad
                  </button>
                  <button
                    onClick={() => updateStatus("approve")}
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    Approve Ad
                  </button>
                </>
              )}

              <button
                onClick={deleteAd}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete Ad
              </button>
            </div>

            <AdImages images={ad.images} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetails;
