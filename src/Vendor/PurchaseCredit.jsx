import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaRegCopy } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const PurchaseCredit = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [showSubmitPayment, setShowSubmitPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({
    referenceId: "", // Changed from 'reference'
    transferNumber: "", // Changed from 'phoneNumber'
    paymentDate: "",
  });
  useEffect(() => {
    if ((showSummary || showSubmitPayment) && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSummary, showSubmitPayment, timeLeft]);

  const validateSelection = () => {
    if (!selectedAmount) {
      setErrorMessage("Please select a credit amount.");
      return false;
    }
    if (!paymentMethod) {
      setErrorMessage("Please select a payment method.");
      return false;
    }
    return true;
  };

  const validatePaymentDetails = () => {
    if (!paymentDetails.transferNumber) {
      setErrorMessage("Please enter the phone number used for payment.");
      return false;
    }
    if (!paymentDetails.paymentDate) {
      setErrorMessage("Please select the payment date.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setErrorMessage("");
    if (validateSelection()) {
      setShowSummary(true);
    }
  };

  const handleProceedToPayment = () => {
    setShowSummary(false);
    setShowSubmitPayment(true);
  };

  const handlePaymentDetailChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const generateWhatsAppLink = () => {
    const message = `Bonjour, veuillez confirmer le paiement de ${selectedAmount} XOF depuis le numéro de téléphone ${paymentDetails.transferNumber}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/+221774127742?text=${encodedMessage}`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!validatePaymentDetails()) {
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication error. Please log in again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/credits/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: selectedAmount,
          paymentMethod,
          ...paymentDetails, // Now includes ReferenceId and TeansferNumber directly
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment processing failed.");
      }

      const data = await response.json();
      setTransactionId(data.transactionId || uuidv4());
      setShowSuccessModal(true);
    } catch (error) {
      setErrorMessage(
        error.message || "Network error. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/credits");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("123456789");
    alert("Account number copied to clipboard!");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleBack = () => {
    if (showSubmitPayment) {
      setShowSubmitPayment(false);
      setShowSummary(true);
    } else if (showSummary) {
      setShowSummary(false);
    } else {
      // Navigate to credits page when Cancel is clicked from the first screen
      navigate("/credits");
    }
  };

  return (
    <Layout>
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {/* Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h4 className="text-lg font-semibold text-red-500 mb-2">Error</h4>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="mt-2 py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h4 className="text-lg font-semibold text-green-500 mb-2">
              Success
            </h4>
            <p className="text-gray-700 mb-4">
              Payment submitted successfully! Your credits will be added after
              verification.
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Contact admin for faster verification:
            </p>
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Message Admin on WhatsApp
            </a>
            <button
              onClick={handleCloseSuccessModal}
              className="mt-2 py-2 px-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Header with navigation buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md rounded-lg px-6 py-4 mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-0">
          Purchase Credits
        </h3>
        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {showSubmitPayment || showSummary ? "Back" : "Cancel"}
          </button>
          {!showSummary && !showSubmitPayment && (
            <button
              onClick={handleNext}
              disabled={isLoading}
              className={`py-2 px-4 text-white rounded-lg ${
                isLoading
                  ? "bg-purple-400"
                  : "bg-purple-500 hover:bg-purple-600"
              }`}
            >
              Next
            </button>
          )}
          {showSummary && (
            <button
              onClick={handleProceedToPayment}
              className="py-2 px-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Submit your Payment
            </button>
          )}
        </div>
      </div>

      {!showSummary && !showSubmitPayment ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credit Package Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-4">Credit Packages</h4>
            <div className="space-y-3">
              {[1000, 2000, 5000].map((amount) => (
                <div
                  key={amount}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setErrorMessage("");
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAmount === amount
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedAmount === amount
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAmount === amount && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="text-gray-700">
                      {amount} XOF = {amount / 1000} credit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-lg font-semibold mb-4">Payment Methods</h4>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  id: "orange_money",
                  label: "Orange Money",
                  img: "/orange.png",
                },
                { id: "wave", label: "Wave Money", img: "/wave.png" },
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => {
                    setPaymentMethod(method.id);
                    setErrorMessage("");
                  }}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        paymentMethod === method.id
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <img
                      src={method.img}
                      alt={method.label}
                      className="h-8 object-contain"
                    />
                    <span className="ml-3 text-gray-700">{method.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : showSummary ? (
        <div className="">
          {/* Payment Summary */}

          {/* Payment Instructions */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold mb-4 border-b pb-2">
                Payment Instructions
              </h4>
              <div className="pt-3 mt-3 mb-3 border-b">
                <div className="flex flex-col items-center mb-4">
                  {/* Show Wave or Orange Money logo based on payment method */}
                  {paymentMethod === "wave" ? (
                    <img
                      src="/wave.png"
                      alt="Wave Money"
                      className="h-16 object-contain mb-3"
                    />
                  ) : (
                    <img
                      src="/orange.png"
                      alt="Orange Money"
                      className="h-16 object-contain mb-3"
                    />
                  )}
                  <p className="lg:text-3xl md:text-2xl font-medium text-black text-center">
                    Transfer the exact amount {selectedAmount} XOF to the{" "}
                    {paymentMethod === "wave" ? "Wave Money" : "Orange Money"}{" "}
                    account below.
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-center">
                {/* WhatsApp Contact Button */}
                <a
                  href="https://wa.me/+221774127742?text=J'ai%20besoin%20d'acheter%20du%20crédit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 py-3 px-6 bg-green-500 text-white text-center rounded-lg hover:bg-green-600 transition"
                >
                  Please Contact your dedicated sales on WhatsApp by clicking
                  here
                </a>
                <hr />
                <p>Click on submit your payment to continue</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">
            In order for Admin to approve your payment, kindly fill the form
            below
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600 mb-1">Amount:</p>
                <p className="font-medium text-primary">{selectedAmount} XOF</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Payment Method:</p>
                <p className="font-medium capitalize">
                  {paymentMethod.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Payment Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Payment Reference
                </label>
                <input
                  type="text"
                  name="referenceId" // Changed from 'reference'
                  value={paymentDetails.referenceId}
                  onChange={handlePaymentDetailChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Phone Number Used *
                </label>
                <input
                  type="tel"
                  name="transferNumber" // Changed from 'phoneNumber'
                  value={paymentDetails.transferNumber}
                  onChange={handlePaymentDetailChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  value={paymentDetails.paymentDate}
                  onChange={handlePaymentDetailChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={handleBack}
              className="py-2 px-4 text-gray-700 hover:text-purple-500"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`py-2 px-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Confirming..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};

export default PurchaseCredit;
