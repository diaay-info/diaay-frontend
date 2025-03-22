import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

const AdDetailss = () => {
  const { adId } = useParams(); // Get the ad ID from the URL
  const [ad, setAd] = useState(null);

  // Fetch ad details based on the ID
  useEffect(() => {
    const fetchAdDetails = async () => {
      try {
        const response = await fetch(
          `https://e-service-v2s8.onrender.com/api/admin/adverts/${id}`
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
        <h1 className="text-2xl font-bold mb-4">{ad.title}</h1>
        <img
          src={ad.image || "/placeholder.png"}
          alt={ad.title}
          className="w-full h-64 object-cover mb-4"
        />
        <p className="text-gray-600 mb-2">{ad.location}</p>
        <p className="text-primary font-bold">CFA {ad.productId.price}</p>
        <p className="mt-4">{ad.description}</p>
      </main>
      <Footer />
    </div>
  );
};

export default AdDetailss;