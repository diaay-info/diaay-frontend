import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { useNavigate } from "react-router-dom";

const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const updateAdStatus = async (approve) => {
    try {
      await Promise.all(
        selectedRows.map(async (id) => {
          const response = await fetch(
            `https://e-service-v2s8.onrender.com/api/ads/${id}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                status: approve ? "active" : "rejected", // Ensure correct status values
              }),
            }
          );

          const data = await response.json();
          console.log("API Response:", data); // Debugging

          if (!response.ok) {
            throw new Error(data.message || "Failed to update status");
          }
        })
      );

      // Update ads state after status change
      setAds((prevAds) =>
        prevAds.map((ad) =>
          selectedRows.includes(ad._id)
            ? { ...ad, status: approve ? "active" : "rejected" }
            : ad
        )
      );

      setIsModalOpen(false);
      setSelectedRows([]);
      setSuccessMessage(approve ? "Successfully Approved" : "Rejected");
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error updating ad status:", error);
    }
  };

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/admin/adverts",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ads");
        }

        const data = await response.json();
        setAds(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching ads:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Check if selected rows contain at least one pending ad
  const selectedRowsContainPending = ads
    .filter((ad) => selectedRows.includes(ad._id))
    .some((ad) => ad.status === "pending");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All Status">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
          {selectedRowsContainPending ? (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={openModal}
            >
              Approve Ads
            </button>
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/create-advert")}
            >
              Create Advert
            </button>
          )}
        </div>

        <div className="">
          {loading ? (
            <p className="text-gray-600 text-center">Loading...</p>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-md">
                  <thead className="bg-primary text-white text-sm uppercase font-semibold">
                    <tr className="border-b border-gray-200">
                      <th className="p-3 text-left"></th>
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Product Name</th>
                      <th className="p-3 text-left">Days Remaining</th>
                      <th className="p-3 text-left">Date Submitted</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center text-gray-500 py-4"
                        >
                          No ads found.
                        </td>
                      </tr>
                    ) : (
                      ads.map((ad) => (
                        <tr
                          key={ad._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => navigate(`/ads-management/${ad._id}`)}
                        >
                          <td
                            className="p-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(ad._id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedRows((prev) =>
                                  prev.includes(ad._id)
                                    ? prev.filter((id) => id !== ad._id)
                                    : [...prev, ad._id]
                                );
                              }}
                            />
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {ad.userId.email || "N/A"}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {ad.title || "N/A"}
                          </td>
                          <td className="p-3">{ad.duration ?? "N/A"} days</td>
                          <td className="p-3">
                            {ad.createdAt
                              ? new Date(ad.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td
                            className={`p-3 font-semibold ${
                              ad.status === "pending"
                                ? "text-yellow-500"
                                : ad.status === "active"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {ad.status || "Pending"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="mb-4 text-lg font-semibold">
              Are you sure you want to approve or reject these ads?
            </p>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => updateAdStatus(true)}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => updateAdStatus(false)}
            >
              Reject
            </button>
            <button className="absolute top-2 right-2" onClick={closeModal}>
              <IoMdClose size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsManagement;
