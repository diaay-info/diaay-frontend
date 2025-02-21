import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { FaEllipsisH } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { Link } from "react-router-dom";

const AdsManagement = () => {
  const [ads, setAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleApproval = (approve) => {
    setAds((prevAds) =>
      prevAds.map((ad) =>
        selectedRows.includes(ad.id)
          ? { ...ad, status: approve ? "Approved" : "Rejected" }
          : ad
      )
    );
    setIsModalOpen(false);
    setSelectedRows([]);
  };

  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setAds(
        Array.from({ length: 25 }, (_, i) => ({
          id: i + 1,
          name: `User ${i + 1}`,
          productName: `Product ${i + 1}`,
          dateRemaining: `${Math.floor(Math.random() * 30)} days left`,
          dateSubmitted: `2024-02-${(i % 28) + 1}`,
          status: ["Approved", "Rejected", "Pending"][i % 3],
        }))
      );
      setLoading(false);
    }, 1500);
  }, []);

  // Filtering ads
  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || ad.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAds = filteredAds.slice(startIndex, startIndex + itemsPerPage);

  // Handling row selection
  //   const handleRowSelect = (id) => {
  //     setSelectedRows([id]); // Only one row can be selected at a time
  //   };
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  // Handle select all rows
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedAds.map((ad) => ad.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/3 flex flex-col items-center relative">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-600 text-2xl"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>

              <h3 className="text-xl font-semibold text-center">Approve Ads</h3>
              <p className="mt-4 text-center">
                Are you sure you want to approve the following ads?
              </p>

              <div className="mt-4 w-full">
                <table className="w-full">
                  <tbody>
                    {ads
                      .filter((ad) => selectedRows.includes(ad.id))
                      .map((ad) => (
                        <tr key={ad.id}>
                          <td className="border-b border-gray-300 ">
                            #{ad.id}
                          </td>
                          <td className="border-b border-gray-300 ">
                            {ad.productName}
                          </td>
                          <td className="border-b border-gray-300 ">
                            {ad.dateSubmitted}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  className="px-8 py-1 bg-purple-600 text-white rounded"
                  onClick={() => handleApproval(true)}
                >
                  Yes
                </button>
                <button
                  className="px-8 py-1 border border-gray-500  text-black rounded"
                  onClick={() => handleApproval(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Back button for non-first pages */}
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(1)}
              className="flex items-center text-gray-600 mb-4"
            >
              <IoIosArrowBack className="mr-1" /> Back to First Page
            </button>
          )}

          {/* Filters Section (Hidden on other pages) */}
          {currentPage === 1 && (
            <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex flex-wrap gap-4">
              <input
                type="text"
                placeholder="Search by name or product..."
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <select
                className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Pending</option>
              </select>
              <button
                className={`rounded-lg px-4 py-2 text-white ${
                  selectedRows.length === 0 ||
                  selectedRows.every((id) => {
                    const ad = ads.find((ad) => ad.id === id);
                    return ad?.status === "Approved";
                  })
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600"
                }`}
                onClick={openModal}
                disabled={
                  selectedRows.length === 0 ||
                  selectedRows.every((id) => {
                    const ad = ads.find((ad) => ad.id === id);
                    return ad?.status === "Approved";
                  })
                }
              >
                Approve Ads
              </button>
            </div>
          )}

          {/* Ads List Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {loading ? (
              <p className="text-gray-600 text-center">Loading...</p>
            ) : paginatedAds.length === 0 ? (
              <div className="text-center mt-6 flex flex-col items-center">
                <FiUsers className="text-gray-400 text-6xl" />
                <p className="text-gray-500 mt-2">
                  No ads have been created yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-300 p-3 text-left">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={
                            selectedRows.length === paginatedAds.length &&
                            paginatedAds.length > 0
                          }
                        />
                      </th>
                      <th className="border-b border-gray-300 p-3 text-left">
                        ID
                      </th>
                      <th className="border-b border-gray-300 p-3 text-left">
                        User
                      </th>
                      <th className="border-b border-gray-300 p-3 text-left">
                        Product Name
                      </th>
                      <th className="border-b border-gray-300 p-3 text-left">
                        Days Remaining
                      </th>
                      <th className="border-b border-gray-300 p-3 text-left">
                        Date Submitted
                      </th>
                      <th className="border-b border-gray-300 p-3 text-left">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAds.map((ad) => (
                      <tr key={ad.id} className="hover:bg-gray-100">
                        <td className="border-b border-gray-300 p-3">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(ad.id)}
                            onChange={() => handleRowSelect(ad.id)}
                          />
                        </td>
                        <td className="border-b border-gray-300 text-sm p-3">
                          {ad.id}
                        </td>
                        <td className="border-b border-gray-300 text-sm p-3">
                          <Link
                            to={`/ads/${ad.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {ad.name}
                          </Link>
                        </td>
                        <td className="border-b border-gray-300 text-sm p-3">
                          {ad.productName}
                        </td>
                        <td className="border-b border-gray-300 text-sm p-3">
                          {ad.dateRemaining}
                        </td>
                        <td className="border-b border-gray-300 text-sm p-3">
                          {ad.dateSubmitted}
                        </td>
                        <td className="border-b border-gray-300 text-sm p-3 flex items-center">
                          <span
                            className={`px-5 py-1 rounded text-xs font-semibold ${
                              ad.status === "Approved"
                                ? "bg-green-100 text-green-600"
                                : ad.status === "Rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {ad.status}
                          </span>
                        </td>
                        <td>
                          <FaEllipsisH className="ml-2 cursor-pointer" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-end items-center mt-4 text-gray-600">
              <IoIosArrowBack
                className="cursor-pointer"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              />
              <span className="mx-3">
                Page {currentPage} of {totalPages}
              </span>
              <IoIosArrowForward
                className="cursor-pointer"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsManagement;
