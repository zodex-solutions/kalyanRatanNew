// AppHeader.jsx
import React, { useState, useEffect } from "react";
import { Menu, Wallet2Icon } from "lucide-react";
import { API_URL } from "../../config";

// IMPORTANT: Replace with your actual base URL
const API_BASE_URL = API_URL;

// Utility function to get the token (assumes JWT is stored in localStorage)
const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

export default function AppHeader({ setSidebar }) {
  const [balance, setBalance] = useState("...");
  const [loading, setLoading] = useState(true);

  // Function to fetch the wallet balance
  const fetchWalletBalance = async () => {
    setLoading(true);
    const token = getAuthToken();

    if (!token) {
      setBalance("Login");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/balance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Format the balance to two decimal places
        setBalance(data.balance.toFixed(2));
      } else {
        // Handle token expiration or other API errors
        setBalance("N/A");
      }
    } catch (err) {
      // Handle network errors
      setBalance("Error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch balance when the component mounts
  useEffect(() => {
    fetchWalletBalance();

    // Optional: Auto-refresh balance every 60 seconds
    const intervalId = setInterval(fetchWalletBalance, 60000);
    return () => clearInterval(intervalId);
  }, []); // Run only on mount and unmount

return (
  <header className="w-full z-40 sticky top-0">
    <div className="p-4 flex justify-between items-center max-w-md mx-auto bg-[#007b70] gradient-to-r from-[#0f766e] to-[#14b8a6] shadow-md">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebar(true)}
          className="text-white hover:opacity-80 transition"
        >
           <div className="p-1 bg-white/20 rounded-lg">
                          <Menu className="text-white h-6 w-6" />
                        </div>
        </button>

        <h1 className="text-white text-lg font-bold tracking-wide">
          KalyanRatan777
        </h1>
      </div>

      {/* RIGHT SIDE (WALLET) */}
      <div className="flex items-center gap-3">
         <button className="bg-[#005e56] px-3 py-1.5 rounded-full flex items-center gap-1 border border-teal-400/30">
          <Wallet2Icon size={18} />

          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            <span className="font-semibold">₹{balance}</span>
          )}
        </button>
      </div>
    </div>
  </header>
);
}
