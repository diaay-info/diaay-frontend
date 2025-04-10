import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

const FinanceDetails = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const pageTitle = type.replace("-", " ").toUpperCase();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/credits/admin/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch transactions.");
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  const formatNumber = (num) => num?.toLocaleString() || 0;

  const totalPages = Math.ceil((transactions?.length || 0) / itemsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const filteredTransactions = transactions.filter((transaction) => {
    if (type === "total-credits") return true;
    if (type === "pending-credits") return transaction.status === "pending";
    if (type === "approved-credits") return transaction.status === "completed";
    if (type === "failed-credits") return transaction.status === "failed";
    return false;
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        <div className="py-6 bg-gray-100 min-h-screen">
          <div className="bg-white p-2 mb-6">
            <button
              onClick={() => navigate("/admin/finance")}
              className="mb-4 flex items-center text-purple-600"
            >
              <IoIosArrowBack className="mr-2" />
              {pageTitle}
            </button>
          </div>

          {loading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-gray-500">No transactions found.</p>
          ) : (
            <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse">
                <thead className="bg-primary text-white text-xs md:text-sm uppercase font-semibold">
                  <tr className="border-b border-gray-200">
                    <th className="border-b p-2 md:p-3 text-left">E-mail</th>
                    <th className="border-b p-2 md:p-3 text-left">Amount</th>
                    <th className="border-b p-2 md:p-3 text-left">
                      Payment Method
                    </th>
                    <th className="border-b p-2 md:p-3 text-left">Date</th>
                    <th className="border-b p-2 md:p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 text-xs md:text-sm"
                    >
                      <td className="border-b p-2 md:p-3">
                        {transaction.userId.email}
                      </td>
                      <td className="border-b p-2 md:p-3">
                        {formatNumber(transaction.amount)}
                      </td>
                      <td className="border-b p-2 md:p-3">
                        {transaction.paymentMethod}
                      </td>
                      <td className="border-b p-2 md:p-3">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border-b p-2 md:p-3 font-semibold">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            transaction.status === "pending"
                              ? " text-yellow-600"
                              : transaction.status === "completed"
                              ? " text-green-600"
                              : " text-red-600"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
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

export default FinanceDetails;
