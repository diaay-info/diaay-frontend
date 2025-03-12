import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const SelectProductForAd = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/products"
        );
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
      <div className="p-4">
        <h1 className="text-2xl font-semibold mb-4">
          Select a Product for Advertisement
        </h1>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/create-ad/${product._id}`)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h2 className="mt-2 font-semibold">{product.name}</h2>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-purple-600 font-semibold">
                  {product.price} CFA
                </p>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
  );
};

export default SelectProductForAd;
