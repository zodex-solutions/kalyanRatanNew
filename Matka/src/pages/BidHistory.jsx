// src/pages/BidHistory.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { ArrowLeft, Loader, Filter, Calendar, Hash, Target } from "lucide-react";

const API_BASE = `${API_URL}`;

export default function BidHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [marketCache, setMarketCache] = useState({});

  const token = localStorage.getItem("accessToken");

  const authHeader = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchMarketInfo = useCallback(
    async (marketId) => {
      if (!marketId) return null;
      if (marketCache[marketId]) return marketCache[marketId];

      try {
        const res = await axios.get(
          `${API_BASE}/api/admin/market/${marketId}`,
          { headers: authHeader }
        );
        const data = res?.data?.data;
        if (data) {
          setMarketCache((prev) => ({ ...prev, [marketId]: data }));
          return data;
        }
      } catch (err) {
        console.log("Market fetch failed:", marketId, err);
      }
      return null;
    },
    [authHeader, marketCache]
  );

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(`${API_BASE}/bid/my-bids`, {
        headers: authHeader,
      });

      const rawHistory = Array.isArray(res.data)
        ? res.data
        : res.data.history || [];

      const historyWithMarket = await Promise.all(
        rawHistory.map(async (item) => {
          const market = await fetchMarketInfo(item.market_id);
          return { ...item, market };
        })
      );

      setHistory(historyWithMarket);
    } catch (err) {
      console.warn("Failed to fetch history:", err?.response?.data || err.message);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [authHeader, fetchMarketInfo]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredHistory = useMemo(() => {
    if (selectedType === "All") return history;
    return history.filter((h) => h.market?.marketType === selectedType);
  }, [history, selectedType]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-24">
      {/* THEME HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="p-2 bg-white/10 rounded-full active:scale-90 transition"
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className="text-lg font-black uppercase tracking-widest italic">Bid History</h2>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* FILTER SECTION */}
        <div className="bg-white p-4 rounded-3xl shadow-md border border-gray-100 mb-6 flex items-center gap-3">
          <div className="bg-teal-50 p-2.5 rounded-xl text-[#005d54]">
            <Filter size={18} strokeWidth={3} />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full bg-transparent text-sm font-black uppercase tracking-tighter outline-none appearance-none cursor-pointer"
          >
            <option value="All">All Markets</option>
            <option value="Market">Regular Market</option>
            <option value="Starline">Starline Game</option>
          </select>
        </div>

        {/* CONTENT */}
        {loadingHistory ? (
          <div className="bg-white p-10 rounded-3xl shadow-lg flex flex-col items-center gap-3">
            <Loader className="animate-spin text-[#005d54]" size={30} />
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Loading Bids...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
            <Target size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-bold text-sm uppercase">No bids found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((h) => (
              <div
                key={h.id}
                className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98]"
              >
                {/* MARKET NAME & TYPE BADGE */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase leading-tight">
                      {h.market?.name || "Unknown Market"}
                    </h3>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase tracking-tighter">
                      {h.market?.marketType}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Points</p>
                    <p className="text-lg font-black text-[#005d54]">₹{h.points}</p>
                  </div>
                </div>

                {/* BID DETAILS GRID */}
                <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Game & Session</p>
                    <p className="text-[11px] font-bold text-gray-700 uppercase">
                      {(h.game_type || "").replace(/_/g, " ")} • {h.session}
                    </p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Chosen Digit</p>
                    <p className="text-xs font-black text-teal-700 bg-white border border-teal-100 inline-block px-3 py-0.5 rounded-full">
                      {h.digit}
                    </p>
                  </div>
                </div>

                {/* DATE FOOTER */}
                <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-400 font-bold px-1">
                  <Calendar size={12} />
                  <span>
                    {new Date(new Date(h.created_at).getTime() + 5.5 * 60 * 60 * 1000)
                      .toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}