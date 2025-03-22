import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaLongArrowAltRight } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import {
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const HomePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [ads, setAds] = useState([]);
  const [featuredAds, setFeaturedAds] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch Ads from API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/ads"
        );
        const data = await response.json();

        console.log("API Response:", data); // Debugging line

        if (response.ok) {
          // Ensure data is an array before filtering
          const adsArray = Array.isArray(data) ? data : data.ads || [];
          const activeAds = adsArray.filter((ad) => ad.status === "active");
          setAds(activeAds);
          setFeaturedAds(getRandomAds(activeAds, 4));
        } else {
          console.error("Error fetching ads:", data);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, []);

  // Function to get random ads
  const getRandomAds = (ads, count) => {
    const shuffled = [...ads].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Automatically update featured ads every 5 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (ads.length > 0) {
  //       setFeaturedAds(getRandomAds(ads, 4));
  //     }
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [ads]);

  // Toggle favorite status
  const toggleFavorite = (ad) => {
    setFavorites((prev) =>
      prev.some((fav) => fav._id === ad._id)
        ? prev.filter((fav) => fav._id !== ad._id)
        : [...prev, ad]
    );
  };

  const faqs = [
    {
      question: "What is this platform about?",
      answer:
        "Adventa is a platform where you can buy, sell, and rent a variety of items ranging from real estate to electronics and more.",
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
        "You can contact our customer support team via the 'Contact Us' page or by emailing support@adventa.com.",
    },
    {
      question: "How long do ads stay active?",
      answer:
        "You can contact our customer support team via the 'Contact Us' page or by emailing support@adventa.com.",
    },
  ];

  return (
    <div className="bg-background font-montserrat">
      <Header />

      {/* Layout with Sidebar & Main Content */}
      <section className="flex flex-col md:flex-row">
        {/* Sidebar Categories (Hidden on small screens) */}
        <aside className="hidden md:block w-1/5 p-4 bg-white shadow-md">
          <h2 className="font-bold mb-4">Categories</h2>
          <ul className="space-y-6 text-sm">
            {[
              "House",
              "Vehicles",
              "Real Estate",
              "Fashion & Beauty",
              "Multimedia",
              "Equipment & Appliances",
            ].map((category, index) => (
              <li
                key={index}
                className="hover:underline text-gray-600 cursor-pointer"
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-4/5 p-4">
          {/* Top Adverts Section */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Top adverts</h2>
            <div className="flex justify-between items-center mb-4">
              <button className="flex items-center space-x-2 px-3 py-1 border border-gray-700 text-xs rounded-full hover:bg-gray-200">
                <MdFilterList className="w-5 h-5" />
                <span>Filter</span>
              </button>
              <button className="px-3 py-1 border border-gray-700 text-xs rounded-full hover:bg-gray-200">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                {
                  img: "/categories/car.png",
                  title: "Lexus 300,000,000 CFA",
                  location: "Accra, Ghana",
                  link: "/lexus",
                },
                {
                  img: "/categories/house.png",
                  title: "4 Beds, 3 Baths, Private Yard",
                  location: "Accra, Ghana",
                  link: "/house",
                },
                {
                  img: "/categories/phone.png",
                  title: "Iphone 13",
                  location: "Accra, Ghana",
                  link: "/washing-machine",
                },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-base font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Categories Section */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Categories</h2>
            <hr />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-5">
              {[
                { name: "Vehicles", image: "/categories/car.png" },
                { name: "House", image: "/categories/house.png" },
                { name: "Fashion & Beauty", image: "/categories/beauty.png" },
                { name: "Food", image: "/categories/food.png" },
                { name: "Electronics", image: "/categories/phone.png" },
                { name: "Services", image: "/categories/services.png" },
                { name: "Sports", image: "/categories/leisure.png" },
                { name: "Jobs", image: "/categories/hire.png" },
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 text-center shadow-md"
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

          {/* Featured Ads Section */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Featured Ads</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {featuredAds.length > 0 ? (
                featuredAds.map((ad) => (
                  <Link
                    key={ad._id}
                    to={`/ads/${ad._id}`} // Navigate to ad details page
                    className="bg-white rounded-lg shadow-md overflow-hidden relative"
                  >
                    {/* Love Icon */}
                    <button
                      className="absolute top-2 right-2 text-red-500 text-xl"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking the heart
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
                      src={ad.image || "/placeholder.png"}
                      alt={ad.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{ad.title}</h3>
                      <p className="text-sm text-gray-600">{ad.location}</p>
                      <p className="text-primary font-bold">
                        CFA {ad.productId.price}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p>Loading ads...</p>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-8 p-6">
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

          {/* Become a Vendor Section */}
          <div className="flex justify-center text-center my-8">
            <div className="bg-black rounded-md text-white p-8 max-w-xl">
              <p className="font-medium text-xl md:text-2xl mb-6">
                Discover how our features can help you advertise and start
                earning with referrals.
              </p>
              <Link to="/start">
                <div className="flex items-center gap-5 p-2 mx-auto rounded-3xl w-[12rem] bg-primary cursor-pointer">
                  <p className="font-medium">Become a vendor</p>
                  <div className="bg-white text-primary rounded-full p-1">
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
