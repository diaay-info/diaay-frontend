import React, { useState } from "react";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

const Notification = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [activeTab, setActiveTab] = useState("User Activity");

  const tabs = [
    { name: "User Activity" },
    { name: "Referral Approvals", count: 15 },
    { name: "Credit Purchases", count: 15 },
    { name: "Ads Approval", count: 15 },
  ];

  const allData = {
    "User Activity": [
      {
        name: "John Doe",
        role: "Vendor",
        activity: "Submitted withdrawal request.",
        date: "10/12/2024",
      },
    ],
    "Referral Approvals": [
      {
        partner: "Alice Smith",
        referral: "Bob Johnson",
        amount: "$50",
        date: "10/12/2024",
        status: "Pending",
      },
    ],
    "Credit Purchases": [
      {
        name: "John Doe",
        credits: "500",
        amount: "$100",
        method: "Credit Card",
        date: "10/12/2024",
        status: "Completed",
      },
    ],
    "Ads Approval": [
      {
        vendor: "Vendor XYZ",
        product: "Premium Listing",
        date: "10/12/2024",
        status: "Pending",
      },
    ],
  };

  const filteredData = allData[activeTab].filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 md:ml-64">
        <Header />

        <div className="py-6">
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-3 w-full">
            <input
              type="text"
              placeholder="Search..."
              className="border px-4 py-2 rounded-lg flex-grow w-full sm:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="border px-4 py-2 rounded-lg w-full sm:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Tabs */}
          <div className="flex border-b mt-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                className={`px-6 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.name
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
                {tab.count && (
                  <span className="ml-2 bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-1">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table Section */}
          <div className="bg-white mt-4 p-4 rounded-lg shadow-md">
            {filteredData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse">
                  <thead>
                    <tr className="text-left bg-gray-100">
                      {activeTab === "User Activity" && (
                        <>
                          <th className="p-3">Name</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Activity</th>
                          <th className="p-3">Date & Time</th>
                          <th className="p-3">Action</th>
                        </>
                      )}
                      {activeTab === "Referral Approvals" && (
                        <>
                          <th className="p-3">Partner Name</th>
                          <th className="p-3">Referral Name</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </>
                      )}
                      {activeTab === "Credit Purchases" && (
                        <>
                          <th className="p-3">Name</th>
                          <th className="p-3">Credits</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment Method</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </>
                      )}
                      {activeTab === "Ads Approval" && (
                        <>
                          <th className="p-3">Vendor Name</th>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Action</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index} className="border-t">
                        {activeTab === "User Activity" && (
                          <>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.role}</td>
                            <td className="p-3">{item.activity}</td>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">
                              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
                                View
                              </button>
                            </td>
                          </>
                        )}
                        {activeTab === "Referral Approvals" && (
                          <>
                            <td className="p-3">{item.partner}</td>
                            <td className="p-3">{item.referral}</td>
                            <td className="p-3">{item.amount}</td>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.status}</td>
                            <td className="p-3 flex gap-2">
                              <button className="bg-green-600 text-white px-3 py-1 rounded-lg">
                                Approve
                              </button>
                              <button className="bg-red-600 text-white px-3 py-1 rounded-lg">
                                Reject
                              </button>
                            </td>
                          </>
                        )}
                        {activeTab === "Credit Purchases" && (
                          <>
                            <td className="p-3">{item.name}</td>
                            <td className="p-3">{item.credits}</td>
                            <td className="p-3">{item.amount}</td>
                            <td className="p-3">{item.method}</td>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.status}</td>
                            <td className="p-3">
                              <button className="bg-green-600 text-white px-3 py-1 rounded-lg mr-2">
                                Approve
                              </button>
                              <button className="bg-red-600 text-white px-3 py-1 rounded-lg">
                                Reject
                              </button>
                            </td>
                          </>
                        )}
                        {activeTab === "Ads Approval" && (
                          <>
                            <td className="p-3">{item.vendor}</td>
                            <td className="p-3">{item.product}</td>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.status}</td>
                            <td className="p-3">
                              <button className="bg-green-600 text-white px-3 py-1 rounded-lg mr-2">
                                Approve
                              </button>
                              <button className="bg-red-600 text-white px-3 py-1 rounded-lg">
                                Reject
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
