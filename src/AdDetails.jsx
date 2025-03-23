import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaLongArrowAltRight } from "react-icons/fa";

const AdDetailss = () => {
  const { adId } = useParams(); // Get the ad ID from the URL
  const [ad, setAd] = useState(null);

  // Fetch ad details based on the ID
  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(
          `https://e-service-v2s8.onrender.com/api/ads/${adId}/active`
        );
        const data = await response.json();
        if (response.ok) {
          setAd(data);
        } else {
          console.error("Error fetching ad details:", data);
        }
      } catch (error) {
        console.error("Error fetching ad details:", error);
      }
    };

    fetchAdDetails();
  }, [adId]);

  if (!ad) {
    return <p>Loading ad details...</p>;
  }

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
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
                    // Set the clicked image as the main image
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
            <p className="text-gray-600 ">{ad.productId.description}</p>
            <hr />
            <p className="text-primary font-bold text-3xl ">
              CFA {ad.productId.price}
            </p>
            <p className="text-gray-600 ">
              {ad.productId.country}, {ad.productId.state}
            </p>
            <hr className="mb-10" />
            <div className="border p-6 mt-10 rounded-lg">
              {/* Seller Information */}
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={ad.userId.avatar || "/placeholder.png"}
                  alt="Seller"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {ad.userId.name || "Taiwo Omotola"}
                  </p>
                  <p className="text-sm text-gray-600">Verified</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4 mb-6">
                <button className="flex items-center justify-center space-x-2 bg-black text-white py-3 px-4 rounded-3xl">
                  <span>Call Vendor</span>
                </button>
                <button className="flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-3xl">
                  <span>Text on WhatsApp</span>
                </button>
                <hr />
                <button className="flex items-center justify-center space-x-2 border border-gray-900 text-gray-700 py-2 px-4 rounded-3xl">
                  <span>Add to Favourites</span>
                </button>{" "}
                <button className="flex items-center justify-center space-x-2 bg-primary text-white py-2 px-4 rounded-3xl">
                  <span>Chat Live Support</span>
                </button>{" "}
                <button className="flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-3xl">
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-10" />

        {/* Product Details and Similar Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 ">
          {/* Product Details */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Product Details</h2>
            <p className="text-gray-600">
              Nourishing body and soul, one delicious bite at a time. This blog
              is a space to share recipes, cooking adventures, and the ways in
              which food brings us joy, comfort, and connection.
            </p>
          </div>

          {/* Similar Products Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {/* Example Similar Product */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-md p-4">
                  <img
                    src="/categories/car.png"
                    alt="Similar Product"
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold">Sony PlayStation A</h3>
                  <p className="text-gray-600">CFA 3000</p>
                  <p className="text-sm text-gray-600">Accra, Olaves</p>
                </div>
              ))}
            </div>
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
