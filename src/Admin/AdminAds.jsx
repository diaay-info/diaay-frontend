import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { FaEllipsisH } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { Link, useNavigate } from "react-router-dom";

const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateAdStatus = async (approve) => {
    try {
      await Promise.all(
        selectedRows.map(async (id) => {
          await fetch(
            `https://e-service-v2s8.onrender.com/api/ads/${id}/status`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
              body: JSON.stringify({
                status: approve ? "Approved" : "Rejected",
              }),
            }
          );
        })
      );
      setAds((prevAds) =>
        prevAds.map((ad) =>
          selectedRows.includes(ad.id)
            ? { ...ad, status: approve ? "Approved" : "Rejected" }
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

  const itemsPerPage = 10;

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
        console.log("Fetched Ads Data:", data); // ✅ Make sure data is logged only inside try block

        setAds(Array.isArray(data.ads) ? data.ads : []); // ✅ Ensure data.ads exists
      } catch (error) {
        console.error("Error fetching ads:", error);
        setAds([]); // ✅ Prevents breaking UI when API fails
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
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
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => navigate("/create-advert")}
            >
              Create Advert
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600 text-center">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>User</th>
                    <th>Product Name</th>
                    <th>Days Remaining</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(ad.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSelectedRows((prev) =>
                              prev.includes(ad.id)
                                ? prev.filter((id) => id !== ad.id)
                                : [...prev, ad.id]
                            );
                          }}
                        />
                      </td>
                      <td>{ad.title}</td>
                      <td>{ad.title}</td>
                      <td>{ad.daysRemaining}</td>
                      <td>{ad.createdAt}</td>
                      <td
                        className={
                          ad.status === "Pending"
                            ? "text-yellow-500"
                            : ad.status === "Approved"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {ad.status}
                      </td>
                      <td>---</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsManagement;
