// src/pages/JackpotGame.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play, Info, ArrowLeft, History, Trophy, TrendingUp, Loader2, ChevronRight, Timer } from "lucide-react";
import { FaChartLine } from "react-icons/fa6";
import { API_URL } from "../../config";

export default function JackpotGame() {
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const getId = (obj) => {
    if (!obj) return null;
    if (obj._id?.$oid) return obj._id.$oid;
    if (typeof obj._id === "string") return obj._id;
    if (obj.id) return obj.id;
    return null;
  };

  const fetchMarkets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/Golidesawar/market`, {
        headers,
      });

      const list = (res.data?.data || []).map((m) => ({
        id: getId(m),
        name: m.name,
        openTime: m.open_time,
        closeTime: m.close_time,
        status: m.status,
        today_result: m.today_result || null,
      }));

      setMarkets(list);
    } catch (err) {
      console.log("User Golidesawar load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarkets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4 italic">Loading Jackpot...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-32">
      {/* NEW STANDARD HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
            <button onClick={() => window.history.back()} className="p-2 bg-white/10 rounded-full active:scale-90 transition">
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-lg font-black uppercase tracking-widest italic text-center flex-1">Golidesawar</h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        
        {/* GAME RATES PANEL */}
        <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-100 mb-6 grid grid-cols-3 gap-2">
            {[
              { label: "Left Digit", val: `10–100` },
              { label: "Right Digit", val: `10–100` },
              { label: "Jodi Digit", val: `10–1000` },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center border-r last:border-0 border-gray-100">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter text-center">{item.label}</p>
                <p className="text-[10px] font-black text-[#005d54] italic">{item.val}</p>
              </div>
            ))}
        </div>

        {/* HISTORY QUICK LINKS */}
        <div className="flex gap-3 mb-6">
          <a href="/king-bids-history" className="flex-1 bg-white py-3 px-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition text-left">
            <div className="flex items-center gap-2">
              <History size={16} className="text-teal-600" />
              <span className="text-[10px] font-black uppercase tracking-tight text-gray-600">Bids</span>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </a>
          <a href="/king-win-history" className="flex-1 bg-white py-3 px-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition text-left">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-600" />
              <span className="text-[10px] font-black uppercase tracking-tight text-gray-600">Wins</span>
            </div>
            <ChevronRight size={14} className="text-gray-300" />
          </a>
        </div>

        {/* MARKETS LIST */}
        <div className="space-y-4">
          {markets.map((mkt) => {
            const openDigit = mkt.today_result?.open_digit || "X";
            const closeDigit = mkt.today_result?.close_digit || "X";
            const marketOpen = mkt.status === true;

            return (
              <div key={mkt.id} className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
                <div className="flex items-center gap-4">
                  {/* PLAY BUTTON */}
                  <a
                    href={marketOpen ? `/king/${mkt.id}` : "#"}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner ${
                      marketOpen ? "bg-teal-50 text-[#005d54] border border-teal-100 animate-pulse" : "bg-red-50 text-red-300 border border-red-100 grayscale cursor-not-allowed"
                    }`}
                  >
                    <Play size={24} fill={marketOpen ? "currentColor" : "none"} className={marketOpen ? "ml-1" : ""} />
                  </a>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xs font-black uppercase text-gray-800 tracking-tight leading-none">{mkt.name}</h3>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic ${marketOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {marketOpen ? "Running" : "Closed"}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-black text-[#005d54] tracking-tighter italic">
                      {openDigit}-{closeDigit}
                    </h2>

                    <div className="flex items-center gap-3 text-[8px] font-bold text-gray-400 uppercase tracking-tighter italic">
                      <span className="flex items-center gap-1"><Timer size={10}/> {mkt.openTime}</span>
                      <span className="text-gray-200">|</span>
                      <span>{mkt.closeTime}</span>
                    </div>
                  </div>
                </div>

                {/* CHART BUTTON */}
                <a href={`/GCharts/${mkt.id}`} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 text-[#005d54] active:scale-90 transition shadow-sm">
                  <FaChartLine size={20} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}