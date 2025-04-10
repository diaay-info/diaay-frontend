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

  const isPurchaseCreditPage = location.pathname.includes("purchasecredit");

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
          "https://e-service-v2s8.onrender.com/api/credits/balance",
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
          `https://e-service-v2s8.onrender.com/api/report`,
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

  // Select/Deselect all products
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product._id));
    }
    setSelectAll(!selectAll);
  };

  // Toggle individual product selection
  const handleProductSelect = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };
  const handlePurchaseCreditToggle = () => {
    setIsPurchaseCredit(!isPurchaseCredit);
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen p-2">
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
                  {creditBalance !== null
                    ? `${creditBalance} Credits Remaining`
                    : "Loading..."}
                </h1>
              </div>

              {/* Product List */}
              {products.length > 0 ? (
                <div className="mt-4 bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
                  <table className="w-full min-w-[600px]">
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
                          <td className="p-2 text-green-600">Active</td>
                          <td className="p-2">
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
