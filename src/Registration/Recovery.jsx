import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Recovery() {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [token, setToken] = useState(""); // Store reset token
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    // Retrieve token from local storage (this should have been set previously)
    const storedToken = localStorage.getItem("resetToken");
    if (storedToken) {
      setToken(storedToken);
    }

    // Countdown timer logic
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer]);

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

  const handleResendCode = () => {
    alert("Resend code functionality triggered!");
    setTimer(60);
    setCanResend(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setError("");
      console.log("Verifying code:", verificationCode);

      // Call verify-reset-token endpoint
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationCode }), // Use the entered code as the token
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid reset token.");

      alert("Verification successful! Proceeding to reset password...");
      localStorage.setItem("resetToken", verificationCode); // Store token for reset step
      navigate("/reset-password"); // Redirect to reset password page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className=" lg:flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-white rounded-lg lg:shadow-lg">
        <div className="mb-6 flex justify-center">
          <img
            src="https://via.placeholder.com/150x50"
            alt="Logo"
            className="h-12"
          />
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-800">Enter Code</h2>
          <p className="text-gray-600 mt-2">Enter the 6-digit code sent to your email</p>
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

          <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded w-full">
            Verify Code
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive a code?{" "}
            <button
              onClick={handleResendCode}
              className={`text-purple-500 hover:underline ${!canResend && "cursor-not-allowed text-gray-400"}`}
              disabled={!canResend}
            >
              Resend Code {timer > 0 && `(${timer}s)`}
            </button>
          </p>
          <Link to="/login">
            <button className="text-sm text-purple-500 underline mt-6">Back to Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Recovery;
