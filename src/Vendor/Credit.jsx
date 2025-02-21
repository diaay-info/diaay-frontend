import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PurchaseCredit from "./PurchaseCredit";
import Layout from "./Layout";

const Credit = ({ onPurchaseCreditclick }) => {
  const [isPurchaseCredit, setIsPurchaseCredit] = useState(false);
  const location = useLocation();
  const [products, setProducts] = useState([]); // Store the list of products

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false); // Track "Select All" checkbox state

  // Check if the current URL contains 'purchasecredit'
  const isPurchaseCreditPage = location.pathname.includes("purchasecredit");

  const handlePurchaseCreditToggle = () => {
    setIsPurchaseCredit(!isPurchaseCredit);
  };

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

  return (
    <Layout>
      <div className="flex flex-col min-h-screen px-4 md:px-8">
        {/* Main Content */}
        <main className="flex-1 py-4">
          {/* Show Add Product Form or Products List */}
          {isPurchaseCredit || isPurchaseCreditPage ? (
            <PurchaseCredit />
          ) : (
            <div className="space-y-6">
              {/* Top Controls */}
              <div className="flex flex-wrap gap-4 justify-between bg-white p-4 rounded-lg shadow-sm">
                <input
                  type="text"
                  placeholder="Search product..."
                  className="border border-gray-300 rounded-lg p-2 flex-grow min-w-[150px]"
                />
                <select className="border border-gray-300 rounded-lg py-2 px-4">
                  <option>Sort by: Default</option>
                  <option>Price</option>
                  <option>Date</option>
                </select>
                <select className="border border-gray-300 rounded-lg py-2 px-4">
                  <option>Show: All Products</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <button className="py-2 px-4 border bg-white border-gray-300 rounded-lg">
                  Filter
                </button>
                <button
                  onClick={handlePurchaseCreditToggle}
                  className="py-2 px-4 bg-purple-500 text-white rounded-lg"
                >
                  Purchase Credits
                </button>
              </div>

              {/* Available Credits */}
              <div className="bg-white rounded-lg px-6 py-4 shadow-md text-center">
                <p className="text-gray-600">Available credits</p>
                <h1 className="text-2xl font-bold text-purple-500">
                  0 Credits Remaining
                </h1>
              </div>

              {/* Product List */}
              {products.length > 0 ? (
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="text-left font-medium bg-gray-100">
                        <th className="p-2">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="p-2">Product Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Ads Status</th>
                        <th className="p-2">Date Added</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-t">
                          <td className="p-2">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleProductSelect(product._id)}
                            />
                          </td>
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.category}</td>
                          <td className="p-2 text-[#7C0DEA]">
                            {product.price} CFA
                          </td>
                          <td className="p-2 text-green-600">Active</td>
                          <td className="p-2">
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-2">
                            <button className="text-gray-600 hover:text-black">
                              &#8942;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col bg-white items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mb-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                    <line x1="6" y1="15" x2="8" y2="15" />
                    <line x1="10" y1="15" x2="14" y2="15" />
                  </svg>
                  <p className="text-gray-500">No Credit available</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Credit;
