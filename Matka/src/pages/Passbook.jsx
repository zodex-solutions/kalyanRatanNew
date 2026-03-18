import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Loader,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  History,
} from "lucide-react";
import { API_URL } from "../config";

const API_BASE = `${API_URL}/passbook/history`;

export default function Passbook() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const token = localStorage.getItem("accessToken");

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          start_date: startDate || null,
          end_date: endDate || null,
        },
      });
      setHistory(res.data.history || []);
    } catch (err) {
      console.log("Passbook error:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getStatusConfig = (type) => {
    switch (type) {
      case "DEPOSIT":
      case "WIN":
      case "QR_DEPOSIT":
        return { color: "text-green-600", bg: "bg-green-50", icon: <ArrowDownLeft size={16} /> };
      case "WITHDRAWAL":
      case "BID":
        return { color: "text-red-600", bg: "bg-red-50", icon: <ArrowUpRight size={16} /> };
      default:
        return { color: "text-gray-600", bg: "bg-gray-50", icon: <History size={16} /> };
    }
  };

  const getAmountText = (item) => {
    if (item.type === "BID") return `-${item.debit}`;
    if (item.type === "WITHDRAWAL") return `-${item.amount}`;
    return `+${item.amount}`;
  };

  const getTitle = (item) => {
    if (item.type === "DEPOSIT") return "Deposit Added";
    if (item.type === "WIN") return "Winning Amount";
    if (item.type === "WITHDRAWAL") return "Withdrawal";
    if (item.type === "BID") return `Bid Placed (${item.game_type})`;
    if (item.type === "QR_DEPOSIT") return "QR Deposit";
    return item.type;
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-32">
      {/* THEME HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => window.history.back()} className="p-2 bg-white/10 rounded-full active:scale-90 transition">
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-black uppercase tracking-widest italic">Passbook</h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-8 relative z-30">
        {/* FILTERS CARD */}
        <div className="bg-white p-5 rounded-[25px] shadow-xl border border-gray-100 mb-6">
          <div className="flex items-center gap-2 mb-4 text-[#005d54]">
             <Filter size={18} strokeWidth={3} />
             <span className="font-black text-xs uppercase tracking-tighter">Filter by Date</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">From</label>
              <input
                type="date"
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold outline-none focus:border-teal-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">To</label>
              <input
                type="date"
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold outline-none focus:border-teal-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={fetchHistory}
            className="mt-4 w-full bg-[#005d54] text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-md active:scale-95 transition"
          >
            Apply Filter
          </button>
        </div>

        {/* HISTORY LIST */}
        {loading ? (
          <div className="bg-white p-10 rounded-3xl shadow-lg flex flex-col items-center gap-3 text-center">
            <Loader size={32} className="animate-spin text-[#005d54]" />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Updating Records...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
            <Calendar size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-bold text-sm">No transactions found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => {
              const config = getStatusConfig(item.type);
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center active:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${config.bg} ${config.color} p-3 rounded-xl`}>
                      {config.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-800 uppercase tracking-tighter leading-tight">
                        {getTitle(item)}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                        {new Date(item.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {item.type === "BID" && (
                         <p className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-teal-100">
                           {item.market_id} • {item.session} • DIGIT: {item.digit}
                         </p>
                      )}
                    </div>
                  </div>

                  <div className={`text-right ${config.color}`}>
                    <span className="text-xs font-black uppercase tracking-tighter block leading-none">Status</span>
                    <span className="text-lg font-black tracking-tighter">₹{getAmountText(item)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}