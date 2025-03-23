import React from "react";
import { useLocation ,Link} from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";
import { FaHeart } from "react-icons/fa";

const Favorites = () => {
  const location = useLocation();
  const favorites = location.state?.favorites || [];

  return (
    <div className="bg-background font-montserrat">
      <Header />

      {/* Main Content */}
      <main className="w-full p-4">
        <h2 className="text-xl font-semibold mb-4">Favorites</h2>

        {/* Display Favorited Ads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.length > 0 ? (
            favorites.map((ad) => (
              <Link
                key={ad._id}
                to={`/ads/${ad._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden relative"
              >
                {/* Love Icon */}
                <div className="absolute top-2 right-2 text-red-500 text-xl">
                  <FaHeart />
                </div>

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
            <p className="text-gray-600">No favorites added yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
