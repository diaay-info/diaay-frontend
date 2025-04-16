// src/components/admin/CategoryManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AWS from "aws-sdk";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const spacesEndpoint = new AWS.Endpoint("nyc3.digitaloceanspaces.com"); // Change region if needed
  const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: import.meta.env.VITE_DO_SPACE_KEY,
    secretAccessKey: import.meta.env.VITE_DO_SPACE_SECRET,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !categoryImage) {
      toast.error("Category name and image are required");
      return;
    }

    setLoading(true);
    try {
      // Upload image to DigitalOcean
      const fileName = `${Date.now()}-${categoryImage.name}`;
      const uploadParams = {
        Bucket: import.meta.env.VITE_DO_SPACE_BUCKET,
        Key: fileName,
        Body: categoryImage,
        ACL: "public-read",
        ContentType: categoryImage.type,
      };

      const upload = await s3.upload(uploadParams).promise();
      const imageUrl = upload.Location;

      // Save category with image URL
      await axios.post(
        `${API_BASE_URL}/api/categories`,
        {
          name: newCategory,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Category added successfully");
      setNewCategory("");
      setCategoryImage(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add category");
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />
        <div className="bg-white p-4 rounded-lg shadow-md mt-4 flex flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-6">Manage Categories</h2>

            {/* Add Category Form */}
            <div className="flex flex-col gap-4 mb-8">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="px-4 py-2 border rounded-md"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                className="px-4 py-2 border rounded-md"
              />
              <button
                onClick={handleAddCategory}
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
              >
                {loading ? "Adding..." : "Add Category"}
              </button>
            </div>

            {/* Categories List */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
              {loading && categories.length === 0 ? (
                <p>Loading categories...</p>
              ) : categories.length === 0 ? (
                <p>No categories found</p>
              ) : (
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li
                      key={category._id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <span className="font-medium">{category.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
