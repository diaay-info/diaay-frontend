// src/components/admin/CategoryManagement.js
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./AdminSideBar";
import Header from "./AdminHeader";
import { useDropzone } from "react-dropzone";
import useDirectSpacesUpload from "../Hooks/useDirectSpacesUpload";


const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const accessToken = localStorage.getItem("accessToken");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Import the direct upload hook
  const { 
    uploadImage, 
    uploading, 
    uploadProgress
  } = useDirectSpacesUpload();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setFetchingCategories(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setFetchingCategories(false);
    }
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!uploadedImageUrl) {
      toast.error("Please upload a category image");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/categories`,
        { 
          name: newCategory,
          image: uploadedImageUrl 
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCategories([...categories, response.data]);
      setNewCategory("");
      setImagePreview(null);
      setUploadedImageUrl("");
      setCategoryImage(null);
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (categoryId) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCategories(categories.filter(category => category._id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload when a file is dropped or selected
  const handleUploadImage = async (file) => {
    try {
      // Start uploading the image
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`Failed to upload image: ${error.message}`);
      return false;
    }
  };

  // Setup dropzone for image uploads
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]; // Take only the first file
      
      // Create a preview
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
      setCategoryImage(file);
      
      // Start uploading immediately
      await handleUploadImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 5242880, // 5MB
    maxFiles: 1,
    disabled: uploading || loading,
  });

  // Clean up object URL on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 md:ml-64 bg-gray-100 min-h-screen">
        <Header />
        <div className="bg-white p-4 rounded-lg shadow-md mt-4 flex flex-wrap gap-4">
          <div className="w-full lg:w-1/2">
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
              
              {/* Dropzone for image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image*
                </label>
                
                <div 
                  {...getRootProps()} 
                  className={`border-2 ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'} 
                    border-dashed rounded-md p-4 text-center cursor-pointer 
                    ${uploading || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-gray-600">Drop the image here ...</p>
                  ) : uploading ? (
                    <p className="text-gray-600">Uploading image...</p>
                  ) : (
                    <p className="text-gray-600">
                      Drag & drop category image here, or click to select
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Accepts JPG, PNG, WebP (Max: 5MB)
                  </p>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="h-24 w-24 object-cover rounded-md border border-gray-300"
                    />
                    {!uploadedImageUrl && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        URL.revokeObjectURL(imagePreview);
                        setImagePreview(null);
                        setCategoryImage(null);
                        setUploadedImageUrl("");
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      title="Remove image"
                      disabled={uploading}
                    >
                      ×
                    </button>
                  </div>
                )}
                
                {/* Upload Progress */}
                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleAddCategory}
                disabled={loading || uploading || !newCategory.trim() || !uploadedImageUrl}
                className={`px-4 py-2 bg-primary text-white rounded-md hover:bg-purple-700 
                  ${(loading || uploading || !newCategory.trim() || !uploadedImageUrl) ? 
                    "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </span>
                ) : "Add Category"}
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Existing Categories</h3>
            {fetchingCategories ? (
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
                    <div className="flex items-center gap-3">
                      {category.image && (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      )}
                      <span className="font-medium">{category.name}</span>
                    </div>
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
  );
};

export default CategoryManagement;