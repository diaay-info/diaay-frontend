import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/admin/adverts",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
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

  const paginatedAds = ads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(ads.length / itemsPerPage);

  const selectedRowsContainPending = ads
    .filter((ad) => selectedRows.includes(ad._id))
    .some((ad) => ad.status === "pending");

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
              body: JSON.stringify({ status: approve ? "active" : "rejected" }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update status");
          }
        })
      );

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

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />
        <div className="py-6">
          {/* Controls */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded w-full sm:w-auto"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option>All Status</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Pending</option>
            </select>
            {selectedRowsContainPending ? (
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(true)}
              >
                Approve Ads
              </button>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => navigate("/create-ads")}
              >
                Create Advert
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            {loading ? (
              <p className="text-gray-600 text-center">Loading...</p>
            ) : ads.length === 0 ? (
              <div className="text-center mt-6 flex flex-col items-center">
                <FiUsers className="text-gray-400 text-6xl" />
                <p className="text-gray-500 mt-2">No Ads Found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-md text-sm">
                  <thead className="bg-primary text-white text-xs md:text-sm uppercase font-semibold">
                    <tr>
                      <th className="p-2 md:p-3 text-left"></th>
                      <th className="p-2 md:p-3 text-left">User</th>
                      <th className="p-2 md:p-3 text-left">Product Name</th>
                      <th className="p-2 md:p-3 text-left">Days Remaining</th>
                      <th className="p-2 md:p-3 text-left">Date Submitted</th>
                      <th className="p-2 md:p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAds.map((ad) => (
                      <tr
                        key={ad._id}
                        className="hover:bg-gray-100 text-xs md:text-sm cursor-pointer"
                        onClick={() => navigate(`/ads-management/${ad._id}`)}
                      >
                        <td
                          onClick={(e) => e.stopPropagation()}
                          className="p-3"
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
                        <td className="p-3">{ad.userId?.email || "N/A"}</td>
                        <td className="p-3">{ad.title || "N/A"}</td>
                        <td className="p-3">{ad.duration ?? "N/A"} days</td>
                        <td className="p-3">
                          {ad.createdAt
                            ? new Date(ad.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-3 font-semibold">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              ad.status === "pending"
                                ? "text-yellow-600"
                                : ad.status === "active"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {ad.status?.charAt(0).toUpperCase() +
                              ad.status?.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {ads.length > itemsPerPage && (
              <div className="flex flex-row justify-center md:justify-end items-center mt-4 gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  <IoIosArrowBack />
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  <IoIosArrowForward />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsManagement;
