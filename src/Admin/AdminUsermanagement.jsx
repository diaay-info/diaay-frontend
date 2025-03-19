import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { FaBars } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { Link } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setUsers(result.data);
        } else {
          setError("Failed to load users");
        }
      } catch (error) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtering users
  const filteredUsers = users.filter((user) => {
    if (!user || !user.fullName || !user.email) return false;

    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "All Roles" ||
      user.role?.toLowerCase() === roleFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "All Status" ||
      user.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex">
      
        <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        <div className="py-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Filters Section */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-4 grid gap-4 md:flex md:items-center">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200 w-full md:w-auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white w-full md:w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All Roles</option>
              <option>Vendor</option>
              <option>Customer</option>
              <option>Partner</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white w-full md:w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <p className="text-gray-600 text-center">Loading...</p>
            ) : paginatedUsers.length === 0 ? (
              <div className="text-center mt-6 flex flex-col items-center">
                <FiUsers className="text-gray-400 text-6xl" />
                <p className="text-gray-500 mt-2">No Users Found</p>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-md text-sm">
                  <thead className="bg-primary text-white uppercase font-semibold">
                    <tr>
                      <th className="border-b border-gray-300 p-3 text-left">Name</th>
                      <th className="border-b border-gray-300 p-3 text-left">Email</th>
                      <th className="border-b border-gray-300 p-3 text-left">Role</th>
                      <th className="border-b border-gray-300 p-3 text-left">Date Created</th>
                      <th className="border-b border-gray-300 p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-100">
                        <td className="border-b border-gray-300 p-3">
                          <Link to={`/admin/users/${user._id}`} className="text-blue-600 hover:underline">
                            {user.fullName}
                          </Link>
                        </td>
                        <td className="border-b border-gray-300 p-3">{user.email}</td>
                        <td className="border-b border-gray-300 p-3">{user.role}</td>
                        <td className="border-b border-gray-300 p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className="border-b border-gray-300 p-3">
                          <span className={`px-3 py-1 rounded text-xs ${user.status.toLowerCase() === "active" ? "bg-green-100 text-green-600" : user.status.toLowerCase() === "inactive" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-black"}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-4 text-gray-600">
            <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
              <IoIosArrowBack />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
              <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
