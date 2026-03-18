// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Play, Info, ArrowLeft } from "lucide-react";
// import { FaChartLine } from "react-icons/fa6";
// import { API_URL } from "../../config";

// export default function StarlineMarket() {
//   const token = localStorage.getItem("accessToken");
//   const headers = { Authorization: `Bearer ${token}` };

//   const [markets, setMarkets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [gameRates, setGameRates] = useState({});
//   const displayDigit = (v) => (!v || v === "-" ? "X" : v);
//   const displayPanna = (v) => (!v || v === "-" ? "XXX" : v);

//   const fetchRates = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/admin/rate/`, { headers });
//       const data = res.data;
//       console.log("data", data);
//       setGameRates(data);
//     } catch (err) {
//       console.log("Rate fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchRates();
//   }, []);

//   const fetchMarkets = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/admin/user/starline`, {
//         headers,
//       });

//       console.log(res?.data?.data);
//       const list = res.data.data.map((m) => {
//         const today = m.today_result || {};

//         return {
//           id: m._id?.$oid,
//           name: m.name,
//           is_active: m.is_active,
//           hindi: m.hindi,
//           openTime: m.open_time,
//           closeTime: m.close_time,
//           status: m.status,
//           marketType: m.marketType,
//           today_result: {
//             open_digit: displayDigit(today.open_digit),
//             close_digit: displayDigit(today.close_digit),
//             open_panna: displayPanna(today.open_panna),
//             close_panna: displayPanna(today.close_panna),
//           },
//         };
//       });

//       console.log("List ", list);

//       setMarkets(list);
//     } catch (err) {
//       console.error("Starline load error:", err);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMarkets();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[60vh] text-white">
//         Loading Starline Markets…
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3 mx-auto max-w-md font-sans pb-20">
//       {/* Header */}
//       <div className="w-full relative bg-gradient-to-b from-black to-black/0 py-2 flex items-center justify-between">
//         <button
//           onClick={() => window.history.back()}
//           className="p-2 pl-4 z-10 rounded-full hover:bg-white/10 transition"
//         >
//           <ArrowLeft size={22} />
//         </button>

//         <h2 className="text-md z-0 w-full absolute flex justify-center font-bold uppercase">
//           StarLine
//         </h2>

//         <span className="pr-4 z-10"></span>
//       </div>

//       {/* Types Info */}
//       <div className="px-3">
//         <div className="w-full bg-white/5 p-4 border border-gray-50/5 rounded-xl space-y-2">
//           <div className="flex justify-between text-[13px] text-gray-100">
//             <span className="font-semibold">Single Digit</span>
//             <span className="font-semibold">
//               {gameRates?.single_digit_1}–{gameRates?.single_digit_2}
//             </span>
//           </div>
//           <div className="flex justify-between text-[13px] text-gray-100">
//             <span className="font-semibold">Single Pana</span>
//             <span className="font-semibold">
//               {" "}
//               {gameRates?.single_pana_1}–{gameRates?.single_pana_2}
//             </span>
//           </div>
//           <div className="flex justify-between text-[13px] text-gray-100">
//             <span className="font-semibold">Double Pana</span>
//             <span className="font-semibold">
//               {gameRates?.double_pana_1}–{gameRates?.double_pana_2}
//             </span>
//           </div>
//           <div className="flex justify-between text-[13px] text-gray-100">
//             <span className="font-semibold">Triple Pana</span>
//             <span className="font-semibold">
//               {gameRates?.tripple_pana_1}–{gameRates?.tripple_pana_2}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* History buttons */}
//       <div className="w-full flex gap-3 px-3">
//         <a
//           href="/bid-history"
//           className="bg-white/10 flex items-center justify-center font-medium rounded-xl border border-gray-50/5 py-2 w-full"
//         >
//           Bids History
//         </a>
//         <a
//           href="/win-history"
//           className="bg-white/10 flex items-center justify-center font-medium rounded-xl border border-gray-50/5 py-2 w-full"
//         >
//           Win History
//         </a>
//       </div>

//       {/* Markets */}
//       <div className="px-3">
//         {markets.map((mkt) => {
//           const r = mkt.today_result;
//           return (
//             <div
//               key={mkt.id}
//               className="w-full rounded-xl shadow-lg backdrop-blur-2xl border border-white/10 mb-3"
//             >
//               <div className="rounded-xl p-3 text-white">
//                 {/* Top Row */}
//                 <div className="flex justify-between items-center mb-2">
//                   <div className="flex items-center gap-1">
//                     <h2 className="text-base font-semibold uppercase">
//                       {mkt.name}
//                     </h2>
//                     <Info
//                       size={18}
//                       className="bg-gray-300 text-black rounded-full"
//                     />
//                   </div>

//                   <span
//                     className={`text-xs font-semibold ${
//                       mkt.status === true ? "text-green-400" : "text-red-400"
//                     }`}
//                   >
//                     {mkt.status === true ? "Market Running" : "Market Closed"}
//                   </span>
//                 </div>

//                 <div className="border-b border-dashed border-cyan-400/25 mb-2"></div>

