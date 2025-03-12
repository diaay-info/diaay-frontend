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
  const [selectAll, setSelectAll] = useState(false); // Track "Select All" checkbox state

  const [vendorData, setVendorData] = useState({
    totalProducts: 0,
  });
  // Function to handle selecting a single product
  const handleProductSelect = (productId) => {
    setSelectedProducts(
      (prevSelected) =>
        prevSelected.includes(productId)
          ? prevSelected.filter((id) => id !== productId)
          : [productId] // Single selection mode
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://e-service-v2s8.onrender.com/api/products"
        );
        const data = await response.json();

        if (response.ok) {
          setProducts(data.products || []); // Set fetched products
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
        <main className="flex-1 ">
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
                    className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                  />
                  <select className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto">
                    <option>Sort by: Default</option>
                    <option>Price</option>
                    <option>Date</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-auto">
                    <option>Show: All Products</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="flex space-x-2">
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

              {/* Product List (Make it scrollable on small screens) */}
              <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full text-sm sm:text-base">
                  <thead>
                    <tr className="text-left font-medium">
                      <th className="p-2 border-b">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-2 border-b">Product Name</th>
                      <th className="p-2 border-b">Category</th>
                      <th className="p-2 border-b">Price</th>
                      <th className="p-2 border-b">Ads Status</th>
                      <th className="p-2 border-b">Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product._id} className="border-t">
                          <td className="p-2 border-b">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleProductSelect(product._id)}
                            />
                          </td>
                          <td className="p-2 border-b">{product.name}</td>
                          <td className="p-2 border-b">{product.category}</td>
                          <td className="p-2 border-b text-[#7C0DEA]">
                            {product.price} CFA
                          </td>
                          <td className="p-2 border-b text-green-600">
                            Active
                          </td>
                          <td className="p-2 border-b">
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-2 border-b">
                            <button className="text-gray-600 hover:text-black">
                              &#8942;
                            </button>
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
          )}
        </main>
      </div>
    </Layout>
  );
};

export default ProductPage;
