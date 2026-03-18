// src/pages/AllUserBids.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, Calendar, Target, Hash, Info } from "lucide-react";
import { API_URL } from "../../config";

export default function AllUserBids() {
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);

  const token = localStorage.getItem("accessToken") || "";
  const headers = { Authorization: `Bearer ${token}` };

  const marketCache = {};

  const getMarketName = async (marketId) => {
    if (marketCache[marketId]) return marketCache[marketId];
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/Golidesawar/market/${marketId}`,
        { headers }
      );
      const name = res.data?.data?.name || "Unknown Market";
      marketCache[marketId] = name;
      return name;
    } catch {
      return "Unknown Market";
    }
  };

  const loadAllUserBids = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/Golidesawar/bids/all`, {
        headers,
      });
      const list = res.data?.data || [];
      const finalList = await Promise.all(
        list.map(async (b) => ({
          ...b,
          market_name: await getMarketName(b.market_id),
        }))
      );
      setBids(finalList);
    } catch (err) {
      console.error("Error fetching all user bids:", err);
      setBids([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllUserBids();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4">Loading Your Bids...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-24">
      {/* THEME HEADER - Using your new standard structure */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/10 rounded-full active:scale-90 transition"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-lg font-black uppercase tracking-widest italic text-center flex-1">
              Gali Bids History
            </h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* INFO SUMMARY */}
        <div className="bg-white rounded-[30px] p-5 shadow-md border border-gray-100 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-teal-50 p-3 rounded-2xl text-teal-600">
              <Target size={24} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Total Active Bids</p>
              <p className="text-xl font-black text-gray-800 tracking-tighter">{bids.length} Records</p>
            </div>
          </div>
          <Info className="text-teal-600 opacity-20" size={32} />
        </div>

        {/* BIDS LIST */}
        <div className="space-y-4">
          {bids.length === 0 ? (
            <div className="bg-white p-12 rounded-[35px] shadow-lg text-center border border-gray-100">
              <Hash size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No bids found yet</p>
            </div>
          ) : (
            bids.map((b, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
              >
                {/* MARKET & POINTS */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase leading-tight">
                      {b.market_name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase italic">
                        {b.game_type}
                      </span>
                      {b.session && (
                         <span className="text-[9px] font-black text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 uppercase italic">
                          {b.session}
                         </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1 tracking-tighter">Amount</p>
                    <p className="text-xl font-black text-[#005d54] tracking-tighter">₹{b.points}</p>
                  </div>
                </div>

                {/* DIGIT DATA BOX */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                      {b.game_type === "jodi" ? "Selected Jodi" : "Selected Digit"}
                    </span>
                    <span className="text-xs font-bold text-gray-700 uppercase">
                      {b.game_type === "jodi" ? "Full Pair" : b.session} Game
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-teal-700 bg-white border border-teal-100 w-12 h-12 flex items-center justify-center rounded-xl shadow-sm">
                      {b.game_type === "jodi"
                        ? `${b.open_digit}${b.close_digit}`
                        : b.session === "open"
                        ? b.open_digit
                        : b.close_digit}
                    </span>
                  </div>
                </div>

                {/* TIME FOOTER */}
                <div className="flex items-center gap-2 mt-4 text-[9px] text-gray-400 font-bold px-1 uppercase tracking-tighter">
                  <Calendar size={11} />
                  <span>
                    {new Date(new Date(b.created_at).getTime() + 5.5 * 60 * 60 * 1000)
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}