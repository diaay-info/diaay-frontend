import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { IoIosArrowRoundBack } from "react-icons/io";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({
    show: false,
    action: "",
    message: "",
    status: "",
  });
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const allowedStatuses = ["pending", "active", "inactive", "banned"];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setUser(result.data);
        } else {
          setError("User not found");
        }
      } catch (err) {
        setError("Error fetching user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id, API_BASE_URL]);

  const handleBack = () => navigate("/admin/users");

  const handleAction = (action, status) => {
    let message = "";
    switch (action) {
      case "approve":
        message = `Are you sure you want to approve ${user.fullName}'s account?`;
        break;
      case "reject":
        message = `Are you sure you want to reject ${user.fullName}'s account?`;
        break;
      case "deactivate":
        message = `Are you sure you want to deactivate ${user.fullName}'s account?`;
        break;
      case "ban":
        message = `Are you sure you want to ban ${user.fullName}'s account?`;
        break;
      default:
        message = `Are you sure you want to change ${user.fullName}'s account status?`;
    }

    setModal({
      show: true,
      action,
      message,
      status,
    });
  };

  const updateUserStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await response.json();

      if (result.success) {
        setUser((prevUser) => ({ ...prevUser, status: newStatus }));
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("An error occurred.");
    }
  };

  const confirmAction = async () => {
    await updateUserStatus(modal.status);
    setModal({ show: false, action: "", message: "", status: "" });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "banned":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen max-w-full overflow-hidden">
        <Header />
        <div className="bg-white p-4 rounded-lg shadow-md my-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <IoIosArrowRoundBack size={30} /> <span className="ml-2">Back</span>
          </button>
        </div>

        <div className="py-4 w-full flex flex-col md:flex-row gap-5 items-start overflow-x-auto">
          <div className="rounded-lg w-full min-w-0 shadow-md bg-white p-4 space-y-4">
            <h2 className="text-xl font-bold">User Details</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Full Name:</td>
                    <td className="py-3 px-4">{user.fullName}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Email:</td>
                    <td className="py-3 px-4">{user.email}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Phone:</td>
                    <td className="py-3 px-4">{user.phoneNumber}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Role:</td>
                    <td className="py-3 px-4">{user.role}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4 font-medium">Date Joined:</td>
                    <td className="py-3 px-4">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Status:</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-white ${getStatusBadgeColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 md:mt-0 w-full min-w-0 rounded-lg shadow-md bg-white space-y-4 p-4">
            <h2 className="text-xl font-bold">Actions</h2>
            <hr />
            <div className="overflow-x-auto pb-2">
              {user.role === "customer" && (
                <div className="space-y-2 flex flex-wrap gap-2">
                  {user.status !== "active" && (
                    <button
                      onClick={() => handleAction("activate", "active")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Activate Account
                    </button>
                  )}
                  {user.status !== "inactive" && (
                    <button
                      onClick={() => handleAction("deactivate", "inactive")}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Deactivate Account
                    </button>
                  )}
                  {user.status !== "banned" && (
                    <button
                      onClick={() => handleAction("ban", "banned")}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Ban Account
                    </button>
                  )}
                </div>
              )}
              {user.role !== "customer" && (
                <div className="space-y-2 flex flex-wrap gap-2">
                  {user.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction("reject", "inactive")}
                        className="border text-black px-4 py-2 rounded-md"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleAction("approve", "active")}
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        Approve
                      </button>
                    </>
                  )}
                  {user.status === "active" && (
                    <button
                      onClick={() => handleAction("deactivate", "inactive")}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    >
                      Deactivate
                    </button>
                  )}
                  {user.status === "inactive" && (
                    <button
                      onClick={() => handleAction("activate", "active")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Activate
                    </button>
                  )}
                  {user.status !== "banned" && (
                    <button
                      onClick={() => handleAction("ban", "banned")}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Ban Account
                    </button>
                  )}
                  {user.status === "banned" && (
                    <button
                      onClick={() => handleAction("unban", "inactive")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Unban Account
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {modal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p>{modal.message}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmAction}
                  className="bg-red-500 text-white px-8 py-1 rounded-md"
                >
                  Yes
                </button>
                <button
                  onClick={() =>
                    setModal({
                      show: false,
                      action: "",
                      message: "",
                      status: "",
                    })
                  }
                  className="border px-8 py-1 rounded-md"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
