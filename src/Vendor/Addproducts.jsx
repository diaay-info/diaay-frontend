import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import useDirectSpacesUpload from "../Hooks/useDirectSpacesUpload";
import useCategories from "../Hooks/useCategories";

const ProductForm = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  // const [categories, setCategories] = useState([]);
  const { categories, loading } = useCategories();
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [features, setFeatures] = useState([{ name: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  console.log(categories);
  // Import the direct upload hook
  const { uploadImage, uploadMultipleImages, uploading, uploadProgress, currentFileIndex, totalFiles } = useDirectSpacesUpload();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token || "");
  }, []);

  // Handle single image upload
  const handleUploadSingleImage = async (file) => {
    try {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setUploadedImageUrls((prev) => [...prev, imageUrl]);
        return imageUrl;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    }
  };

  // Implement the drop zone functionality with immediate upload
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Limit to 3 images maximum
      const limitedFiles = acceptedFiles.slice(0, 3 - imageFiles.length);

      if (imageFiles.length + acceptedFiles.length > 3) {
        toast.warning("Maximum of 3 images allowed. Only the first " + (3 - imageFiles.length) + " will be used.");
      }

      if (limitedFiles.length > 0) {
        // Create previews for the dropped files and update files state
        const newPreviews = limitedFiles.map((file) => URL.createObjectURL(file));

        // Update previews and files state
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setImageFiles((prev) => [...prev, ...limitedFiles]);

        // Start uploading the files immediately
        for (const file of limitedFiles) {
          await handleUploadSingleImage(file);
        }
      }
    },
    [imageFiles, uploadedImageUrls]
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxSize: 10485760, // 10MB
    maxFiles: 3,
    disabled: imageFiles.length >= 3 || uploading || isSubmitting,
  });

  // Handle removing an image
  const handleRemoveImage = (index) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove the image from previews, files, and uploaded URLs
    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];
    const newUrls = [...uploadedImageUrls];

    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);

    // Only remove URL if it exists (might still be uploading)
    if (index < newUrls.length) {
      newUrls.splice(index, 1);
    }

    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
    setUploadedImageUrls(newUrls);
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

  const onSubmit = async (data) => {
    if (!accessToken) {
      toast.error("Authentication required. Please login.");
      return;
    }

    if (imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    // Check if uploads are still in progress
    if (uploading) {
      toast.warning("Please wait for image uploads to complete");
      return;
    }

    // Check if we have all the image URLs
    if (uploadedImageUrls.length < imageFiles.length) {
      toast.warning("Some images are still uploading. Please wait a moment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        country: data.country,
        state: data.state,
        category: data.category,
        features: features.filter((f) => f.name && f.value),
        images: uploadedImageUrls, // Use the pre-uploaded image URLs
      };

      const response = await axios.post(`${API_BASE_URL}/api/products`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

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
    // Clean up object URLs to prevent memory leaks
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImagePreviews([]);
    setImageFiles([]);
    setUploadedImageUrls([]);
    setFeatures([{ name: "", value: "" }]);
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
        <button onClick={() => navigate("/products")} className="border px-4 py-2 rounded-lg hover:bg-primary hover:text-white">
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Main Form Fields */}
          <div className="flex-1 space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
              <input
                type="text"
                {...register("name", { required: "Product name is required" })}
                className={`w-full px-3 py-2 border rounded-md ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${errors.description ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.price ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
                <input
                  type="number"
                  {...register("stock", {
                    required: "Stock is required",
                    min: { value: 0, message: "Stock must be positive" },
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.stock ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
                <input
                  type="text"
                  {...register("country", { required: "Country is required" })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.country ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.country && <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                <input
                  type="text"
                  {...register("state", { required: "State is required" })}
                  className={`w-full px-3 py-2 border rounded-md ${errors.state ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                {...register("category", { required: "Category is required" })}
                className={`w-full px-3 py-2 border rounded-md ${errors.category ? "border-red-500" : "border-gray-300"}`}
                disabled={loading}
              >
                <option value="">Select a category</option>
                {loading ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((category, index) => (
                    <option key={index} value={category?.name}>
                      {category?.name}
                    </option>
                  ))
                )}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>
          </div>

          {/* Right Column - Images and Features */}
          <div className="flex-1 space-y-4">
            {/* Images with Drag & Drop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images* (Maximum 3)</label>

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 ${isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"} 
                  border-dashed rounded-md p-4 text-center cursor-pointer 
                  ${imageFiles.length >= 3 || uploading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-gray-600">Drop the images here ...</p>
                ) : uploading ? (
                  <p className="text-gray-600">Please wait, uploading images...</p>
                ) : (
                  <p className="text-gray-600">
                    {imageFiles.length >= 3 ? "Maximum of 3 images reached" : "Drag & drop images here, or click to select files"}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">Accepts JPG, PNG, WebP (Max: 10MB)</p>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        title="Remove image"
                        disabled={uploading}
                      >
                        ×
                      </button>
                      {index >= uploadedImageUrls.length && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Uploading image {currentFileIndex + 1} of {totalFiles}...
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Feature name"
                    value={feature.name}
                    onChange={(e) => handleFeatureChange(index, "name", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Feature value"
                    value={feature.value}
                    onChange={(e) => handleFeatureChange(index, "value", e.target.value)}
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
            disabled={isSubmitting || uploading || (imageFiles.length > 0 && uploadedImageUrls.length < imageFiles.length)}
            className={`w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700 ${
              isSubmitting || uploading || (imageFiles.length > 0 && uploadedImageUrls.length < imageFiles.length)
                ? "opacity-50 cursor-not-allowed"
                : ""
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
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : uploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading Images...
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
