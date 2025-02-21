import React, { useState, useEffect } from "react";

function Verify() {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      document.getElementById(`input-${index + 1}`).focus();
    }

    setError("");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      const response = await fetch("https://e-service-v2s8.onrender.com/api/auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, code: verificationCode }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Verification failed");

      console.log("Verification successful:", data);
      alert("Phone number verified successfully!");
    } catch (error) {
      console.error("Error verifying phone:", error);
      setError(error.message || "Failed to verify code. Please try again.");
    }
  };

  const handleResendCode = async () => {
    setIsResendDisabled(true);
    setCountdown(60); // Restart the countdown

    try {
      const response = await fetch("https://e-service-v2s8.onrender.com/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to resend code");

      console.log("Code resent successfully:", data);
      alert("A new verification code has been sent!");
    } catch (error) {
      console.error("Error resending code:", error);
      setError(error.message || "Failed to resend code. Please try again.");
      setIsResendDisabled(false);
    }
  };

  return (
    <div className="bg-white flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full p-6 rounded-lg">
        <div className="mb-6 flex justify-center">
          <img
            src="https://via.placeholder.com/150x50"
            alt="Logo"
            className="h-12"
          />
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">Verify Phone Number</h2>
          <p className="text-gray-600 mt-2">
            Enter the code sent to: <span className="font-bold">{phoneNumber || "Not provided"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`input-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border rounded text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded w-full"
          >
            Verify code
          </button>

          <div className="text-center text-gray-600 mt-2">
            {countdown > 0 ? (
              <span>Resend code in <span className="font-bold">{countdown}s</span></span>
            ) : (
              <button
                onClick={handleResendCode}
                className="text-purple-500 font-bold hover:underline"
                disabled={isResendDisabled}
              >
                Resend Code
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Verify;
