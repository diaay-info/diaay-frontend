import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import Addproducts from "./Addproducts";

const ProductPage = () => {
  const [isAddProduct, setIsAddProduct] = useState(false);
  const [products, setProducts] = useState([]); // Store the list of products
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Track loading state
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [selectAll, setSelectAll] = useState(false); // Track "Select All" checkbox state
  const [showActions, setShowActions] = useState(null); // Track which product's actions are visible

  const [vendorData, setVendorData] = useState({
    totalProducts: 0,
  });

  // Function to handle selecting a single product
  const handleProductSelect = (productId) => {
    setSelectedProducts(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId)
          : [...prevSelected, productId] // Allow multiple selection
    );
  };

  // Handle selecting/deselecting all products
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]); // Deselect all
    } else {
      setSelectedProducts(products.map((product) => product._id)); // Select all
    }
    setSelectAll(!selectAll);
  };

  // Check if the current URL contains 'addproducts'
  const isAddProductPage = location.pathname.includes("addproducts");

  const handleAddProductToggle = () => {
    setIsAddProduct(!isAddProduct);
  };

  // Function to add product to the list
  const handleProductAdded = (newProduct) => {
    if (!newProduct) return;

    setProducts((prevProducts) => [
      ...prevProducts,
      {
        ...newProduct,
        dateAdded: new Date().toLocaleDateString(), // Add date if not available
      },
    ]);
    setIsAddProduct(false); // Hide the form after adding a product
  };

  // Function to toggle the "more" actions for a product
  const toggleActions = (productId) => {
    setShowActions((prev) => (prev === productId ? null : productId));
  };

  // Function to delete a product
  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `https://e-service-v2s8.onrender.com/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove the deleted product from the list
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
        // Remove the product from the selected list if it was selected
        setSelectedProducts((prevSelected) =>
          prevSelected.filter((id) => id !== productId)
        );
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/report",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok) {
          setProducts(data.vendorProducts || []); // Set fetched products
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

  return (
    <Layout>
      <div className="flex min-h-screen p-2">
        {/* Main Content */}
        <main className="flex-1">
          {isAddProduct || isAddProductPage ? (
            <Addproducts onProductAdded={handleProductAdded} />
          ) : (
            <div>
              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm bg-white p-4 rounded-lg shadow-sm space-y-2 sm:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <input
                    type="text"
                    placeholder="Search product..."
                    className="border border-gray-300 rounded-lg p-2 w-full sm:w-48 text-sm"
                  />
                  <select className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto text-sm">
                    <option>Sort by: Default</option>
                    <option>Price</option>
                    <option>Date</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto text-sm">
                    <option>Show: All Products</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button className="py-2 px-4 border border-gray-300 rounded-lg w-full sm:w-auto text-sm">
                    Filter
                  </button>
                  <button
                    onClick={handleAddProductToggle}
                    className="py-2 px-4 bg-purple-500 text-white rounded-lg w-full sm:w-auto text-sm"
                  >
                    + Add Product
                  </button>
                </div>
              </div>

              {/* Product List (Make it scrollable on small screens) */}
              <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                <div className="min-w-[600px]">
                  {" "}
                  {/* Ensure the table has a minimum width */}
                  <table className="w-full text-sm sm:text-base">
                    <thead>
                      <tr className="text-left font-medium">
                        <th className="p-2 border-b whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="p-2 border-b whitespace-nowrap">
                          Product Name
                        </th>
                        <th className="p-2 border-b whitespace-nowrap">
                          Category
                        </th>
                        <th className="p-2 border-b whitespace-nowrap">
                          Price
                        </th>
                        <th className="p-2 border-b whitespace-nowrap">
                          Status
                        </th>
                        <th className="p-2 border-b whitespace-nowrap">
                          Date Added
                        </th>
                        <th className="p-2 border-b whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((product) => (
                          <tr key={product._id} className="border-t">
                            <td className="p-2 border-b whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(product._id)}
                                onChange={() =>
                                  handleProductSelect(product._id)
                                }
                              />
                            </td>
                            <td className="p-2 border-b whitespace-nowrap">
                              {product.name}
                            </td>
                            <td className="p-2 border-b whitespace-nowrap">
                              {product.category}
                            </td>
                            <td className="p-2 border-b text-[#7C0DEA] whitespace-nowrap">
                              {product.price} CFA
                            </td>
                            <td
                              className={`p-2 border-b whitespace-nowrap ${
                                product.status === "active"
                                  ? "text-green-600"
                                  : product.status === "expired"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}
                            >
                              {product.status
                                ? product.status.charAt(0).toUpperCase() +
                                  product.status.slice(1)
                                : "N/A"}
                            </td>
                            <td className="p-2 border-b whitespace-nowrap">
                              {product.createdAt
                                ? new Date(
                                    product.createdAt
                                  ).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="p-2 border-b whitespace-nowrap relative">
                              <button
                                onClick={() => toggleActions(product._id)}
                                className="text-gray-600 hover:text-black"
                              >
                                &#8942;
                              </button>
                              {showActions === product._id && (
                                <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => {
                                      // Handle view action
                                      console.log("View:", product._id);
                                      setShowActions(null);
                                    }}
                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteProduct(product._id);
                                      setShowActions(null);
                                    }}
                                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center p-4">
                            No products listed yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
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