//                 {/* Results */}
//                 <div className="flex justify-between items-center text-xs text-gray-300">
//                   <div>
//                     <h3 className="text-2xl mb-1 font-semibold text-[#c21af0] tracking-wider">
//                       {r.open_panna}-{r.open_digit}
//                       {/* {r.close_digit}-{r.close_panna} */}
//                     </h3>

//                     <div className="flex gap-7 text-gray-400">
//                       <p>
//                         {/* Open Time: */}
//                         <span className="block text-white font-medium">
//                           {mkt.openTime}
//                         </span>
//                       </p>
//                       {/* <p>
//                         Close Time:
//                         <span className="block text-white font-medium">
//                           {mkt.closeTime}
//                         </span>
//                       </p> */}
//                     </div>
//                   </div>

//                   <a href={`/charts/${mkt.id}`}>
//                     <FaChartLine size={26} />
//                   </a>

//                   <div className="flex flex-col items-center">
//                     <a
//                       href={mkt.status === true ? `/play/${mkt.id}` : ""}
//                       className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
//                         mkt.status === true
//                           ? "border-white"
//                           : "border-red-400 cursor-not-allowed"
//                       }`}
//                     >
//                       <Play
//                         size={18}
//                         className={
//                           mkt.status === true
//                             ? "text-green-500"
//                             : "text-red-400"
//                         }
//                       />
//                     </a>
//                     <span className="text-[14px] font-semibold">Play</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
// src/pages/StarlineMarket.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Play, Info, ArrowLeft, History, Trophy, TrendingUp, Loader2, ChevronRight } from "lucide-react";
import { FaChartLine } from "react-icons/fa6";
import { API_URL } from "../../config";

export default function StarlineMarket() {
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameRates, setGameRates] = useState({});

  const displayDigit = (v) => (!v || v === "-" ? "X" : v);
  const displayPanna = (v) => (!v || v === "-" ? "XXX" : v);

  /* ------------------ TIME CHECK LOGIC ------------------ */
  function isMarketOpen(open_time) {
    if (!open_time) return false;
    const now = new Date();
    const [time, modifier] = open_time.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const closeDate = new Date();
    closeDate.setHours(hours, minutes, 0, 0);
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return now >= midnight && now < closeDate;
  }

  const fetchData = async () => {
    try {
      const [rateRes, marketRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/rate/`, { headers }),
        axios.get(`${API_URL}/api/admin/user/starline`, { headers })
      ]);
      
      setGameRates(rateRes.data);
      
      const list = marketRes.data.data.map((m) => {
        const today = m.today_result || {};
        return {
          id: m._id?.$oid,
          name: m.name,
          status: m.status,
          openTime: m.open_time,
          today_result: {
            open_digit: displayDigit(today.open_digit),
            open_panna: displayPanna(today.open_panna),
          },
        };
      });
      setMarkets(list);
    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4 italic">Loading Starline...</p>
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
            <h2 className="text-lg font-black uppercase tracking-widest italic text-center flex-1">StarLine</h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* GAME RATES PANEL */}
        <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-gray-100 mb-6 grid grid-cols-2 gap-y-4 gap-x-2">
            {[
              { label: "Single Digit", val: `${gameRates?.single_digit_1}-${gameRates?.single_digit_2}` },
              { label: "Single Pana", val: `${gameRates?.single_pana_1}-${gameRates?.single_pana_2}` },
              { label: "Double Pana", val: `${gameRates?.double_pana_1}-${gameRates?.double_pana_2}` },
              { label: "Triple Pana", val: `${gameRates?.tripple_pana_1}-${gameRates?.tripple_pana_2}` }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center border-r last:border-0 border-gray-100 odd:border-r">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{item.label}</p>
                <p className="text-xs font-black text-[#005d54] italic">{item.val}</p>
              </div>
            ))}
        </div>

        {/* HISTORY QUICK LINKS */}
        <div className="flex gap-3 mb-6">
          <a href="/bid-history" className="flex-1 bg-white py-3 px-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition">
            <div className="flex items-center gap-2">
              <History size={16} className="text-teal-600" />
              <span className="text-[10px] font-black uppercase tracking-tight text-gray-600">Bids</span>
            </div>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-teal-600" />
          </a>
          <a href="/win-history" className="flex-1 bg-white py-3 px-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-yellow-600" />
              <span className="text-[10px] font-black uppercase tracking-tight text-gray-600">Wins</span>
            </div>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-teal-600" />
          </a>
        </div>

        {/* MARKETS LIST */}
        <div className="space-y-4">
          {markets.map((mkt) => {
            const r = mkt.today_result;
            const marketOpen = mkt.status === true && isMarketOpen(mkt.openTime);

            return (
              <div key={mkt.id} className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative">
                <div className="flex items-center gap-4">
                  {/* PLAY ICON CIRCLE */}
                  <a
                    href={marketOpen ? `/play/${mkt.id}` : "#"}
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
                        {marketOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-[#005d54] tracking-tighter italic">
                      {r.open_panna}-{r.open_digit}
                    </h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
                      <TrendingUp size={10} /> Next: {mkt.openTime}
                    </p>
                  </div>
                </div>

                {/* CHART BUTTON */}
                <a href={`/charts/${mkt.id}`} className="bg-gray-50 p-4 rounded-3xl border border-gray-100 text-[#005d54] active:scale-90 transition shadow-sm">
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