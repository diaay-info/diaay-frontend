import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [features, setFeatures] = useState([{ name: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token || "");

    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://e-service-v2s8.onrender.com/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Cloudinary configuration
  const CLOUD_NAME = "dferg7plg";
  const UPLOAD_PRESET = "product image";

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token || "");
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setImageFiles(files);
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][field] = value;
    setFeatures(updatedFeatures);
  };

  const addFeatureField = () => {
    setFeatures([...features, { name: "", value: "" }]);
  };

  const removeFeatureField = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    if (!accessToken) {
      toast.error("Authentication required. Please login.");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);

    try {
      const uploadPromises = imageFiles.map(uploadToCloudinary);
      const imageUrls = await Promise.all(uploadPromises);

      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        country: data.country,
        state: data.state,
        category: data.category,
        features: features.filter((f) => f.name && f.value),
        images: imageUrls,
      };

      const response = await axios.post(
        "https://e-service-v2s8.onrender.com/api/products",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Product added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      handleSubmissionError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setImagePreviews([]);
    setImageFiles([]);
    setFeatures([{ name: "", value: "" }]);
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
  };

  const handleSubmissionError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
      } else {
        toast.error(error.response.data?.message || "Failed to add product");
      }
    } else {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between ">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Product
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="border px-4 py-2 rounded-lg hover:bg-primary hover:text-white"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Main Form Fields */}
          <div className="flex-1 space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name*
              </label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price*
                </label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock*
                </label>
                <input
                  type="number"
                  {...register("stock", {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock must be positive" },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country*
                </label>
                <input
                  type="text"
                  {...register("country", { required: "Country is required" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State*
                </label>
                <input
                  type="text"
                  {...register("state", { required: "State is required" })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loadingCategories}
              >
                <option value="">Select a category</option>
                {loadingCategories ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Images and Features */}
          <div className="flex-1 space-y-4">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images*
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              {imagePreviews.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-20 w-20 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Features
              </label>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Feature name"
                    value={feature.name}
                    onChange={(e) =>
                      handleFeatureChange(index, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Feature value"
                    value={feature.value}
                    onChange={(e) =>
                      handleFeatureChange(index, "value", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeatureField(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeatureField}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Feature
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
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
              </span>
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
