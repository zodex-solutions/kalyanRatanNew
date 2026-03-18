// src/pages/WinHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, Trophy, Calendar, Target, Award, Star } from "lucide-react";
import { API_URL } from "../../config";

export default function GWinHistory() {
  const [loading, setLoading] = useState(true);
  const [wins, setWins] = useState([]);

  const token = localStorage.getItem("accessToken") || "";
  const headers = { Authorization: `Bearer ${token}` };

  const marketCache = {};

  const getMarketName = async (marketId) => {
    if (marketId === undefined) return "Market";
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

  const loadWinHistory = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/Golidesawar/win-history`,
        { headers }
      );
      const list = res.data?.wins || [];

      const finalList = await Promise.all(
        list.map(async (w) => ({
          ...w,
          market_name: await getMarketName(w.market_id),
        }))
      );

      setWins(finalList);
    } catch (err) {
      console.log("Error fetching win history:", err);
      setWins([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWinHistory();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4">Fetching Victories...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-24">
      {/* THEME HEADER - Full-width background with centered content */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/10 rounded-full active:scale-90 transition"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-lg font-black uppercase tracking-widest italic text-center flex-1">
              Gali Win History
            </h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* TOTAL WINS SUMMARY */}
        <div className="bg-white rounded-[30px] p-5 shadow-md border border-gray-100 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
              <Trophy size={24} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Total Victories</p>
              <p className="text-xl font-black text-gray-800 tracking-tighter">{wins.length} Games Won</p>
            </div>
          </div>
          <Star className="text-yellow-400 fill-yellow-400 opacity-20" size={32} />
        </div>

        {/* WIN LIST */}
        {wins.length === 0 ? (
          <div className="bg-white p-12 rounded-[35px] shadow-lg text-center border border-gray-100">
            <Target size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No wins recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {wins.map((w, i) => {
              const gameType = w.game_type || "-";
              const session = w.session || "";
              const openDigit = w.open_digit ?? "-";
              const closeDigit = w.close_digit ?? "-";

              const displayDigit =
                gameType === "jodi"
                  ? `${openDigit}${closeDigit}`
                  : session === "open"
                  ? openDigit
                  : closeDigit;

              const createdTime = w.created_at || w.date;

              return (
                <div
                  key={w._id || i}
                  className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
                >
                  {/* MARKET & WIN AMOUNT */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-black text-gray-800 uppercase leading-tight">
                        {w.market_name || "Unknown"}
                      </h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase italic">
                          {gameType}
                        </span>
                        {session && (
                           <span className="text-[9px] font-black text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 uppercase italic">
                            {session}
                           </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-green-600 uppercase leading-none mb-1 tracking-tighter">Net Profit</p>
                      <p className="text-xl font-black text-green-600 tracking-tighter">₹{w.win_amount ?? 0}</p>
                    </div>
                  </div>

                  {/* GAME DATA GRID */}
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-400 uppercase">Played Pts</span>
                      <span className="text-xs font-bold text-gray-700">{w.points ?? 0} Points</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-black text-gray-400 uppercase">
                        {gameType === "jodi" ? "Winning Jodi" : "Winning Digit"}
                      </span>
                      <span className="text-xs font-black text-teal-700 bg-white border border-teal-100 inline-block px-3 py-0.5 rounded-full self-end">
                        {displayDigit}
                      </span>
                    </div>
                  </div>

                  {/* RESULT BAR */}
                  <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-2 flex justify-between items-center px-4">
                    <span className="text-[10px] font-black text-teal-800 uppercase flex items-center gap-1">
                      <Award size={12} /> Declared:
                    </span>
                    <span className="text-xs font-black text-gray-600 tracking-widest italic">
                      {w.open_digit ?? "-"} — {w.close_digit ?? "-"}
                    </span>
                  </div>

                  {/* FOOTER DATE */}
                  {createdTime && (
                    <div className="flex items-center gap-2 mt-4 text-[9px] text-gray-400 font-bold px-1 uppercase tracking-tighter">
                      <Calendar size={11} />
                      <span>
                        {new Date(new Date(createdTime).getTime() + 5.5 * 60 * 60 * 1000)
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}