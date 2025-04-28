import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaLongArrowAltRight, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useFavorites } from "./useFavorites";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdDetailss = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const isFavorite = favorites.some((fav) => fav._id === ad?._id);

  const handleCallVendor = () => {
    if (!ad?.userId?.phoneNumber)
      return alert("Phone number is not available.");
    window.location.href = `tel:${ad.userId.phoneNumber}`;
  };

  const handleWhatsAppRedirect = () => {
    if (!ad?.userId?.phoneNumber)
      return alert("Phone number is not available.");
    const formatted = ad.userId.phoneNumber.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Hello, good day! I'm interested in this product: ${ad.title}\n\n${window.location.href}`
    );
    window.location.href = `https://wa.me/${formatted}?text=${msg}`;
  };

  const toggleFavorite = () => {
    isFavorite ? removeFromFavorites(ad._id) : addToFavorites(ad);
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
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const data = await res.json();
        console.log("Fetching details for id:", id);
        if (res.ok) {
          setAd(data);
          fetchSimilarProducts(data.category);
        }
      } catch (err) {
        console.error("Failed to fetch ad details", err);
      }
    };

    const fetchSimilarProducts = async (category) => {
      try {
        console.log("Fetching similar products for category:", category);
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await res.json();
        console.log("Categories data:", data);

        const match = data.find((cat) => cat.name === category);
        console.log("Matched category:", match);

        if (match) {
          const productsRes = await fetch(
            `${API_BASE_URL}/api/products?category=${encodeURIComponent(
              match.name
            )}`
          );
          const productsData = await productsRes.json();
          console.log("Similar products data:", productsData);

          // Fix: Extract products array from the response
          const filtered = productsData.products
            ? productsData.products.filter((p) => p._id !== id)
            : [];

          console.log("Filtered products:", filtered);
          setSimilarProducts(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      }
    };

    fetchAdDetails();
  }, [id]);

  const renderTabContent = () => {
    if (!ad) return <Skeleton count={5} />;

    switch (activeTab) {
      case "description":
        return (
          <div className="p-4 bg-gray-50 rounded-2xl">
            <p className="text-gray-600">{ad.description}</p>
          </div>
        );
      case "characteristics":
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {ad.features?.map((f, i) => (
                <li key={i} className="text-gray-600">
                  {f.name}: {f.value}
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        );
      case "safeInfo":
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc pl-5 space-y-4 mt-2 text-gray-600">
              <li>Do not send any prepayment.</li>
              <hr />
              <li>Meet the seller in a safe public place.</li>
              <hr />
              <li>Inspect what you're going to buy.</li>
              <hr />
              <li>Check all documents before paying.</li>
            </ul>
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
        <div className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          &gt;
          <Link
            to={`/categories/${ad?.category}`}
            className="hover:text-primary"
          >
            {" "}
            {ad?.category}
          </Link>{" "}
          &gt;
          <span className="font-semibold">{ad?.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            {ad ? (
              <>
                <img
                  src={ad.images[0] || "/placeholder.png"}
                  alt={ad.title}
                  className="w-full h-96 object-cover rounded-2xl mb-4"
                />
                <div className="grid grid-cols-3 gap-4 w-full">
                  {ad.images.slice(0, 3).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${ad.title}-${idx + 1}`}
                      className="w-full h-[10rem] object-cover rounded-lg cursor-pointer"
                      onClick={() => {
                        const newImages = [...ad.images];
                        newImages[0] = img;
                        newImages[idx] = ad.images[0];
                        setAd({
                          ...ad,
                          productId: { ...ad.productId, images: newImages },
                        });
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <Skeleton height={400} />
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{ad?.name || <Skeleton />}</h1>
            <p className="text-gray-600">
              {ad?.description || <Skeleton count={2} />}
            </p>
            <hr />
            <p className="text-primary font-bold text-3xl">
              {ad ? ` ${ad.price}` : <Skeleton width={120} />}
            </p>
            <p className="text-gray-600">
              {ad ? `${ad.country}, ${ad.city}` : <Skeleton width={150} />}
            </p>
            <hr className="mb-10" />

            <div className="border p-6 mt-10 rounded-lg">
              <div className="mb-6">
                <p className="font-semibold">
                  {ad?.userId.fullName || <Skeleton width={100} />}
                </p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Product Details</h2>
            <div className="flex border-b mb-4">
              {["description", "characteristics", "safeInfo"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 font-medium ${
                    activeTab === tab
                      ? "bg-purple-600 text-white"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "description"
                    ? "Description"
                    : tab === "characteristics"
                    ? "Characteristics"
                    : "Safety Info"}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>

          <section className="relative">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            {similarProducts.length > 0 ? (
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${similarProducts.length * 100}%`,
                  }}
                >
                  {similarProducts.map((p) => (
                    <div
                      key={p._id}
                      className="flex-shrink-0 w-full md:w-1/3 lg:w-1/2 p-2"
                    >
                      <Link to={`/products/${p._id}`} className="block h-full">
                        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100">
                          <div className="relative overflow-hidden">
                            <img
                              src={p.images?.[0] || "/placeholder.png"}
                              alt={p.name}
                              className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-2 py-1 m-2 rounded-full">
                              Similar
                            </div>
                          </div>
                          <div className="p-4 flex flex-col flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                              {p.name}
                            </h3>
                            <p className="text-primary font-bold text-xl mb-1">
                              {p.price || "N/A"}
                            </p>
                            <div className="mt-auto flex items-center text-sm text-gray-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="truncate">
                                {p.country}, {p.city}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                {similarProducts.length > 4 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-50 transition-colors"
                      aria-label="Previous slide"
                    >
                      <FaArrowLeft className="text-gray-700" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg z-10 hover:bg-gray-50 transition-colors"
                      aria-label="Next slide"
                    >
                      <FaArrowRight className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-10 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-600 font-medium">
                  No similar products available.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Check back later for more options
                </p>
              </div>
            )}
          </section>
        </div>

        <hr className="my-10" />
        <div className="flex justify-center items-center text-center">
          <div className="bg-black rounded-md text-white p-6 md:p-8 max-w-lg">
            <p className="font-medium text-lg md:text-xl mb-6">
              Discover how our features can help you advertise and start earning
              with referrals.
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
      <Footer />
    </div>
  );
};

export default AdDetailss;
