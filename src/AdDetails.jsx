import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaLongArrowAltRight, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useFavorites } from "./useFavorites";

const AdDetailss = () => {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const isFavorite = favorites.some((fav) => fav._id === ad?._id);

  const handleCallVendor = () => {
    if (!ad?.userId?.phoneNumber) {
      alert("Phone number is not available.");
      return;
    }
    window.location.href = `tel:${ad.userId.phoneNumber}`;
  };

  const handleWhatsAppRedirect = () => {
    if (!ad?.userId?.phoneNumber) {
      alert("Phone number is not available.");
      return;
    }
    const formattedPhoneNumber = ad.userId.phoneNumber.replace(/\D/g, "");
    const productLink = window.location.href;
    const message = encodeURIComponent(
      `Hello, good day! I'm interested in this product: ${ad.title}\n\n${productLink}`
    );
    window.location.href = `https://wa.me/${formattedPhoneNumber}?text=${message}`;
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(ad._id);
    } else {
      addToFavorites(ad);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === Math.ceil(similarProducts.length / 2) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.ceil(similarProducts.length / 2) - 1 : prev - 1
    );
  };

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(
          `https://e-service-v2s8.onrender.com/api/ads/${adId}/active`
        );
        const data = await response.json();
        if (response.ok) {
          setAd(data);
          // Fetch similar products after setting the ad
          fetchSimilarProducts(data.category);
        } else {
          console.error("Error fetching ad details:", data);
        }
      } catch (error) {
        console.error("Error fetching ad details:", error);
      }
    };

    const fetchSimilarProducts = async (category) => {
      try {
        const response = await fetch(
          `https://e-service-v2s8.onrender.com/api/ads?category=${encodeURIComponent(
            category
          )}`
        );
        const data = await response.json();
        if (response.ok) {
          // Filter out the current ad from similar products
          const similar = Array.isArray(data) ? data : data.ads || [];
          setSimilarProducts(similar.filter((product) => product._id !== adId));
        } else {
          console.error("Error fetching similar products:", data);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    fetchAdDetails();
  }, [adId]);

  if (!ad) {
    return <p>Loading ad details...</p>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-gray-600">{ad.productId.description}</p>
          </div>
        );
      case "characteristics":
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {ad.productId.features?.map((feature, index) => (
                <li key={index} className="text-gray-600">
                  {feature.name}: {feature.value}
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        );
      case "safeInfo":
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              For your safety, please:
              <ul className="list-disc pl-5 space-y-4 mt-2">
                <li>Do not send any prepayment.</li>
                <hr />
                <li>Meet the seller in a safe public place.</li>
                <hr />
                <li>
                  Inspect what you're going to buy to make sure it's what you
                  need
                </li>{" "}
                <hr />
                <li>Check all documents and only pay if you are satisfied.</li>
              </ul>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background font-montserrat">
      <Header />
      <main className="p-4">
        {/* Navigation Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link to="/featured-ads" className="hover:text-primary">
            Featured Ads
          </Link>{" "}
          &gt;{" "}
          <Link to={`/category/${ad.category}`} className="hover:text-primary">
            {ad.category}
          </Link>{" "}
          &gt; <span className="font-semibold">{ad.title}</span>
        </div>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="w-full">
            {/* Big Picture */}
            <img
              src={ad.productId.images[0] || "/placeholder.png"}
              alt={ad.title}
              className="w-full h-96 object-cover rounded-2xl mb-4"
            />

            {/* Small Pictures */}
            <div className="grid grid-cols-3 gap-4 w-full">
              {ad.productId.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${ad.title} - ${index + 1}`}
                  className="w-full h-[10rem] object-cover rounded-lg cursor-pointer"
                  onClick={() => {
                    const newImages = [...ad.productId.images];
                    newImages[0] = image;
                    newImages[index] = ad.productId.images[0];
                    setAd({
                      ...ad,
                      productId: { ...ad.productId, images: newImages },
                    });
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{ad.title}</h1>
            <p className="text-gray-600">{ad.productId.description}</p>
            <hr />
            <p className="text-primary font-bold text-3xl">
              XOF {ad.productId.price}
            </p>
            <p className="text-gray-600">
              {ad.productId.country}, {ad.productId.state}
            </p>
            <hr className="mb-10" />
            <div className="border p-6 mt-10 rounded-lg">
              {/* Seller Information */}
              <div className="mb-6">
                <p className="font-semibold">{ad.userId.fullName || ""}</p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4 mb-6">
                <button
                  onClick={handleCallVendor}
                  className="flex items-center justify-center space-x-2 bg-black text-white py-3 px-4 rounded-3xl"
                >
                  <span>Call Vendor</span>
                </button>
                <button
                  onClick={handleWhatsAppRedirect}
                  className="flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-3xl"
                >
                  <span>Text on WhatsApp</span>
                </button>
                <hr />
                <button
                  onClick={toggleFavorite}
                  className={`flex items-center justify-center space-x-2 border py-2 px-4 rounded-3xl ${
                    isFavorite
                      ? "border-primary text-primary"
                      : "border-gray-900 text-gray-700"
                  }`}
                >
                  <span>
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-10" />

        {/* Product Details and Similar Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Product Details */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Product Details</h2>

            {/* Tab Headers */}
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "description"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "characteristics"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("characteristics")}
              >
                Characteristics
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "safeInfo"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("safeInfo")}
              >
                Safety Information
              </button>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>

          {/* Similar Products Section */}
          <section className="relative">
            <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
            {similarProducts.length > 0 ? (
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-300"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${similarProducts.length * 50}%`,
                  }}
                >
                  {similarProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex-shrink-0 w-full sm:w-1/2 p-2"
                    >
                      <Link to={`/ads/${product._id}/active`}>
                        <div className="bg-white rounded-lg shadow-md p-4 h-full hover:shadow-lg transition-shadow">
                          <img
                            src={
                              product.productId?.images?.[0] ||
                              "/placeholder.png"
                            }
                            alt={product.title}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                          <h3 className="text-lg font-semibold">
                            {product.title}
                          </h3>
                          <p className="text-gray-600">
                            XOF {product.productId?.price || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {product.productId?.country || ""},{" "}
                            {product.productId?.state || ""}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                {similarProducts.length > 2 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                    >
                      <FaArrowLeft />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
                    >
                      <FaArrowRight />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p>No similar products found</p>
            )}
          </section>
        </div>
        <hr className="my-10" />

        {/* Become a Vendor Section */}
        <div className="flex justify-center text-center my-8">
          <div className="bg-black rounded-md text-white p-8 max-w-xl">
            <p className="font-medium text-xl md:text-2xl mb-6">
              Discover how our features can help you advertise and start earning
              with referrals.
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
      <Footer />
    </div>
  );
};

export default AdDetailss;
