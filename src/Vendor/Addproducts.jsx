import React, { useState } from "react";
import { FaCheckCircle, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Addproducts = ({ onProductAdded }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productCountry, setProductCountry] = useState("");
  const [productState, setProductState] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState({ name: "", value: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // Sample categories
  const categories = [
    "Electronics",
    "Clothing",
    "Furniture",
    "Vehicles",
    "Others",
  ];

  // Handle feature input change
  const handleFeatureChange = (e, field) => {
    setNewFeature({ ...newFeature, [field]: e.target.value });
  };

  // Add a new feature
  const addFeature = () => {
    if (newFeature.name && newFeature.value) {
      setFeatures([...features, newFeature]);
      setNewFeature({ name: "", value: "" });
    }
  };

  // Remove a feature
  const removeFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (imageFiles.length + files.length > 3) {
      setErrorMessage("You can only upload up to 3 images.");
      return;
    }

    setImageFiles([...imageFiles, ...files]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !productName ||
      !productPrice ||
      !productCategory ||
      !productCountry ||
      !productState ||
      imageFiles.length === 0
    ) {
      setErrorMessage("All fields including an image are required.");
      return;
    }

    setShowSuccessModal(true);
    onProductAdded({ name: productName });

    setProductName("");
    setProductDescription("");
    setProductPrice("");
    setProductStock("");
    setProductCategory("");
    setProductCountry("");
    setProductState("");
    setImageFiles([]);
    setFeatures([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl mx-auto">
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
            placeholder="Enter product name"
          />

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg"
            placeholder="Enter product description"
          />

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

          {/* Country and State Inputs */}
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

        {/* Image Upload */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Product Media</h4>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="block w-full mt-2"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">Product Features</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Feature name"
            value={newFeature.name}
            onChange={(e) => handleFeatureChange(e, "name")}
            className="border px-3 py-2 rounded-lg w-1/2"
          />
          <input
            type="text"
            placeholder="Feature value"
            value={newFeature.value}
            onChange={(e) => handleFeatureChange(e, "value")}
            className="border px-3 py-2 rounded-lg w-1/2"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={addFeature}
          >
            <FaPlus />
          </button>
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

export default Addproducts;
