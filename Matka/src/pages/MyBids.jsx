import React from "react";
import {
  ArrowLeft,
  Wallet,
  Gamepad2,
  Ticket,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  History,
  Trophy,
  Star,
} from "lucide-react";

export default function MyBids() {
  const bidOptions = [
    {
      id: 1,
      link: "/bid-history",
      title: "Bid History",
      desc: "Check your past betting records",
      color: "bg-teal-50",
      iconColor: "text-teal-600",
      icon: <History size={22} />,
    },
    {
      id: 2,
      link: "/win-history",
      title: "Game Results",
      desc: "View recent market outcomes",
      color: "bg-green-50",
      iconColor: "text-green-600",
      icon: <Trophy size={22} />,
    },
    {
      id: 3,
      link: "/bid-history",
      title: "Starline Bid History",
      desc: "Your starline game records",
      color: "bg-amber-50",
      iconColor: "text-amber-600",
      icon: <Star size={22} />,
    },
    {
      id: 4,
      link: "/win-history",
      title: "Starline Result History",
      desc: "Check past starline winning numbers",
      color: "bg-orange-50",
      iconColor: "text-orange-600",
      icon: <ArrowDownCircle size={22} />,
    },
    {
      id: 5,
      link: "/king-bids-history",
      title: "Galidesawar Bid History",
      desc: "View your Galidesawar records",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: <Ticket size={22} />,
    },
    {
      id: 6,
      link: "/king-win-history",
      title: "Galidesawar Result History",
      desc: "Check Galidesawar winning numbers",
      color: "bg-indigo-50",
      iconColor: "text-indigo-600",
      icon: <ArrowUpCircle size={22} />,
    },
  ];

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
          <h2 className="text-lg font-black uppercase tracking-widest italic">My Bids</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* OPTIONS LIST */}
      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30 space-y-3">
        {bidOptions.map((item) => (
          <a
            href={item?.link}
            key={item.id}
            className="flex items-center justify-between bg-white rounded-3xl p-4 shadow-md border border-gray-100 hover:shadow-lg active:scale-[0.98] transition-all"
          >
            <div className="flex items-center">
              {/* Icon Box - Circular and Subtle Color */}
              <div
                className={`w-14 h-14 ${item.color} ${item.iconColor} rounded-2xl flex items-center justify-center shadow-sm border border-white`}
              >
                {item.icon}
              </div>

              {/* Text Section */}
              <div className="ml-4">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5 italic leading-tight uppercase">
                  {item.desc}
                </p>
              </div>
            </div>

            {/* Arrow Badge */}
            <div className="bg-gray-50 p-2 rounded-full border border-gray-100">
              <ChevronRight size={18} className="text-[#005d54]" strokeWidth={3} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}