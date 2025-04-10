import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Added axios import
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

// Cloudinary configuration
const CLOUD_NAME = "dferg7plg";
  const UPLOAD_PRESET = "product image";

function AdminCreateAdvert() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    startDate: "",
    endDate: "",
    duration: "",
    image: "",
    description: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Ad title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) > new Date(formData.endDate)
    ) {
      newErrors.dateRange = "End date must be after start date";
    }
    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const formData = new FormData();
      formData.append("file", imageFile);
    formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );

        setFormData((prev) => ({
          ...prev,
          image: response.data.secure_url,
        }));

        if (errors.image) {
          setErrors((prev) => ({ ...prev, image: "" }));
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        setErrors((prev) => ({ ...prev, image: "Failed to upload image" }));
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/ads");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const requestBody = {
        title: formData.title,
        price: formData.price,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        location: formData.location,
        image: formData.image,
      };
 // Calculate duration in days
 const start = new Date(formData.startDate);
 const end = new Date(formData.endDate);
 requestBody.duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://e-service-v2s8.onrender.com/api/top-ads",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create ad");
      }

      setModalMessage("Ad created successfully!");
      setIsSuccess(true);
      setShowModal(true);
    } catch (error) {
      console.error("Error creating ad:", error);
      setModalMessage(error.message || "Error creating ad. Please try again.");
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    if (isSuccess) {
      navigate("/admin/ads");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />

        {/* Header with cancel and publish buttons */}
        <div className="flex justify-between items-center mt-6 bg-white p-2 rounded-lg shadow">
          <h1 className="text-[1.3rem] font-medium">Create New Ad</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center min-w-24"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Publish Ad"
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg mt-10 shadow-md p-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-8"
            noValidate
          >
            {/* Left column - Form fields */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Ad Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Ad Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full border ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full border ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      rows="4"
                      required
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Budget (optional)
                </h2>
                <div>
                  <label className="block text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Duration *</h2>
                {errors.dateRange && (
                  <p className="text-red-500 text-sm mb-2">
                    {errors.dateRange}
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full border ${
                        errors.startDate ? "border-red-500" : "border-gray-300"
                      } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className={`w-full border ${
                        errors.endDate ? "border-red-500" : "border-gray-300"
                      } rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                    {errors.endDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Image upload */}
            <div className="flex-1">
              <div>
                <h2 className="text-xl font-semibold mb-4">Mobile Upload *</h2>
                <div
                  className={`border-2 ${
                    errors.image
                      ? "border-red-500"
                      : "border-dashed border-gray-300"
                  } rounded-lg p-6 flex flex-col items-center justify-center`}
                >
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image} // Use the Cloudinary URL directly
                        alt="Preview"
                        className="max-h-64 w-auto mb-4 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Change Image
                      </button>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text-gray-600">
                          Drag and drop your image here, or
                        </p>
                      </div>
                      <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          Select Image
                        </span>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                      </label>
                    </>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Recommended size: 800x600px (JPG, PNG, or GIF)
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Success/Failure Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {isSuccess ? "Success!" : "Error"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <p className="mb-6">{modalMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded transition-colors ${
                    isSuccess
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCreateAdvert;
