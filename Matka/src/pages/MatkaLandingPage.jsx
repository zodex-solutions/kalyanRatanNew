// import React, { useState, useEffect, useCallback } from "react";
// import { Play, Star, Wallet, WalletCards } from "lucide-react";
// import { BsWhatsapp } from "react-icons/bs";
// import { API_URL } from "../config";
// import axios from "axios";
// import MarketList from "./Client/MarketList";
// import { fetchSiteData } from "../components/layout/fetchSiteData";
// import NotificationModal from "../components/layout/NotificationModal";
// import { SiMarketo } from "react-icons/si";

// export default function Dashboard() {
//   const token = localStorage.getItem("accessToken");
//   const [markets, setMarkets] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Redirect if NOT logged in
//   useEffect(() => {
//     if (!token) {
//       window.location.href = "/login";
//     }
//   }, [token]);

//   const displayDigit = (v) => (!v || v === "-" ? "X" : v);
//   const displayPanna = (v) => (!v || v === "-" ? "XXX" : v);

//   const fetchMarkets = useCallback(async () => {
//     try {
//       setIsLoading(true);

//       const res = await axios.get(`${API_URL}/api/admin/user/markets`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const list = res.data.data.map((m) => {
//         const today = m.today_result || {};

//         return {
//           id: m._id?.$oid,
//           name: m.name,
//           openTime: m.open_time,
//           closeTime: m.close_time,

//           status: m.status,
//           // If backend adds final_result later
//           result: m.final_result || "xxx-x-xxx",
//           open_digit: displayDigit(today.open_digit),
//           close_digit: displayDigit(today.close_digit),
//           open_panna: displayPanna(today.open_panna),
//           close_panna: displayPanna(today.close_panna),
//         };
//       });

//       setMarkets(list);

//       console.log("list", list);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load markets");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token]);

//   useEffect(() => {
//     fetchMarkets();
//   }, [fetchMarkets]);

//   const [site, setSite] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const data = await fetchSiteData();
//       console.log("data ======", data);
//       setSite(data);
//     })();
//   }, []);

//   const [siteData, setSiteData] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/sitedata/get`);
//         setSiteData(res.data);

//         const alreadyShown = localStorage.getItem("notice_shown");

//         // Show modal only if notice_board_html exists and not shown before
//         if (res.data.notice_board_html && !alreadyShown) {
//           setShowModal(true);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleClose = () => {
//     setShowModal(false);
//     localStorage.setItem("notice_shown", "true"); // show only once
//   };

//   return (
//     <div className="text-white font-sans">
//       <div className="flex flex-col max-w-md mx-auto h-screen">
//         {/* HEADER */}
//         <div className="bg-gradient-to-b rounded-b-2xl from-[#03050e] via-[#192149] to-[#5a0572] px-4 py-3 flex flex-col items-center text-sm">
//           <div className="w-full flex justify-between items-center">
//             <a
//               href="/add-points"
//               className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
//             >
//               <Wallet size={18} /> Add Funds
//             </a>

//             <a
//               href="/withdrawal-request"
//               className="flex items-center gap-2 px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
//             >
//               <WalletCards size={18} /> Withdraw
//             </a>
//           </div>

//           <div
//             className="p-1 px-2 overflow-hidden w-full rounded-full mt-4 backdrop-blur-2xl bg-white/10  text-center 
//                whitespace-nowrap inline-block"
//           >
//             <p
//               className="w-full"
//               style={{
//                 animation: " marquee 8s linear infinite",
//               }}
//             >
//               {site?.dashboard_notification_line}
//             </p>
//           </div>

//           <div className="flex gap-3 w-full justify-between">
//             {/* <a
//               href="/how-to-play"
//               className="backdrop-blur-md px-3 py-1 mt-3 bg-white/30 flex items-center gap-2 text-sm rounded-full hover:bg-gray-700"
//             >
//               <Play size={15} /> How to Play
//             </a> */}

//             <a
//               href={`/starline`}
//               className="flex items-center  mt-3 gap-2 px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
//             >
//               <Star size={18} /> Starline
//             </a>

//             {/* <a
//               href={`https://wa.me/${site?.whatsapp_number}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="backdrop-blur-md px-3 py-1 mt-3 bg-white/30 flex items-center gap-2 text-sm rounded-full hover:bg-gray-700"
//             >
//               <BsWhatsapp /> Whatsapp
//             </a> */}
//             <a
//               href={`https://wa.me/${site?.whatsapp_number}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2  mt-3 px-2.5 py-2 text-sm rounded-full border border-white hover:bg-gray-700"
//             >
//               <BsWhatsapp size={18} /> Whatsapp
//             </a>
//           </div>
//         </div>

//         {/* MARKET LIST */}
//         <main className="flex-1 px-3 py-3 pb-20">
//           {isLoading && (
//             <p className="text-center text-cyan-400">Loading markets...</p>
//           )}
//           {error && (
//             <div className="text-center p-4 bg-red-800/40 border border-red-500 rounded-lg mt-4">
//               <p className="text-red-300">{error}</p>
//             </div>
//           )}
//           {!isLoading && !error && <MarketList markets={markets} />}
//         </main>
//       </div>

