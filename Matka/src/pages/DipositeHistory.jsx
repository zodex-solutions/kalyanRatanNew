// src/pages/DepositHistory.jsx
import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { API_URL } from "../config";
import axios from "axios";

export default function DepositHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("accessToken");

  // Status UI Logic
  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS":
        return {
          label: "Approved",
          color: "text-green-600",
          bg: "bg-green-50",
          icon: <CheckCircle2 size={14} />,
          border: "border-green-100"
        };
      case "FAILED":
        return {
          label: "Rejected",
          color: "text-red-600",
          bg: "bg-red-50",
          icon: <XCircle size={14} />,
          border: "border-red-100"
        };
      default:
        return {
          label: "Pending",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          icon: <Clock size={14} />,
          border: "border-yellow-100"
        };
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/deposit-qr/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data.history || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch deposit records.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4">Loading Records...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-24">
      {/* NEW STANDARD THEME HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/10 rounded-full active:scale-90 transition"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-lg font-black uppercase tracking-widest italic text-center flex-1">
              Deposit History
            </h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {error && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 mb-4 text-red-600 text-xs font-bold uppercase italic">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* RECORDS LIST */}
        <div className="space-y-4">
          {history.length === 0 && !error ? (
            <div className="bg-white p-12 rounded-[35px] shadow-lg text-center border border-gray-100">
              <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No deposits found</p>
            </div>
          ) : (
            history.map((item, i) => {
              const status = getStatusInfo(item.status);
              return (
                <div
                  key={item._id || i}
                  className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100 transition-all overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* LEFT: SCREENSHOT PREVIEW */}
                    <div className="relative group shrink-0">
                      {item.image_url ? (
                        <a
                          href={`${API_URL}${item.image_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative"
                        >
                          <img
                            src={`${API_URL}${item.image_url}`}
                            alt="Receipt"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-50 shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                            <ExternalLink size={14} className="text-white" />
                          </div>
                        </a>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>

                    {/* CENTER: DETAILS */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xl font-black text-gray-800 tracking-tighter">
                          ₹{item.amount?.toFixed(0) || 0}
                        </p>
                        <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg border ${status.bg} ${status.color} ${status.border}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold uppercase tracking-tight italic">
                        <Calendar size={10} />
                        <span>
                          {new Date(new Date(item.uploaded_at || item.created_at).getTime() + 5.5 * 60 * 60 * 1000).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM: FOOTER INFO */}
                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[2px]">Deposit Request</p>
                    <p className="text-[9px] font-bold text-[#005d54] italic">Points Topup</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}