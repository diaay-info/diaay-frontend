import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaLongArrowAltRight, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useFavorites } from "./useFavorites";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdDetailss = () => {
  const { adId } = useParams();
  const [ad, setAd] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const isFavorite = favorites.some((fav) => fav._id === ad?._id);

  const handleCallVendor = () => {
    if (!ad?.userId?.phoneNumber) return alert("Phone number is not available.");
    window.location.href = `tel:${ad.userId.phoneNumber}`;
  };

  const handleWhatsAppRedirect = () => {
    if (!ad?.userId?.phoneNumber) return alert("Phone number is not available.");
    const formatted = ad.userId.phoneNumber.replace(/\D/g, "");
    const msg = encodeURIComponent(`Hello, good day! I'm interested in this product: ${ad.title}\n\n${window.location.href}`);
    window.location.href = `https://wa.me/${formatted}?text=${msg}`;
  };

  const toggleFavorite = () => {
    isFavorite ? removeFromFavorites(ad._id) : addToFavorites(ad);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === Math.ceil(similarProducts.length / 2) - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.ceil(similarProducts.length / 2) - 1 : prev - 1));
  };

  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ads/${adId}/active`);
        const data = await res.json();
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
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await res.json();
        const match = data.find((cat) => cat.name === category);

        if (match) {
          const productsRes = await fetch(`${API_BASE_URL}/api/ads?category=${encodeURIComponent(match.name)}`);
          const productsData = await productsRes.json();
          const filtered = Array.isArray(productsData) ? productsData : productsData.ads || [];
          setSimilarProducts(filtered.filter((p) => p._id !== adId));
        }
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      }
    };

    fetchAdDetails();
  }, [adId]);

  const renderTabContent = () => {
    if (!ad) return <Skeleton count={5} />;

    switch (activeTab) {
      case "description":
        return <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-gray-600">{ad.productId.description}</p></div>;
      case "characteristics":
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc pl-5 space-y-2">
              {ad.productId.features?.map((f, i) => (
                <li key={i} className="text-gray-600">{f.name}: {f.value}<hr /></li>
              ))}
            </ul>
          </div>
        );
      case "safeInfo":
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <ul className="list-disc pl-5 space-y-4 mt-2 text-gray-600">
              <li>Do not send any prepayment.</li><hr />
              <li>Meet the seller in a safe public place.</li><hr />
              <li>Inspect what you're going to buy.</li><hr />
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
          <Link to="/" className="hover:text-primary">Home</Link> &gt; 
          <Link to="/featured-ads" className="hover:text-primary"> Featured Ads</Link> &gt; 
          <Link to={`/category/${ad?.category}`} className="hover:text-primary"> {ad?.category}</Link> &gt; 
          <span className="font-semibold">{ad?.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            {ad ? (
              <>
                <img src={ad.productId.images[0] || "/placeholder.png"} alt={ad.title} className="w-full h-96 object-cover rounded-2xl mb-4" />
                <div className="grid grid-cols-3 gap-4 w-full">
                  {ad.productId.images.slice(0, 3).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${ad.title}-${idx + 1}`}
                      className="w-full h-[10rem] object-cover rounded-lg cursor-pointer"
                      onClick={() => {
                        const newImages = [...ad.productId.images];
                        newImages[0] = img;
                        newImages[idx] = ad.productId.images[0];
                        setAd({ ...ad, productId: { ...ad.productId, images: newImages } });
                      }}
                    />
                  ))}
                </div>
              </>
            ) : <Skeleton height={400} />}
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{ad?.title || <Skeleton />}</h1>
            <p className="text-gray-600">{ad?.productId.description || <Skeleton count={2} />}</p>
            <hr />
            <p className="text-primary font-bold text-3xl">
              {ad ? `XOF ${ad.productId.price}` : <Skeleton width={120} />}
            </p>
            <p className="text-gray-600">{ad ? `${ad.productId.country}, ${ad.productId.state}` : <Skeleton width={150} />}</p>
            <hr className="mb-10" />

            <div className="border p-6 mt-10 rounded-lg">
              <div className="mb-6">
                <p className="font-semibold">{ad?.userId.fullName || <Skeleton width={100} />}</p>
                <p className="text-sm text-gray-600">Verified</p>
              </div>

              <div className="flex flex-col space-y-4 mb-6">
                <button onClick={handleCallVendor} className="flex items-center justify-center space-x-2 bg-black text-white py-3 px-4 rounded-3xl">
                  <span>Call Vendor</span>
                </button>
                <button onClick={handleWhatsAppRedirect} className="flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-3xl">
                  <span>Text on WhatsApp</span>
                </button>
                <hr />
                <button onClick={toggleFavorite}
                  className={`flex items-center justify-center space-x-2 border py-2 px-4 rounded-3xl ${isFavorite ? "border-primary text-primary" : "border-gray-900 text-gray-700"}`}>
                  <span>{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
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
                <button key={tab}
                  className={`py-2 px-4 font-medium ${activeTab === tab ? "bg-purple-600 text-white" : "text-gray-600"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "description" ? "Description" :
                    tab === "characteristics" ? "Characteristics" : "Safety Info"}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>

          <section className="relative">
            <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
            {similarProducts.length > 0 ? (
              <div className="relative overflow-hidden">
                <div className="flex transition-transform duration-300"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${similarProducts.length * 50}%`,
                  }}
                >
                  {similarProducts.map((p) => (
                    <div key={p._id} className="flex-shrink-0 w-full sm:w-1/2 p-2">
                      <Link to={`/ads/${p._id}/active`}>
                        <div className="bg-white rounded-lg shadow-md p-4 h-full hover:shadow-lg transition-shadow">
                          <img src={p.productId?.images?.[0] || "/placeholder.png"}
                            alt={p.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                          <h3 className="text-lg font-semibold">{p.title}</h3>
                          <p className="text-gray-600">XOF {p.productId?.price || "N/A"}</p>
                          <p className="text-sm text-gray-600">{p.productId?.country}, {p.productId?.state}</p>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                {similarProducts.length > 2 && (
                  <>
                    <button onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10">
                      <FaArrowLeft />
                    </button>
                    <button onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10">
                      <FaArrowRight />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <Skeleton height={150} count={2} />
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
