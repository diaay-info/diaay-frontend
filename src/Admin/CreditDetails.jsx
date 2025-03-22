import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

const CreditDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [credit, setCredit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCreditDetails = async () => {
      try {
        const response = await fetch(
          `https://e-service-v2s8.onrender.com/api/credits/admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch credit details.");
        }

        const data = await response.json();
        setCredit(data);
      } catch (error) {
        console.error("Error fetching credit details:", error);
        setError("Failed to fetch credit details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCreditDetails();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      const response = await fetch(
        "https://e-service-v2s8.onrender.com/api/credits/admin/update",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ id, status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update credit status.");
      }

      setCredit({ ...credit, status: newStatus });
    } catch (error) {
      console.error("Error updating credit status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <p>Loading credit details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen ">
        <Header />
        <div className=" bg-gray-100 min-h-screen space-y-4  mt-5">
          <div className="bg-white rounded-md shadow-md px-2 ">
            {" "}
            <button
              onClick={() => navigate(-1)}
              className="text-purple-600 mb-4"
            >
              &larr; Back
            </button>
          </div>

          <div className=" flex justify-between w-full gap-5">
            <div className="bg-white p-6 rounded-md shadow-md space-y-4 w-[50%] ">
              {" "}
              <h2 className="text-xl font-bold">Credit Details</h2> <hr />
              <p>
                <strong>Vendor Name:</strong> {credit.name}
              </p>{" "}
              <hr />
              <p>
                <strong>Credits Purchased:</strong> {credit.amount}
              </p>{" "}
              <hr />
              <p>
                <strong>Amount Paid:</strong> {credit.amountPaid}
              </p>{" "}
              <hr />
              <p>
                <strong>Payment Method:</strong> {credit.paymentMethod}
              </p>{" "}
              <hr />
              <p>
                <strong>Date of Purchase:</strong>{" "}
                {new Date(credit.createdAt).toLocaleDateString()}
              </p>{" "}
              <hr />
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded ${
                    credit.status === "completed"
                      ? "bg-green-500 text-white"
                      : credit.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {credit.status}
                </span>
              </p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-md space-y-4 w-[50%]">
              <div className="flex gap-4">
                <button
                  onClick={() => updateStatus("completed")}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Approve Payment
                </button>
                <button
                  onClick={() => updateStatus("failed")}
                  className="px-4 py-2 border border-black text-black rounded"
                >
                  Reject Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditDetails;
