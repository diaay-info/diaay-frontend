import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { categoryName } = useParams(); // Changed from categoryId to categoryName
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/categories`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();
        setCategories(data.categories || data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all ads and filter by category name when categoryName changes
  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/ads`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ads");
        }

        const data = await response.json();
        const allAds = data.ads || data || [];

        // Filter ads by category name if a category is selected
        const filteredAds = categoryName
          ? allAds.filter(
              (ad) =>
                ad.productId?.category?.toLowerCase() ===
                  categoryName.toLowerCase() ||
                ad.category?.toLowerCase() === categoryName.toLowerCase()
            )
          : allAds;

        setAds(filteredAds);
      } catch (error) {
        console.error("Error fetching ads:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-8 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-8 text-center text-red-500">
          Error: {error}
        </div>
        <Footer />
      </div>
    );
  }

  const selectedCategory = categories.find(
    (cat) => cat.name.toLowerCase() === categoryName?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-8 px-4">
        {!categoryName ? (
          // Show all categories
          <div>
            <h1 className="text-2xl font-bold mb-6">All Categories</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name} // Using name as key since no ID
                  to={`/categories/${encodeURIComponent(
                    category.name.toLowerCase()
                  )}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xl">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-800">{category.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          // Show ads for selected category
          <div>
            <div className="flex items-center mb-6">
              <Link
                to="/categories"
                className="mr-4 text-primary hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                
              </Link>
              <h1 className="text-2xl font-bold capitalize text-primary">
                {selectedCategory?.name || categoryName}
              </h1>
            </div>

            {ads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {ads.map((ad) => (
                  <div
                    key={ad._id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/ads/${ad._id}/active`}>
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        {ad.productId?.images?.[0] ? (
                          <img
                            src={ad.productId.images[0]}
                            alt={ad.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">
                          {ad.title}
                        </h3>
                        <p className="text-primary-600 font-bold mb-2">
                          {ad.productId?.price
                            ? `₦${ad.productId.price}`
                            : "Price not available"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {ad.productId?.description?.substring(0, 80) ||
                            "No description available"}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">
                  No ads found in this category
                </p>
                <Link
                  to="/categories"
                  className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-purple-700 transition"
                >
                  Browse All Categories
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
