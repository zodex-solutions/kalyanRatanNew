// src/pages/ContactUs.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Phone, ShieldCheck, MessageCircle, Send, Loader2, ChevronRight } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { fetchSiteData } from "../components/layout/fetchSiteData";

export default function ContactUs() {
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchSiteData();
      setSite(data);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
      </div>
    );

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
              Contact Us
            </h2>
            <div className="w-10"></div>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* SUPPORT HERO CARD */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-6 shadow-sm border border-gray-100 text-center">
            <div className="bg-teal-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-[#005d54]">
                <MessageCircle size={32} />
            </div>
            <h3 className="font-black text-gray-800 uppercase tracking-tight text-sm">How can we help?</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Our support team is active 24/7</p>
        </div>

        {/* CONTACT METHODS */}
        <div className="space-y-4">
          {/* WHATSAPP CARD */}
          <a
            href={`https://wa.me/${site?.whatsapp_number}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
                <div className="bg-green-50 p-3 rounded-2xl text-green-500">
                    <FaWhatsapp size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">WhatsApp Chat</p>
                    <p className="text-sm font-black text-gray-800 tracking-tight">+{site?.whatsapp_number}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-green-500" />
          </a>

          {/* TELEGRAM CARD */}
          <a
            href={`https://t.me/${site?.telegram_link?.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-2xl text-blue-500">
                    <FaTelegramPlane size={28} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Telegram Support</p>
                    <p className="text-sm font-black text-gray-800 tracking-tight">{site?.telegram_link}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
          </a>
        </div>

        {/* SECURITY BADGE */}
        <div className="mt-12 flex flex-col items-center opacity-40">
            <ShieldCheck size={40} className="text-[#005d54] mb-2" />
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[3px]">Verified Official Support</p>
        </div>
      </div>
    </div>
  );
}