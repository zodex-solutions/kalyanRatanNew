// src/pages/GameRatePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Loader2, IndianRupee, Star, Zap } from "lucide-react";
import { API_URL } from "../config";

export default function GameRatePage() {
  const [loading, setLoading] = useState(true);
  const [chart, setChart] = useState(null);

  const token = localStorage.getItem("accessToken") || "";
  const headers = { Authorization: `Bearer ${token}` };

  const fetchRates = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/rate/`, { headers });
      setChart(res.data);
    } catch (err) {
      console.log("Rate load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4 italic">Loading Rates...</p>
      </div>
    );

  const rates = [
    { label: "Single Digit", rate: `${chart?.single_digit_1}-${chart?.single_digit_2}`, icon: <Zap size={14} /> },
    { label: "Jodi Digit", rate: `${chart?.jodi_digit_1}-${chart?.jodi_digit_2}`, icon: <Star size={14} /> },
    { label: "Single Panna", rate: `${chart?.single_pana_1}-${chart?.single_pana_2}`, icon: <Zap size={14} /> },
    { label: "Double Panna", rate: `${chart?.double_pana_1}-${chart?.double_pana_2}`, icon: <Star size={14} /> },
    { label: "Triple Panna", rate: `${chart?.tripple_pana_1}-${chart?.tripple_pana_2}`, icon: <Star size={14} /> },
    { label: "Half Sangam", rate: `${chart?.half_sangam_1}-${chart?.half_sangam_2}`, icon: <Zap size={14} /> },
    { label: "Full Sangam", rate: `${chart?.full_sangam_1}-${chart?.full_sangam_2}`, icon: <Star size={14} /> },
  ];

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
              Game Rates
            </h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* INFO CARD */}
        <div className="bg-white rounded-[2rem] p-4 mb-6 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-teal-50 p-3 rounded-2xl text-[#005d54]">
                <IndianRupee size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Winning Ratio</p>
                <p className="text-xs font-bold text-teal-600 italic leading-none">Best Market Rates Guaranteed</p>
            </div>
        </div>

        {/* RATES LIST */}
        <div className="space-y-3">
          {rates.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white p-4 rounded-[1.8rem] shadow-sm border border-gray-100 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="text-teal-200">
                    {item.icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-600 italic">
                    {item.label}
                </span>
              </div>
              
              <div className="bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100">
                <span className="text-sm font-black text-[#005d54] italic">
                    {item.rate}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER NOTICE */}
        <div className="mt-8 text-center px-6">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[2px] leading-relaxed">
                Rates are subject to market conditions. <br/> Points will be added instantly.
            </p>
        </div>
      </div>
    </div>
  );
}