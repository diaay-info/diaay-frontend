import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { FaEllipsisH } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { useNavigate } from "react-router-dom";

const Finance = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/credits/admin/counts",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const result = await response.json();
        console.log("Stats API Response:", result);
        setStats(result);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to load stats");
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/credits/admin/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const result = await response.json();

        console.log("Transactions API Response:", result);

        if (!Array.isArray(result)) {
          throw new Error("Invalid data format");
        }

        setTransactions(result || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to load transactions");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchTransactions();
  }, []);

  const formatNumber = (num) => num?.toLocaleString() || 0;

  const totalPages = Math.ceil((transactions?.length || 0) / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />
        <div className="py-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatBox
              title="Total Credits"
              value={formatNumber(stats?.totalCount)}
              onClick={() => navigate("/finance/total-credits")}
            />
            <StatBox
              title="Pending Credits"
              value={formatNumber(stats?.pendingCount)}
              onClick={() => navigate("/finance/pending-credits")}
            />
            <StatBox
              title="Approved Credits"
              value={formatNumber(stats?.approvedCount)}
              onClick={() => navigate("/finance/approved-credits")}
            />
            <StatBox
              title="Rejected Credits"
              value={formatNumber(stats?.rejectedCount)}
              onClick={() => navigate("/finance/rejected-credits")}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            {loading ? (
              <p className="text-gray-600 text-center">Loading...</p>
            ) : transactions.length === 0 ? (
              <div className="text-center mt-6 flex flex-col items-center">
                <FiUsers className="text-gray-400 text-6xl" />
                <p className="text-gray-500 mt-2">
                  No Financial Transactions Found
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-md">
                <thead className="bg-primary text-white text-sm uppercase font-semibold">
                <tr className="border-b border-gray-200">
                <th className="border-b p-3 text-left">Name</th>
                      <th className="border-b p-3 text-left">
                        Transaction Type
                      </th>
                      <th className="border-b p-3 text-left">Amount</th>
                      <th className="border-b p-3 text-left">Date</th>
                      <th className="border-b p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(paginatedTransactions || []).map((transaction, index) => (
                      <tr key={index} className="hover:bg-gray-100">
                        <td className="border-b p-3">{transaction.name}</td>
                        <td className="border-b p-3">{transaction.type}</td>
                        <td className="border-b p-3">
                          {formatNumber(transaction.amount)}
                        </td>
                        <td className="border-b p-3">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border-b p-3">{transaction.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end items-center mt-4">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <IoIosArrowBack />
              </button>
              <span className="mx-3">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, onClick }) => {
  // Define button colors based on the title
  const buttonColors = {
    "Total Credits": "bg-purple-600 hover:bg-purple-700",
    "Pending Credits": "bg-yellow-500 hover:bg-yellow-600",
    "Approved Credits": "bg-green-600 hover:bg-green-700",
    "Rejected Credits": "bg-red-600 hover:bg-red-700",
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-center">
      <p className="text-gray-600">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
      <button
        onClick={onClick}
        className={`mt-3 px-4 py-2 text-white rounded-lg transition ${
          buttonColors[title] || "bg-gray-600 hover:bg-gray-700"
        }`}
      >
        View {title}
      </button>
    </div>
  );
};

export default Finance;
