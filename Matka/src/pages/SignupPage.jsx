import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Smartphone,
  Lock,
  LogIn,
  Power,
  ShieldAlert,
  CheckCircle,
  Ticket,
  Loader2,
} from "lucide-react";
import { API_URL } from "../config";
import logo from "../assets/logo.png";
import { useSearchParams } from "react-router-dom";

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [referral_code, setReferralCode] = useState(ref || "");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [shake, setShake] = useState(false);

  const triggerError = (text) => {
    setMessage({ type: "error", text });
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleSignup = async () => {
    if (!username || !mobile || mobile.length !== 10 || !password) {
      triggerError("All fields required. Mobile must be 10 digits.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await axios.post(
        `${API_URL}/auth/register`,
        {
          username,
          mobile,
          password,
          referral_code: referral_code || null,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("accessToken", res.data.access_token);
      localStorage.setItem("userId", res.data.user.id);
      
      setMessage({
        type: "success",
        text: "Registration successful! Redirecting...",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (err) {
      if (err.response?.data?.detail) {
        triggerError(err.response.data.detail);
      } else {
        triggerError("Server error. Try again.");
      }
    }
    setIsLoading(false);
  };

  const Message = ({ type, text }) => {
    if (!text) return null;

    let bg = "bg-gray-100 border-gray-300 text-gray-800";
    let Icon = ShieldAlert;

    if (type === "error") {
      bg = "bg-red-100 border border-red-500 text-red-700";
      Icon = Power;
    }
    if (type === "success") {
      bg = "bg-teal-100 border border-teal-500 text-teal-700";
      Icon = CheckCircle;
    }

    return (
      <div
        className={`p-3 mt-4 rounded-xl flex items-center gap-2 shadow-sm ${bg} ${
          type === "error" && shake ? "animate-shake" : ""
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <div className="flex flex-col items-center mb-4">
          <div className="p-1 bg-teal-600 rounded-full mb-3 shadow-lg">
            <img src={logo} className="h-24 w-24 rounded-full object-cover border-2 border-white" alt="Logo" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#00695c]">Create Account</h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-semibold">Join Satka Matka</p>
        </div>

        {message && <Message type={message.type} text={message.text} />}

        {/* Username */}
        <div className="mt-6">
          <label className="text-gray-600 block mb-1 text-xs font-bold uppercase tracking-tight">Username</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-11 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5" />
          </div>
        </div>

        {/* Mobile */}
        <div className="mt-4">
          <label className="text-gray-600 block mb-1 text-xs font-bold uppercase tracking-tight">Mobile Number</label>
          <div className="relative">
            <input
              type="text"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 10 digit mobile"
              className="w-full px-11 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
              {mobile.length}/10
            </span>
          </div>
        </div>

        {/* Password */}
        <div className="mt-4">
          <label className="text-gray-600 block mb-1 text-xs font-bold uppercase tracking-tight">Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create password"
              className="w-full px-11 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5" />
          </div>
        </div>

        {/* Referral Code */}
        <div className="mt-4">
          <label className="text-gray-600 block mb-1 text-xs font-bold uppercase tracking-tight">Referral Code (Optional)</label>
          <div className="relative">
            <input
              type="text"
              value={referral_code}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code"
              className="w-full px-11 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5" />
          </div>
        </div>

        {/* Register Button - Matching the App's Teal Gradient */}
        <button
          onClick={handleSignup}
          disabled={isLoading}
          className="w-full mt-8 flex items-center justify-center bg-gradient-to-r from-[#00695c] to-[#00897b] text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Creating...
            </>
          ) : (
            "Sign Up Now"
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-teal-600 font-bold hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}