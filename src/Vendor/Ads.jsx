import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import SelectProductForAd from "./SelectProductForAd";

const Ads = () => {
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [ads, setAds] = useState([]); // Store ads
  const [loading, setLoading] = useState(true);
  const [selectedAds, setSelectedAds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Filters
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [priceSort, setPriceSort] = useState("default");

 
 

  const handleAddProductToggle = () => {
    setIsAddProduct(!isAddProduct);
  };

  // Fetch Ads
  useEffect(() => {
    const fetchAds = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/ads/my-ads`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        console.log("Fetched ads data:", data); // Log the fetched data

        if (response.ok) {
          setAds(data.ads || []);
        } else {
          throw new Error(data.message || "Failed to fetch ads");
        }
      } catch (err) {
        console.error("Error fetching ads:", err); // Log any error
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Function to check if an ad is expired
  const isAdExpired = (ad) => {
    const today = new Date();
    return new Date(ad.expiryDate) < today;
  };

  // Count ads per category
  const categoryCounts = ads.reduce((acc, ad) => {
    acc[ad.category] = (acc[ad.category] || 0) + 1;
    return acc;
  }, {});

  const allCategoriesCount = ads.length;

  // Filtered Ads
  const filteredAds = ads
    .filter((ad) => (category === "All" ? true : ad.category === category))
    .filter((ad) =>
      status === "All"
        ? true
        : status === "Active"
        ? !isAdExpired(ad)
        : isAdExpired(ad)
    )
    .sort((a, b) =>
      priceSort === "low"
        ? a.price - b.price
        : priceSort === "high"
        ? b.price - a.price
        : 0
    );

  return (
    <Layout>
      <div className="flex min-h-screen sm:p-2">
        {/* Main Content */}
        <main className="flex-1">
          {isAddingAd ? (
            <SelectProductForAd setIsAddingAd={setIsAddingAd} />
          ) : (
            <div>
              {/* First Filter Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm bg-white p-4 rounded-lg shadow-sm space-y-2 sm:space-y-0">
                <input
                  type="text"
                  placeholder="Search ads..."
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                />
                <select
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto"
                  onChange={(e) => setPriceSort(e.target.value)}
                >
                  <option value="default">Sort by: Default</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
                <select
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="All">Show: All Ads</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>
                <button className="py-2 px-4 border border-gray-300 rounded-lg w-full sm:w-auto">
                  Filter
                </button>
                <button
                  onClick={() => setIsAddingAd(true)}
                  className="py-2 px-4 bg-purple-500 text-white rounded-lg w-full sm:w-auto"
                >
                  + Add Ad
                </button>
              </div>

              {/* Second Filter Section */}
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-sm bg-white p-4 rounded-lg shadow-sm space-y-2 sm:space-y-0">
                {/* Category Filter */}
                <select
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="All">
                    All Categories ({allCategoriesCount})
                  </option>
                  {Object.entries(categoryCounts).map(([cat, count]) => (
                    <option key={cat} value={cat}>
                      {cat} ({count})
                    </option>
                  ))}
                </select>

                {/* Ad Status Filter */}
                <select
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option value="All">All Ads</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>

                {/* Price Filter */}
                <select
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto"
                  onChange={(e) => setPriceSort(e.target.value)}
                  value={priceSort}
                >
                  <option value="default">Price</option>
                  <option value="low"> Low to High</option>
                  <option value="high"> High to Low</option>
                </select>

                {selectedAds.some((adId) =>
                  isAdExpired(ads.find((ad) => ad._id === adId))
                ) && (
                  <button className="py-2 px-4 bg-red-500 text-white rounded-lg w-full sm:w-auto">
                    Renew Ad
                  </button>
                )}
              </div>

              {/* Ads List */}
              <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto max-w-full">
                {/* Fixed Container for the Table */}
                <div className="relative max-h-screen overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-base overflow-x-auto">
                    <thead>
                      <tr className="text-left font-medium">
                        
                        <th className="p-2 border-b">Product Name</th>
                        <th className="p-2 border-b">Category</th>
                        <th className="p-2 border-b">Price</th>
                        <th className="p-2 border-b">Ads Status</th>
                        <th className="p-2 border-b">Date Added</th>
                        <th className="p-2 border-b">Expiry Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAds.length > 0 ? (
                        filteredAds.map((ad) => {
                          const expiryDate = new Date(
                            ad.expiresAt
                          ).toLocaleDateString();
                          const createdDate = new Date(
                            ad.createdAt
                          ).toLocaleDateString();

                          // Determine status color
                          let statusColor = "text-gray-600"; // Default color
                          if (ad.status === "active")
                            statusColor = "text-green-600";
                          else if (ad.status === "expired")
                            statusColor = "text-red-500";
                          else if (ad.status === "pending")
                            statusColor = "text-yellow-500";

                          return (
                            <tr key={ad._id} className="border-t">
                              
                              <td className="p-2 border-b">{ad.title}</td>
                              <td className="p-2 border-b">{ad.productId.category}</td>
                              <td className="p-2 border-b text-[#7C0DEA]">
                                {ad.price} XOF
                              </td>
                              <td className={`p-2 border-b ${statusColor}`}>
                                {ad.status.charAt(0).toUpperCase() +
                                  ad.status.slice(1)}
                              </td>
                              <td className="p-2 border-b">{createdDate}</td>
                              <td className="p-2 border-b">{expiryDate}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center p-4">
                            No products advertised available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Ads;
