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
  const [modal, setModal] = useState({ show: false, action: "", message: "" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(
          `https://e-service-v2s8.onrender.com/api/admin/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
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
  }, [id]);

  const handleBack = () => navigate("/admin/users");

  const handleAction = (action) => {
    setModal({
      show: true,
      action,
      message: `Are you sure you want to ${action} ${user.fullName}'s account?`,
    });
  };

  const updateUserStatus = async (newStatus) => {
    try {
      const response = await fetch(
        `https://e-service-v2s8.onrender.com/api/admin/users/${id}`,
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
        setUser((prevUser) => ({ ...prevUser, status: newStatus })); // Update status in UI
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("An error occurred.");
    }
  };

  const confirmAction = async () => {
    let newStatus = "";
    if (modal.action === "approve") newStatus = "active";
    else if (modal.action === "reject") newStatus = "inactive";
    else if (modal.action === "deactivate") newStatus = "inactive";

    await updateUserStatus(newStatus);
    setModal({ show: false, action: "", message: "" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />
        <div className="bg-white p-4 rounded-lg shadow-md m-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-black"
          >
            <IoIosArrowRoundBack size={30} /> <span className="ml-2">Back</span>
          </button>
        </div>

        <div className="p-4 w-full flex flex-col md:flex-row gap-5 items-start">
          <div className="rounded-lg w-full shadow-md bg-white p-4 space-y-4">
            <h2 className="text-xl font-bold">User Details</h2>
            <hr />
            <p>
              <strong>Full Name:</strong> {user.fullName}
            </p>{" "}
            <hr />
            <p>
              <strong>Email:</strong> {user.email}
            </p>{" "}
            <hr />
            <p>
              <strong>Phone:</strong> {user.phoneNumber}
            </p>{" "}
            <hr />
            <p>
              <strong>Role:</strong> {user.role}
            </p>{" "}
            <hr />
            <p>
              <strong>Date Joined:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>{" "}
            <hr />
            <p>
              <strong>Status:</strong>
              <span
                className={`px-2 py-1 rounded text-white ${
                  user.status === "pending"
                    ? "bg-yellow-500"
                    : user.status === "active"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              >
                {user.status}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full rounded-lg shadow-md bg-white space-y-4 p-4">
            {user.role === "customer" && (
              <button
                onClick={() => handleAction("deactivate")}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Deactivate Account
              </button>
            )}
            {user.role !== "customer" && (
              <>
                {user.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction("reject")}
                      className="border text-black px-4 py-2 rounded-md"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction("approve")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Approve
                    </button>
                  </div>
                )}
                {(user.status === "active" || user.status === "inactive") && (
                  <button
                    onClick={() => handleAction("deactivate")}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Deactivate
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {modal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
                    setModal({ show: false, action: "", message: "" })
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
