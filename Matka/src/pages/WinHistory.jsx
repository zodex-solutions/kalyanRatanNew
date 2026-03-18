// import React, { useState } from "react";
// import { Loader2 } from "lucide-react";
// import { API_URL } from "../config";

// const API_BASE = API_URL;
// const getToken = () => localStorage.getItem("accessToken");

// export default function WinHistory() {
//   const today = new Date().toISOString().slice(0, 10);

//   const [startDate, setStartDate] = useState(today);
//   const [endDate, setEndDate] = useState(today);
//   const [loading, setLoading] = useState(false);
//   const [wins, setWins] = useState([]);
//   const [error, setError] = useState(null);

//   // Fetch Win History
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const token = getToken();
//     if (!token) {
//       setError("Please login again.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const url = `${API_BASE}/user/winning_history?start_date=${startDate}&end_date=${endDate}`;

//       const response = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await response.json();

//       if (!response.ok || data.error) {
//         setError(data.error || "Failed to load data.");
//         setWins([]);
//       } else {
//         setWins(data.wins || []);
//       }
//     } catch (err) {
//       setError("Network error while fetching history.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-md mx-auto flex flex-col items-center font-sans text-white">
//       {/* Header */}
//       <div className="w-full bg-gradient-to-b from-black to-black/0 text-white py-4 text-center">
//         <h1 className="text-lg font-semibold">Win History</h1>
//       </div>

//       {/* Form Section */}
//       <form
//         onSubmit={handleSubmit}
//         className="w-[93%] max-w-md bg-white/20 rounded-2xl shadow-lg p-3 mt-3"
//       >
//         {/* Start Date */}
//         <div className="mb-4">
//           <label className="block text-gray-200 text-sm mb-1 font-medium">
//             Start Date
//           </label>
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="w-full border text-gray-900 py-2 px-4 rounded-md  border-gray-300 focus:ring-2 focus:ring-purple-700 outline-none"
//           />
//         </div>

//         {/* End Date */}
//         <div className="mb-6">
//           <label className="block text-gray-200 text-sm mb-1 font-medium">
//             To Date
//           </label>
//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="w-full border text-gray-900 py-2 px-4 rounded-md border-gray-300 focus:ring-2 focus:ring-purple-700 outline-none"
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full bg-purple-700 text-white font-semibold py-2 rounded-full hover:bg-purple-800 transition flex items-center justify-center"
//         >
//           {loading ? <Loader2 className="animate-spin" /> : "Submit"}
//         </button>
//       </form>

//       {/* Error */}
//       {error && (
//         <p className="text-red-400 mt-4 bg-red-900/20 px-4 py-2 rounded">
//           {error}
//         </p>
//       )}

//       {/* No Data */}
//       {!loading && wins.length === 0 && !error && (
//         <div className="flex flex-col items-center mt-10">
//           <img
//             src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-illustration-download-in-svg-png-gif-file-formats--empty-result-search-error-pack-people-illustrations-4571557.png?f=webp"
//             alt="No Data"
//             className="w-48 mb-6"
//           />
//           <div className="bg-white px-5 py-2 rounded-full shadow-md">
//             <p className="text-gray-700 text-sm font-medium">
//               Winning History Data Not Available
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Show Win Table */}
//       {wins.length > 0 && (
//         <div className="w-[93%] mt-6 bg-gray-900 rounded-lg shadow-xl p-3">
//           <h3 className="text-gray-200 mb-2 font-semibold">Winning Records</h3>

//           <table className="w-full text-left text-sm">
//             <thead className="text-gray-400 border-b border-gray-700">
//               <tr>
//                 <th className="py-2">TX ID</th>
//                 <th className="py-2">Amount</th>
//                 <th className="py-2">Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {wins.map((w) => (
//                 <tr key={w.tx_id} className="border-b border-gray-800">
//                   <td className="py-2 text-gray-300">
//                     {w.tx_id.slice(0, 6)}...
//                   </td>
//                   <td className="py-2 text-green-400 font-bold">₹{w.amount}</td>
//                   <td className="py-2 text-gray-400">
//                     {new Date(w.date).toLocaleString()}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy, ArrowLeft, Loader2, Calendar, Target, Award } from "lucide-react";
import { API_URL } from "../config";

