import React, { useEffect, useState } from "react";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";


const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/admin/report`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Pass token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6 md:ml-64">
        {/* Header */}
        <Header />

        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 mt-10">{error}</p>
        ) : (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <StatBox title="Total Users" value={data?.totalUsers || 0} />
              <StatBox title="Total Vendors" value={data?.totalVendors || 0} />
              <StatBox
                title="Total Partners"
                value={data?.totalPartners || 0}
              />
              <StatBox
                title="Pending Payments"
                value={`${data?.pendingPayment || 0} CFA`}
              />
            </div>

            {/* Earnings Section */}
            <div className="mt-8 bg-white shadow-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Earnings & Withdrawals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-gray-600">Total Earnings</h4>
                  <p className="text-2xl font-bold">{`${
                    data?.totalEarnings || 0
                  } CFA`}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h4 className="text-gray-600">Pending Withdrawals</h4>
                  <p className="text-2xl font-bold">{`${
                    data?.pendingWithdrawals || 0
                  } CFA`}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8 bg-white shadow-md p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <ul>
                {data?.recentActivity && data.recentActivity.length > 0 ? (
                  data.recentActivity.map((activity, index) => (
                    <li key={index} className="border-b py-2">
                      {activity}
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No recent activity.</p>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Box Component
const StatBox = ({ title, value }) => (
  <div className="p-4 bg-purple-600 text-white shadow-md rounded-lg text-center">
    <p className="text-white">{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default Dashboard;
