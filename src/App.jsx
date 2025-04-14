import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FaWhatsapp ,
} from "react-icons/fa";

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [ads, setAds] = useState([]);
  const [featuredAds, setFeaturedAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [topAds, setTopAds] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const categories = [
    { name: "Vehicles", image: "/categories/car.png" },
    { name: "House", image: "/categories/house.png" },
    { name: "Fashion", image: "/categories/beauty.png" },
    { name: "Food", image: "/categories/food.png" },
    { name: "Health & Beauty", image: "/categories/food.png" },
    { name: "Electronics", image: "/categories/phone.png" },
    { name: "Services", image: "/categories/services.png" },
    { name: "Sports", image: "/categories/leisure.png" },
    { name: "Jobs", image: "/categories/hire.png" },
    { name: "Other", image: "/categories/hire.png" },
  ];

  // Fetch Categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();

        if (response.ok) {
          setCategories(data.categories || []);
        } else {
          console.error("Error fetching categories:", data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Fetch Regular Ads from API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads`);
        const data = await response.json();

        if (response.ok) {
          const adsArray = Array.isArray(data) ? data : data.ads || [];
          const activeAds = adsArray.filter((ad) => ad.status === "active");
          setAds(activeAds);
          setFilteredAds(activeAds); // Initialize filtered ads with all active ads
          setFeaturedAds(getRandomAds(activeAds));
        } else {
          console.error("Error fetching ads:", data);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  // Filter ads when category is selected
  useEffect(() => {
    if (selectedCategory) {
      const filtered = ads.filter(
        (ad) =>
          ad.productId?.category?.toLowerCase() ===
            selectedCategory.toLowerCase() ||
          ad.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredAds(filtered);
      setFeaturedAds(getRandomAds(filtered));
    } else {
      setFilteredAds(ads);
      setFeaturedAds(getRandomAds(ads));
    }
  }, [selectedCategory, ads]);

  // Function to get random ads
  const getRandomAds = (ads, count = 4) => {
    const shuffled = [...ads].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Toggle favorite status
  const toggleFavorite = (ad) => {
    setFavorites((prev) =>
      prev.some((fav) => fav._id === ad._id)
        ? prev.filter((fav) => fav._id !== ad._id)
        : [...prev, ad]
    );
  };

  // Handle category selection
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(
      categoryName === selectedCategory ? null : categoryName
    );
    navigate(`/categories/${encodeURIComponent(categoryName.toLowerCase())}`);
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
    
    // Construct the WhatsApp URL with pre-written message
    const productUrl = `${window.location.origin}/ads/${ad._id}/active`;
    const message = encodeURIComponent(`Hello, I'm interested in getting this product: ${ad.title}\n${productUrl}`);

    const phoneNumber = ad.productId.vendorPhone || ad.vendorPhone || "";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  return (
    <div className="bg-background font-montserrat">
      <Header favorites={favorites} />

      {/* Layout with Sidebar & Main Content */}
      <section className="flex flex-col md:flex-row">
        {/* Sidebar Categories (Hidden on small screens) */}
        <aside className="hidden md:block w-1/5 p-4 border border-r">
          <h2 className="font-bold mb-4">Categories</h2>
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
            <ul className="space-y-6 text-sm">
              {categories.map((category) => (
                <li
                  key={category._id}
                  className={`hover:underline cursor-pointer ${
                    selectedCategory === category.name
                      ? "text-primary font-bold"
                      : "text-gray-600"
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
          {/* Featured Ads Section */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Featured Ads</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredAds.length > 0 ? (
                featuredAds.map((ad) => (
                  <Link
                    key={ad._id}
                    to={`/ads/${ad._id}/active`}
                    className="bg-white rounded-lg shadow-md overflow-hidden relative"
                  >
                    <button
                      className="absolute top-2 right-2 text-red-500 text-xl"
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

                    <img
                      src={ad.productId.images[0]}
                      alt={ad.title}
                      className="w-full h-40 object-contain"
                    />
                    <div className="p-4">
                      <h3 className="lg:text-[0.7rem] text-[0.9rem] font-semibold">
                        {ad.title}
                      </h3>
                      <p className="text-primary font-bold">
                        XOF {ad.productId.price}
                      </p>
                      <hr />

                      <div className="flex justify-between items-center mt-2">
                        <p className="flex items-center text-sm text-gray-600">
                          <CiLocationOn /> {ad.productId.country},{" "}
                          {ad.productId.state}
                        </p>
                        <button
                          className="text-green-500 text-xl hover:text-green-600"
                          onClick={(e) => handleWhatsAppRedirect(e, ad)}
                        >
                          <FaWhatsapp />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>Loading ads...</p>
              )}
            </div>
          </section>

          {/* Categories Section */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <hr />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-5">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-4 text-center shadow-md cursor-pointer ${
                    selectedCategory === category.name
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="mx-auto mb-3 object-contain"
                  />
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-8 p-2">
            <h2 className="text-2xl font-semibold mb-4 border-b">FAQs</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border rounded-lg ${
                    activeIndex === index
                      ? "bg-purple-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer"
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
                    <div className="p-4 border-t">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          {/* Top adverts */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Top Adverts</h2>
              <button className="px-3 py-1 border border-gray-700 text-xs rounded-full hover:bg-gray-200">
                View All
              </button>
            </div>

            {topAds.length > 0 ? (
              <div className="relative group">
                {/* Carousel */}
                <div className="overflow-hidden rounded-xl ">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {topAds.map((ad) => (
                      <div key={ad._id} className="w-full flex-shrink-0">
                        <div className=" h-96 flex items-center justify-center">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className=" object-fit p-4"
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-3 rounded-full shadow-md hover:bg-opacity-100 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                >
                  <FaChevronLeft className="text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-3 rounded-full shadow-md hover:bg-opacity-100 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
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
                          ? "bg-primary w-4"
                          : "bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p>No active top adverts available</p>
              </div>
            )}
          </section>

          {/* Become a Vendor Section */}
          <div className="flex justify-center items-center text-center">
            <div className="bg-black rounded-md text-white p-6 md:p-8 max-w-lg">
              <p className="font-medium text-lg md:text-xl mb-6">
                Discover how our features can help you advertise and start
                earning with referrals.
              </p>
              <Link to="/start">
                <div className="flex w-[15rem] mx-auto items-center justify-center gap-4 p-3 rounded-3xl bg-primary cursor-pointer">
                  <p className="font-medium">Start Now</p>
                  <div className="bg-white text-primary rounded-full p-2">
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
