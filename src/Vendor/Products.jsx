import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiBox } from "react-icons/fi";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleProductSelect = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.filter((p) => p?._id).map((p) => p._id));
    }
    setSelectAll(!selectAll);
  };

  const handleProductAdded = () => {
    // Refetch products after adding a new one
    fetchProducts();
    navigate("/vendor/products");
  };

  const toggleActions = (productId) => {
    setShowActions((prev) => (prev === productId ? null : productId));
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        setSelectedProducts((prev) => prev.filter((id) => id !== productId));
      } else throw new Error("Failed to delete product");
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/vendor`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        const productsList = Array.isArray(data) ? data : data.vendorProducts || [];
        setProducts(productsList.filter((p) => p));
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const validProducts = products.filter((product) => product);
  const totalPages = Math.ceil(validProducts.length / productsPerPage);
  const paginatedProducts = validProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <Layout>
    <div>
      {/* Top Bar */}
      <div className="grid gap-2 sm:flex sm:justify-between text-sm bg-white p-4 rounded-lg shadow-sm">
        <div className="grid sm:flex sm:items-center gap-2">
          <input
            type="text"
            placeholder="Search product..."
            className="border border-gray-300 rounded-lg p-2 w-full sm:max-w-[200px]"
          />
          <select className="border border-gray-300 rounded-lg py-2 px-3 w-full sm:w-auto">
            <option>Sort by: Default</option>
            <option>Price</option>
            <option>Date</option>
          </select>
          <select className="border border-gray-300 rounded-lg py-2 px-3 w-full sm:w-auto">
            <option>Show: All Products</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <button className="py-2 px-4 border border-gray-300 rounded-lg w-full sm:w-auto">
            Filter
          </button>
          <Link
            to="/vendor/products/add"
            className="py-2 px-4 bg-purple-500 text-white rounded-lg w-full sm:w-auto text-center"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <div className="mt-4 bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-base sm:text-lg font-semibold">Your Products</h2>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mt-6">
          {loading ? (
            <p className="text-gray-600 text-center">Loading...</p>
          ) : validProducts.length === 0 ? (
            <div className="text-center mt-6 flex flex-col items-center">
              <FiBox className="text-gray-400 text-6xl" />
              <p className="text-gray-500 mt-2">No Products Listed Yet</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-thin">
              <table className="min-w-full table-auto text-sm sm:text-base">
                <thead className="bg-primary text-white text-xs md:text-sm uppercase font-semibold">
                  <tr>
                    <th className="px-2 py-3 text-left">Name</th>
                    <th className="px-2 py-3 text-left">Category</th>
                    <th className="px-2 py-3 text-left">Price</th>
                    <th className="px-2 py-3 text-left">Status</th>
                    <th className="px-2 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-100 text-xs md:text-sm"
                    >
                      <td className="px-2 py-3 whitespace-nowrap">
                        <Link to={`/vendor/products/${product._id}`}>
                          {product.name || "N/A"}
                        </Link>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {product.category || "N/A"}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-purple-600">
                        {product.price ? `${product.price} XOF` : "N/A"}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap font-semibold">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            product.status === "active"
                              ? "text-green-600"
                              : product.status === "expired"
                              ? "text-red-600"
                              : "text-yellow-500"
                          }`}
                        >
                          {product.status
                            ? product.status.charAt(0).toUpperCase() +
                              product.status.slice(1)
                            : "N/A"}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        {product.createdAt
                          ? new Date(product.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {validProducts.length > 0 && (
            <div className="flex flex-row justify-center md:justify-end items-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <IoIosArrowBack />
              </button>
              <span className="mx-2 text-sm md:text-base">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default ProductPage;