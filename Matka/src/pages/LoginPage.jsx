import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LogIn,
  User,
  Power,
  Loader2,
  Smartphone,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { API_URL } from "../config";
import logo from "../assets/logo.png";
const API_BASE_URL = API_URL;
import { fetchSiteData } from "../components/layout/fetchSiteData";

const LoadingSpinner = () => <Loader2 className="animate-spin h-5 w-5 mr-2" />;

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [shake, setShake] = useState(false);
  const [site, setSite] = useState(null);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // setUser(response.data); // Assuming setUser exists in your state
      } catch (err) {
        console.log("Fetch user error", err);
      }
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (token) {
      setMessage({ type: "info", text: "You are already logged in!" });
    }
    (async () => {
      const data = await fetchSiteData();
      setSite(data);
    })();
  }, [token]);

  const showError = (text) => {
    setMessage({ type: "error", text });
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleLogin = async () => {
    if (!mobile || !password || mobile.length !== 10) {
      showError("Enter valid 10-digit mobile & password.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/token`,
        { mobile, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("userId", data.userId);

      setMessage({ type: "success", text: "Login Successful!" });
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      if (err.response) {
        const detail = err.response.data.detail;
        showError(typeof detail === "string" ? detail : "Incorrect mobile or password!");
      } else {
        showError("Server connection failed.");
      }
    }
    setIsLoading(false);
  };

  const Message = ({ type, text }) => {
    if (!text) return null;
    let bgColor = "bg-gray-100 text-gray-800 border-gray-300";
    if (type === "error") bgColor = "bg-red-100 border-red-500 text-red-700";
    if (type === "success") bgColor = "bg-teal-100 border-teal-500 text-teal-700";
    if (type === "info") bgColor = "bg-blue-100 border-blue-500 text-blue-700";

    return (
      <div className={`p-3 rounded-lg flex items-center gap-2 mt-3 border shadow-sm ${bgColor} ${type === "error" && shake ? "animate-shake" : ""}`}>
        <ShieldAlert className="h-5 w-5" />
        <span className="text-sm font-medium">{text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
        <div className="flex flex-col items-center mb-6">
          <div className="p-1 bg-teal-600 rounded-full mb-4 shadow-lg">
             <img src={logo} className="h-24 w-24 rounded-full object-cover border-2 border-white" alt="Logo" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#00695c]">Satka Matka</h1>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-semibold">Secure Login</p>
        </div>

        {message && <Message type={message.type} text={message.text} />}

        {/* MOBILE INPUT */}
        <div className="mt-6">
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
          </div>
        </div>

        {/* PASSWORD INPUT */}
        <div className="mt-4">
          <label className="text-gray-600 block mb-1 text-xs font-bold uppercase tracking-tight">Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-11 py-3 rounded-xl bg-gray-50 text-gray-800 border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 h-5 w-5" />
          </div>
        </div>

        {/* LOGIN BUTTON - Teal Theme */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full mt-8 flex items-center justify-center bg-gradient-to-r from-[#00695c] to-[#00897b] text-white font-bold py-3.5 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider"
        >
          {isLoading ? (
            <><LoadingSpinner /> Authenticating...</>
          ) : (
            <><LogIn size={20} className="mr-2" /> Login Now</>
          )}
        </button>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
            <p className="text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-teal-600 font-bold hover:underline">SignUp</a>
            </p>
            
            <p className="text-center text-sm">
              <a
                href={`https://wa.me/${site?.whatsapp_number}`}
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700"
                target="_blank"
                rel="noreferrer"
              >
                <span className="mr-1">Support:</span> WhatsApp Help
              </a>
            </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}