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
        : [...prevSelected, productId]
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
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        console.error(
          "Authentication token or userId missing. Redirecting to login."
        );
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      try {
        const reportRes = await fetch(
          `https://e-service-v2s8.onrender.com/api/report?vendorId=${userId}`,
          { headers }
        );

        if (!reportRes.ok) throw new Error("Failed to fetch vendor report");

        const reportData = await reportRes.json();

        setVendorData({
          totalProducts: reportData.userTotalProducts || 0,
          activeAds: reportData.userTotalProductsAds || 0,
          impressions: reportData.totalImpressions || 0,
          availableCredits: reportData.creditBalance || 0,
        });

        setProducts(reportData.vendorProducts || []);
      } catch (err) {
        console.error("Error fetching vendor data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen p-2 md:p-4 w-full max-w-full ">
        {/* Analytics Section */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 mb-4">
          <div className="bg-white p-2 md:p-3 rounded-lg shadow-sm text-center">
            <FaBox className="text-purple-500 text-lg md:text-xl mx-auto" />
            <p className="text-sm md:text-base font-bold mt-1">
              {vendorData.totalProducts}
            </p>
            <p className="text-gray-600 text-xs">Total Products</p>
          </div>
          <div className="bg-white p-2 md:p-3 rounded-lg shadow-sm text-center">
            <FaAd className="text-purple-500 text-lg md:text-xl mx-auto" />
            <p className="text-sm md:text-base font-bold mt-1">
              {vendorData.activeAds}
            </p>
            <p className="text-gray-600 text-xs">Active Ads</p>
          </div>
          <div className="bg-white p-2 md:p-3 rounded-lg shadow-sm text-center">
            <FaChartLine className="text-purple-500 text-lg md:text-xl mx-auto" />
            <p className="text-sm md:text-base font-bold mt-1">
              {vendorData.impressions}
            </p>
            <p className="text-gray-600 text-xs">Impressions</p>
          </div>
          <div className="bg-white p-2 md:p-3 rounded-lg shadow-sm text-center">
            <FaCreditCard className="text-purple-500 text-lg md:text-xl mx-auto" />
            <p className="text-sm md:text-base font-bold mt-1">
              {vendorData.availableCredits}
            </p>
            <p className="text-gray-600 text-xs">Credits</p>
          </div>
        </section>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow-sm w-full">
          <div className="p-3 md:p-4 border-b">
            <h2 className="text-base md:text-lg font-semibold">
              Your Products
            </h2>
          </div>

          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-primary text-white text-xs md:text-sm uppercase font-semibold">
                  <tr className="border-b">
                    <th className="border-b p-2 md:p-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="h-4 w-4"
                      />
                    </th>
                    <th className="border-b p-2 md:p-3 text-left">Name</th>
                    <th className="border-b p-2 md:p-3 text-left">Category</th>
                    <th className="border-b p-2 md:p-3 text-left">Price</th>
                    <th className="border-b p-2 md:p-3 text-left">Status</th>
                    <th className="border-b p-2 md:p-3 text-left">
                      Date Added
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-100">
                      <td className="border-b p-2 md:p-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => handleProductSelect(product._id)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className="border-b p-2 md:p-3">{product.name}</td>
                      <td className="border-b p-2 md:p-3">
                        {product.category}
                      </td>
                      <td className="border-b p-2 md:p-3">
                        {product.price} XOF
                      </td>
                      <td className="border-b p-2 md:p-3">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="border-b p-2 md:p-3">
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
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-500 mb-4">No products listed yet</p>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm">
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default VendorDashboard;
