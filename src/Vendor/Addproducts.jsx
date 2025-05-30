import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { FaTrash } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import useDirectSpacesUpload from "../Hooks/useDirectSpacesUpload";
import useCategories from "../Hooks/useCategories";
import Swal from "sweetalert2";
import { Country, State, City } from "country-state-city";
import Layout from "./Layout";

// Currency mapping function
const getCurrencyByCountry = (country) => {
  const currencyMap = {
    Nigeria: "NGN",
    Senegal: "XOF",
    Benin: "XOF",
    "United States": "USD",
    // Add more countries as needed
  };
  return currencyMap[country] || "XOF"; // Default to USD if country not found
};

const ProductForm = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const { categories, loading } = useCategories();
  const [features, setFeatures] = useState([{ name: "", value: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [countries, setCountries] = useState([]);
  const [statesList, setStatesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Senegal"); // Default to Senegal
  const [creditBalance, setCreditBalance] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(false);
  // const [productCount, setProductCount] = useState(0);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize countries
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(
      allCountries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      }))
    );

    // Set initial country value
    setValue("country", "Senegal");

    // Load states for Senegal immediately
    const senegalCode = allCountries.find((c) => c.name === "Senegal")?.isoCode;
    if (senegalCode) {
      const senegalStates = State.getStatesOfCountry(senegalCode).map(
        (state) => ({
          value: state.isoCode,
          label: state.name,
        })
      );
      setStatesList(senegalStates);
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      country: "Senegal",
    },
  });

  // Watch country and state values
  const watchCountry = watch("country");
  const watchState = watch("state");

  // Update states when country changes
  useEffect(() => {
    if (watchCountry) {
      const countryCode = countries.find(
        (c) => c.label === watchCountry
      )?.value;
      if (countryCode) {
        const countryStates = State.getStatesOfCountry(countryCode).map(
          (state) => ({
            value: state.isoCode,
            label: state.name,
          })
        );
        setStatesList(countryStates);
      }
    }
  }, [watchCountry, countries]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setAccessToken(token || "");

    // Fetch credit balance and product count when accessToken is available
    if (token) {
      fetchCreditBalance(token);
      // fetchUserProductCount(token);
    }
  }, []);

  // Fetch user's credit balance
  const fetchCreditBalance = async (token) => {
    setLoadingCredits(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/credits/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCreditBalance(response.data.balance.balance || 0);
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      setCreditBalance(0);
    } finally {
      setLoadingCredits(false);
    }
  };

  // Fetch user's product count
  // const fetchUserProductCount = async (token) => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/api/products/count`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setProductCount(response.data.count || 0);
  //   } catch (error) {
  //     console.error("Error fetching product count:", error);
  //     setProductCount(0);
  //   }
  // };

  // Import the direct upload hook
  const {
    uploadImage,
    uploadMultipleImages,
    uploading,
    uploadProgress,
    currentFileIndex,
    totalFiles,
  } = useDirectSpacesUpload();

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
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: `Failed to upload image: ${error.message}`,
      });
      return null;
    }
  };

  // Implement the drop zone functionality with immediate upload
  const onDrop = useCallback(
    async (acceptedFiles) => {
      // Limit to 5 images maximum
      const limitedFiles = acceptedFiles.slice(0, 5 - imageFiles.length);

      if (imageFiles.length + acceptedFiles.length > 5) {
        Swal.fire({
          icon: "warning",
          title: "Image Limit",
          text: `Maximum of 5 images allowed. Only the first ${
            5 - imageFiles.length
          } will be used.`,
        });
      }

      if (limitedFiles.length > 0) {
        // Create previews for the dropped files and update files state
        const newPreviews = limitedFiles.map((file) =>
          URL.createObjectURL(file)
        );

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
    maxFiles: 5,
    disabled: imageFiles.length >= 5 || uploading || isSubmitting,
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

  // Handle country change
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setValue("country", country);
    setValue("state", ""); // Reset state when country changes
  };

  // Handle state change
  const handleStateChange = (e) => {
    setValue("state", e.target.value);
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

  // // Check if user can post for free
  // const canPostForFree = productCount < 5;

  // Add this helper function for price formatting
  const formatPrice = (value) => {
    if (!value) return "";
    // Remove all non-digit characters
    const num = value.toString().replace(/[^0-9]/g, "");
    // Format with commas
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // In the onSubmit function with fixed error handling
  const onSubmit = async (data) => {
    if (!accessToken) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please login to add a product",
      });
      return;
    }

    if (imageFiles.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Images Required",
        text: "Please upload at least one image",
      });
      return;
    }

    if (uploading) {
      Swal.fire({
        icon: "warning",
        title: "Upload in Progress",
        text: "Please wait for image uploads to complete",
      });
      return;
    }

    if (uploadedImageUrls.length < imageFiles.length) {
      Swal.fire({
        icon: "warning",
        title: "Upload in Progress",
        text: "Some images are still uploading. Please wait a moment.",
      });
      return;
    }

    // Check if user already has 5 products and needs a credit
    if ( creditBalance < 1) {
      Swal.fire({
        icon: "error",
        title: "Insufficient Credits",
        text: "You've used your 2 free product listings. You need 1 credit to add more products.",
      });
      return;
    }

    // Get currency based on selected country
    const currency = getCurrencyByCountry(data.country);

    // Format the price with currency
    const formattedPrice = `${currency} ${Number(data.price)}`;

    setIsSubmitting(true);

    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: formattedPrice, // Include the currency with price
        stock: Number(data.stock),
        country: data.country,
        city: data.state,
        category: data.category,
        features: features.filter((f) => f.name && f.value),
        images: uploadedImageUrls,
        duration: 365, // Set to 1 year (365 days)
        credit: 1, // Use 1 credit if not free
        cost:  1000, // Set cost if using credit
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/products`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added successfully!",
        confirmButtonText: "OK",
      });

      resetForm();
      navigate("/vendor/products");
    } catch (error) {
      console.error("Error adding product:", error);
      let errorMessage = "Failed to add product";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again.";
          localStorage.removeItem("accessToken");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonText: "OK",
          });
        } else if (
          error.response.data.message ===
          "Valid credit amount required for paid product"
        ) {
          // Use a custom HTML SweetAlert for the credit purchase option
          Swal.fire({
            icon: "error",
            title: "Insufficient Credits",
            html: 'You need credits to add more products. <a href="/credits" class="text-blue-500 underline cursor-pointer">Click here to purchase credits</a>',
            confirmButtonText: "OK",
          });
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonText: "OK",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonText: "OK",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset({
      country: "Senegal", // Preserve Senegal as default when resetting
    });
    // Clean up object URLs to prevent memory leaks
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImagePreviews([]);
    setImageFiles([]);
    setUploadedImageUrls([]);
    setFeatures([{ name: "", value: "" }]);
    setSelectedCountry("Senegal");

    // Need to reload states for Senegal after reset
    const senegalCode = countries.find((c) => c.label === "Senegal")?.value;
    if (senegalCode) {
      const senegalStates = State.getStatesOfCountry(senegalCode).map(
        (state) => ({
          value: state.isoCode,
          label: state.name,
        })
      );
      setStatesList(senegalStates);
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
            Add New Product
          </h2>
          <button
            onClick={() => navigate("/vendor/products")}
            className="w-full sm:w-auto border px-4 py-2 rounded-lg hover:bg-primary hover:text-white text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Column - Main Form Fields */}
            <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name*
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "Product name is required",
                  })}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price*
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {watchCountry === "Nigeria"
                          ? "₦"
                          : watchCountry === "Senegal"
                          ? "CFA"
                          : watchCountry === "United States"
                          ? "$"
                          : ""}
                      </span>
                    </div>
                    <input
                      type="text" // Changed from number to text to remove arrows
                      inputMode="numeric" // Shows numeric keyboard on mobile
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 0, message: "Price must be positive" },
                        validate: {
                          positive: (v) =>
                            parseFloat(v.replace(/,/g, "")) > 0 ||
                            "Price must be positive",
                        },
                        onChange: (e) => {
                          // Format the value with commas
                          const formattedValue = formatPrice(e.target.value);
                          e.target.value = formattedValue;
                          // Update the form value with the raw number (without commas)
                          setValue("price", formattedValue.replace(/,/g, ""), {
                            shouldValidate: true,
                          });
                        },
                      })}
                      className={`block w-full pl-10 pr-12 py-2 border rounded-md ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      } appearance-none`} // appearance-none removes default styling
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {watchCountry === "Nigeria"
                          ? "NGN"
                          : watchCountry === "Senegal"
                          ? "XOF"
                          : watchCountry === "United States"
                          ? "USD"
                          : ""}
                      </span>
                    </div>
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available*
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
              {/* Country Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country*
                </label>
                <select
                  {...register("country", { required: "Country is required" })}
                  onChange={handleCountryChange}
                  value={watchCountry || "Senegal"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Senegal">Senegal</option>
                  {countries
                    .filter((country) => country.label !== "Senegal") // Filter out Senegal to avoid duplication
                    .map((country, index) => (
                      <option key={index} value={country.label}>
                        {country.label}
                      </option>
                    ))}
                </select>
              </div>
              {/* State Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <select
                  {...register("state", { required: "State is required" })}
                  onChange={handleStateChange}
                  value={watchState || ""}
                  disabled={statesList.length === 0}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  } ${statesList.length === 0 ? "bg-gray-100" : ""}`}
                >
                  <option value="">
                    {statesList.length === 0
                      ? "Loading locations..."
                      : "Select a location"}
                  </option>
                  {statesList.map((state, index) => (
                    <option key={index} value={state.label}>
                      {state.label}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.state.message}
                  </p>
                )}
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
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
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Images and Features */}
            <div className="w-full lg:w-1/2 space-y-3 sm:space-y-4 mt-4 lg:mt-0">
              {/* Images with Drag & Drop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images* (Maximum 5)
                </label>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300"
                  } 
                  border-dashed rounded-md p-4 text-center cursor-pointer 
                  ${
                    imageFiles.length >= 5 || uploading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-gray-600">Drop the images here ...</p>
                  ) : uploading ? (
                    <p className="text-gray-600">
                      Please wait, uploading images...
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {imageFiles.length >= 5
                        ? "Maximum of 5 images reached"
                        : "Drag & drop images here, or click to select files"}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Accepts JPG, PNG, WebP (Max: 10MB)
                  </p>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 object-cover rounded-md border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm"
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
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* Product Listing Information */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-2">
                  Product Listing Information
                </h3>

                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-medium">
                    
                        You can add{" "}
                        <span className="font-bold text-blue-700">
                          2 
                        </span>{" "}
                         products for free
                      
                   <br/>
                     
                        Your Available Credits:
                        {loadingCredits ? (
                          <span className="inline-block ml-1 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <span className="ml-1 font-bold text-blue-700">
                            {creditBalance}
                          </span>
                        )}
                        {creditBalance < 1 && (
                          <p className="text-sm text-red-600 mt-1">
                            You need 1 credit to list more products after your
                            free listings.
                          </p>
                        )}
                     
                    
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features
                </label>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-2 mb-3"
                  >
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
                        className="mt-1 sm:mt-0 text-red-500 rounded-md hover:text-red-400 text-sm sm:text-base"
                      >
                        = <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeatureField}
                  className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm sm:text-base"
                >
                  Add Feature
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 sm:pt-6">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                uploading ||
                (imageFiles.length > 0 &&
                  uploadedImageUrls.length < imageFiles.length) ||
                ( creditBalance < 1)
              }
              className={`w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700 text-sm sm:text-base ${
                isSubmitting ||
                uploading ||
                (imageFiles.length > 0 &&
                  uploadedImageUrls.length < imageFiles.length) ||
                ( creditBalance < 1)
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
              ) : uploading ? (
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
                  Uploading Images...
                </span>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProductForm;
