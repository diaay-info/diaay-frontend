import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import Addproducts from "./Addproducts";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FiBox } from "react-icons/fi";

const ProductPage = () => {
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [showActions, setShowActions] = useState(null);

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
      setSelectedProducts(
        products.filter((p) => p?._id).map((product) => product._id)
      );
    }
    setSelectAll(!selectAll);
  };

  const isAddProductPage = location.pathname.includes("addproducts");

  const handleAddProductToggle = () => {
    setIsAddProduct(!isAddProduct);
  };

  const handleProductAdded = (newProduct) => {
    if (!newProduct) return;
    setProducts((prev) => [
      ...prev,
      { ...newProduct, dateAdded: new Date().toLocaleDateString() },
    ]);
    setIsAddProduct(false);
  };

  const toggleActions = (productId) => {
    setShowActions((prev) => (prev === productId ? null : productId));
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(
        `https://e-service-v2s8.onrender.com/api/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p?._id !== productId));
        setSelectedProducts((prev) => prev.filter((id) => id !== productId));
      } else throw new Error("Failed to delete product");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await fetch(
          "https://e-service-v2s8.onrender.com/api/report",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          // Filter out any null or undefined products
          setProducts((data.vendorProducts || []).filter((p) => p));
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Filter out null products before pagination
  const validProducts = products.filter((product) => product);
  const totalPages = Math.ceil(validProducts.length / productsPerPage);
  const paginatedProducts = validProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <Layout>
      <div className="min-h-screen p-2 sm:p-4">
        <main className="flex-1 overflow-x-hidden">
          {isAddProduct || isAddProductPage ? (
            <Addproducts onProductAdded={handleProductAdded} />
          ) : (
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
                  <button
                    onClick={handleAddProductToggle}
                    className="py-2 px-4 bg-purple-500 text-white rounded-lg w-full sm:w-auto"
                  >
                    + Add Product
                  </button>
                </div>
              </div>

              {/* Product Table */}
              <div className="mt-4 bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-base sm:text-lg font-semibold">
                    Your Products
                  </h2>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mt-6">
                  {loading ? (
                    <p className="text-gray-600 text-center">Loading...</p>
                  ) : validProducts.length === 0 ? (
                    <div className="text-center mt-6 flex flex-col items-center">
                      <FiBox className="text-gray-400 text-6xl" />
                      <p className="text-gray-500 mt-2">
                        No Products Listed Yet
                      </p>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto scrollbar-thin">
                      <div className="min-w-[600px]">
                        <table className="w-full border-collapse border border-gray-200 bg-white rounded-lg shadow-md text-sm">
                          <thead className="bg-primary text-white text-xs md:text-sm uppercase font-semibold">
                            <tr className="border-b border-gray-200">
                              <th className="p-2 md:p-3 text-left sticky left-0 bg-primary z-10">
                                <input
                                  type="checkbox"
                                  checked={selectAll}
                                  onChange={handleSelectAll}
                                  className="h-4 w-4"
                                />
                              </th>
                              <th className="p-2 md:p-3 text-left min-w-[150px]">
                                Product Name
                              </th>
                              <th className="p-2 md:p-3 text-left min-w-[120px]">
                                Category
                              </th>
                              <th className="p-2 md:p-3 text-left min-w-[100px]">
                                Price
                              </th>
                              <th className="p-2 md:p-3 text-left min-w-[100px]">
                                Status
                              </th>
                              <th className="p-2 md:p-3 text-left min-w-[120px]">
                                Date Added
                              </th>
                              <th className="p-2 md:p-3 text-left min-w-[100px]">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedProducts.map(
                              (product) =>
                                product && (
                                  <tr
                                    key={product._id}
                                    className="hover:bg-gray-100 text-xs md:text-sm"
                                  >
                                    <td className="p-2 md:p-3 sticky left-0 bg-white z-10">
                                      <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(
                                          product._id
                                        )}
                                        onChange={() =>
                                          handleProductSelect(product._id)
                                        }
                                        className="h-4 w-4"
                                      />
                                    </td>
                                    <td className="p-2 md:p-3">
                                      {product.name || "N/A"}
                                    </td>
                                    <td className="p-2 md:p-3">
                                      {product.category || "N/A"}
                                    </td>
                                    <td className="p-2 md:p-3 text-purple-600">
                                      {product.price
                                        ? `${product.price} XOF`
                                        : "N/A"}
                                    </td>
                                    <td className="p-2 md:p-3 font-semibold">
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
                                          ? product.status
                                              .charAt(0)
                                              .toUpperCase() +
                                            product.status.slice(1)
                                          : "N/A"}
                                      </span>
                                    </td>
                                    <td className="p-2 md:p-3">
                                      {product.createdAt
                                        ? new Date(
                                            product.createdAt
                                          ).toLocaleDateString()
                                        : "N/A"}
                                    </td>
                                    <td className="p-2 md:p-3 relative text-right">
                                      <button
                                        onClick={() =>
                                          toggleActions(product._id)
                                        }
                                        className="text-gray-600 hover:text-black"
                                      >
                                        &#8942;
                                      </button>
                                      {showActions === product._id && (
                                        <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                          <button
                                            onClick={() => {
                                              console.log("View:", product._id);
                                              setShowActions(null);
                                            }}
                                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                                          >
                                            View
                                          </button>
                                          <button
                                            onClick={() => {
                                              handleDeleteProduct(product._id);
                                              setShowActions(null);
                                            }}
                                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 text-left"
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Pagination */}
                  {validProducts.length > 0 && (
                    <div className="flex flex-row justify-center md:justify-end items-center mt-4 gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(currentPage - 1, 1))
                        }
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
          )}
        </main>
      </div>
    </Layout>
  );
};

export default ProductPage;
