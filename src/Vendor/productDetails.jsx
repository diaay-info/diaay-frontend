import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const token = localStorage.getItem("accessToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
        setForm(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id, API_BASE_URL, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (e) => {
    try {
      // Try to parse as JSON if it's a valid JSON string
      const parsedValue = JSON.parse(e.target.value);
      setForm({
        ...form,
        features: parsedValue,
      });
    } catch {
      // If not valid JSON, store as string
      setForm({
        ...form,
        features: e.target.value,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProduct(updatedProduct);
        setEditMode(false);
        alert("Product updated successfully");
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Product deleted successfully");
        navigate("/products");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  if (!product) {
    return (
      <Layout>
        <div className="flex min-h-screen justify-center items-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Helper function to display field value properly
  const renderFieldValue = (key, value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }

    if (key === "features") {
      if (Array.isArray(value)) {
        return value.map((feature, idx) => (
          <div key={idx} className="text-gray-700 p-2 bg-gray-50 rounded mb-1">
            {typeof feature === "object"
              ? `${feature.name || ""}: ${feature.value || ""}`
              : feature}
          </div>
        ));
      } else if (typeof value === "object") {
        return JSON.stringify(value);
      }
    }

    if (key === "price") {
      return `$${parseFloat(value).toFixed(2)}`;
    }

    return value.toString();
  };

  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const valueClass = "text-gray-800 font-medium";
  const inputClass =
    "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2";

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            {/* Product Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Product Detail
                </h2>
                
              </div>
            </div>

            {/* Product Content */}
            <div className="p-6">
              <div className="md:flex">
                {/* Image Section */}
                <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {product.images?.slice(1, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img || "/placeholder.jpg"}
                        alt={`${product.name} ${i + 1}`}
                        className="h-16 w-16 object-cover rounded border border-gray-200 flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>

                {/* Details Section */}
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 gap-6">
                     {/* Description */}
                     <div className="border-b"> 
                      <label className={labelClass}>Product Name</label>
                      {editMode ? (
                        <textarea
                          name="name"
                          value={form.name || ""}
                          onChange={handleChange}
                          rows="1"
                          className={inputClass}
                        />
                      ) : (
                        <p className="text-gray-700  whitespace-pre-line">
                          {product.name || "No name available"}
                        </p>
                      )}
                    </div>
                    {/* Price */}
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-500">
                          Price
                        </span>
                        {editMode ? (
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            value={form.price || ""}
                            onChange={handleChange}
                            className={inputClass}
                          />
                        ) : (
                          <span className="text-2xl font-bold text-indigo-600">
                            {parseFloat(product.price).toFixed(2)}XOF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="border-b"> 
                    <label className={labelClass}>Description</label>
                      {editMode ? (
                        <textarea
                          name="description"
                          value={form.description || ""}
                          onChange={handleChange}
                          rows="4"
                          className={inputClass}
                        />
                      ) : (
                        <p className="text-gray-700 whitespace-pre-line">
                          {product.description || "No description available"}
                        </p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="border-b"> 
                    <label className={labelClass}>Category</label>
                      {editMode ? (
                        <input
                          name="category"
                          value={form.category || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      ) : (
                        <p className={valueClass}>
                          {product.category || "Uncategorized"}
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <div className="border-b"> 
                    <label className={`${labelClass} flex items-center`}>
                        <span>Features</span>
                        <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                          {Array.isArray(product.features)
                            ? product.features.length
                            : "0"}
                        </span>
                      </label>
                      {editMode ? (
                        <textarea
                          name="features"
                          value={
                            typeof form.features === "object"
                              ? JSON.stringify(form.features, null, 2)
                              : form.features || ""
                          }
                          onChange={handleFeatureChange}
                          rows="4"
                          className={inputClass}
                          placeholder="Enter features as JSON array"
                        />
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          {product.features && product.features.length > 0 ? (
                            renderFieldValue("features", product.features)
                          ) : (
                            <p className="text-gray-500 italic">
                              No features listed
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className={`px-4 py-2 rounded-md text-sm font-medium shadow-sm ${
                        editMode
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                    >
                      {editMode ? "Cancel" : "Edit"}
                    </button>
                    {editMode && (
                      <button
                        onClick={handleUpdate}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