const WIN_API = `${API_URL}/api/admin/win-history`;

export default function WinningHistory() {
  const [history, setHistory] = useState([]);
  const [totalWins, setTotalWins] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const formatGameName = (str = "") =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const fetchHistory = async () => {
    try {
      const res = await axios.get(WIN_API, authHeader);
      setHistory(Array.isArray(res.data.wins) ? res.data.wins : []);
      setTotalWins(res.data.wins?.length || 0);
    } catch (err) {
      console.log("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f3f4f6] min-h-screen flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#005d54]" />
        <p className="text-[#005d54] font-bold uppercase text-[10px] tracking-widest mt-3">Loading Wins...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-24">
      {/* THEME HEADER */}
    <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* <div className="flex items-center justify-between"> */}
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/10 rounded-full active:scale-90 transition"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-lg font-black uppercase tracking-widest italic">Win History</h2>
            <div className="w-10"></div>
          </div>
        {/* </div> */}
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* TOTAL WINS SUMMARY CARD */}
        <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-100 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
              <Trophy size={24} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase leading-none">Total Games Won</p>
              <p className="text-xl font-black text-gray-800 tracking-tighter">{totalWins} Wins</p>
            </div>
          </div>
          <div className="text-right">
             <Award className="text-teal-600 opacity-20" size={40} />
          </div>
        </div>

        {/* NO HISTORY */}
        {history.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow-lg text-center">
            <Target size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-bold text-sm uppercase">No winning history found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
              >
                {/* MARKET NAME & WIN AMOUNT */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-800 uppercase leading-tight">
                      {item.market_name}
                    </h3>
                    <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase tracking-tighter">
                      {formatGameName(item.game_type)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-green-600 uppercase leading-none mb-1 italic">You Won</p>
                    <p className="text-xl font-black text-green-600">₹{item.win_amount}</p>
                  </div>
                </div>

                {/* GAME DETAILS GRID */}
                <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Session & Points</p>
                    <p className="text-[11px] font-bold text-gray-700 uppercase">
                      {item.session} • {item.points} Pts
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase">Played Digit</p>
                    <p className="text-xs font-black text-teal-700 bg-white border border-teal-100 inline-block px-3 py-0.5 rounded-full">
                      {item.digit_or_panna}
                    </p>
                  </div>
                </div>

                {/* RESULT BOX */}
                <div className="mt-3 bg-teal-50/50 border border-teal-100 rounded-2xl p-3">
                  <p className="text-[10px] font-black text-teal-800 uppercase mb-2 flex items-center gap-1">
                    <Award size={12} /> Declared Result
                  </p>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div className="bg-white p-1 rounded-lg border border-teal-50">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Open</p>
                      <p className="text-[10px] font-black text-gray-800">{item.declared_result?.open_digit || '-'}</p>
                    </div>
                    <div className="bg-white p-1 rounded-lg border border-teal-50">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">Close</p>
                      <p className="text-[10px] font-black text-gray-800">{item.declared_result?.close_digit || '-'}</p>
                    </div>
                    <div className="bg-white p-1 rounded-lg border border-teal-50">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">O-Panna</p>
                      <p className="text-[10px] font-black text-gray-800">{item.declared_result?.open_panna || '-'}</p>
                    </div>
                    <div className="bg-white p-1 rounded-lg border border-teal-50">
                      <p className="text-[8px] text-gray-400 font-bold uppercase">C-Panna</p>
                      <p className="text-[10px] font-black text-gray-800">{item.declared_result?.close_panna || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* DATE FOOTER */}
                <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-400 font-bold px-1 uppercase tracking-tighter">
                  <Calendar size={12} />
                  <span>
                    {new Date(new Date(item.created_at).getTime() + 5.5 * 60 * 60 * 1000)
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