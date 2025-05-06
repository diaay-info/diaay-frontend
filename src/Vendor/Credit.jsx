import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PurchaseCredit from "./PurchaseCredit";
import Layout from "./Layout";

const Credit = ({ onPurchaseCreditclick }) => {
  const [isPurchaseCredit, setIsPurchaseCredit] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [creditBalance, setCreditBalance] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track auth status
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;  const isPurchaseCreditPage = location.pathname.includes("purchasecredit");

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // Get token from storage
    if (!token) {
      navigate("/login"); // Redirect if not logged in
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Fetch available credit balance (only if authenticated)

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCreditBalance = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${API_BASE_URL}/api/credits/balance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Credit Balance API Response:", data); // Debugging

        if (response.ok) {
          setCreditBalance(data.balance.balance ); // Extract correct balance
        } else {
          throw new Error(data.message || "Failed to fetch credit balance");
        }
      } catch (error) {
        console.error("Error fetching credit balance:", error);
        setCreditBalance(0);
      }
    };

    fetchCreditBalance();
  }, [isAuthenticated]);

  // Fetch products (only if authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${API_BASE_URL}/api/report`,
          {
            headers: {
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
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [isAuthenticated]);

 
  const handlePurchaseCreditToggle = () => {
    navigate("/credits/purchasecredit"); // updates the URL and triggers the conditional view
  };
  
  

  return (
    <Layout>
      <div className="flex flex-col min-h-screen lg:p-2">
        {/* Main Content */}
        <main className="flex-1 ">
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
                  <option>Show: All Products</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                
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
                  {creditBalance !== null
                    ? `${creditBalance} Credits Remaining`
                    : "Loading..."}
                </h1>
              </div>

              {/* Product List */}
              {products.length > 0 ? (
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                  <table className="min-w-full text-sm sm:text-base overflow-x-auto">
                  <thead>
                      <tr className="text-left font-medium bg-gray-100">
                       
                        <th className="p-2">Product Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Price (XOF)</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-t">
                         
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.category}</td>
                          <td className="p-2 text-[#7C0DEA]">
                            {product.price}
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
                                        ? product.status
                                            .charAt(0)
                                            .toUpperCase() +
                                          product.status.slice(1)
                                        : "N/A"}
                                    </span>
                                  </td>                          <td className="p-2">
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleDateString()
                              : "N/A"}
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
