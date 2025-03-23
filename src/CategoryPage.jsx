import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Component/Header";
import Footer from "./Component/Footer";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/categories"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-background font-montserrat">
      <Header />

      {/* Main Content */}
      <main className="w-full p-4">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <hr />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-5">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/categories/${category._id}`} // Link to category details page
              className="bg-white rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={category.image || "/placeholder.png"} // Fallback for missing images
                alt={category.name}
                className="mx-auto mb-3 w-24 h-24 object-cover rounded-full"
              />
              <h3 className="font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;