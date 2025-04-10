import React, { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
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
  const itemsPerPage = 10;
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setUsers(result.data);
        } else {
          setError("Failed to load users.");
        }
      } catch (error) {
        setError("Error fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / itemsPerPage)
  );
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 md:ml-64">
        <Header />

        <section className="py-6">
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          {/* Filters */}
          <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All Roles</option>
              <option>Vendor</option>
              <option>Customer</option>
              <option>Partner</option>
            </select>
            <select
              className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-lg"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>
          </div>

          {/* User Table */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            {loading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : paginatedUsers.length === 0 ? (
              <div className="text-center mt-6 flex flex-col items-center">
                <FiUsers className="text-gray-400 text-6xl" />
                <p className="text-gray-500 mt-2">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-md text-sm">
                  <thead className="bg-primary text-white text-xs md:text-sm uppercase font-semibold">
                    <tr>
                      <th className="p-2 md:p-3 text-left">Name</th>
                      <th className="p-2 md:p-3 text-left">Email</th>
                      <th className="p-2 md:p-3 text-left">Role</th>
                      <th className="p-2 md:p-3 text-left">Date Created</th>
                      <th className="p-2 md:p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-100 text-xs md:text-sm"
                      >
                        <td className="p-2 md:p-3 font-medium text-gray-800">
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {user.fullName}
                          </Link>
                        </td>
                        <td className="p-2 md:p-3 text-gray-600">
                          {user.email}
                        </td>
                        <td className="p-2 md:p-3 text-gray-600">
                          {user.role}
                        </td>
                        <td className="p-2 md:p-3 text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 md:p-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.status.toLowerCase() === "active"
                                ? "text-green-700 bg-green-100"
                                : user.status.toLowerCase() === "inactive"
                                ? "text-red-600 bg-red-100"
                                : "text-yellow-700 bg-yellow-100"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > 0 && (
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
        </section>
      </main>
    </div>
  );
};

export default UserManagement;
