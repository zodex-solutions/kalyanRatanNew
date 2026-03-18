import React from "react";
import {
  ArrowLeft,
  Wallet,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  History,
  TrendingUp,
  CreditCard
} from "lucide-react";

export default function WalletPage() {
  const walletOptions = [
    {
      id: 1,
      link: "/wallet-history",
      title: "Wallet History",
      desc: "Check your complete wallet statements",
      color: "bg-teal-50",
      iconColor: "text-teal-600",
      icon: <History size={22} />,
    },
    {
      id: 2,
      link: "/add-points",
      title: "Add Money",
      desc: "Instantly add funds to your account",
      color: "bg-green-50",
      iconColor: "text-green-600",
      icon: <PlusCircle size={22} />,
    },
    {
      id: 3,
      link: "/withdrawal-history",
      title: "Withdrawal History",
      desc: "Track your cash-out requests",
      color: "bg-red-50",
      iconColor: "text-red-600",
      icon: <TrendingUp size={22} />,
    },
    {
      id: 4,
      link: "/deposit-history",
      title: "Deposit History",
      desc: "View all your past successful deposits",
      color: "bg-blue-50",
      iconColor: "text-blue-600",
      icon: <CreditCard size={22} />,
    },
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
              My Wallet
            </h2>
            <div className="w-10"></div>
          </div>
      </div>

      {/* WALLET OPTIONS LIST */}
      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30 space-y-3">
        {walletOptions.map((item) => (
          <a
            href={item.link || "#"}
            key={item.id}
            className="flex items-center justify-between bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 hover:shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex items-center">
              {/* Subtle Colored Icon Box */}
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

            {/* Navigation Arrow */}
            <div className="bg-gray-50 p-2 rounded-full border border-gray-100">
              <ChevronRight size={18} className="text-[#005d54]" strokeWidth={3} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}