import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaArrowLeft, FaSearch, FaHeart, FaRegHeart } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categories, setCategories] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const limit = 12;

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    handleSearch(value);
  };

  // Prevent form submission
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
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
  }, [API_BASE_URL]);

  // Fetch ads by category when one is selected
  useEffect(() => {
    if (!categoryName) return;

    const fetchCategoryAds = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: currentPage,
          limit: limit,
          category: decodeURIComponent(categoryName),
          ...(searchTerm && { search: searchTerm }),
        });

        const response = await fetch(
          `${API_BASE_URL}/api/ads?${params.toString()}`
        );

        if (!response.ok) throw new Error("Failed to fetch ads");

        const data = await response.json();
        setAds(data.ads || data || []);
        setTotalPages(Math.ceil((data.total || data.length) / limit));
      } catch (error) {
        console.error("Error fetching ads:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAds();
  }, [categoryName, currentPage, searchTerm, API_BASE_URL]);

  const toggleFavorite = (ad) => {
    setFavorites((prev) =>
      prev.some((fav) => fav._id === ad._id)
        ? prev.filter((fav) => fav._id !== ad._id)
        : [...prev, ad]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getAdImage = (ad) => {
    return ad.product?.images?.[0] || "/placeholder-product.jpg";
  };

  const getAdTitle = (ad) => {
    return ad.product?.name || ad.title || "No title";
  };

  const getAdPrice = (ad) => {
    return ad.product?.price || 0;
  };

  const getAdLocation = (ad) => {
    return {
      country: ad.product?.country || "",
      state: ad.product?.state || "",
    };
  };

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

  // Show all categories if none is selected
  if (!categoryName) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Browse Categories
          </h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id || category.name}
                to={`/categories/${encodeURIComponent(category.name)}`}
                className="group bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-category.jpg";
                      }}
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl font-bold">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                {/* <p className="text-xs text-gray-500 mt-1">
                  {category.count || 0} items
                </p> */}
              </Link>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Show ads for selected category
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 text-primary hover:underline flex items-center"
          >
            <FaArrowLeft className="mr-2" />
            All Categories
          </button>
          <h1 className="text-2xl font-bold capitalize text-gray-800">
            {decodeURIComponent(categoryName)}
          </h1>
        </div>

        {/* Search input without form */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder={`Search in ${decodeURIComponent(categoryName)}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {ads.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <Link to={`/ads/${ad._id}/active`} className="block">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={getAdImage(ad)}
                          alt={getAdTitle(ad)}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <button
                      className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(ad);
                      }}
                    >
                      {favorites.some((fav) => fav._id === ad._id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-1">
                      <span className="text-xs text-gray-500">
                        {formatDate(ad.createdAt)}
                      </span>
                    </div>
                    <Link to={`/ads/${ad._id}/active`}>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {getAdTitle(ad)}
                      </h3>
                    </Link>
                    <p className="text-primary-600 font-bold mb-3">
                      XOF{" "}
                      {getAdPrice(ad)?.toLocaleString() || "Price on request"}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-600">
                        <CiLocationOn className="mr-1" />
                        <span className="truncate max-w-[100px]">
                          {getAdLocation(ad).country}, {getAdLocation(ad).state}
                        </span>
                      </div>
                      <button
                        className="text-green-500 hover:text-green-600 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          const phoneNumber = ad.user?.phoneNumber || "";
                          const message = encodeURIComponent(
                            `Hello, I'm interested in ${getAdTitle(ad)}`
                          );
                          window.open(
                            `https://wa.me/${phoneNumber}?text=${message}`,
                            "_blank"
                          );
                        }}
                      >
                        <FaWhatsapp size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    Previous
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-md ${
                          currentPage === pageNum
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-purple-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-purple-100"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
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
              No ads found in {decodeURIComponent(categoryName)}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 transition"
            >
              Back to Categories
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;
