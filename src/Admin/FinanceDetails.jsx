import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

const FinanceDetails = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const pageTitle = type.replace("-", " ").toUpperCase();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="border-b p-3 text-left">Payment Method</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/finance/credit/${transaction._id}`)
                    }
                  >
                    <td className="p-3">{transaction.userId.email}</td>
                    <td className="p-3">{transaction.amount}</td>
                    <td className="border-b p-3">
                      {transaction.paymentMethod}
                    </td>
                    <td className="p-3">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceDetails;
