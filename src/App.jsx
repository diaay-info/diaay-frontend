import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import countryList from "react-select-country-list";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import {
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaWhatsapp,
  FaSearch,
} from "react-icons/fa";

const HomePage = () => {
  // Existing state variables
  const [activeIndex, setActiveIndex] = useState(null);
  const [ads, setAds] = useState([]);
  const [featuredAds, setFeaturedAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topAds, setTopAds] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize country list with memoization to prevent unnecessary re-renders
  const countries = useMemo(() => countryList().getData(), []);

  const limit = 12; // Number of ads per page

  // Parse URL params on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || "";
    const country = queryParams.get("country") || "";
    const page = parseInt(queryParams.get("page")) || 1;

    setSearchTerm(search);
    setSelectedCountry(country);
    setCurrentPage(page);
  }, [location.search]);

  // Update URL when filters change
  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (searchTerm) queryParams.set("search", searchTerm);
    if (selectedCountry) queryParams.set("country", selectedCountry);
    if (currentPage > 1) queryParams.set("page", currentPage.toString());

    const newUrl = queryParams.toString()
      ? `${location.pathname}?${queryParams.toString()}`
      : location.pathname;

    navigate(newUrl, { replace: true });
  }, [searchTerm, selectedCountry, currentPage, navigate, location.pathname]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();

        if (response.ok) {
          // Make sure to check the structure of your API response
          // and extract the categories properly
          if (data.categories && Array.isArray(data.categories)) {
            setCategories(data.categories);
          } else if (Array.isArray(data)) {
            setCategories(data);
          } else {
            console.error("Unexpected categories data format:", data);
            setCategories([]);
          }
        } else {
          console.error("Error fetching categories:", data);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]);

  // Fetch Top Ads from API
  useEffect(() => {
    const fetchTopAds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/top-ads`);
        const data = await response.json();

        if (response.ok) {
          // Filter only active top ads
          const activeTopAds = Array.isArray(data)
            ? data.filter((ad) => ad.status === "active")
            : [];
          setTopAds(activeTopAds);
        } else {
          console.error("Error fetching top ads:", data);
        }
      } catch (error) {
        console.error("Error fetching top ads:", error);
      }
    };

    fetchTopAds();
  }, []);

  // Fetch All Ads from API
  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        // Build query params for filtering
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("limit", limit.toString());
        if (searchTerm) params.append("search", searchTerm);
        if (selectedCountry) params.append("country", selectedCountry);

        const url = `${API_BASE_URL}/api/ads?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
          // Handle different response formats
          let adsArray = [];

          // Check if data has an ads property (based on the API response you shared)
          if (data.ads && Array.isArray(data.ads)) {
            adsArray = data.ads;
          } else if (Array.isArray(data)) {
            adsArray = data;
          }

          // Filter active ads
          const activeAds = adsArray.filter(
            (ad) => ad.status === "active" || !ad.status
          );

          // Filter ads by country if a country is selected
          const countryFilteredAds = selectedCountry
            ? activeAds.filter((ad) => {
                const adCountry = ad.product?.country || "";
                return (
                  adCountry.toLowerCase() === selectedCountry.toLowerCase()
                );
              })
            : activeAds;

          setAds(activeAds);
          setFilteredAds(countryFilteredAds);

          // Limit featured ads to 100 as requested
          const limitedAds = countryFilteredAds.slice(0, 100);
          setFeaturedAds(limitedAds);

          // Calculate total pages based on API response or total active ads
          const totalItems = data.total || activeAds.length;
          setTotalPages(Math.ceil(totalItems / limit) || 1);
        } else {
          console.error("Error fetching ads:", data);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [searchTerm, selectedCountry, currentPage]);

  // Toggle favorite status
  const toggleFavorite = (ad) => {
    setFavorites((prev) =>
      prev.some((fav) => fav._id === ad._id)
        ? prev.filter((fav) => fav._id !== ad._id)
        : [...prev, ad]
    );
  };

  // Handle country selection for the react-select component
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption ? selectedOption.label : "");
    setCurrentPage(1); // Reset to first page when changing country
  };

  // Custom styling for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9333ea",
      },
      borderRadius: "0.5rem",
      padding: "1px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#9333ea"
        : state.isFocused
        ? "#f3e8ff"
        : null,
      color: state.isSelected ? "white" : "#4b5563",
    }),
  };

  const handleCategorySelect = (categoryName) => {
    // Navigate to the category page with proper URL encoding
    const encodedCategory = encodeURIComponent(categoryName);
    navigate(`/categories/${encodedCategory}`);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination
  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === topAds.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? topAds.length - 1 : prev - 1));
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "Diaay is a digital marketplace designed to connect buyers with independent vendors and empower partners to refer customers.",
    },
    {
      question: "How can I post an ad?",
      answer:
        "To become a vendor, sign up for an account, complete the verification process, and start listing your items on our platform.",
    },
    {
      question: "How do I purchase credits?",
      answer:
        "Yes! We prioritize security and provide measures like vendor verification to ensure safe transactions.",
    },
    {
      question: "How do I earn as a partner?",
      answer:
        "You can contact our customer support team via the 'Contact Us' page or by emailing info@diaay.com.",
    },
    {
      question: "How long do ads stay active?",
      answer:
        "You can contact our customer support team via the 'Contact Us' page or by emailing info@diaay.com.",
    },
  ];

  const handleWhatsAppRedirect = (e, ad) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the phone number from the correct location in the data structure
    const phoneNumber = ad.user?.phoneNumber || "";

    // Construct the WhatsApp URL with pre-written message
    const productUrl = `${window.location.origin}/ads/${ad._id}/active`;
    const message = encodeURIComponent(
      `Hello, I'm interested in getting this product: ${
        ad.product?.name || "your product"
      }\n${productUrl}`
    );

    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // Helper function to get values from the nested structure
  const getAdImage = (ad) => {
    if (ad.product?.images && ad.product.images.length > 0) {
      return ad.product.images[0];
    }
    return "/placeholder-product.jpg";
  };

  const getAdTitle = (ad) => {
    return ad.product?.name || ad.title || "No title";
  };

  const getAdPrice = (ad) => {
    return ad.product?.price || 0;
  };

  const getAdLocation = (ad) => {
    const country = ad.product?.country || "";
    const state = ad.product?.state || "";
    return { country, state };
  };

  return (
    <div className="bg-gray-50 font-montserrat">
      <Header favorites={favorites} />

      {/* Layout with Sidebar & Main Content */}
      <section className="flex flex-col md:flex-row max-w-7xl mx-auto">
        {/* Sidebar Categories (Hidden on small screens) */}
        <aside className="hidden md:block w-1/5 p-4 bg-gray-100 shadow-sm rounded-lg my-4 ml-4">
          <h2 className="font-bold text-lg mb-4 text-gray-800 border-b pb-2">
            Categories
          </h2>
          {loadingCategories ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="h-6 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              {categories.map((category, idx) => (
                <li
                  key={idx}
                  className={`px-3 py-2 rounded-md transition-all duration-200 hover:bg-gray-100 cursor-pointer ${
                    selectedCategory === category.name
                      ? "bg-purple-100 text-purple-700 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  {category.name}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-4/5 p-4">
          {/* Search and Filter Section */}
          <section className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-3"
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>

              <div className="relative w-full md:w-64">
                <Select
                  options={countries}
                  value={
                    selectedCountry
                      ? countries.find(
                          (country) => country.label === selectedCountry
                        )
                      : null
                  }
                  onChange={handleCountryChange}
                  styles={customStyles}
                  placeholder="Select a country"
                  isClearable
                  formatOptionLabel={(country) => (
                    <div className="flex items-center">
                      <span className="mr-2">{country.value}</span>
                      <span>{country.label}</span>
                    </div>
                  )}
                  className="country-select"
                />
              </div>

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Search
              </button>
            </form>
          </section>

          {/* Featured Ads Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Featured Ads
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 rounded-lg overflow-hidden animate-pulse"
                  >
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredAds.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredAds.map((ad) => (
                    <Link
                      key={ad._id}
                      to={`/ads/${ad._id}/active`}
                      className="bg-white rounded-lg shadow-md overflow-hidden relative border border-gray-200 hover:shadow-lg transition-shadow duration-200 h-80 flex flex-col"
                    >
                      <button
                        className="absolute top-2 right-2 z-10 text-red-500 text-xl bg-white bg-opacity-70 rounded-full p-1.5"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(ad);
                        }}
                      >
                        {favorites.some((fav) => fav._id === ad._id) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>

                      <div className="h-40 overflow-hidden">
                        <img
                          src={getAdImage(ad)}
                          alt={getAdTitle(ad)}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder-product.jpg";
                          }}
                        />
                      </div>

                      <div className="p-3 flex-grow flex flex-col">
                        <div className="mb-1">
                          <span className="text-xs text-gray-500">
                            {formatDate(ad.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium line-clamp-2 mb-1 h-10">
                          {getAdTitle(ad)}
                        </h3>
                        <p className="text-purple-600 font-bold mt-auto">
                          XOF{" "}
                          {getAdPrice(ad)?.toLocaleString() ||
                            "Price on request"}
                        </p>
                        <hr className="my-2" />

                        <div className="flex justify-between items-center">
                          <p className="flex items-center text-xs text-gray-600 truncate max-w-[70%]">
                            <CiLocationOn className="mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {getAdLocation(ad).country},{" "}
                              {getAdLocation(ad).state}
                            </span>
                          </p>
                          <button
                            className="text-green-500 text-xl hover:text-green-600 flex-shrink-0"
                            onClick={(e) => handleWhatsAppRedirect(e, ad)}
                          >
                            <FaWhatsapp />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-purple-100"
                        }`}
                      >
                        <FaChevronLeft size={14} />
                      </button>

                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNumber = idx + 1;
                        // Show limited page numbers with ellipsis
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={idx}
                              onClick={() => goToPage(pageNumber)}
                              className={`px-3 py-1 rounded-md ${
                                currentPage === pageNumber
                                  ? "bg-purple-600 text-white"
                                  : "text-gray-700 hover:bg-purple-100"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return <span key={idx}>...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-purple-100"
                        }`}
                      >
                        <FaChevronRight size={14} />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No products found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                    setSelectedCountry("");
                  }}
                  className="mt-4 text-purple-600 hover:text-purple-800"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>

          {/* Categories Section - Mobile Only */}
          <section className="bg-white p-4 md:hidden rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              Categories
            </h2>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-2 text-center border hover:border-purple-400 transition-all duration-200 cursor-pointer ${
                    selectedCategory === category.name
                      ? "border-purple-500 shadow-md"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <img
                    src={category.image || "/placeholder-category.jpg"}
                    alt={category.name}
                    className="h-12 w-12 mx-auto object-contain mb-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-category.jpg";
                    }}
                  />
                  <h3 className="font-medium text-xs text-gray-800 truncate">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>

          {/* Top adverts */}
          <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Top Adverts
              </h2>
              <button className="px-4 py-1.5 border border-purple-600 text-purple-600 text-sm rounded-full hover:bg-purple-50 transition-colors duration-200">
                View All
              </button>
            </div>

            {topAds.length > 0 ? (
              <div className="relative group">
                {/* Carousel */}
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {topAds.map((ad) => (
                      <div key={ad._id} className="w-full flex-shrink-0">
                        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg p-4">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="max-h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-ad.jpg"; // Fallback image
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows - Only show on hover */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <FaChevronLeft className="text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <FaChevronRight className="text-gray-700" />
                </button>

                {/* Indicators */}
                <div className="flex justify-center mt-4 space-x-2">
                  {topAds.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        currentSlide === index
                          ? "bg-purple-600 w-4"
                          : "bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500">No active top adverts available</p>
              </div>
            )}
          </section>

          {/* FAQ Section */}
          <section className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800">
              FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden shadow-sm"
                >
                  <div
                    className={`flex justify-between items-center p-4 cursor-pointer ${
                      activeIndex === index
                        ? "bg-purple-600 text-white"
                        : "bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3 className="font-medium">{faq.question}</h3>
                    {activeIndex === index ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {activeIndex === index && (
                    <div className="p-4 border-t bg-white text-gray-700">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Become a Vendor Section */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Start Selling Today
              </h2>
              <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
                Discover how our features can help you advertise and start
                earning with referrals.
              </p>
              <Link to="/start">
                <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-purple-700 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-md cursor-pointer">
                  <p className="font-medium">Start Now</p>
                  <div className="bg-purple-600 text-white rounded-full p-1.5">
                    <FaLongArrowAltRight />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
