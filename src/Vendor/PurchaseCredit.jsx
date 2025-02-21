import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { FaRegCopy } from "react-icons/fa6";

const PurchaseCredit = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3592);

  useEffect(() => {
    if (showSummary) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showSummary]);

  const handleSubmit = async () => {
    if (!selectedAmount || !paymentMethod) {
      setErrorMessage("Please select an amount and a payment method.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErrorMessage("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "https://e-service-v2s8.onrender.com/api/credits/purchase",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: selectedAmount,
            paymentMethod,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong.");
      }

      const data = await response.json();
      setTransactionId(data.transactionId || uuidv4());
      setShowSummary(true);
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("123456789");
    alert("Account number copied!");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6">
      {errorMessage && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center w-80 md:w-96">
            <h4 className="text-lg font-semibold text-red-500">Error</h4>
            <p className="text-gray-700 my-2">{errorMessage}</p>
            <button
              onClick={() => setErrorMessage("")}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md rounded-lg px-4 py-3 md:px-6">
        <h3 className="text-lg md:text-xl font-semibold">
          Purchase More Credits
        </h3>
        <div className="space-x-4 mt-3 md:mt-0">
          <button
            className="py-1 px-4 text-sm border border-gray-700 text-black rounded-lg"
            onClick={() => setShowSummary(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="py-1 px-4 text-sm bg-purple-500 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>

      {!showSummary ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Credit Package Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-2 font-semibold">Choose Credit Package:</p>
            <div className="space-y-2">
              {[1, 2, 5].map((amount) => (
                <label key={amount} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="amount"
                    value={amount}
                    checked={selectedAmount === amount}
                    onChange={() => setSelectedAmount(amount)}
                    className="form-radio text-purple-500"
                  />
                  <span className="text-gray-700">
                    {amount} Credit = {amount * 1000} CFA
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="mb-2 font-semibold">Choose Payment Method:</p>
            <div className="flex flex-col md:flex-row gap-4">
              {["orange", "wave"].map((method) => (
                <div
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`border p-4 rounded-lg cursor-pointer w-full ${
                    paymentMethod === method
                      ? "border-purple-500"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={`/${method}.png`}
                    className="w-28 mx-auto"
                    alt={method}
                  />
                  <p className="text-center capitalize text-gray-700">
                    Pay with {method} Money
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Payment Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold border-b pb-2">
              Payment Summary
            </h3>
            <p>
              <strong>Credit:</strong> {selectedAmount} credits
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {paymentMethod === "wave" ? "Wave Money" : "Orange Money"}
            </p>
            <p>
              <strong>Transaction ID:</strong> #{transactionId}
            </p>
            <p>
              <strong>Total Amount:</strong> {selectedAmount * 1000} CFA
            </p>
          </div>
          <div className="space-y-8">
            {/* Bank Transfer Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-semibold border-b pb-2">
                Pay with Bank Transfer
              </h4>
              <p>
                <strong>Bank Name:</strong>{" "}
                {paymentMethod === "wave" ? "Wave Money" : "Orange Money"}
              </p>
              <p>
                <strong>Account Name:</strong> XYZ Services
              </p>
              <p className="flex items-center">
                <strong>Account Number:</strong> 123456789
                <button
                  onClick={copyToClipboard}
                  className="ml-2 text-purple-500"
                >
                  <FaRegCopy size={16} />
                </button>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Note: Kindly transfer the exact amount to the account details
                above.
              </p>
              <p className="text-sm text-red-500 mt-2">
                Account number is valid for {formatTime(timeLeft)}
              </p>
            </div>

            <div className="shadow-md p-4 rounded-lg space-y-3 w-full bg-white">
              <button className="py-2 px-4 w-full bg-purple-500 text-white text-sm rounded-xl">
                I've Sent the Money
              </button>
              <button
                onClick={() => setShowSummary(false)}
                className=" text-black text-sm w-full"
              >
                Change Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseCredit;
