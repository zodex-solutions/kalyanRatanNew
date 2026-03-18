// src/pages/AddMoney.jsx
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, History, Zap, QrCode, Loader2 } from "lucide-react";
import AddMoneyQrTab from "./Admin/Qr/AddMoneyQrTab";
import axios from "axios";
import DepositeByOwn from "./DepositeByOwn";
import { API_URL } from "../config";

export default function AddMoney() {
  const [activeTab, setActiveTab] = useState("auto");
  const [showAutoNotice, setShowAutoNotice] = useState(false);
  const qrRef = useRef(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/settings/get`);
      setSettings(res?.data);
    } catch (error) {
      console.log("Settings API Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const goToQrSection = () => {
    setActiveTab("qr");
    setTimeout(() => {
      qrRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const triggerAutoNotice = () => {
    setShowAutoNotice(true);
    goToQrSection();
    setTimeout(() => setShowAutoNotice(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#005d54]" size={40} />
        <p className="text-[#005d54] font-black uppercase text-[10px] tracking-widest mt-4">Loading Payments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans text-gray-800 pb-32">
      {/* NEW STANDARD HEADER */}
      <div className="bg-[#005d54] max-w-md mx-auto text-white p-4 pb-12 rounded-b-[35px] shadow-lg sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="p-2 bg-white/10 rounded-full active:scale-90 transition"
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-lg font-black uppercase tracking-widest italic text-center flex-1">
              Add Points
            </h2>
            <a href="/deposit-history" className="p-2 bg-white/10 rounded-full active:scale-90 transition">
              <History size={20} />
            </a>
          </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-30">
        {/* MODERN PILL TABS */}
        <div className="bg-white p-1.5 rounded-[2rem] shadow-md border border-gray-100 flex items-center mb-6">
          <button
            onClick={() => setActiveTab("auto")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.8rem] text-[11px] font-black uppercase transition-all duration-300 ${
              activeTab === "auto"
                ? "bg-[#005d54] text-white shadow-lg shadow-teal-900/20"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Zap size={14} fill={activeTab === "auto" ? "currentColor" : "none"} />
            Auto Deposit
          </button>

          <button
            onClick={() => setActiveTab("qr")}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.8rem] text-[11px] font-black uppercase transition-all duration-300 ${
              activeTab === "qr"
                ? "bg-[#005d54] text-white shadow-lg shadow-teal-900/20"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <QrCode size={14} />
            QR Code
          </button>
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 min-h-[400px]">
          {activeTab === "auto" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <DepositeByOwn
                settings={settings}
                onRequestCreated={triggerAutoNotice}
              />
            </div>
          ) : (
            <div ref={qrRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <AddMoneyQrTab settings={settings} />
            </div>
          )}
        </div>
      </div>

      {/* THEMED NOTIFICATION */}
      {showAutoNotice && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-xs animate-bounce">
          <div className="bg-[#005d54] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white/20 text-center">
            <p className="text-xs font-black uppercase tracking-widest italic">
              🚀 Pay & Upload Screenshot
            </p>
          </div>
        </div>
      )}
    </div>
  );
}