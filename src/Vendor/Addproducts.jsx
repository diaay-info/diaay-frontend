import React, { useState } from "react";
import { FaCheckCircle, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AddProducts = ({ onProductAdded }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productCountry, setProductCountry] = useState("");
  const [productState, setProductState] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // Store Base64 strings instead of files
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ name: "", value: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const categories = [
    "Electronics",
    "Clothing",
    "Furniture",
    "Vehicles",
    "Beauty",
    "Others",
  ];

  const handleFeatureChange = (e, field) => {
    setNewFeature({ ...newFeature, [field]: e.target.value });
  };

  const addFeature = () => {
    if (newFeature.name && newFeature.value) {
      setFeatures([...features, newFeature]);
      setNewFeature({ name: "", value: "" });
    }
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 3) {
      setErrorMessage("You can only upload up to 3 images.");
      return;
    }

    // Convert each file to a Base64 string
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Resolve with the Base64 string
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    // Wait for all files to be converted
    Promise.all(promises)
      .then((base64Strings) => {
        setImageFiles([...imageFiles, ...base64Strings]); // Store Base64 strings
      })
      .catch((error) => {
        setErrorMessage("Failed to process images. Please try again.");
        console.error("Error converting images to Base64:", error);
      });
  };

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !productName ||
      !productPrice ||
      !productCategory ||
      !productDescription ||
      imageFiles.length === 0
    ) {
      setErrorMessage("All fields including an image are required.");
      return;
    }

    const productData = {
      name: productName,
      description: productDescription,
      price: Number(productPrice),
      stock: Number(productStock),
      category: productCategory,
      country: productCountry,
      state: productState,
      images: imageFiles, // Send Base64 strings directly
      features: features,
    };

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        "https://e-service-v2s8.onrender.com/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData), // Send as JSON
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong!");
      }

      setShowSuccessModal(true);
      onProductAdded({ name: productName });

      // Reset form
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductStock("");
      setProductCategory("");
      setProductCountry("");
      setProductState("");
      setImageFiles([]);
      setFeatures([]);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-6xl mx-auto">
      {showSuccessModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h4 className="text-lg font-semibold text-green-600 mt-2">
              Product Successfully Added!
            </h4>
            <button
              onClick={() => navigate("/products")}
              className="mt-4 py-2 px-6 bg-green-500 text-white rounded-lg"
            >
              Back to Products
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-4 text-center">
        Add New Product
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg required"
            placeholder="Enter product name"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg required"
            placeholder="Enter product description"
          />

          {/* Price & Stock (Side by Side) */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Enter product price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={productStock}
                onChange={(e) => setProductStock(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Enter product stock"
              />
            </div>
          </div>

          {/* Country & State (Side by Side) */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                value={productCountry}
                onChange={(e) => setProductCountry(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                value={productState}
                onChange={(e) => setProductState(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Enter state"
              />
            </div>
          </div>

          {/* Category Selection */}
          <label className="block text-sm font-medium text-gray-700 mt-4">
            Category
          </label>
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Right Column */}
        <div>
          <h4 className="text-lg font-semibold mb-2"></h4>
          <label className="w-full h-32 border-2 border-dashed flex items-center justify-center text-gray-500 cursor-pointer">
            Click to Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          <div className="mt-4 flex gap-4">
            {imageFiles.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image} // Use Base64 string directly
                  alt="Uploaded"
                  className="w-20 h-20 object-cover rounded-md"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">Product Features</h4>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Feature Name"
                value={newFeature.name}
                onChange={(e) => handleFeatureChange(e, "name")}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Feature Value"
                value={newFeature.value}
                onChange={(e) => handleFeatureChange(e, "value")}
                className="border rounded px-2 py-1"
              />
              <button
                onClick={addFeature}
                className="bg-primary text-white px-3 py-1 rounded"
              >
                <FaPlus />
              </button>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="border rounded px-2 py-1">
                  {feature.name}: {feature.value}
                </span>
                <button
                  onClick={() => removeFeature(index)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 py-2 px-4 bg-purple-500 text-white rounded-lg"
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProducts;