//       {showModal && (
//         <NotificationModal
//           html={siteData?.notice_board_html}
//           onClose={handleClose}
//         />
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect, useCallback } from "react";
import { Play, Star, Wallet, WalletCards, Menu, Bell } from "lucide-react";
import { BsWhatsapp } from "react-icons/bs";
import { API_URL } from "../config";
import axios from "axios";
import MarketList from "./Client/MarketList";
import { fetchSiteData } from "../components/layout/fetchSiteData";
import NotificationModal from "../components/layout/NotificationModal";

export default function Dashboard() {
  const token = localStorage.getItem("accessToken");
  const [markets, setMarkets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [site, setSite] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Functionality preserved from your original code
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  const displayDigit = (v) => (!v || v === "-" ? "X" : v);
  const displayPanna = (v) => (!v || v === "-" ? "XXX" : v);

  const fetchMarkets = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/user/markets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = res.data.data.map((m) => {
        const today = m.today_result || {};
        return {
          id: m._id?.$oid,
          name: m.name,
          openTime: m.open_time,
          closeTime: m.close_time,
          status: m.status,
          open_digit: displayDigit(today.open_digit),
          close_digit: displayDigit(today.close_digit),
          open_panna: displayPanna(today.open_panna),
          close_panna: displayPanna(today.close_panna),
        };
      });
      setMarkets(list);
    } catch (err) {
      console.error(err);
      setError("Failed to load markets");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMarkets();
    (async () => {
      const data = await fetchSiteData();
      setSite(data);
    })();
  }, [fetchMarkets]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/sitedata/get`);
        setSiteData(res.data);
        if (res.data.notice_board_html && !localStorage.getItem("notice_shown")) {
          setShowModal(true);
        }
      } catch (err) { console.log(err); }
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    localStorage.setItem("notice_shown", "true");
  };

  return (
    <div className="bg-[#f0f0f0] min-h-screen font-sans text-gray-800">
      <div className="flex flex-col max-w-md mx-auto min-h-screen bg-white shadow-2xl">
        
        {/* NEW THEME HEADER - Exactly like Screenshot */}
        <div className="bg-[#007b70] px-4 py-3 pb-8 rounded-b-[25px] shadow-lg">
         
          {/* ACTION BUTTONS GRID */}
          <div className="grid grid-cols-2 gap-3">
            <a href="/add-points" className="flex items-center justify-center gap-2 bg-[#005e56] text-white py-3 rounded-2xl font-extrabold text-[13px] shadow-md border border-white/10 active:scale-95 transition-all">
              <div className="bg-white/20 rounded-full p-1"><Wallet size={14} strokeWidth={3} /></div>
              ADD MONEY
            </a>
            <a href="/withdrawal-request" className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#e91e63] to-[#c2185b] text-white py-3 rounded-2xl font-extrabold text-[13px] shadow-md active:scale-95 transition-all">
              <div className="bg-white/20 rounded-full p-1"><WalletCards size={14} strokeWidth={3} /></div>
              WITHDRAW
            </a>
            <a href="/starline" className="flex items-center justify-center gap-2 bg-[#e0e0e0] text-[#333] py-3 rounded-2xl font-extrabold text-[13px] shadow-md border border-gray-300">
              <div className="bg-black/10 rounded-full p-1 text-black"><Play size={14} fill="currentColor" /></div>
              STARLINE MARKET
            </a>
            <a href={`https://wa.me/${site?.whatsapp_number}`} className="flex items-center justify-center gap-2 bg-[#007b70] text-white py-3 rounded-2xl font-extrabold text-[13px] shadow-md border border-[#009688] active:scale-95 transition-all">
              <div className="bg-white/20 rounded-full p-1"><BsWhatsapp size={14} /></div>
              WHATSAPP
            </a>
          </div>
        </div>

        {/* MARQUEE NOTICE - Floating Capsule Style */}
        <div className="px-4 -mt-4 relative z-10">
          <div className="bg-white border border-gray-100 shadow-lg rounded-full py-2 px-6 overflow-hidden">
            <p className="whitespace-nowrap text-[#007b70] text-xs font-bold animate-marquee-fast uppercase tracking-wider">
              {site?.dashboard_notification_line || "Welcome to Kalyan Ratan - Trust and Speed Guaranteed!"}
            </p>
          </div>
        </div>

        {/* MARKET LIST - Functional Main Section */}
        <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
               <div className="h-10 w-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-teal-800 font-bold mt-3">Loading Markets...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold">
              {error}
            </div>
          )}
          
          {!isLoading && !error && (
            <div className="space-y-4">
               <div className="flex items-center gap-2 px-1">
                 <div className="w-1.5 h-6 bg-teal-600 rounded-full"></div>
                 <h2 className="text-[#007b70] font-black text-lg uppercase italic tracking-tighter">Live Game Rates</h2>
               </div>
               <MarketList markets={markets} />
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <NotificationModal
          html={siteData?.notice_board_html}
          onClose={handleClose}
        />
      )}

      {/* Global Theme Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-fast {
          display: inline-block;
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
}