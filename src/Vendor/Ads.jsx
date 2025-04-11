import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import SelectProductForAd from "./SelectProductForAd";

const Ads = () => {
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories || []);
        } else {
          throw new Error(data.message || "Failed to fetch categories");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Ads
  useEffect(() => {
    const fetchAds = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads/my-ads`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setAds(data.ads || []);
        } else {
          throw new Error(data.message || "Failed to fetch ads");
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
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

  // Handle checkbox selection
  const handleCheckboxChange = (adId) => {
    setSelectedAds((prev) =>
      prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAds([]);
    } else {
      setSelectedAds(filteredAds.map((ad) => ad._id));
    }
    setSelectAll(!selectAll);
  };

  // Renew selected ads
  const renewSelectedAds = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      for (const adId of selectedAds) {
        const response = await fetch(`${API_BASE_URL}/api/ads/${adId}/renew`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to renew ad");
        }
      }
      // Refresh ads after renewal
      const response = await fetch(`${API_BASE_URL}/api/ads/my-ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAds(data.ads || []);
      setSelectedAds([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Error renewing ads:", err);
      setError(err.message);
    }
  };

  // Count ads per category
  const categoryCounts = ads.reduce((acc, ad) => {
    const cat = ad.productId?.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const allCategoriesCount = ads.length;

  // Filtered Ads
  const filteredAds = ads
    .filter((ad) =>
      category === "All" ? true : ad.productId?.category === category
    )
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

  // Check if any selected ad is expired
  const hasExpiredSelected = selectedAds.some((adId) => {
    const ad = ads.find((a) => a._id === adId);
    return ad && isAdExpired(ad);
  });

  return (
    <Layout>
      <div className="flex min-h-screen sm:p-2">
        <main className="flex-1">
          {isAddingAd ? (
            <SelectProductForAd setIsAddingAd={setIsAddingAd} />
          ) : (
            <div>
              {/* First Filter Section */}
              <div className="flex flex- space-x-4 sm:flex-row sm:justify-between text-sm bg-white p-4 rounded-lg shadow-sm space-y-2 sm:space-y-0">
                <input
                  type="text"
                  placeholder="Search ads..."
                  className="border border-gray-300 rounded-lg p-2 flex-grow min-w-[150px]"
                />
                {/* Category Filter */}
                <select
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="All">
                    All Categories ({allCategoriesCount})
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name} ({categoryCounts[cat.name] || 0})
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto"
                  onChange={(e) => setStatus(e.target.value)}
                  value={status}
                >
                  <option value="All">Show: All Ads</option>
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                </select>

                <button
                  onClick={() => setIsAddingAd(true)}
                  className="py-2 px-4 bg-purple-500 text-white rounded-lg w-full sm:w-auto"
                >
                  + Add Ad
                </button>
              </div>

              {/* Second Filter Section */}
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between text-sm bg-white p-4 rounded-lg shadow-sm space-y-2 sm:space-y-0">
                {hasExpiredSelected && (
                  <button
                    onClick={renewSelectedAds}
                    className="py-2 px-4 bg-red-500 text-white rounded-lg w-full sm:w-auto"
                  >
                    Renew Selected Ads
                  </button>
                )}
              </div>

              {/* Ads List */}
              <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto max-w-full">
                <div className="relative max-h-screen overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-base overflow-x-auto">
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
                          const expired = isAdExpired(ad);
                          const statusColor = expired
                            ? "text-red-500"
                            : "text-green-600";

                          return (
                            <tr key={ad._id} className="border-t">
                              <td className="p-2 border-b">
                                <input
                                  type="checkbox"
                                  checked={selectedAds.includes(ad._id)}
                                  onChange={() => handleCheckboxChange(ad._id)}
                                />
                              </td>
                              <td className="p-2 border-b">{ad.title}</td>
                              <td className="p-2 border-b">
                                {ad.productId?.category || "Uncategorized"}
                              </td>
                              <td className="p-2 border-b text-[#7C0DEA]">
                                {ad.productId?.price || "N/A"} XOF
                              </td>
                              <td className={`p-2 border-b ${statusColor}`}>
                                {expired ? "Expired" : "Active"}
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
