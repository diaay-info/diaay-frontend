import React, { useState, useEffect } from "react";
import { FaBox, FaAd, FaChartLine, FaCreditCard } from "react-icons/fa";
import Layout from "./Layout";

function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [vendorData, setVendorData] = useState({
    totalProducts: 0,
    activeAds: 0,
    impressions: 0,
    availableCredits: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleProductSelect = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product._id));
    }
    setSelectAll(!selectAll);
  };

  const handleProductAdded = (newProduct) => {
    if (!newProduct) return;

    setProducts((prevProducts) => [
      ...prevProducts,
      {
        ...newProduct,
        dateAdded: new Date().toLocaleDateString(),
      },
    ]);
  };

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
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken"); // Retrieve token
  
      if (!token) {
        console.error("No authentication token found. Redirecting to login.");
        return; // Optionally redirect to login page
      }
  
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
  
      try {
        // Fetch Products
        const productsRes = await fetch("https://e-service-v2s8.onrender.com/api/products", { headers });
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        const productsData = await productsRes.json();
  
        // Fetch Active Ads
        const adsRes = await fetch("https://e-service-v2s8.onrender.com/api/ads", { headers });
        if (!adsRes.ok) throw new Error("Failed to fetch active ads");
        const adsData = await adsRes.json();
  
        // Fetch Available Credits
        const creditsRes = await fetch("https://e-service-v2s8.onrender.com/api/credits/balance", { headers });
        if (!creditsRes.ok) throw new Error("Failed to fetch available credits");
        const creditsData = await creditsRes.json();
  
        // Update vendor data
        setVendorData({
          totalProducts: productsData.total || 0,
          activeAds: adsData.totalActive || 0,
          impressions: 0, // If there's an endpoint for impressions, fetch it
          availableCredits: creditsData.balance || 0,
        });
  
      } catch (err) {
        console.error("Error fetching vendor data:", err);
        if (err.message.includes("401") || err.message.includes("403")) {
          // Handle unauthorized access (redirect to login, show error message, etc.)
          console.warn("Unauthorized access. Redirecting to login...");
        }
      }
    };
  
    fetchData();
  }, []);
  
  return (
    <Layout>
      <div className="flex flex-col min-h-screen p-2">
        {/* Analytics Section */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <FaBox className="text-purple-500 text-2xl mx-auto" />
            <p className="text-lg font-bold">{vendorData.totalProducts}</p>
            <p className="text-gray-600 text-sm">Total Products</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <FaAd className="text-purple-500 text-2xl mx-auto" />
            <p className="text-lg font-bold">{vendorData.activeAds}</p>
            <p className="text-gray-600 text-sm">Total Active Ads</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <FaChartLine className="text-purple-500 text-2xl mx-auto" />
            <p className="text-lg font-bold">{vendorData.impressions}</p>
            <p className="text-gray-600 text-sm">Impressions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <FaCreditCard className="text-purple-500 text-2xl mx-auto" />
            <p className="text-lg font-bold">{vendorData.availableCredits}</p>
            <p className="text-gray-600 text-sm">Available Credits</p>
          </div>
        </section>

        {/* Product List */}
        {products.length > 0 ? (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                <tr className="text-left font-medium">
                  <th className="p-2 border-b">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-2 border-b">Product Name</th>
                  <th className="p-2 border-b">Category</th>
                  <th className="p-2 border-b">Price</th>
                  <th className="p-2 border-b">Ads Status</th>
                  <th className="p-2 border-b">Date Added</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t">
                    <td className="p-2 border-b">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelect(product._id)}
                      />
                    </td>
                    <td className="p-2 border-b">{product.name}</td>
                    <td className="p-2 border-b">{product.category}</td>
                    <td className="p-2 border-b text-[#7C0DEA]">
                      {product.price} CFA
                    </td>
                    <td className="p-2 border-b text-green-600">Active</td>
                    <td className="p-2 border-b">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg mt-4">
            <p className="text-gray-500">No products listed yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default VendorDashboard;
