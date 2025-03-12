import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "./Layout";

const CreateAd = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [credits, setCredits] = useState(10);
  const [selectedDuration, setSelectedDuration] = useState(7);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, success: false, message: "" });

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      navigate("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://e-service-v2s8.onrender.com/api/products/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setProduct(data);
        } else {
          throw new Error(data.message || "Failed to fetch product details");
        }
      } catch (err) {
        console.error("Fetch error:", err.message);
      }
    };

    fetchProduct();
  }, [productId, token, navigate]);

  const handleCreateAd = async () => {
    if (!product) return;

    const adCost = selectedDuration === 7 ? 1 : selectedDuration === 14 ? 2 : 3;
    if (credits < adCost) {
      setModal({ show: true, success: false, message: "Insufficient credits!" });
      return;
    }

    setIsLoading(true); // Start loader

    const adData = { productId, duration: selectedDuration, cost: adCost, title: product.name };

    try {
      const response = await fetch("https://e-service-v2s8.onrender.com/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(adData),
      });

      const result = await response.json();

      if (response.ok) {
        setModal({ show: true, success: true, message: "Ad created successfully!" });
      } else {
        throw new Error(result.message || "Failed to create ad.");
      }
    } catch (err) {
      setModal({ show: true, success: false, message: err.message });
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  if (!isAuthenticated) return null;

  if (!product)
    return (
      <Layout>
        <p className="text-center text-lg mt-10">Loading...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-2 py-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-semibold">Create Advertisement</h1>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/products")}
              className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAd}
              className={`ml-3 px-5 py-2 rounded-lg transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Ad"}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {/* Product Details */}
          <div className="bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
            <div className="flex items-start gap-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-36 h-36 object-cover rounded-lg"
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div className="text-lg">
                <p>
                  <strong>Title:</strong> {product.name}
                </p>
                <p>
                  <strong>Description:</strong> {product.description}
                </p>
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                <p>
                  <strong>Price:</strong> {product.price} CFA
                </p>
                <p>
                  <strong>Location:</strong> {product.location}
                </p>
              </div>
            </div>

            {/* Ad Duration Selection */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Select Ad Duration</h2>
              <div className="space-y-3 text-lg">
                {[7, 14, 30].map((days) => (
                  <label key={days} className="block cursor-pointer">
                    <input
                      type="radio"
                      value={days}
                      checked={selectedDuration === days}
                      onChange={() => setSelectedDuration(days)}
                      className="mr-2"
                    />
                    {days} days - {days === 7 ? 1 : days === 14 ? 2 : 3} credits
                  </label>
                ))}
              </div>
              <p className="mt-3 text-lg font-medium">
                <strong>Your Available Credits:</strong> {credits}
              </p>
            </div>
          </div>

          {/* Ad Summary */}
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold mb-4">Ad Summary</h2>
            <p className="text-lg">
              <strong>Selected Duration:</strong> {selectedDuration} days
            </p>
            <p className="text-lg">
              <strong>Total Credits Required:</strong>{" "}
              {selectedDuration === 7 ? 1 : selectedDuration === 14 ? 2 : 3}
            </p>
            <p className="text-lg">
              <strong>Current Credit Available:</strong> {credits}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <p
              className={`text-xl font-semibold ${
                modal.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {modal.message}
            </p>
            <button
              className="mt-4 px-6 py-2 bg-gray-600 text-white rounded-lg"
              onClick={() => setModal({ show: false })}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CreateAd;
