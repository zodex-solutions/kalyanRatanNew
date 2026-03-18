import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Info,
  ArrowLeft,
  Calendar,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { API_URL } from "../config";

const getAuthToken = () => localStorage.getItem("accessToken");

export default function MyWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status Badge Logic (Styled like Rajan Matka App)
  const getStatusDisplay = (status) => {
    switch (status) {
      case "success":
        return (
          <span className="flex items-center gap-1 font-black text-[10px] px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 uppercase">
            <CheckCircle size={12} /> Paid
          </span>
        );
      case "rejected":
        return (
          <span className="flex items-center gap-1 font-black text-[10px] px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 uppercase">
            <XCircle size={12} /> Rejected
          </span>
        );
      case "pending":
      default:
        return (
          <span className="flex items-center gap-1 font-black text-[10px] px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 uppercase">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      const token = getAuthToken();

      if (!token) {
        setError("Please log in to see history.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/user-deposit-withdrawal/withdraw/my`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWithdrawals(data);
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to load history.");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatTime = (isoString) => {
    if (!isoString) return "N/A";
    return new Date(isoString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-20">
      {/* THEME HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="p-2 bg-white/10 rounded-full active:scale-90 transition"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-black uppercase tracking-widest italic">Withdraw History</h2>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8">
        {/* LOADER */}
        {loading && (
          <div className="bg-white p-10 rounded-3xl shadow-xl flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#005d54]" />
            <p className="text-gray-500 font-bold animate-pulse uppercase text-xs">Fetching Records...</p>
          </div>
        )}

        {/* ERROR BOX */}
        {error && (
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center">
            <Info size={32} className="mx-auto text-red-500 mb-2" />
            <p className="text-red-700 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && withdrawals.length === 0 && (
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 text-center">
             <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-gray-400" size={30} />
             </div>
             <p className="text-gray-500 font-bold text-sm uppercase">No withdrawals found</p>
          </div>
        )}

        {/* WITHDRAWAL CARDS LIST */}
        {!loading && withdrawals.length > 0 && (
          <div className="space-y-4">
            {withdrawals.map((w) => (
              <div key={w.wd_id} className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 active:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-3 rounded-2xl">
                      <ArrowUpRight className="text-[#005d54]" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Amount</p>
                      <p className="text-xl font-black text-[#005d54]">₹{w.amount.toFixed(2)}</p>
                    </div>
                  </div>
                  {getStatusDisplay(w.status)}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase">Method</span>
                    <span className="text-gray-800 font-black uppercase">{w.method}</span>
                  </div>
                  
                  {w.method === "Bank Transfer" ? (
                    <div className="pt-2 border-t border-gray-200 mt-2 space-y-1">
                      <p className="text-[11px] font-bold text-gray-600 uppercase">A/C: {w.account_no}</p>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">IFSC: {w.ifc_code}</p>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-gray-200 mt-2">
                       <p className="text-xs font-bold text-teal-700 tracking-wider">ID: {w.number}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-400 font-bold px-1">
                   <Calendar size={12} />
                   <span>{formatTime(w.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}