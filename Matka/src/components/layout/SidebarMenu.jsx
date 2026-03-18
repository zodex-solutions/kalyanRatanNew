// src/components/SidebarMenu.jsx
import React, { useEffect, useState } from "react";
import {
  User,
  Wallet,
  Clock,
  Trophy,
  Gamepad2,
  Phone,
  Lock,
  LogOut,
  X,
  DollarSign,
  Star,
  Play,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
  Share2,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";
import { SiMarketo } from "react-icons/si";

const API_BASE = `${API_URL}/user`;

export default function SidebarMenu({ sidebar, setSidebar }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("accessToken");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/profile`, authHeader);
      setUser(res.data);
    } catch (err) {
      console.log("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) setAccessToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    setAccessToken(null);
    window.location.href = "/login";
  };

  const menuItems = [
    { icon: <User size={18} />, label: "My Profile", link: "/profile" },
    { icon: <Wallet size={18} />, label: "My Wallet", link: "/wallet" },
    { icon: <DollarSign size={18} />, label: "Add Points", link: "/add-points" },
    { icon: <LayoutDashboard size={18} />, label: "Withdraw Funds", link: "/withdrawal-request" },
    { icon: <Star size={18} />, label: "Starline Market", link: "/starline" },
    { icon: <SiMarketo size={18} />, label: "Galidesawar", link: "/golidesawar" },
    { icon: <Clock size={18} />, label: "Bid History", link: "/bid-history" },
    { icon: <Trophy size={18} />, label: "Win History", link: "/win-history" },
    { icon: <Gamepad2 size={18} />, label: "Game Rates", link: "/game-rate" },
    { icon: <Share2 size={18} />, label: "Refer & Earn", link: "/referrals" },
    { icon: <Phone size={18} />, label: "Contact Us", link: "/contact-us" },
    { icon: <Play size={18} />, label: "How To Play", link: "/how-to-play" },
    { icon: <Lock size={18} />, label: "Change Password", link: "/change-password" },
    { icon: <LogOut size={18} />, label: "Logout", onClick: handleLogout, isLogout: true },
  ];

  return (
    <>
      {/* OVERLAY */}
      {sidebar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSidebar(false)}></div>
      )}

      {/* SIDEBAR */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#f3f4f6] shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-hidden ${sidebar ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* CURVED PROFILE HEADER */}
        <div className="bg-[#005d54] pt-12 pb-8 px-6 rounded-b-[40px] relative shadow-lg">
          <button onClick={() => setSidebar(false)} className="absolute right-6 top-6 text-white/50 hover:text-white transition">
            <X size={24} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-black text-2xl italic shadow-inner">
              {user?.username?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-lg font-black text-white uppercase italic tracking-tighter truncate leading-none mb-1">
                {user?.username || "Guest User"}
              </h3>
              <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest opacity-80 italic">
                {user?.mobile || "+91 0000000000"}
              </p>
            </div>
          </div>
        </div>

        {/* MENU LIST */}
        <div className="h-[calc(100%-160px)] overflow-y-auto px-4 py-6 space-y-2">
          {menuItems
            .filter((item) => !item.isLogout || accessToken)
            .map((item, index) => (
              <a
                key={index}
                href={item.link}
                onClick={item.onClick}
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all active:scale-95 group ${
                  item.isLogout 
                  ? "mt-8 bg-red-50 border border-red-100" 
                  : "bg-white border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${item.isLogout ? "text-red-500" : "text-[#005d54] opacity-70 group-hover:opacity-100"}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[11px] font-black uppercase italic tracking-wider ${item.isLogout ? "text-red-600" : "text-gray-600"}`}>
                    {item.label}
                  </span>
                </div>
                {!item.isLogout && <ChevronRight size={14} className="text-gray-300 group-hover:text-teal-400" />}
              </a>
            ))}

            {/* VERSION INFO */}
            <div className="pt-8 pb-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1 text-teal-600 opacity-30">
                    <ShieldCheck size={12} />
                    <span className="text-[8px] font-black uppercase tracking-[3px]">Secure Access</span>
                </div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">Rajan Matka v2.0.4</p>
            </div>
        </div>
      </div>
    </>
  );
}