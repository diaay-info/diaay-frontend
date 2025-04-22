import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [isRenewing, setIsRenewing] = useState(false);
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

  const handleRenew = async () => {
    if (!product || product.status !== "expired") return;
    
    setIsRenewing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}/renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const updatedProduct = await res.json();
        setProduct(updatedProduct);
        alert("Product successfully renewed");
      } else {
        alert("Failed to renew product");
      }
    } catch (error) {
      console.error("Error renewing product:", error);
      alert("Error renewing product");
    } finally {
      setIsRenewing(false);
    }
  };

  if (!product) {
    return (
      <Layout>
        <div className="flex min-h-screen justify-center items-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 w-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-2/3 space-y-6">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const valueClass = "text-gray-800 font-medium";
  const inputClass =
    "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2";

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-600 hover:text-indigo-600 mb-4 transition"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Products
          </button>
          
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Product Details
                  </h2>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(product.status)}`}>
                    {product.status || 'Unknown'}
                  </span>
                  
                  {product.status === "expired" && (
                    <button
                      onClick={handleRenew}
                      disabled={isRenewing}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow hover:from-emerald-600 hover:to-teal-600 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isRenewing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Renewing...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                          </svg>
                          Renew Ad
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column: Image Section */}
                <div className="lg:w-1/3 w-full">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={product.images?.[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {product.images?.slice(1, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img || "/placeholder.jpg"}
                        alt={`${product.name} ${i + 1}`}
                        className="h-16 w-16 object-cover rounded-lg border border-gray-200 flex-shrink-0 hover:ring-2 hover:ring-indigo-500 transition cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column: Details Section */}
                <div className="lg:w-2/3 w-full">
                  <div className="space-y-6 divide-y divide-gray-100">
                    {/* Name Section */}
                    <div className="pb-4">
                      <label className={labelClass}>Product Name</label>
                      {editMode ? (
                        <input
                          name="name"
                          value={form.name || ""}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      ) : (
                        <h3 className="text-xl font-semibold text-gray-800">
                          {product.name || "No name available"}
                        </h3>
                      )}
                    </div>

                    {/* Price & Category Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
                      <div>
                        <label className={labelClass}>Price</label>
                        {editMode ? (
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">XOF</span>
                            </div>
                            <input
                              name="price"
                              type="number"
                              step="0.01"
                              value={form.price || ""}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-3 sm:text-sm border-gray-300 rounded-md p-2"
                            />
                          </div>
                        ) : (
                          <div className="flex items-baseline">
                            <span className="text-2xl font-bold text-indigo-600">
                              {parseFloat(product.price).toFixed(2)}
                            </span>
                            <span className="ml-1 text-gray-500">XOF</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className={labelClass}>Category</label>
                        {editMode ? (
                          <input
                            name="category"
                            value={form.category || ""}
                            onChange={handleChange}
                            className={inputClass}
                          />
                        ) : (
                          <div className="bg-indigo-50 text-indigo-700 inline-block px-3 py-1 rounded-full text-sm font-medium">
                            {product.category || "Uncategorized"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="py-4">
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

                    {/* Features */}
                    <div className="py-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className={`${labelClass} flex items-center m-0`}>
                          <span>Features</span>
                          <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                            {Array.isArray(product.features)
                              ? product.features.length
                              : "0"}
                          </span>
                        </label>
                      </div>
                      
                      {editMode ? (
                        <div>
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
                          <p className="text-xs text-gray-500 mt-1">Format: [{'{"}name": "Feature name", "value": "Feature value"{'}'}]</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          {product.features && product.features.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {renderFieldValue("features", product.features)}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic text-center py-2">
                              No features listed
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-6 flex flex-wrap justify-end gap-3">
                      {!editMode && (
                        <button
                          onClick={() => navigate('/products')}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition"
                        >
                          Back
                        </button>
                      )}
                      
                      <button
                        onClick={() => setEditMode(!editMode)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition ${
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
                          className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Save Changes
                        </button>
                      )}
                      
                      <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
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